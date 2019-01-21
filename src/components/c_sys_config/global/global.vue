<template>
	<div class="sys-config">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
		<!-- 搜索 -->
		<div class="search-fil-wrap one-line">
			<el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
				<el-form-item label="所属商家">
					<el-select
							v-model="searchForm.merchantSid"
							filterable
							remote
							placeholder="请输入商家名称"
							:remote-method="remoteMethod"
							:loading="getMerchantLoading">
						<el-option
								v-for="item in merchantData"
								:key="item.sid"
								:label="item.nameFull"
								:value="item.sid">
						</el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="searchInfo">搜索</el-button>
			</el-form>
		</div>

		<el-table :data="tableData" v-loading="loading" class="table-composing" stripe>
			<el-table-column label="商家名称" prop="merchantName">
				<template slot-scope="scope">{{scope.row.merchantName || '--'}}</template>
			</el-table-column>
			<el-table-column label="规则名称" prop="nameDesc" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="代码参数" prop="name"></el-table-column>
			<el-table-column label="代码参数注释" prop="description" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="数值" prop="value"></el-table-column>
			<el-table-column label="操作" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button type="text" v-if="button.update"
							   @click="handleEdit(scope.row.merchantSid, scope.row.name, scope.row.sid)">编辑</el-button>
					<el-button type="text" v-if="button.delete"
							   @click="handleDel(scope.row.sid)">恢复默认</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="编辑配置" v-model="dialogVisible" :close-on-click-modal="false" size="tiny" @close="dialogClose">
			<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="84px">
				<el-form-item label="商家名称">
					<el-input v-model="dialogForm.merchantName" disabled></el-input>
				</el-form-item>
				<el-form-item label="规则名称">
					<el-input v-model="dialogForm.nameDesc" disabled></el-input>
				</el-form-item>
				<el-form-item label="代码参数">
					<el-input v-model="dialogForm.name" disabled></el-input>
				</el-form-item>
				<el-form-item label="代码参数注释">
					<el-input v-model="dialogForm.description" disabled></el-input>
				</el-form-item>
				<el-form-item label="数值" prop="value">
					<el-input v-model="dialogForm.value"></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</template>
		</el-dialog>

	</div>
</template>

<script>
	import { mixin_getButton, mixin_breadcrumb } from '../../common/jkc-mixin.vue'
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'
	import { vm } from '../../../pages/platform.js'

	export default {
		mixins: [mixin_getButton, mixin_breadcrumb],
		data() {
			return {
				api: null,
				dialogVisible: false,
				currSid: null,
				dialogForm: {},
				rules: {
                    value: [{
                        required: true,
						message: '请输入数值',
						trigger: 'blur'
					}]
				},
                loading: false,
                tableData: [],
                searchForm: {
                    merchantSid: ''
				},
				merchantData: [],
                getMerchantLoading: false,
			}
		},
		created() {
			this.api = api.config;
			this.crumbs = [{
				title: '系统设置'
			}, {
				title: '全局配置'
			}];
			this.getData();
		},
		beforeMount() {

		},
		methods: {
            remoteMethod(query) {		// 动态搜索商家信息
				if(query === ''){
                    this.searchForm.merchantSid = '';
				}
                if (query !== '' && query.length > 1) {
                    this.getMerchantLoading = true;
                    this.$http.get(api.merchant + 'list')
                        .then((result) => {
                            this.getMerchantLoading = false;
                            this.merchantData = result.body.data.filter(item => {
                                return item.nameFull.toLowerCase().indexOf(query.toLowerCase()) > -1;
                            });
                        }).catch((err) => {
                        console.log(err)
                    });
                } else {
                    this.merchantData = [];
                }
            },
            getData(param) {		// 获取列表数据
				this.loading = true;
				let url = api.config;
				if(param){
				    url += param;
				}
                this.$http.get(url)
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200) {
                            this.tableData = result.body.data;
                        }else{
                            this.$message({
								type: 'warning',
								message: result.body.message
							})
						}
                    }).catch((err) => {
                    console.log(err)
                })
            },
            searchInfo() {
                if(!this.searchForm.merchantSid){
                    this.getData();
                }else {
                    this.getData(this.searchForm.merchantSid);
                }
            },
//			handleAdd(body) {
//				const _this = this;
//				pubObj.httpRequest(_this, {
//					method: 'POST',
//					url: api.config,
//					body: body,
//					success(result) {
//						_this.$message.success({
//							message: result.message,
//							duration: 2000,
//							onClose() {
//								_this.$store.commit('refresh', 1) // 刷新
//							}
//						});
//
//					}
//				})
//			},
			handleEdit(merchantSid, name, sid) {
				const _this = this;
				this.currSid = sid;
				pubObj.httpRequest(_this, {
					url: api.config + merchantSid + '/' + name,
					success(result) {
						_this.dialogForm = result.data;
						_this.dialogVisible = true;
					}
				})
			},
			handleDel(sid) {
				pubObj.del(this, {
					title: '恢复提示',
					content: '确定恢复默认值？',
					api: api.config,
					sid: sid
				})
			},
			handleSave() {
                this.$refs.dialogForm.validate(valid => {
                    if(valid){
                        const _this = this;
                        pubObj.httpRequest(_this, {
                            method: 'PUT',
                            url: api.config + _this.currSid,
                            body: _this.dialogForm,
                            success(result) {
                                _this.$message.success({
                                    message: result.message,
                                    duration: 2000,
                                    onClose() {
                                        _this.dialogVisible = false;
                                        _this.$store.commit('refresh', 1) // 刷新
                                    }
                                });
                            }
                        })
					}
				})
			},
			dialogClose(){
                this.$refs.dialogForm.resetFields();
			}
		}
	}
</script>

<style>

</style>
