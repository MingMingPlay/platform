<template>
	<div class="role-wrap expand-table">
		<!--面包屑-->
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<!-- 搜索 -->
		<div class="search-fil-wrap one-line">
			<el-form label-width="80px" :model="searchForm" :inline="true">
				<el-form-item label="角色名称">
					<el-input v-model="searchForm.q" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-button type="primary" @click="searchInfo">搜索</el-button>
			</el-form>
		</div>
		<div class="assist-btn-wrap">
			<el-button type="primary" @click="addRole()" v-if="button.create">新增角色</el-button>
            <el-button type="success" @click="refresh">刷新权限缓存</el-button>
		</div>

		<el-table :data="tableData" v-loading="getRoleLoading" :stripe="true">
			<el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
			<el-table-column prop="name" label="角色名称" label-class-name="first-col-no-padding" class-name="first-col-no-padding"></el-table-column>
            <el-table-column label="角色状态" align="center">
                <template slot-scope="scope">
                    <span :class="{'state-active': scope.row.state === 'Active', 'state-disabled': scope.row.state === 'Disabled'}">
                        {{scope.row.stateName}}
                    </span>
                </template>
            </el-table-column>
			<el-table-column label="备注" align="center" prop="description"></el-table-column>
			<el-table-column label="授权管理" align="center">
				<template slot-scope="scope">
                    <el-button type="text" @click="editAuth(scope.row.sid)" v-if="!scope.row.reserved">查看/修改</el-button>
                    <span v-else-if="scope.row.reserved">--</span>
				</template>
			</el-table-column>
			<!--<el-table-column label="授权用户" align="center">-->
				<!--<template slot-scope="scope">-->
					<!--<el-button type="text" @click="editUserAuth(scope.row.sid)">查看/修改</el-button>-->
				<!--</template>-->
			<!--</el-table-column>-->
			<el-table-column label="操作" align="center" width="120px">
				<template slot-scope="scope">
                    <template v-if="!scope.row.reserved">
                        <el-button type="text" @click="addRole(scope.$index,tableData)">修改</el-button>
                        <el-button type="text" style="color:#f00" @click="delRole(scope.row.sid)">删除</el-button>
                    </template>
                    <span v-else-if="scope.row.reserved">--</span>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog :title="dialog.title" v-model="dialogSwitch" :close-on-click-modal="false" @close="dialogClose" size="tiny">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="角色名称" label-width="80px" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="角色备注" label-width="80px">
					<el-input v-model="form.description"></el-input>
				</el-form-item>
			</el-form>
			<template slot="footer">
				<el-button @click="dialogSwitch = false">取消</el-button>
				<el-button type="primary" @click="addRoleConfirm">{{dialog.button}}</el-button>
			</template>
		</el-dialog>

		<!-- 角色权限管理 -->
		<el-dialog title="角色权限管理" v-model="authSwitch" size="tiny" @close="authClose">
			<el-table :data="authData" :class="'auth-wrap'" ref="authData" :row-class-name="setClass"
			:row-style="initSelect" @select="select" @select-all="selectAll" v-loading="tableLoading">
				<el-table-column type="selection" width="40" align="center" label-class-name="table-index-title"></el-table-column>
				<el-table-column type="expand" width="9">
					<template slot-scope="props">
						<el-table :data="props.row.children" :ref="props.row.code" :show-header="false" :class="'child-table'" :row-class-name="setClass" :row-style="initSelect" @select="select">
							<el-table-column type="selection" width="70" :class-name="'checkbox'" align="center" label-class-name="table-index-title"></el-table-column>
							<el-table-column type="expand" width="9">
								<template slot-scope="props2">
									<el-table :data="props2.row.children" :ref="props2.row.code" :row-style="initSelect" :show-header="false" @select="select">
										<el-table-column type="selection" width="100" :class-name="'checkbox'" align="center" label-class-name="table-index-title"></el-table-column>
										<el-table-column prop="name" label="资源名称"
														 :show-overflow-tooltip="true"
														 class-name="first-content-left"></el-table-column>
									</el-table>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="资源名称"
											 :show-overflow-tooltip="true"
											 class-name="first-content-left"></el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="资源名称"
								 :show-overflow-tooltip="true"
								 label-class-name="first-title-left"
								 class-name="first-content-left"></el-table-column>
			</el-table>
			<template slot="footer">
				<el-button @click="authSwitch = false">取消</el-button>
				<el-button type="primary" @click="saveAuth" :loading="authSubmitLoading">保存</el-button>
			</template>
		</el-dialog>

		<!-- 根据角色授权用户权限 -->
		<el-dialog title="角色授权管理" v-model="authUserSwitch" size="tiny" @close="authClose">
            <el-form :inline="true">
                <tp-organ v-model="organCode" :goods="true"></tp-organ>
                <el-button type="primary" @click="editUserAuth(tempSid)">查询</el-button>
            </el-form>
			<el-table :data="authUserData" ref="authUserData" :empty-text="authUserEmpty" @select="selectUser" @select-all="selectUserAll" v-loading="tableLoading" :row-style="initSelectUser" height="250">
				<el-table-column type="selection" width="40"></el-table-column>
				<el-table-column prop="userName" label="用户名称" header-align="left" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
			<template slot="footer">
				<el-button @click="authUserSwitch = false">取消</el-button>
				<el-button type="primary" @click="saveAuthUser" :loading="authSubmitLoading" :disabled="authUserData.length == 0">保存</el-button>
			</template>
		</el-dialog>


	</div>
