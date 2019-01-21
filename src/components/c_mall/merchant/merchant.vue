<template>
	<div class="business">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true">
				<el-form-item label="关键字">
					<el-input v-model="form.q" placeholder="商家名称"></el-input>
				</el-form-item>
				<el-form-item label="商家类型">
					<el-select v-model="form.type" placeholder="不限" clearable>
						<el-option label="不限" value=""></el-option>
						<el-option label="个人" value="Personal"></el-option>
						<el-option label="企业" value="Enterprise"></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
			</el-form>
		</div>

		<!--新增等辅助按钮-->
		<div class="assist-btn-wrap">
			<el-button type="primary" @click="handleAdd">新增商家</el-button>
		</div>

		<el-table :data="tableData" v-loading="loading" stripe>
			<el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
				<template slot-scope="scope">
					{{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
				</template>
			</el-table-column>
			<el-table-column label="商家名称" prop="nameFull" class-name="one-line" width="240"></el-table-column>
			<el-table-column label="商家地址" prop="areaName" class-name="one-line" width="200"></el-table-column>
			<el-table-column label="商家类型" prop="typeName" width="140" align="center"></el-table-column>
			<el-table-column label="联系电话" prop="contactPhone" width="140"></el-table-column>
			<el-table-column label="联系邮箱" prop="contactEmail" class-name="one-line" width="200"></el-table-column>
			<el-table-column label="商家配置" align="center" width="140">
				<template slot-scope="scope">
				    <el-button type="text" @click="handleBrand(scope.row.sid)">配置品牌</el-button>
					<!--<el-button type="text" @click="handleShop(scope.row.sid)">配置店铺</el-button>-->
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
				    <el-button type="text" @click="handleEdit(scope.row.sid)">编辑</el-button>
				    <el-button type="text" @click="handleLook(scope.row.sid, scope.row.type)">详情</el-button>
					<!--<el-button type="text" @click="handleCheck(scope.row.sid)">审批</el-button>-->
					<!--<el-button type="text" @click="handleReset(scope.row.sid)">重置密码</el-button>-->
					<!--<el-button type="text" class="textBtnDel" @click="handleDel(scope.row.sid)" v-if="button.delete">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>
		
		<pagination event-name="merchant-pagination" :total="mxTableList.pagiTotal"></pagination>


		<!--配置品牌-->
		<brand-table @refresh="handleRefresh"></brand-table>

		<!--配置店铺-->
		<!--<shop-form v-if="aStatus !== 0" :showExemption="true"></shop-form>-->

		<!--暂时隐藏，审批对话框，勿删！！！-->
		<!--<el-dialog title="商家审批" v-model="dialogVisible" class="jkc-dialog--size">
			<el-form :inline="true" :model="checkForm">
				<el-form-item label="审批操作：">
					<el-select v-model="checkForm.state" placeholder="请选择">
						<el-option label="通过" value="Active"></el-option>
						<el-option label="拒绝" value="Refuse"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleCheckingSave">确 定</el-button>
			</div>
		</el-dialog>-->

	</div>
</template>

<script>
    
    // child
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
	import BrandTable from './table.vue'
	import ShopForm from './form.vue'
	// mixin
    import TableList from '../../mixin/table-list.vue'
	// js
	import { merchant } from '../../../assets/staticData/merchant.js'
	import api from '../../../assets/config/c-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
	    components: { JkcBreadcrumb, Pagination, BrandTable, ShopForm },
		mixins: [TableList], // 插入混合对象
		data() {
			return {
			    loading: true,
				api: null,
				form: { type: null },
				dialogVisible: false,
				mxTableList: {
				    url: ['newMerchant'],
				    pagiTotal: 0
				},
				/*checkForm: { // 审核功能暂时关闭，勿删！！！
					state: ''
				},*/
			}
		},
		computed: {
			aStatus() {
				return this.$store.state.a.status;
			},
			bStatus() {
				return this.$store.state.b.status;
			}
		},
		created() {
		    this.crumbs = [{ title: '商家管理' }, { title: '商家列表' }];
			this.api = api.newMerchant.url;
			this.tableHead = merchant.tableHead;
		},
		mounted() {
            bus.$on('merchant-pagination', (obj) => {
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
		methods: {
		    // 搜索
		    handleSearch() { this.getTableList(this.form) },
		    // 刷新
            handleRefresh() { this.getTableList() },
			// 新增
			handleAdd() {
				this.$router.push({
					path: '/c_mall/merchant/info',
					query: { type: 1 }
				})
			},
			// 编辑
			handleEdit(sid) {
			    this.$router.push({
                    path: '/c_mall/merchant/info',
                    query: { type: 2, sid: sid }
                })
			},
			// 配置品牌
            handleBrand(sid) {
                bus.$emit('brand-table', { sid: sid })
            },
			// 详情
			handleLook(sid, type) {
			    this.$router.push({
                    path: '/c_mall/merchant/detail',
                    query: { type: type, sid: sid }
                })
			},
//			// 配置店铺
//			handleShop(sid) {
//				this.$store.commit('aEdit', [2, sid])
//			},
			// 删除
			/*handleDel(sid) {
				pubObj.del(this, {
					title: '删除商家',
					content: '确定删除该商家，删除之后不可恢复?',
					api: api.merchant,
					sid: sid
				})
			},*/
			// 审批功能暂时隐藏，勿删！！！
			/*// 点击审批按钮，弹出dialog
			handleCheck(sid) {
				this.dialogVisible = true
				this.checkForm.curId = sid
			},
			// 确定审批
			handleCheckingSave() {
				pubObj.httpRequest($th, {
					method: 'PUT',
					url: api.merchant + this.checkForm.curId + '/' + this.checkForm.state,
					success(result) {
						$th.dialogVisible = false
						$th.$message.success('操作成功')
						pubObj.get_dataList($th, $th.api)
					}
				})
			},*/
		}
	}
</script>

<style>

</style>