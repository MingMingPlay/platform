<template>
	<div class="busiDetail">

		<jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>

		<el-tabs @tab-click="handleClick">
			<el-tab-pane label="商家详情">
				<div class="detail-title">基础信息</div>
				<div class="detail-wrap">
					<detail-item v-for="(item,index) in basicInfo" :key="index" :type="item.type"
						:label="item.label" :value="detailData[item.prop]" label-width="84px">
					    <div class="detail-img-wrap" slot="img" v-if="item.type === 'img' && detailData[i] !== null" v-for="i in item.prop">
                            <img :src="detailData[i]" />
                        </div>
					</detail-item>
				</div>
				<div class="detail-title">资质信息</div>
				<div class="detail-wrap">
					<detail-item v-for="(item,index) in qualifiedInfo" :key="index" :type="item.type" :label="item.label" :value="detailData[item.prop]" class="clearfix" label-width="84px">
						<div class="detail-img-wrap" slot="img" v-if="item.type === 'img' && detailData[i] !== null" v-for="(i, index) in item.prop">
							<img :src="detailData[i]" />
							<span class="img-name">{{index | imgName}}</span>
						</div>
					</detail-item>
				</div>
			</el-tab-pane>
			<el-tab-pane label="我是代理商">
				<el-table :data="tableData1" v-loading="loading" v-if="isShow" class="marginTop">
					<el-table-column v-for="(item,index) in tableHead1" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
					<el-table-column v-for="item in tableHead1" :prop="item.prop" :label="item.label" :key="item"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="handleCheck(scope.row.sid)">审批</el-button>
							<el-button type="text" @click="handleDetail(scope.row.sid)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<template v-else>
					<div class="detail-title">详情信息</div>
					<div class="detail-wrap">
						<detail-item v-for="(item,index) in supplierDetail1" :key="index" :label="item.label" :value="detailData2[item.prop]" label-width="84px">
						<detail-item v-for="item in supplierDetail1" :label="item.label" :value="detailData2[item.prop]" :key="item" label-width="84px">
						</detail-item>
					</div>
					<div class="btn-wrap">
						<el-button type="primary" @click="isShow = true">返回</el-button>
					</div>
				</template>
			</el-tab-pane>
			<el-tab-pane label="我是供货商">
				<el-table :data="tableData2" v-loading="loading" v-if="isShow">
					<el-table-column v-for="(item,index) in tableHead2" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
					<el-table-column v-for="item in tableHead2" :prop="item.prop" :label="item.label" :key="item"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="handleCheck(scope.row.sid)">审批</el-button>
							<el-button type="text" @click="handleDetail(scope.row.sid)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<template v-else>
					<div class="detail-title">详情信息</div>
					<div class="detail-wrap">
						<detail-item v-for="(item,index) in supplierDetail2" :key="index" :label="item.label" :value="detailData2[item.prop]" label-width="84px">
						<detail-item v-for="item in supplierDetail2" :label="item.label" :value="detailData2[item.prop]" :key="item" label-width="84px">
						</detail-item>
					</div>
					<div class="btn-wrap">
						<el-button type="primary" @click="isShow = true">返回</el-button>
					</div>
				</template>
			</el-tab-pane>
		</el-tabs>
		<!--对话框-->
		<el-dialog title="审批提示" v-model="dialogVisible" class="jkc-dialog--size">
			<el-form :inline="true" :model="suppForm">
				<el-form-item label="请选择审批操作：">
					<el-select v-model="suppForm.state" placeholder="请选择">
						<el-option label="有效" value="Active"></el-option>
						<el-option label="无效" value="Disabled"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSave">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	//	import Item from './item.vue'
	import DetailItem from '../../common/detail-item.vue'
	import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
	import { merchant, supplier } from '../../../assets/staticData/merchant.js'
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'

	export default {
		mixins: [mixin_breadcrumb],
		components: {
			DetailItem
		},
		data() {
			return {
				loading: false,
				isShow: true,
				dialogVisible: false,
				detailData: {},
				detailData2: {},
				tableData1: [],
				tableData2: [],
				suppChainSid: null, // 查看供应商详情的sid
				suppForm: {
					state: null,
				},
			}
		},
		created() {
			this.crumbs = [{
				title: '商家管理',
				to: '/c_mall/merchant'
			}, {
				title: '商家详情'
			}];
			this.basicInfo = merchant.basicInfo;
			this.qualifiedInfo = this.dataProcess();
			this.tableHead1 = supplier.tableHead1;
			this.tableHead2 = supplier.tableHead2;
			this.supplierDetail1 = supplier.supplierDetail1;
			this.supplierDetail2 = supplier.supplierDetail2;
		},
		beforeMount() {
			this.get_detailData(api.merchant + 'cloud/merchant/');
		},
		filters: {
			imgName(val) {
				if(val === 0) return '证件照正面';
				else if(val === 1) return '证件照反面';
				else return '营业执照';
			}
		},
		methods: {
			// 获取详情
			get_detailData(api, sid, index) {
				index = index || '';
				const _this = this;
				const currSid = sid || this.$route.query.sid;
				pubObj.httpRequest(_this, {
					url: api + currSid,
					success(result) {
						_this['detailData' + index] = result.data;
					}
				})
			},
			// 数据加工
			dataProcess() {
				// 局部缓存
				const arr = merchant.qualifiedInfo;
				// 临时处理变量
				var tempArr = [];
				// 克隆数据
				arr.forEach((item) => {
					tempArr.push(item)
				});
				// type = Personal
				if(this.$route.query.type === 'Personal') {
					for(let i = 0, len = tempArr.length; i < len; i++) {
						if(tempArr[i].prop === 'licenseCode') {
							// 删除代理商和供应商
							tempArr.splice(i, 1);
							break;
						} else continue;
					}
					return tempArr;
				} else return arr;
			},
			// 获取供应链关系列表
			get_tableData(index) {
				var $th = this;
				$th.isShow = true;
				if(index !== '0') {
					let type = index === '1' ? 'Agent' : 'Supplier';
					pubObj.httpRequest($th, {
						url: api.supplier + type + '/' + $th.$route.query.sid,
						success(result) {
							$th['tableData' + index] = result.data;
						}
					})
				}
			},
			// 获取供应链关系列表
			handleClick(tab) {
				this.suppForm.curTab = tab.index
				this.get_tableData(tab.index)
			},
			handleCheck(sid) {
				this.dialogVisible = true
				this.suppForm.curId = sid
			},
			handleSave() {
				var $th = this;
				pubObj.httpRequest($th, {
					method: 'PUT',
					url: api.supplier + $th.suppForm.curId + '/' + $th.suppForm.state,
					success() {
						$th.dialogVisible = false
						$th.$message.success('操作成功')
						$th.get_tableData($th.suppForm.curTab)
					}
				})
			},
			handleDetail(sid) {
				this.get_detailData(api.supplier, sid, 2);
				this.isShow = false;
			}
		}
	}
</script>

<style scoped>
	.detail-img-wrap {
		width: 128px;
		height: auto;
		float: left;
		margin-left: 10px;
		text-align: center;
	}

	.detail-img-wrap img {
		width: 100%;
		height: auto;
	}

	.detail-item-wrap .detail-img-wrap span {
		margin: 0;
		font-size: 12px;
	}

	.btn-wrap {
		text-align: center;
		margin: 22px 0;
	}
</style>
