<template>
	<div class="resource-wrap expand-table">
		<!--面包屑-->
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<!-- 搜索 -->
		<div class="search-fil-wrap one-line">
			<el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
				<el-form-item label="分组名称">
					<el-input v-model="searchForm.q" placeholder="请输入查找分组名称"></el-input>
				</el-form-item>
				<el-button type="primary" @click="searchInfo()">搜索</el-button>
			</el-form>
		</div>
		<div class="assist-btn-wrap">
			<el-button type="primary" @click="addMerCate('_top')" v-if="button.create">新增商品分组</el-button>
		</div>

        <el-table :data="tableData" :class="'table-wrap'" :stripe="true">
            <el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
            <el-table-column prop="nameAbbr" label="分组名称" label-class-name="first-title-left" class-name="first-content-left">
                <template slot-scope="scope">
                    <div @click="toggle(scope.$index, scope.row)" v-if="scope.row.children" class="tree-space">
                        <span class="el-icon-caret-right" v-if="!scope.row.isShow"></span>
                        <span class="el-icon-caret-bottom" v-if="scope.row.isShow"></span>
                    </div>
                    <div class="tree-space" v-else></div>
                    <span class="tree-space" v-for="item in scope.row.level"></span>
                    <span>{{scope.row.nameAbbr}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="分组描述" header-align="left"></el-table-column>
            <el-table-column prop="rank" label="排序值" align="center"></el-table-column>
            <!--<el-table-column prop="createdTime" label="创建时间" align="center"></el-table-column>-->
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <span :class="{'state-active': scope.row.state === 'Active', 'state-disabled': scope.row.state === 'Disabled'}">
                        {{scope.row.stateName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="right" header-align="center">
                <template slot-scope="scope">
                    <el-button type="text"
                               @click.native.parent="addMerCate(scope.$index,tableData)"
                               v-if="button.create && scope.row.shopSid && scope.row.level === 1">新增</el-button>
                    <el-button type="text"
                               @click.native.parent="editMerCate(scope.$index,tableData)"
                               v-if="button.update && scope.row.shopSid">修改</el-button>
                    <el-button type="text" style="color:#f00;"
                               @click.native.parent="delMerCate(scope.$index,tableData)"
                               v-if="button.delete && scope.row.shopSid">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

		<!-- dialog -->
		<el-dialog :title="dialog.title" v-model="dialogAdd" @close="dialogClose" size="tiny">
			<el-form :model="addForm" :rules="rules" ref="addForm">
				<el-form-item label="分组名称" label-width="84px" prop="nameAbbr">
					<el-input v-model="addForm.nameAbbr"></el-input>
				</el-form-item>
				<el-form-item label="分组说明" label-width="84px" prop="description">
					<el-input type="textarea" v-model="addForm.description"></el-input>
				</el-form-item>
				<el-form-item label="排序值" label-width="84px" prop="rank">
					<el-slider v-model.number="addForm.rank" show-input :max="99" :show-tooltip="false"></el-slider>
					<div style="font-size: 12px">数字越大排序越靠前</div>
				</el-form-item>
				<el-form-item label="状态" label-width="84px" required>
					<el-radio-group v-model="addForm.state">
						<el-radio label="Active">启用</el-radio>
						<el-radio label="Disabled">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAdd = false">取消</el-button>
				<el-button type="primary" @click="addMerCateConfirm('addForm')">{{dialog.btnTitle}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	import api from '../../../assets/config/m-api.js'
	import { mixin_getButton } from '../../common/jkc-mixin.vue'
	export default {
		mixins: [mixin_getButton],
		data() {
			return {
				crumbs: [{
						title: '商品管理',
					},
					{
						title: '分组管理',
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
				addForm: { // 新增分组默认form
                    nameAbbr: '',
					description: '',
					rank: 1,
					parentSid: '',
					state: 'Active',
				},
				rules: {
                    nameAbbr: [{
						required: true,
						message: '请输入分组名称',
						trigger: 'blur'
					}, {
						max: 15,
						message: '分组名称不能超过15字',
						trigger: 'change,blur'
					}, {
						validator: this.validName,
						message: '分组名称不能重复',
						trigger: 'change,blur'
					}],
					description: [{
						max: 30,
						message: '分组说明不能超过30字',
						trigger: 'change,blur'
					}],
					rank: [{
						required: true,
						type: 'number',
						message: '请输入分组排序',
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
			getData(param) { // 获取数据
//				this.$http.get(api.shopBizCate + 'Mall', {
				this.$http.get(['shopBizCate', 'Mall'], {
						params: param
					})
					.then((result) => {
						if(result.body.code === 200) {
							this.tableData = result.body.data;
						}
					}).catch((err) => {
						console.log(err)
					})
			},
			searchInfo() { // 搜索
				let data = {};
				for(let key in this.searchForm) {
					if(this.searchForm[key]) {
						data[key] = this.searchForm[key];
					}
				}
				if(JSON.stringify(data) === '{}') {
					this.getData();
					return false;
				}
				this.getData(data);
			},
			validName(rule, value, callback) { // 验证名称重复
				let repeat = false;
				for(let i = 0; i < this.tableData.length; i++) {
					if(this.addForm.sid !== this.tableData[i].sid && value === this.tableData[i].nameAbbr) {
						repeat = true;
						break;
					}
					if(this.tableData[i].children) {
						for(let j = 0; j < this.tableData[i].children.length; j++) {
							if(this.addForm.sid !== this.tableData[i].children[j].sid && value === this.tableData[i].children[j].nameAbbr) {
								repeat = true;
								break;
							}
						}
					}
				}
				if(repeat) {
					callback(new Error(rule.message));
				} else {
					callback();
				}
			},
			addMerCate(index, data) { // 打开新增分组dialog，并设定相应数据
				this.dialog.title = '新增分组';
				this.dialog.btnTitle = '确定';
				this.dialog.method = 'POST';
				this.dialogAdd = true;
				if(index != '_top') {
					this.addForm.parentSid = data[index].sid;
					//                    this.addForm._parentCode = data[index].code + '>';
				}
			},
			editMerCate(index, data) { // 修改数据
				this.addForm = JSON.parse(JSON.stringify(data[index]));
				this.dialog.title = '修改分组';
				this.dialog.btnTitle = '保存';
				this.dialog.method = 'PUT';
				this.dialogAdd = true;
			},
			addMerCateConfirm(formName) { // 确定新增/修改并验证数据，验证通过发起请求
				this.$refs[formName].validate((valid) => {
					if(valid) {
//						let url = api.shopBizCate + 'Mall' + (this.dialog.method == 'PUT' ? '/' + this.addForm.sid : '');
						let url = ['shopBizCate', 'Mall', (this.dialog.method == 'PUT' ? '/' + this.addForm.sid : '')];
						this.$http({
							method: this.dialog.method,
							url: url,
							body: this.addForm
						}).then((result) => {
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
						}).catch((error) => {
							console.log(error)
						})
					} else {
						console.log('error');
						return false;
					}
				})
			},
			delMerCate(index, data) { // 删除数据
				if(data[index].children && data[index].children.length > 0) {
					this.$message({
						type: 'warning',
						message: '该分组下有子分组不能直接删除！'
					});
					return false;
				}
				var url = ['shopBizCate', data[index].sid];
				this.$confirm('确定删除吗？删除后将无法恢复！', '删除提示', {
						type: 'warning'
					})
					.then(() => {
						this.$http.delete(url).then((result) => {
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
					}).catch(() => {
					})
			},
			dialogClose() { // 关闭dialog回调，重置addFrom
				this.$refs['addForm'].resetFields();
				this.addForm = {
                    nameAbbr: '',
					description: '',
					rank: 1,
					parentSid: '',
					state: 'Active',
				}
			},
            // 展开下级
            toggle: function(index, row) {
                let tableData = this.tableData;
                row.isShow = !row.isShow;
                if(row.isShow) {
                    for(let i = 0; i < row.children.length; i++) {
                        tableData.splice(index + 1, 0, row.children[i]);
                        index++;
                    }
                } else {
                    for(let i = index; i < tableData.length; i++) {
                        if(tableData[i + 1] && tableData[i + 1].level > tableData[index].level) {
                            if(tableData[i + 1].isShow){
                                tableData[i + 1].isShow = false;
                            }
                            tableData.splice(i + 1, 1);
                            i--;
                        } else {
                            break;
                        }
                    }
                }
            },
		}
	}
</script>

<style>
    .expand-table .tree-space{
        width: 12px;
        height: 1px;
        display: inline-block;
    }
</style>