</template>

<script>

import api from '../../../assets/config/m-api.js'
import { mixin_getButton } from '../../common/jkc-mixin.vue'
import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
import TpOrgan from '../../common/tp-organ.vue'

export default {
    mixins: [mixin_getButton],
	data (){
		return {
			crumbs: [
				{
					title: '系统设置',
				},
				{
					title: '角色管理',
				},
			],
			tableData:[],
			getRoleLoading: false,
			searchForm: {
			    q: ''
			},
            // 根据角色查用户或授权用户时
            organCode: '',
			form: {
				name: '',
                description: ''
			},
			rules: {
				name: [{
					required: true,
					message: '请输入角色名称',
					trigger: 'blur'
				},{
					message: '角色名称长度不能大于32个字符',
					max: 32,
					trigger: 'blur'
				}]
			},
			dialog: {
				title: '',
				button: '',
				type: ''
			},
			dialogSwitch: false,
			authSwitch: false,
			tableLoading: false,
			authData: [],
			authForm: [],
			authSubmitLoading: false,
			tempSid:'',
			authUserSwitch: false,
			authUserData: [],
			authUserForm: [],
			authUserEmpty: '暂无数据',
		}
	},
	created (){
		this.getData();
	},
	components: {
		JkcBreadcrumb,
        TpOrgan
	},
	methods: {
		getData (param){		// 获取列表
			this.getRoleLoading = true;
			this.$http.get(['roleBiz'], {params: param})
				.then(function(result){
					if(result.body.code === 200){
						this.getRoleLoading = false;
						this.tableData = result.body.data;
					}
				}).catch(error => {
					console.log(error)
				})
		},
        searchInfo() {
            if(!this.searchForm.q){
                this.getData();
            }else {
                this.getData(this.searchForm);
            }
        },
		addRole (index,data){		// 打开dialog，根据参数判断是新增还是修改
			if(index || index === 0){
				this.dialog.title = '修改角色';
				this.dialog.button = '保存';
				this.dialog.type = 'PUT';
				this.form = JSON.parse(JSON.stringify(data[index]));
			}else{
				this.dialog.title = '新增角色';
				this.dialog.button = '确定';
				this.dialog.type = 'POST';
			}
			this.dialogSwitch = true;
		},
		addRoleConfirm (){		// 新增和修改角色
			this.$refs.form.validate((valid) => {
				if(valid){
					var url = ['roleBiz', this.dialog.type === 'PUT' ? this.form.sid : '']
					this.$http({
						method: this.dialog.type,
						url: url,
						body:this.form
					}).then(function(result){
						if(result.body.code === 200){
							this.getData();
							this.$message({type:'success',message:result.body.message})
							this.dialogSwitch = false;
						}else{
							this.$message({type:'info',message:result.body.message})
						}
					},function(err){

					})
				}
			})
		},
		delRole (sid){		// 删除角色
			this.$confirm('确定删除吗？删除后将无法恢复！','删除提示',{type:'warning'})
			.then(() => {
				this.$http.delete(['roleBiz', sid]).then(function(result){
					if(result.body.code === 200){
						this.getData();
						this.$message({type:'success',message:result.body.message})
					}else {
                        this.$message.warning(result.body.message)
                    }
				},function(err){})
			})
			.catch(() => {})
		},
		dialogClose (){			// dialog关闭重置form
			this.$refs.form.resetFields();
			this.form = {name:''}
		},
		getRoleAuth (sid){		// 根据角色获取权限
			this.tableLoading = true;
			this.$http.get(['roleBiz', sid + '/perm'])
			.then(function(result){
				if(result.body.code === 200){
					this.tableLoading = false;
					this.authData = result.body.data;
				}
			}).catch(function(err){
				console.log(err)
			})
		},
		editAuth (sid){		// 编辑权限，打开dialog并根据sid获取数据
			this.authSwitch = true;
			this.getRoleAuth(sid);
			this.tempSid = sid;
		},
		setClass (row,index){		// 没有子集的添加class来隐藏折叠符号 '>'
			if(!row.children){
				return 'no-child'
			}
		},
		findParentCode(code, data, pCode){		// 通过子集的code查找父级的code
		    let parentCode = '';
		    for(let i=0;i<data.length;i++){
		        if(data[i].code === code){
                    parentCode = pCode;
                    break;
				}
		        if(data[i].children){
		            if(this.findParentCode(code, data[i].children, data[i].code)){
                        parentCode = this.findParentCode(code, data[i].children, data[i].code)
					}
				}
			}
			return parentCode;
		},
		initSelect (row,index){		// 初始化选择，需要注意ref是用code命名的
			let dataName = this.findParentCode(row.code, this.authData, 'authData');
			this.$refs[dataName] && this.$refs[dataName].toggleRowSelection(row,row.checked)
		},
		selectParent (data, code, bool){
			for(var i=0;i<data.length;i++){
				if(data[i].code === code){
					data[i].checked = bool;
					this.initSelect(data[i]);
				}
			}
		},
		select (selection, row, bool){		// 单个选中的所有逻辑
			if(selection === 'all'){
				row.checked = bool;
			}else{
				row.checked = !row.checked;
				bool = row.checked;
			}
            let parentCode = this.findParentCode(row.code, this.authData, 'authData');
			if(parentCode !== 'authData' && selection !== 'all' && selection.length === 0 && row.button === false){
				// 子集不为button，且全都没有选中，则父级也不选中
				this.selectParent(this.authData, parentCode, false)
			}else if(parentCode !== 'authData' && selection !== 'all' && selection.length > 0 && row.button === false){
				// 子集任意一个选中，父级也要选中
				this.selectParent(this.authData, parentCode, true)
			}
			this.initSelect(row);
			if(row.children){	// 对子集只执行单一操作，所有改为all
				for(var i=0;i<row.children.length;i++){
					this.select('all',row.children[i],bool)
				}
			}
		},
		selectAll (selection){		// 全选逻辑
			for(var i=0;i<this.authData.length;i++){
				if(selection.length === 0){		// 取消
					this.select('all', this.authData[i], false)
				}else if(selection.length > 0){		// 全选
					this.select('all', this.authData[i], true)
				}
			}
		},
		formatAuthForm (data, form, type){		// 遍历数据取到选中的值
			for(var i=0;i<data.length;i++){
				if(data[i].checked){
					form.push(data[i][type])
				}
				if(data[i].children){
					this.formatAuthForm(data[i].children, form, type);
				}
			}
		},
		saveAuth (){		// 保存修改权限
			this.authSubmitLoading = true;
			this.formatAuthForm(this.authData, this.authForm, 'code');
			this.$http.put(['roleBiz', this.tempSid + '/perm'], this.authForm)
			.then(function(result){
                this.authSwitch = false;
				if(result.body.code === 200){
					this.$message({type:'success',message:result.body.message})
					// this.authSwitch = false;
				}else{
					this.$message({type:'info',message:result.body.message})
				}
				this.authForm = [];
				this.authSubmitLoading = false;
			}).catch(function(err){
				console.log(err)
			})
		},
		authClose (){		// 权限管理dialog窗口关闭，授权用户也调了这个方法
			this.authForm = [];
			this.tempSid = '';
			this.authUserData = [];
            this.organCode = '';
		},
		editUserAuth (sid){		// 根据角色sid获取用户列表
			this.tempSid = sid;
			this.authUserData = [];
			this.authUserSwitch = true;
			this.tableLoading = true;
			this.$http.get(['roleBiz', sid + '/user', '?organCode=' + this.organCode])
			.then(function(result){
				if(result.body.code === 200){
					this.tableLoading = false;
					this.authUserData = result.body.data;
				}else{
					this.tableLoading = false;
					this.authUserEmpty = result.body.message;
				}
			}).catch(function(err){
				console.log(err)
			})
		},
		initSelectUser (row, index){	// 初始化用户具备权限
			this.$refs.authUserData.toggleRowSelection(row,row.checked)
		},
		selectUser (selection, row){		// 授权选择单个用户
			row.checked = !row.checked;
		},
		selectUserAll (selection){		// 授权点击全选按钮
			for(let i=0;i<this.authUserData.length;i++){
				if(selection.length === 0){
					this.authUserData[i].checked = false;
				}else if(selection.length > 0){
					this.authUserData[i].checked = true;
				}
			}
		},
		saveAuthUser (){		// 保存授权用户
			this.formatAuthForm(this.authUserData, this.authUserForm, 'userSid');
			this.$http.put(['roleBiz', this.tempSid + '/user', '?organCode=' + this.organCode], this.authUserForm)
			.then(function(result){
                this.authUserSwitch = false;
				if(result.body.code === 200){
					this.$message({type:'success',message:result.body.message})
				}else{
					this.$message({type:'info',message:result.body.message})
				}
				this.authUserForm = [];
				this.authSubmitLoading = false;
			}).catch(function(err){
				console.log(err)
			})
		},
        refresh(){
            this.$http.get(['roleRefresh'])
                .then(result => {
                    if(result.body.code === 200){
                        this.$message(result.body.message)
                    }
                })
        },
	},
}
</script>

<style>
.role-wrap .no-child .el-table__expand-icon {
	display: none;
}
</style>
