<template>
	<div class="channel">
		<!--面包屑-->
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<!-- 搜索 -->
		<div class="search-fil-wrap one-line">
			<el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
				<el-form-item label="渠道名称">
					<el-input v-model="searchForm.q"></el-input>
				</el-form-item>
				<el-button type="primary" @click="searchChannel()">搜索</el-button>
			</el-form>
		</div>

		<!--新增等辅助按钮-->
		<div class="assist-btn-wrap">
			<el-button type="primary" @click="addChannel('_parent')">新增渠道</el-button>
			<el-button type="success" @click="handleRefreshCache">刷新缓存</el-button>
		</div>

		<!-- 表格 -->
		<el-table :data="tableData" v-loading="loading" :stripe="true">
			<el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
			<el-table-column prop="name" label="渠道名称" label-class-name="first-col-no-padding" class-name="first-col-no-padding"></el-table-column>
			<!--<el-table-column prop="code" label="渠道代码"></el-table-column>-->
			<el-table-column prop="memberCount" label="渠道限制总会员数" align="center"></el-table-column>
			<el-table-column prop="hierarchyCount" label="渠道限制组织机构层级数" align="center"></el-table-column>
			<el-table-column label="导航栏设置" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="handleShow(1, scope.row.sid)">查看/修改</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="150px">
				<template slot-scope="scope">
					<el-button type="text" @click.native.parent="editChannel(scope.$index,tableData)">修改</el-button>
					<!--<el-button type="text" style="color:#f00;" @click.native.parent="delSingleData(scope.$index,tableData)">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<!-- dialog -->
		<el-dialog :title="dialog.title" v-model="dialogAdd" @close="dialogClose" size="tiny">
			<el-form :model="addForm" :rules="rules" ref="addForm">
				<el-form-item label="渠道名字" label-width="84px" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<!--<el-form-item label="渠道代码" label-width="84px">-->
				<!--<el-input v-model="addForm.code"></el-input>-->
				<!--</el-form-item>-->
				<el-form-item label="会员总数限制" label-width="84px" prop="memberCount">
					<el-slider v-model.number="addForm.memberCount" :step="100" show-input :max="1000000" :show-tooltip="false"></el-slider>
				</el-form-item>
				<el-form-item label="组织机构层级限制" label-width="84px" prop="hierarchyCount">
					<el-slider v-model.number="addForm.hierarchyCount" show-input :max="5" :show-tooltip="false"></el-slider>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAdd = false">取消</el-button>
				<el-button type="primary" @click="addChannelConfirm('addForm')">{{dialog.btnTitle}}</el-button>
			</div>
		</el-dialog>

		<!--增加导航-->
		<channel-table v-if="bStatus !== 0"></channel-table>
	</div>
</template>
<script>
	/*import Vue from 'Vue'*/
	import ChannelTable from './table.vue'
	import api from '../../../assets/config/c-api.js'
	import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	import validator from '../../../assets/unit/validator.js'
	import { pubObj } from '../../../assets/unit/public.js'

	export default {
		data() {
			return {
				crumbs: [{
						title: '多版本管理',
					},
					{
						title: '渠道管理',
					},
				],
				searchForm: {
					q: ''
				},
				addForm: {
					name: '',
					code: '',
					memberCount: 1,
					hierarchyCount: 1
				},
				rules: {
					name: [{
						required: true,
						message: '请输入渠道名称！',
						trigger: 'blur'
					}, {
						validator: validator.validStringLength,
						length: 10,
						message: '渠道名称不能超过10个字',
						trigger: 'blur'
					}, {
						validator: this.validName,
						message: '渠道名称不能重复',
						trigger: 'blur'
					}],
					memberCount: [{
						required: true,
						type: 'number',
						min: 1,
						message: '会员总数不能为0',
						trigger: 'blur'
					}],
					hierarchyCount: [{
						required: true,
						type: 'number',
						min: 1,
						message: '组织机构层级不能为0',
						trigger: 'blur'
					}],
				},
				dialog: {
					title: '',
					btnTitle: '',
					method: ''
				},
				dialogAdd: false,
				tableData: [],
				pagination: {},
				loading: false
			}
		},
		computed: {
			bStatus() {
				return this.$store.state.b.status;
			}
		},
		created() {
			this.getData();
		},
		methods: {
		    // 刷新缓存
		    handleRefreshCache() {
                pubObj.httpRequest(this, {
                    url: this.$api.channel + 'refresh',
                    success(result) {
                        this.$message.success(result.message);
                    }
                })
            },
			dialogClose() { // 关闭dialog的回调
				this.$refs.addForm.resetFields();
//				this.addForm = {
//					name: '',
//					code: '',
//					memberCount: null,
//					hierarchyCount: null
//				};
			},
			getData(param) { // 获取列表数据
				this.loading = true;
				this.$http.get(api.channel, {
						params: param
					})
					.then(function(response) {
						this.loading = false;
						if(response.body.code === 200) {
							this.tableData = response.body.data;
							if(response.body.pagination) {
								this.pagination = response.body.pagination;
							}
						}
					}).catch((error) => {
						console.log(error)
					});
			},
			searchChannel() { // 搜索渠道
				if(!this.searchForm.q) {
					this.getData();
					return;
				}
				this.getData(this.searchForm);
			},
			validName(rule, value, callback) { // 验证名称重复
				let repeat = false;
				for(let i = 0; i < this.tableData.length; i++) {
					if(this.addForm.sid !== this.tableData[i].sid && value === this.tableData[i].name) {
						repeat = true;
					}
				}
				if(repeat) {
					callback(new Error(rule.message));
				} else {
					callback();
				}
			},
			resetForm(formName) { // 重置表单
				this.$refs[formName].resetFields();
			},
			addChannel(index, data) { // 打开新增规格dialog，并设定相应数据
				this.dialog.title = '新增渠道';
				this.dialog.btnTitle = '确定';
				this.dialog.method = 'POST';
				this.dialogAdd = true;
				if(index != '_parent') {
					this.addForm = data[index];
				}
			},
			editChannel(index, data) { // 修改数据
				this.addForm = JSON.parse(JSON.stringify(data[index]));
				this.dialog.title = '修改渠道';
				this.dialog.btnTitle = '保存';
				this.dialog.method = 'PUT';
				this.dialogAdd = true;
			},
			addChannelConfirm(formName) { // 确定新增/修改并验证数据，验证通过发起请求
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var url = api.channel + (this.dialog.method === 'PUT' ? '/' + this.addForm.sid : '')
						this.$http({
							method: this.dialog.method,
							url: url,
							body: this.addForm
						}).then(function(result) {
							if(result.body.code === 200) {
								this.$message({
									type: 'success',
									message: this.dialog.method === 'PUT' ? '修改成功' : '新增成功'
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
					}
				})
			},
			delSingleData(index, data) { // 删除单条数据
				let url = api.channel + data[index].sid;
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
								data.splice(index, 1);
							} else {
							}
						}, function(err) {
							console.log(err)
						})
					})
			},
			// 为渠道增加导航
			handleShow(status, sid) {
				this.$store.commit('bEdit', [status, sid])
			}
		},
		components: {
			JkcBreadcrumb,
			ChannelTable
		}
	}
</script>
