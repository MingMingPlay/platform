<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <!--<div class="detail-title">账户收支明细</div>-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!--<el-tab-pane label="资金明细" name="fund"></el-tab-pane>-->
            <el-tab-pane label="充值记录" name="recharge"></el-tab-pane>
            <el-tab-pane label="提现记录" name="withdraw"></el-tab-pane>
            <el-tab-pane label="提现手续费收入" name="feeIncome"></el-tab-pane>
        </el-tabs>
        <!--activeName === 'feeIncome'-->
        <div class="search-fil-wrap one-line" v-if="activeName === 'feeIncome'">
            <el-form :model="incomeForm" :inline="true" label-width="80px">
                <el-form-item label="起止时间">
                    <el-date-picker
                        placeholder="选择日期范围"
                        v-model="incomeForm.rangeTime"
                        type="daterange"
                        :picker-options="{ disabledDate: setAvailableDate }"
                        @change="handleRangeTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="订单号">
                    <el-input type="number" placeholder="订单号" v-model="incomeForm.orderNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="流水号">
                    <el-input type="number" placeholder="流水号" v-model="incomeForm.tradeNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="search-fil-wrap one-line" v-else>
            <el-form :model="form" :inline="true">
                <el-form-item label="起止时间">
                    <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="logTimeChange"  :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="form.orderId" placeholder="请输入内容" @keyup.native="form.orderId = pubObj.formatInt($event)" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="流水号：">
                    <el-input v-model="form.keyword" placeholder="请输入内容" style="width: 180px"></el-input>
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
        
        <!--手续费收入显示-->
        <div class="fee-total" v-if="activeName === 'feeIncome'">
            <span>手续费总计：</span>
            <span v-text="totalIncome"></span>
            <span>元</span>
        </div>
            
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
    import { router } from '../../../pages/merchant.js'
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import api from '../../../assets/config/m-api.js'
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
                    //订单号
                    orderId:'',
                    //流水号
                    keyword:'',
                    //交易类型
                    tradeType: '',
                    pageIndex:1,
                    pageSize:10,
                },
                incomeForm: {},
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //表单头部
                tableHeader:'',
                //表单详情数据
                tableData: [],
                totalIncome: null,
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
                name:'recharge'
            }
            //tags状态
            this.activeName = tab.name;

            //初始化-路由
            this.routerSet('fund',1,this.form.pageSize);
            //初始化-表单头部信息
            this.tableHeader = merchantDetail.tableColumnsFund;
            //初始化-收支明细数据
            this.handleClick(tab);
        },
        methods: {
            // 只能选择今天之前的时间
            setAvailableDate(date) {
                return (new Date()).getTime() < (new Date(date)).getTime();
            },
            // 起止时间
            handleRangeTime(date) {
                if(!date) return;
                const index = date.indexOf(' - ');
                this.incomeForm.startDate = date.slice(0, index);
                this.incomeForm.endDate = date.slice(index + 3);
            },
            //tags切换
            handleClick(tab, event) {
                switch (tab.name){
//                    case 'fund':
//                        this.crumbs[this.crumbs.length-1].title = '资金明细';
//                        this.tableHeader = merchantDetail.tableColumnsFund;
//                        this.routerSet('fund',1,this.form.pageSize)
//                        this.clearData();
//                        this.fundData();
//                        break;
                    case 'recharge':
                        this.crumbs[this.crumbs.length-1].title = '充值记录';
                        this.tableHeader = merchantDetail.tableColumnsRecharge;
                        this.routerSet('recharge',1,this.form.pageSize)
                        this.clearData();
                        this.rachargeData();
                        break;
                    case 'withdraw':
                        this.crumbs[this.crumbs.length-1].title = '提现记录';
                        this.tableHeader = merchantDetail.tableColumnsWithdraw;
                        this.routerSet('withdraw',1,this.form.pageSize)
                        this.clearData();
                        this.withdrawData();
                        break;
                    case 'feeIncome':
                        this.crumbs[this.crumbs.length-1].title = '提现手续费收入';
                        this.tableHeader = merchantDetail.tableColumnsFeeIncome;
                        this.feeIncomeData();
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
                this.routerSet(this.activeName,pageIndex,pageSize);
                this.searchData();

            },
            handleCurrentChange(pageIndex,pageSize) {
                this.form.pageIndex = pageIndex;
                this.routerSet(this.activeName,pageIndex,pageSize);
                this.searchData();
            },
            routerSet(type,pageIndex,pageSize){
                this.query = JSON.parse(JSON.stringify(this.$route.query));
                this.query = {
                    type:type,
                    pageIndex:pageIndex,
                    pageSize:pageSize
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
                    case 'feeIncome':
                        setTimeout(()=>{
                            this.feeIncomeData();
                        },10)
                        break;
                }
            },
            //清空数据
            clearData(){
                this.tableData=[];
                this.createTime = [];
                for(var key in this.form){
                    if( key != 'pageSize'){
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
                this.$http.get(['financialDeposits'],{
                    params:this.form
                })
                    .then((result) => {
                        if(result.body.code == 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                            for(var i=0;i<this.tableData.length;i++){
                                this.tableData[i].tradeTypeName = '在线充值';
                            }
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
            },
            feeIncomeData(){
                this.loading = true;
                this.$http.post(['financialfeeIncome'], {}, {
                    params:this.incomeForm
                })
                    .then((result) => {
                        if(result.body.code == 200){
                            this.tableData = result.body.data.list;
                            this.totalIncome = result.body.data.totalIncome;
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

<style scoped>
	.fee-total {
        font-size: 14px;
        font-weight: 600;
        color: #F56C6C;
        margin-top: 10px;
        padding-left: 10px;
    }
</style>
