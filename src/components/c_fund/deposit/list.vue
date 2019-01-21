<template>
    <div class="deposit">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap one-line">
            <el-form class="search-form" :model="searchForm" :inline="true">
                <el-form-item label="账号">
                    <el-input v-model="searchForm.mobile" type="number" placeholder="手机号" :maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="充值渠道">
                    <el-select v-model="searchForm.tradeSource" placeholder="选择渠道">
                        <el-option :label="item.tradeSourceDesc" :value="item.tradeSource"
                                   v-for="(item,index) in channelData" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button type="primary" @click="resetSearch" class="margin-right-10">重置</el-button>
                <el-form-item label="创建时间">
                    <time-period v-on:emit-time="getTime" :default="'threeDay'"></time-period>
                </el-form-item>
            </el-form>
        </div>

        <div class="recharge-button">
            <el-button type="primary"
                       @click="router.push({path: '/c_fund/deposit/recharge', query: {btn: $route.query.btn}})">充值
            </el-button>
        </div>

        <el-table :data="data" :stripe="true" v-loading="loading">
            <el-table-column type="index" label="序号" width="70" align="center"
                             label-class-name="table-index-title"></el-table-column>
            <el-table-column prop="createdTime" label="充值时间" label-class-name="first-col-no-padding"
                             class-name="first-col-no-padding"></el-table-column>
            <el-table-column prop="reasonDesc" label="名称"></el-table-column>
            <el-table-column prop="tradeCode" label="交易流水" width="180px" align="center"></el-table-column>
            <el-table-column prop="tradeSourceDesc" label="充值渠道" align="center"></el-table-column>
            <el-table-column prop="typeDesc" label="类型" align="center"></el-table-column>
            <el-table-column prop="mobile" label="账号" align="center"></el-table-column>
            <el-table-column label="金额（元）" align="right">
                <template slot-scope="scope">
                    <p style="padding-right: 20px">{{scope.row.tradeAmount}}</p>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-wrap" v-if="data.length > 0">
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
    import TimePeriod from '../../common/time-period.vue'
    import api from '../../../assets/config/c-api.js'
    import {router} from '../../../pages/platform.js'
    export default {
        data() {
            return {
                router,
                crumbs: [
                    {
                        title: '资金管理',
                    },
                    {
                        title: '充值记录',
                    }
                ],
                searchForm: {
                    pageIndex: 1,
                    pageSize: 10,
                    mobile: '',
                    tradeSource: '',
                    createdTimeBegin: '',
                    createdTimeEnd: '',
                },
                channelData: [],
                data: [],
                loading: false,
                pagination: {},
            }
        },
        components: {
            JkcBreadcrumb,
            TimePeriod
        },
        created(){
            this.getChannel();
        },
        methods: {
            search(){
                if (this.searchForm.mobile) {
                    if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(this.searchForm.mobile)) {
                        this.$message.warning('请输入正确的手机号')
                        return false;
                    }
                }
                this.searchForm.pageIndex = 1;
                this.getData(this.searchForm);
            },
            resetSearch(){
                this.searchForm.pageIndex = 1;
                this.searchForm.mobile = '';
                this.searchForm.tradeSource = '';
                this.getData(this.searchForm);
            },
            getTime(start, end){    // 时间组件的回调
                if (start) {
                    this.searchForm.createdTimeBegin = start;
                    this.searchForm.createdTimeEnd = end;
                } else {
                    this.searchForm.createdTimeBegin = '';
                    this.searchForm.createdTimeEnd = '';
                }
                this.searchForm.pageIndex = 1;
                this.getData(this.searchForm);
            },
            getChannel() { // 获取充值渠道数据
                this.$http.get(`${api.cWalletUser}tradeSource`)
                    .then(result => {
                        if (result.body.code === 200) {
                            this.channelData = result.body.data;
                        }
                    }).catch((error) => {
                    console.log(error)
                });
            },
            getData(param){    // 获取用户充值记录
                this.loading = true;
                this.$http.get(`${api.cWalletUser}recharge`, {params: param})
                    .then(result => {
                        this.loading = false;
                        if (result.body.code === 200) {
                            this.data = result.body.data;
                            this.pagination = result.body.pagination;
                        } else {
                            this.$message.error(result.body.message);
                        }
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
    .deposit .recharge-button {
        margin-bottom: 15px;
        text-align: right;
    }

    .deposit .pagination-wrap {
        margin-top: 20px;
        text-align: center;
    }
</style>
