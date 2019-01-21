<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <!--<div class="detail-title">账户收支明细</div>-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!--<el-tab-pane label="资金明细" name="fund"></el-tab-pane>-->
            <el-tab-pane label="充值记录" name="recharge"></el-tab-pane>
            <el-tab-pane label="提现记录" name="withdraw"></el-tab-pane>
        </el-tabs>
        <!--搜索-->
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="起止时间">
                    <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="logTimeChange" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input  v-model="form.orderId" placeholder="请输入订单号" @keyup.native="form.orderId = pubObj.formatInt($event)" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="流水号：">
                    <el-input v-model="form.keyword" placeholder="请输入流水号" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="交易类型" v-if="this.activeName === 'fund'">
                    <el-select v-model="form.tradeType" placeholder="不限" clearable>
                        <el-option
                            v-for="item in valueTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form>
        </div>
        <!--表单-->
        <product-table v-bind:tableHeader="tableHeader" v-bind:tableData="tableData" v-bind:loading="loading"></product-table>
        <!--分页-->
        <list-pagination
            v-if="loading==false && pagination"
            v-bind:pagination="pagination"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="handleCurrentChange">
        </list-pagination>
    </div>
</template>
<script>
    import { router } from '../../../pages/platform.js'
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import api from '../../../assets/config/c-api.js'
    import { merchantDetail } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    import productTable from '../../common/product-table.vue'
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                pubObj,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                //tags状态
                activeName: 'recharge',
                //交易类型--数据
                valueTypeList: merchantDetail.valueTypeList,
                //面包屑
                crumbs:merchantDetail.crumbs,
                //时间值
                createTime:[],
                //提交的表单
                form:{
                    pageIndex:1,
                    pageSize:10,
                    merchantSid:this.$route.query.merchantSid,
                    //订单号
                    orderId:'',
                    //流水号
                    keyword:'',
                    //交易类型
                    tradeType: '',
                },
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //表单头部
                tableHeader:'',
                //表单详情数据
                tableData: [],
                //加载
                loading: true,
                //路由url
                query:{}
            };
        },
        components:{
            listPagination,
            productTable
        },
        created(){
            let tab = {
                name:this.$route.query.type
            }
            //tags状态
            this.activeName = tab.name;
            //初始数据
            this.handleClick(tab);
        },
        methods: {
            //tags切换
            handleClick(tab, event) {
                switch (tab.name){
//                    case 'fund':
//                        this.crumbs[this.crumbs.length-1].title = '资金明细';
//                        this.tableHeader = merchantDetail.tableColumnsFund;
//                        this.routerSet('fund',1,this.form.pageSize,this.form.merchantSid)
//                        this.clearData();
//                        this.fundData();
//                        break;
                    case 'recharge':
                        this.crumbs[this.crumbs.length-1].title = '充值记录';
                        this.tableHeader = merchantDetail.tableColumnsRecharge;
                        this.routerSet('recharge',1,this.form.pageSize,this.form.merchantSid)
                        this.clearData();
                        this.rachargeData();
                        break;
                    case 'withdraw':
                        this.crumbs[this.crumbs.length-1].title = '提现记录';
                        this.tableHeader = merchantDetail.tableColumnsWithdraw;
                        this.routerSet('withdraw',1,this.form.pageSize,this.form.merchantSid)
                        this.clearData();
                        this.withdrawData();
                        break;
                }
            },
            //起止时间选择
            logTimeChange(datetime) {
                const index = datetime.indexOf(' - ');
                this.form.startTime = datetime.slice(0, index);
                this.form.endTime = datetime.slice(index + 3);
            },
            handleSizeChange(pageIndex,pageSize) {
                this.form.pageSize = pageSize;
                this.routerSet(this.activeName,pageIndex,pageSize,this.form.merchantSid);
                this.searchData();

            },
            handleCurrentChange(pageIndex,pageSize) {
                this.form.pageIndex = pageIndex;
                this.routerSet(this.activeName,pageIndex,pageSize,this.form.merchantSid);
                this.searchData();
            },
            //路由重置
            routerSet(type,pageIndex,pageSize,merchantSid){
                this.query = JSON.parse(JSON.stringify(this.$route.query));
                this.query = {
                    type:type,
                    pageIndex:pageIndex,
                    pageSize:pageSize,
                    merchantSid:merchantSid
                };
                router.replace({path: this.$route.path, query: this.query})
            },
            //查询
            handleSearch(){
                this.form.pageIndex = 1;
                this.form.pageSize = 10;
                this.searchData();
            },
            //分页选择与查询请求数据封装
            searchData(){
                switch (this.activeName){
                    case 'fund':
                        setTimeout(()=>{
                            this.fundData();
                        },10)
                        break;
                    case 'recharge':
                        setTimeout(()=>{
                            this.rachargeData();
                        },10)
                        break;
                    case 'withdraw':
                        setTimeout(()=>{
                            this.withdrawData();
                        },10)
                        break;
                }
            },
            //清空数据
            clearData(){
                this.tableData=[];
                this.createTime = [];
                for(var key in this.form){
                    if(!(key === 'pageSize' || key === 'merchantSid')){
                        this.form[key] = '';
                    }
                }
                this.form.pageIndex = 1;
            },
            fundData(){
                this.loading = true;
                this.$http.get(['financialPlatform'],{
                    params:this.form
                })
                    .then((result) => {
                        if(result.body.code == 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                            this.loading = false;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })

            },
            rachargeData(){
                this.loading = true;
                this.$http.get(['financialDposits'],{
                    params:this.form
                })
                    .then((result) => {
                        if(result.body.code == 200){
                            this.tableData = result.body.data;
                            for(var i=0;i<this.tableData.length;i++){
                                this.tableData[i].tradeTypeName = '在线充值';
                            }
                            this.pagination = result.body.pagination;
                            this.loading = false;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })

            },
            withdrawData(){
                this.loading = true;
                this.$http.get(['financialWithdraws'],{
                    params:this.form
                })
                    .then((result) => {
                        if(result.body.code == 200){
                            this.tableData = result.body.data;
                            for(var i=0;i<this.tableData.length;i++){
                                this.tableData[i].tradeTypeName = '提现';
                            }
                            this.pagination = result.body.pagination;
                            this.loading = false;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            }
        }
    };
</script>
