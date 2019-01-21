<template>
    <div class="user-list">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap one-line">
            <el-form class="search-form" :model="searchForm" :inline="true">
                <el-form-item>
                    <el-input v-model="searchForm.q" placeholder="昵称/姓名/手机号"></el-input>
                </el-form-item>
                <el-form-item label="所属商家">
                    <el-select
                        v-model="searchForm.merchantSid"
                        clearable
                        filterable
                        remote
                        placeholder="请输入商家名称"
                        :remote-method="getMerchant"
                        :loading="getLoading"
                        @change="selectBiz">
                        <el-option
                            v-for="item in merchantData"
                            :key="item.sid"
                            :label="item.nameFull"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织机构" v-if="organBizData.length > 0">
                    <el-cascader
                        :options="organBizData"
                        v-model="searchForm.organBizCodes"
                        change-on-select
                        clearable
                        :show-all-levels="false"
                        @change="handleChangeBiz">
                    </el-cascader>
                </el-form-item>
                <el-button type="primary" @click="search" class="button-margin-button-22">搜索</el-button>
            </el-form>
        </div>

        <el-table :data="userList" :stripe="true" v-loading="loading">
            <el-table-column label="序号" width="90" header-align="center" align="center" label-class-name="table-index-title">
                <template slot-scope="scope">
                    {{scope.$index | newIndex(pagination.pageIndex, pagination.pageSize)}}
                </template>
            </el-table-column>
            <template v-for="(item, key) in tableHeader">
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
                    <enable-and-disable :row="scope.row" @success="successCallback"></enable-and-disable>
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
    import AreaSelect from '../../common/area-select.vue'
    import EnableAndDisable from '../../common/enable-and-disable.vue'
    import resetPassword from '../../common/reset-password.vue'
    import api from '../../../assets/config/c-api.js'
    import validator from '../../../assets/unit/validator'
    import tableHeader from './tableHeader.js'
    export default {
        data() {
            return {
                tableHeader,
                crumbs: [
                    {
                        title: '用户管理',
                    },
                    {
                        title: '店铺管理员',
                    }
                ],
                searchForm: {
                    pageIndex: 1,
                    pageSize: 10,
                    q: '',
                    organCode: '',
                    merchantSid: ''
                },
                userList: [],
                pagination: {},
                loading: false,
                // 组织机构数据
                organBizData: [],
                getLoading: false,
                merchantData: [],
            }
        },
        components: {
            JkcBreadcrumb,
            AreaSelect,
            EnableAndDisable,
            resetPassword,
        },
        created(){
            this.getData();
        },
        methods:{
            handleGetArea(obj) {
                this.registerForm.area = obj.areaSid;
            },
            getArea(data){  // 接收区域组件回传的数据
                if(data){
                    this.searchForm.area = data.areaSid;
                }else {
                    this.searchForm.area = '';
                }
            },
            getOrgan (sid){		// 获取组织机构
                function transformData(data) {      // 仅用于改造数据；改造成级联选择器需要的数据
                    data.forEach(value => {
                        value.label = value.name;
                        value.value = value.code;
                        if(value.children && value.children.length > 0){
                            return transformData(value.children);
                        }
                    });
                    return data;
                }
                this.$http.get(['organ', sid])
                    .then((result) => {
                        if(result.body.data[0].level < 4){
                            let data = result.body.data[0].children;
                            if(data && data.length > 0){
                                this.organBizData = transformData(data);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            handleChangeBiz(codes){      // 操作组织机构
                this.searchForm.organCode = codes[codes.length - 1];
            },
            getMerchant(query) { // 获取商家列表
                this.getLoading = true;
                let queryData = {
                    pageIndex: 1,
                    pageSize: 10,
                    q: query
                };
                this.$http.get(['newMerchant'], {params: queryData})
                    .then((result) => {
                        this.getLoading = false;
                        this.merchantData = result.body.data.filter(item => {
                            return item.nameFull.toLowerCase().indexOf(query.toLowerCase()) > -1;
                        });
                    }).catch((err) => {
                    console.log(err)
                });
            },
            // 选择商家后的回调，然后查询组织机构
            selectBiz(merchantSid){
                if(merchantSid){
                    this.getOrgan(merchantSid);
                }else {
                    this.organBizData = [];
                }
            },
            search(){
                this.searchForm.pageIndex = 1;
                this.getData(this.searchForm);
            },
            getData(param){     // 获取列表数据
                this.loading = true;
                this.$http.get(['userManager'],{params: param})
                    .then(result => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.userList = result.body.data;
                            this.pagination = result.body.pagination;
                        }
                    })
            },
            // 禁用启用操作成功回调
            successCallback(){
                this.getData(this.searchForm);
            },
            gotoDetail(sid){
                this.$router.push({
                    path: '/c_user/manager/detail',
                    query: {
                        sid: sid,
                    }
                });
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
