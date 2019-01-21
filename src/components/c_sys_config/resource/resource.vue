<template>
	<div class="resource-wrap expand-table">
		<!--面包屑-->
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
		<el-tabs v-model="platform" type="card" @tab-click="typeClick">
			<el-tab-pane label="云平台" name="cloud"></el-tab-pane>
			<el-tab-pane label="阅商机" name="biz"></el-tab-pane>
		</el-tabs>

		<div class="assist-btn-wrap">
			<el-button type="primary" @click="addResource('_top')" v-if="button.create">新增父资源</el-button>
			<el-button type="success" @click="refresh">刷新缓存</el-button>
		</div>

		<!-- 表格 -->
		<el-table :data="tableData" :class="'table-wrap'" :row-class-name="setClass" :stripe="true">
			<el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
			<el-table-column type="expand" width="9">
				<template slot-scope="props">
					<el-table :data="props.row.children" :show-header="false" :class="'child-table'" :row-class-name="setClass">
						<el-table-column width="60"></el-table-column>
						<el-table-column type="expand" width="9">
							<template slot-scope="props2">
								<el-table :data="props2.row.children" :show-header="false">
									<el-table-column width="70"></el-table-column>
									<el-table-column prop="name" label="资源名称" label-class-name="first-title-left" class-name="first-content-left"></el-table-column>
									<el-table-column prop="code" label="资源代码"></el-table-column>
									<el-table-column prop="url" label="资源路径"></el-table-column>
									<el-table-column prop="rank" label="资源排序" align="center"></el-table-column>
									<el-table-column label="是否是按钮" align="center">
										<template slot-scope="scope">
											<span>{{scope.row.button?'是':''}}</span>
										</template>
									</el-table-column>
									<el-table-column label="操作" width="160px" align="center">
										<template slot-scope="scope">
											<el-button type="text" @click.native.parent="editResource(scope.$index,props2.row.children)" v-if="button.update">修改</el-button>
											<el-button type="text" style="color:#f00;" @click.native.parent="delResource(scope.$index,props2.row.children)" v-if="button.delete">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="资源名称" label-class-name="first-title-left" class-name="first-content-left"></el-table-column>
						<el-table-column prop="code" label="资源代码"></el-table-column>
						<el-table-column prop="url" label="资源路径"></el-table-column>
						<el-table-column prop="rank" label="资源排序" align="center"></el-table-column>
						<el-table-column label="是否是按钮" align="center">
							<template slot-scope="scope">
								<span>{{scope.row.button?'是':''}}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="160px" align="center">
							<template slot-scope="scope">
								<el-button type="text" @click.native.parent="addResource(scope.$index,props.row.children)" v-if="button.create">新增</el-button>
								<el-button type="text" @click.native.parent="editResource(scope.$index,props.row.children)" v-if="button.update">修改</el-button>
								<el-button type="text" style="color:#f00;" @click.native.parent="delResource(scope.$index,props.row.children)" v-if="button.delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="资源名称" label-class-name="first-title-left" class-name="first-content-left"></el-table-column>
			<el-table-column prop="code" label="资源代码" header-align="left"></el-table-column>
			<el-table-column prop="url" label="资源路径" header-align="left"></el-table-column>
			<el-table-column prop="rank" label="资源排序" align="center"></el-table-column>
			<el-table-column label="是否是按钮" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.button?'是':''}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="160px" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click.native.parent="addResource(scope.$index,tableData)" v-if="button.create">新增</el-button>
					<el-button type="text" @click.native.parent="editResource(scope.$index,tableData)" v-if="button.update">修改</el-button>
					<el-button type="text" style="color:#f00;" @click.native.parent="delResource(scope.$index,tableData)" v-if="button.delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- dialog -->
		<el-dialog :title="dialog.title" v-model="dialogAdd" @close="dialogClose" size="tiny">
			<el-form :model="addForm" :rules="rules" ref="addForm">
				<el-form-item label="资源名称" label-width="84px" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="资源代码" label-width="84px" class="form-code" prop="code">
					<span class="code-parent" v-if="addForm._parentCode">{{addForm._parentCode}}</span>
					<el-input v-model="addForm.code"></el-input>
				</el-form-item>
				<el-form-item label="资源路径" label-width="84px">
					<el-input v-model="addForm.url" :disabled="resourceType == 'button'"></el-input>
				</el-form-item>
				<el-form-item label="资源排序" label-width="84px" required>
					<el-slider v-model.number="addForm.rank" show-input :max="99" :show-tooltip="false"></el-slider>
					<div style="font-size: 12px">数字越大排序越靠前</div>
				</el-form-item>
				<el-form-item label="资源类型" label-width="84px">
					<el-radio-group v-model="resourceType" :disabled="this.dialog.method == 'PUT'">
						<el-radio v-for="(item,index) in type" :key="index" :label="item.label">{{item.value}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="请求方式" label-width="84px">
					<el-radio-group v-model="addForm.method">
						<el-radio v-for="(item,index) in methodOptions" :key="index" :label="item.value"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAdd = false">取 消</el-button>
				<el-button type="primary" @click="addResourceConfirm('addForm')">{{dialog.btnTitle}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mixin_getButton } from '../../common/jkc-mixin.vue'
	import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	export default {
		mixins: [mixin_getButton],
		data() {
			return {
				crumbs: [{
						title: '系统设置',
					},
					{
						title: '资源管理',
					},
				],
				platform: this.$route.query.platform || 'cloud',
				tableData: [],
				dialogAdd: false,
				dialog: {
					title: '',
					btnTitle: '',
					method: ''
				},
				addForm: { // 新增资源默认form
					name: '',
					code: '',
					rank: 1,
					method: 'GET',
					url: '',
				},
				methodOptions: [{
						value: 'GET',
					},
					{
						value: 'POST',
					},
					{
						value: 'PUT',
					},
					{
						value: 'DELETE',
					}
				],
				type: [{
					label: 'func',
					value: '菜单'
				}, {
					label: 'button',
					value: '按钮'
				}],
				resourceType: 'func',
				rules: {
					name: [{
						required: true,
						message: '请输入资源名称',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入资源代码',
						trigger: 'blur'
					}]
				},
			}
		},
		components: {
			JkcBreadcrumb,
		},
		created() {
			if(!this.$route.query.platform) {
				let query = JSON.parse(JSON.stringify(this.$route.query));
				query.platform = this.platform;
				this.$router.replace({
					path: this.$route.path,
					query: query
				})
			}
			this.getData();
		},
		methods: {
			typeClick(tab, event) { // 切换代理商或供货商
				// cloud:云平台, merchant:商家端, author:作家端
				let query = JSON.parse(JSON.stringify(this.$route.query));
				query.platform = tab.name;
				this.$router.replace({
					path: this.$route.path,
					query: query
				})
				this.getData();
			},
			getData() {
				this.$http.get(['newResource', this.$route.query.platform]).then(function(result) {
					if(result.body.code === 200) {
						this.tableData = result.body.data;
					}
				}, function(err) {
					console.log(err)
				})
			},
			setClass(row, index) {
				if(!row.children) {
					return 'no-child'
				}
			},
			addResource(index, data) { // 打开新增资源dialog，并设定相应数据
				this.dialog.title = '新增资源';
				this.dialog.btnTitle = '新 增';
				this.dialog.method = 'POST';
				this.dialogAdd = true;
				if(index !== '_top') {
					this.addForm._parentCode = data[index].code + '>';
				}
			},
			editResource(index, data) { // 修改数据
				this.addForm = JSON.parse(JSON.stringify(data[index]));
				if(data[index].code.lastIndexOf('>') !== -1) {
					var i = data[index].code.lastIndexOf('>');
					this.addForm._parentCode = this.addForm.code.substring(0, i + 1);
					this.addForm.code = this.addForm.code.substring(i + 1);
				}
				this.dialog.title = '修改资源';
				this.dialog.btnTitle = '修 改';
				this.dialog.method = 'PUT';
				this.dialogAdd = true;
				this.resourceType = data[index].button ? 'button' : 'func';
			},
			addResourceConfirm(formName) { // 确定新增/修改并验证数据，验证通过发起请求
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var data = JSON.parse(JSON.stringify(this.addForm));
						if(data._parentCode) {
							data.code = data._parentCode + data.code;
							delete data._parentCode;
						}
						if(this.resourceType === 'button') {
							delete data.url;
						}
						var url = ['newResource', this.$route.query.platform + '/' + this.resourceType + (this.dialog.method === 'PUT' ? '/' + this.addForm.sid : '')]
						this.$http({
							method: this.dialog.method,
							url: url,
							body: data
						}).then(result => {
							if(result.body.code === 200) {
								this.$message({
									type: 'success',
									message: this.dialog.method === 'PUT' ? '修改成功' : '新增成功'
								});
								this.getData();
								this.getBtn(this.$route.query.btn, 'cloud');
								this.dialogAdd = false;
							} else {
								this.$message({
									message: result.body.message,
									type: 'warning'
								})
							}
						}).catch(error => {
							console.log(error)
						})
					} else {
						console.log('error');
						return false;
					}
				})
			},
            refresh(){
			    this.$http.get(['newResource', this.$route.query.platform, '/refresh'])
                    .then(result => {
                        if(result.body.code === 200){
                            this.$message(result.body.message)
                        }
                })
            },
			delResource(index, data) { // 删除数据
				var url = ['newResource', this.$route.query.platform + '/' + (data[index].button ? 'button/' : 'func/') + data[index].sid];
				this.$confirm('确定删除吗？删除后将无法恢复！', '删除提示', {
						type: 'warning'
					})
					.then(() => {
						this.$http.delete(url).then(function(result) {
							if(result.body.code === 200) {
								this.$message({
									type: 'success',
									message: '删除成功'
								});
								this.getData();
								this.getBtn(this.$route.query.btn, 'cloud');
							} else {
								this.$message({
									type: 'warning',
									message: result.body.message
								});
							}
						}, function(err) {
							console.log(err)
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
					name: '',
					code: '',
					rank: 1,
					method: 'GET',
					url: ''
				};
				this.resourceType = 'func';
			}
		}
	}
</script>

<style>
	.resource-wrap.expand-table .no-child .el-table__expand-icon {
		display: none;
	}

	.resource-wrap .form-code .el-form-item__content {
		display: flex;
	}

	.resource-wrap .form-code .code-parent {
		margin-right: 10px;
	}
</style>
