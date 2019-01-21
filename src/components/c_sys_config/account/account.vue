<template>
	<div class="account">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true" ref="form">
				<el-form-item>
					<el-input v-model="form.q" placeholder="用户名、姓名、手机"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="assist-btn-wrap">
			<el-button type="primary" @click="handleRegister">注册用户</el-button>
            <el-button type="success" @click="refresh">刷新权限缓存</el-button>
		</div>

		<el-table :data="tableData" v-loading="loading" class="table-composing" stripe>
		    <el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                </template>
            </el-table-column>
            <el-table-column label="用户名" prop="loginName"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="手机" prop="mobile"></el-table-column>
            <el-table-column label="状态" prop="stateName"></el-table-column>
            <el-table-column label="用户授权">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="handleShow(scope.row.sid)"
                        :disabled="scope.row.reserved">查看/修改</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <is-disabled
                        :value="scope.row.state"
                        :sid="scope.row.sid"
                        :disabled="scope.row.reserved"
                        @refresh="handleRefresh">
                    </is-disabled>
                    <el-button
                        type="text"
                        @click="handleEdit(scope.row.sid)"
                        :disabled="scope.row.reserved">修改</el-button>
                    <el-button
                        type="text"
                        @click="handleReset(scope.row.sid)"
                        :disabled="scope.row.reserved">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination event-name="c-account-pagination" :total="mxTableList.pagiTotal"></pagination>

		<account-form @refresh="handleRefresh"></account-form>

        <user-table></user-table>

        <el-dialog title="重置密码" v-model="dialogVisible" :close-on-click-modal="false">
            <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px">
                <el-form-item label="输入新密码" prop="password">
                    <el-input v-model="dialogForm.password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('dialogForm')">保 存</el-button>
            </div>
        </el-dialog>

	</div>
</template>

<script>
    // child
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	import AccountForm from './form.vue'
	import IsDisabled from '../../c_user/common/isDisabled.vue'
	import UserTable from './table.vue'
	import Pagination from '../../common/pagination.vue'
	// mixin
	import TableList from '../../mixin/table-list.vue'
	// js
	import api from '../../../assets/config/c-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
		components: { JkcBreadcrumb, AccountForm, IsDisabled, UserTable, Pagination },
		mixins: [TableList],
		data() {
		    const rules = {
                password: [{
                    required: true,
                    message: '请输入新的密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 30,
                    message: '密码长度6-30位',
                    trigger: 'blur'
                }]
            };
			return {
				crumbs: [],
				form: {},
				mxTableList: {
                    url: ['userSystem'],
                    pagiTotal: 0
                },
				dialogVisible: false,
				dialogForm: {},
				rules: rules,
				// 重置密码
				userSid: null,
			}
		},
		created() {
		    this.crumbs = [{ title: '系统设置' }, { title: '管理员' }];
		},
		mounted() {
            bus.$on('c-account-pagination', (obj) => {
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
		methods: {
		    handleSearch() { this.getTableList(this.form); },
			handleRegister() {
				bus.$emit('c-account-dialog', {
                    type: 1,
                    title: '注册用户'
                })
			},
			// 修改用户
            handleEdit(sid) {
                bus.$emit('c-account-dialog', {
                    type: 2,
                    title: '修改用户',
                    sid: sid
                })
            },
            handleShow(sid) {
                bus.$emit('c-user-table', { sid: sid })
            },
            handleRefresh() { this.getTableList() },
			// 重置密码
			handleReset(sid) {
				this.dialogVisible = true;
                this.userSid = sid;
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						pubObj.httpRequest(this, {
							method: 'PUT',
							url: ['changePassword', '/' + this.userSid],
                            body: this.dialogForm,
							success(result) {
								this.$message.success(result.message)
								this.dialogVisible = false;
							}
						})
					} else {
						return false;
					}
				});
			},
            // 刷新缓存
            refresh(){
                this.$http.get(['roleRefresh'])
                    .then(result => {
                        if(result.body.code === 200){
                            this.$message(result.body.message)
                        }
                    })
            },
		},
		beforeDestroy() { bus.$off() }
	}
</script>

<style>

</style>
