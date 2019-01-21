<template>
    <div class="transaction">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap one-line">
            <el-form class="search-form" :model="searchForm" :inline="true">
                <el-form-item label="订单号">
                    <el-input v-model="searchForm.keyword" placeholder="商家订单号/退款单号"></el-input>
                </el-form-item>
                <el-form-item label="渠道">
                    <el-select v-model="searchForm.channelSid">
                        <el-option :label="item.name" :value="item.sid" 
                        v-for="(item,index) in channelData"
                        :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button type="primary" @click="resetSearch" class="margin-right-10">重置</el-button>
                <el-form-item label="创建时间">
                    <time-period v-on:emit-time="getTime" :default="'threeDay'"></time-period>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="data" :stripe="true" v-loading="loading">
            <el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
            <el-table-column prop="updatedTime" label="退款时间" width="150px" label-class-name="first-col-no-padding" class-name="first-col-no-padding"></el-table-column>
            <el-table-column label="商家订单号/退款流水号" align="center" width="200px">
                <template slot-scope="scope">
                    <p>{{scope.row.orderId}}</p><p>{{scope.row.refundId}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="支付方式" align="center"></el-table-column>
            <el-table-column prop="channelName" label="渠道" align="center"></el-table-column>
            <el-table-column prop="typeDesc" label="类型" align="center"></el-table-column>
            <el-table-column prop="mobile" label="账号" align="center"></el-table-column>
            <el-table-column label="金额（元）" align="right">
                <template slot-scope="scope">
                    <p style="padding-right: 20px">{{scope.row.amount}}</p>
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
    export default {
        data() {
            return {
                crumbs: [
                    {
                        title: '资金管理',
                    },
                    {
                        title: '退款流水',
                    }
                ],
                searchForm: {
                    pageIndex: 1,
                    pageSize: 10,
                    keyword: '',
                    channelSid: '',
                    updatedTimeBegin: '',
                    updatedTimeEnd: '',
                },
                channelData: [],
                data: [],
                loading: false,
                pagination: {},
            }
        },
        components:{
            JkcBreadcrumb,
            TimePeriod,
        },
        created(){
            this.getChannel();
        },
        methods: {
            search(){
                this.searchForm.pageIndex = 1;
                this.getData(this.searchForm);
            },
            resetSearch(){
                this.searchForm.pageIndex = 1;
                this.searchForm.keyword = '';
                this.searchForm.channelSid = '';
                this.getData(this.searchForm);
            },
            getTime(start, end){    // 时间组件的回调
                if(start){
                    this.searchForm.updatedTimeBegin = start;
                    this.searchForm.updatedTimeEnd = end;
                }else {
                    this.searchForm.updatedTimeBegin = '';
                    this.searchForm.updatedTimeEnd = '';
                }
                this.searchForm.pageIndex = 1;
                this.getData(this.searchForm);
            },
            getChannel() { // 获取渠道数据
                this.$http.get(api.channel)
                    .then(result => {
                        if(result.body.code === 200) {
                            this.channelData = result.body.data;
                        }
                    }).catch((error) => {
                    console.log(error)
                });
            },
            getData(param){    // 获取用户退款流水
                this.loading = true;
                this.$http.get(`${api.cWalletUser}refund`, {params: param})
                    .then(result => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.data = result.body.data;
                            this.pagination = result.body.pagination;
                        }else {
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
<style type="text/css">
    .transaction .pagination-wrap{
        margin-top: 20px;
        text-align: center;
    }
    .transaction{}
    .transaction{}
</style>
