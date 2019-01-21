<template>
	<div class="resource-wrap expand-table">
		<!--面包屑-->
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<!-- 搜索 -->
		<div class="search-fil-wrap one-line">
			<el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
				<el-form-item label="规格名称">
					<el-input v-model="searchForm.q" placeholder="规格名称"></el-input>
				</el-form-item>
				<el-button type="primary" @click="searchInfo">搜索</el-button>
			</el-form>
		</div>

		<!--新增等辅助按钮-->
		<div class="assist-btn-wrap">
			<el-button type="primary" @click="addResource('_parent')" v-if="button.create">新增规格</el-button>
		</div>

		<!-- 表格 -->
		<el-table :data="tableData" :class="'table-wrap'" :row-class-name="setClass" :stripe="true">
			<el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
			<el-table-column type="expand" width="9">
				<template slot-scope="props">
					<el-table :data="props.row.children" :show-header="false" :class="'child-table'" :row-class-name="setClass">
						<el-table-column width="57"></el-table-column>
						<el-table-column prop="name" label="规格名称"></el-table-column>
						<el-table-column label="操作" width="120px" align="right">
							<template slot-scope="scope">
								<el-button type="text" @click.native.parent="editResource(scope.$index,props.row.children)" v-if="button.update">修改</el-button>
								<!--<el-button type="text" style="color:#f00;" @click.native.parent="delResource(scope.$index,props.row.children)" v-if="button.delete">删除</el-button>-->
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="规格名称" label-class-name="first-title-left" class-name="first-content-left"></el-table-column>
			<el-table-column label="操作" width="110px" align="right" header-align="center">
				<template slot-scope="scope">
					<el-button type="text" @click.native.parent="addResource(scope.$index,tableData)" v-if="button.create">新增</el-button>
					<el-button type="text" @click.native.parent="editResource(scope.$index,tableData)" v-if="button.update">修改</el-button>
					<!--<el-button type="text" style="color:#f00;" @click.native.parent="delResource(scope.$index,tableData)" v-if="button.delete">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>
		<!-- dialog -->
		<el-dialog :title="dialog.title" v-model="dialogAdd" @close="dialogClose" :close-on-click-modal="false">
			<el-form :model="addForm" :rules="rules" ref="addForm">
				<el-form-item label="规格名称" label-width="84px" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAdd = false">取消</el-button>
				<el-button type="primary" @click="addResourceConfirm('addForm')">{{dialog.btnTitle}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	/*import Vue from 'Vue'*/
	import { router } from '../../../pages/platform.js' //获取router实例对象，从main.js中导出的
	import api from '../../../assets/config/c-api.js'
	import { mixin_getButton } from '../../common/jkc-mixin.vue'
	import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	export default {
		mixins: [mixin_getButton],
		data() {
			return {
				crumbs: [{
						title: '商品管理',
					},
					{
						title: '规格管理',
					},
				],
				tableData: [],
				searchForm: {
					q: ''
				},
				dialogAdd: false,
				dialog: {
					title: '',
					btnTitle: '',
					method: ''
				},
				addForm: { // 新增规格默认form
					name: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入规格名称',
						trigger: 'blur'
					}]
				},
			}
		},
		components: {
			JkcBreadcrumb,
		},
		created() {
			this.getData();
		},
		methods: {
			getData(param) {
                this.$http.get(api.attribute, {
                    params: param,
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                    if(result.body.code == 200) {
                        this.tableData = result.body.data;
                    }
                }).catch((err) => {
                    console.log(err)
                })
			},
			searchInfo() {
				if(!this.searchForm.q) {
					this.getData();
				} else {
					this.getData(this.searchForm);
				}
			},
			setClass(row, index) {
				if(!row.children) {
					return 'no-child'
				}
			},
			addResource(index, data) { // 打开新增规格dialog，并设定相应数据
				this.dialog.title = '新增规格';
				this.dialog.btnTitle = '确定';
				this.dialog.method = 'POST';
				this.dialogAdd = true;
				if(index != '_parent') {
					this.addForm.code = data[index].code;
				}
			},
			editResource(index, data) { // 修改数据
				this.addForm = JSON.parse(JSON.stringify(data[index]));
				this.dialog.title = '修改规格';
				this.dialog.btnTitle = '保存';
				this.dialog.method = 'PUT';
				this.dialogAdd = true;
			},
			addResourceConfirm(formName) { // 确定新增/修改并验证数据，验证通过发起请求
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var url = api.attribute + (this.dialog.method == 'PUT' ? this.addForm.sid : '')
						this.$http({
							method: this.dialog.method,
							url: url,
							body: this.addForm,
                            headers: {
                                'api-ver': '2.0.0'
                            }
						}).then(function(result) {
							if(result.body.code == 200) {
								this.$message({
									type: 'success',
									message: this.dialog.method == 'PUT' ? '修改成功' : '新增成功'
								});
								this.getData();
								this.dialogAdd = false;
							} else {
								this.$message({
									message: result.body.message,
									type: 'warning'
								})
							}
						}, function(err) {
							console.log(err)
						})
					} else {
						console.log('error');
						return false;
					}
				})
			},
			delResource(index, data) { // 删除数据
				var url = api.attribute + data[index].sid;
				this.$confirm('确定删除吗？删除后将无法恢复！', '删除提示', {
						type: 'warning'
					})
					.then(() => {
                        this.$http.delete(url, {
                            headers: {
                                'api-ver': '2.0.0'
                            }
                        }).then((result) => {
                            if(result.body.code == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功'
                                });
                                this.getData();
                            } else {
                                this.$message({
                                    message: result.body.message,
                                    type: 'warning'
                                })
                            }
                        }).catch((err) => {
                            this.$message({
                                type: 'warning',
                                message: err.body.message
                            });
                        })
					}).catch(() => {})
			},
			dialogClose() { // 关闭dialog回调，重置addFrom
				this.$refs.addForm.resetFields();
				this.addForm = {
					name: ''
				};
			}
		}
	}
</script>

<style>
	.resource-wrap .no-child .el-table__expand-icon {
		display: none;
	}
</style>
