<template>
	<div class="account">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" ref="form">
                <el-form-item>
                    <el-input v-model="form.q" placeholder="用户名，姓名，手机"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

		<el-table :data="tableData" v-loading="loading" stripe>
            <el-table-column label="序号" width="60" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                </template>
            </el-table-column>
            <el-table-column label="用户名" prop="loginName"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="手机" prop="mobile"></el-table-column>
            <el-table-column label="状态" prop="stateName"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <is-disabled 
                        :value="scope.row.state" 
                        :sid="scope.row.sid"
                        @refresh="handleRefresh">
                    </is-disabled>
                    <el-button type="text" @click="handleReset(scope.row.sid)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>

		<pagination event-name="c-account-pagination" :total="mxTableList.pagiTotal"></pagination>

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
    import IsDisabled from '../../c_user/common/isDisabled.vue'
    import Pagination from '../../common/pagination.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'
    // js
//  import api from '../../../assets/config/c-api.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
		components: { JkcBreadcrumb, IsDisabled, Pagination },
		
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
                form: {},
                mxTableList: {
                    pagiTotal: 0,
                    url: ['userManager'],
                    mountQuery: this.$route.query
                },
                dialogVisible: false,
                dialogForm: {},
                rules: rules,
                // 重置密码
                userSid: null,
            }
        },
		created() {
            this.crumbs = [{ title: '店铺管理' }, { title: '店铺列表', to: '/c_mall/shop' }, { title: '管理员' }];
        },
        mounted() {
            bus.$on('c-account-pagination', (obj) => {
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
        methods: {
            handleSearch() { this.getTableList(Object.assign({}, this.mxTableList.mountQuery, this.form)); },
            handleRefresh() { this.getTableList(this.mxTableList.mountQuery) },
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
            }
        },
        beforeDestroy() { bus.$off() }
	}
</script>

<style>

</style>
