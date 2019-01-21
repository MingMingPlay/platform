<template>
    <div class="user-list">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap one-line">
            <el-form class="search-form" :model="searchForm" :inline="true">
                <el-form-item>
                    <el-input v-model="searchForm.q" placeholder="昵称/姓名/手机号"></el-input>
                </el-form-item>
                <el-form-item label="所属区域" class="area-width">
                    <area-select v-model="searchForm.areaSid"></area-select>
                </el-form-item>
                <el-button type="primary" @click="search" class="button-margin-button-22">搜索</el-button>
            </el-form>
        </div>
        <div class="top-button">
            <!--<el-button type="primary" @click="registerShow = true;employee = true">注册员工</el-button>-->
            <el-button type="primary" @click="registerShow = true;employee = false">注册普通用户</el-button>
        </div>

        <register-user v-if="registerShow" :isShow="registerShow" :employee="employee" @close="closeRegister" @success="registerSuccess"></register-user>

        <el-table :data="userList" :stripe="true" v-loading="loading">
            <el-table-column label="序号" width="90" header-align="center" align="center" label-class-name="table-index-title">
                <template slot-scope="scope">
                    {{scope.$index | newIndex(pagination.pageIndex, pagination.pageSize)}}
                </template>
            </el-table-column>
            <template v-for="(item, key) in userListHeader">
                <el-table-column :label="item.label" :width="item.width" :align="item.align" v-if="key === 'nickname'">
                    <template slot-scope="scope">
                        <el-button type="text" @click="gotoDetail(scope.row.sid)"
                        >{{scope.row.nickname}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="item.label" :width="item.width" :align="item.align" v-else-if="key === 'mobile'">
                    <template slot-scope="scope">
                        <el-button type="text" @click="gotoDetail(scope.row.sid)"
                        >{{scope.row.mobile}}</el-button>
                        <el-button type="text" @click="showMobile(scope.row)" v-if="scope.row.mobile">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="item.label" :width="item.width" :align="item.align" v-else-if="key === 'stateName'">
                    <template slot-scope="scope">
                    <span :class="{'state-active': scope.row.state === 'Active', 'state-disabled': scope.row.state === 'Disabled'}">
                        {{scope.row.stateName}}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column :prop="key" :label="item.label" :align="item.align" v-else></el-table-column>
            </template>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <enable-and-disable :row="scope.row" @success="enableCallback"></enable-and-disable>
                    <!--重置密码功能，产品说暂时不需要-->
                    <!--<reset-password :row="scope.row"></reset-password>-->
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-wrap" v-if="userList.length > 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.totalRow">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import AreaSelect from '../../common/area-select-new.vue'
    import EnableAndDisable from '../../common/enable-and-disable.vue'
    import resetPassword from '../../common/reset-password.vue'
    import RegisterUser from './register-user.vue'
    import api from '../../../assets/config/c-api.js'
    import { userListHeader } from './tableHeader.js'
    export default {
        data() {
            return {
                userListHeader,
                crumbs: [
                    {
                        title: '用户管理',
                    },
                    {
                        title: '所有用户',
                    }
                ],
                searchForm: {
                    pageIndex: 1,
                    pageSize: 10,
                    q: '',
                    areaSid: '',
                },
                userList: [],
                merchantData: [],
                organData: [],
                pagination: {},
                loading: false,
                registerShow: false,
                employee: true,
            }
        },
        components: {
            JkcBreadcrumb,
            AreaSelect,
            EnableAndDisable,
            resetPassword,
            RegisterUser
        },
        created(){
            this.getData();
        },
        methods:{
            search(){
                this.searchForm.pageIndex = 1;
                this.getData(this.searchForm);
            },
            getData(param){     // 获取列表数据
                this.loading = true;
                this.$http.get(['userAll'],{params: param})
                    .then(result => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.userList = result.body.data;
                            this.pagination = result.body.pagination;
                            this.getUserLeval(this.userList);
                        }
                    })
            },
            // 获取会员等级
            getUserLeval(userList){
                let param = {userIds:[]};
                param.userIds = userList.map(value => {
                    return value.sid;
                });
                this.$http.post(['memberExtendBatch'], param)
                    .then(result => {
                        if(result.body.code === 200){
                            let data = result.body.data;
                            this.userList.forEach(value => {
                                for(let i=0;i<data.length;i++){
                                    if(value.sid === data[i].userId){
                                        this.$set(value, 'gradeName', data[i].gradeName);
                                        break;
                                    }
                                }
                            });
                        }
                    })
            },
            // 禁用启用操作成功回调
            enableCallback(){
                this.getData(this.searchForm);
            },
            gotoDetail(sid){
                this.$router.push({
                    path: '/c_user/all/detail',
                    query: {
                        sid: sid,
                    }
                });
            },
            // 关闭注册弹窗回调
            closeRegister(state){
                this.registerShow = state;
            },
            // 注册成功回调
            registerSuccess(data){
                this.getData();
            },
            showMobile(row){	// 查看用户手机号
                this.$http.get(['userPrivacyMobile', row.sid, '/mobile'])
                    .then(result => {
                        if(result.body.code === 200){
                            row.mobile = result.body.data;
                        }else{
                            this.$message.error(result.body.message)
                        }
                    }).catch(error => {
                    console.log(error)
                })
            },
            handleSizeChange(size){
                this.searchForm.pageSize = size;
                this.getData(this.searchForm);
            },
            handleCurrentChange(index){
                this.searchForm.pageIndex = index;
                this.getData(this.searchForm);
            },


        }
    }
</script>
<style>
.user-list .top-button{
    margin-bottom: 15px;
    position: relative;
}
.user-list .area-width .el-select{
    width: 100px;
}
.user-list .pagination-wrap{
    margin-top: 20px;
    text-align: center;
}
.user-list .area-select .el-select { width: 32%; float: left; }
.user-list .area-select .el-select+.el-select { margin-left: 2%; }
</style>
