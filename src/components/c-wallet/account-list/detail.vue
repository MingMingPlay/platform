<template>
    <div class="wallet-account">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>账户列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{ activeBreadcrumb }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--当前用户-->
        <div style="font-size: 14px; padding-left: 16px; margin: 20px 0 10px;">用户名称：{{ query.userName }}</div>
        <!--标签-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="资金明细" name="fund"></el-tab-pane>
            <el-tab-pane label="充值记录" name="recharge"></el-tab-pane>
            <el-tab-pane label="提现记录" name="withdraw"></el-tab-pane>
        </el-tabs>
        <!--搜索-->
        <div class="search-fil-wrap one-line">
            <el-form ref="searchForm" :model="form" :inline="true">
                <el-form-item label="起止时间" prop="rangeTime">
                    <el-date-picker
                        placeholder="选择日期范围"
                        v-model="form.rangeTime"
                        type="daterange"
                        :picker-options="{ disabledDate: setAvailableDate }"
                        @change="handleRangeTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="订单号" prop="orderNo">
                    <el-input type="number" placeholder="请输入订单号" v-model="form.orderNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="流水号" prop="tradeNo">
                    <el-input type="number" placeholder="请输入流水号" v-model="form.tradeNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="交易类型" prop="tradeType" v-show="activeName === 'fund'">
                    <el-select v-model="form.tradeType" placeholder="不限" clearable>
                        <el-option
                            v-for="(item,index) in valueTypeList"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--列表-->
        <common-table 
            :tableHeader="tableHeader" 
            :tableData="tableData" 
            :loading="loading">
        </common-table>
        <!--分页-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalRow"
            style="margin: 30px 0; text-align: center;">
        </el-pagination>
    </div>
</template>
<script>
    import { merchantDetail } from '../../../assets/staticData/wallet.js'
    import commonTable from '../../common/product-table.vue'
    import { pubObj } from '../../../assets/unit/public.js'
    
    export default {
        name: 'WalletAccountDetail',
        
        components: { commonTable },
        
        data() {
            return {
                // 缓存用户名
                activeName: 'fund',
                activeBreadcrumb: '资金明细',
                apiName: 'walletUserAccDetail',
                form: {
                    userId: null,
                    rangeTime: null,
                    orderNo: null,
                    tradeNo: null,
                    tradeType: null
                },
                // 交易类型--数据
                valueTypeList: merchantDetail.valueTypeList,
                //表单头部
                tableHeader: [],
                tableData: [],
                loading: false,
                currentPage: 1,
                totalRow: 0,
                query: this.$route.query,
            }
        },
        
        methods: {
            // 只能选择今天之前的时间
            setAvailableDate(date) {
                return (new Date()).getTime() < (new Date(date)).getTime();
            },
            // 起止时间
            handleRangeTime(date) {
                const index = date.indexOf(' - ');
                this.form.startDate = date.slice(0, index);
                this.form.endDate = date.slice(index + 3);
            },
            // 获取数据
            handleGetTableData(params = {}) {
                this.loading = true;
                pubObj.httpRequest(this, {
                    url: [this.apiName],
                    method: 'POST',
                    params: params,
                    success(result) {
                        this.activeName === 'fund' ? result = this.handleProcessing(result) : null;
                        this.tableData = result.data;
                        this.totalRow = result.pagination ? result.pagination.totalRow : 0;
                    }
                })
            },
            // 数据预处理
            handleProcessing(result) {
                result.data = result.data.map((row) => {
                    if(row.payType === 1) {
                        row.spending = '--';
                        row.amt = '+'+row.amt;
                    } else {
                        row.spending = '-'+row.amt;
                        row.amt = '--';
                    };
                    return row;
                });
                return result;
            },
            // 切换标签页
            handleTabClick(tab) {
                switch (tab.name){
                    case 'fund':
                        this.activeBreadcrumb = '资金明细';
                        this.tableHeader = merchantDetail.tableColumnsFund;
                        this.handleResetForm();
                        this.apiName = 'walletUserAccDetail';
                        this.handleGetTableData(this.form);
                        break;
                    case 'recharge':
                        this.activeBreadcrumb = '充值记录';
                        this.tableHeader = merchantDetail.tableColumnsRecharge;
                        this.handleResetForm();
                        this.apiName = 'walletRecharge';
                        this.handleGetTableData(this.form);
                        break;
                    case 'withdraw':
                        this.activeBreadcrumb = '提现记录';
                        this.tableHeader = merchantDetail.tableColumnsWithdraw;
                        this.handleResetForm();
                        this.apiName = 'walletWithdraw';
                        this.handleGetTableData(this.form);
                        break;
                }
            },
            // 查询
            handleFormSearch() {
                this.form.pageIndex = this.currentPage = 1;
                this.handleGetTableData(this.form);
            },
            // 重置查询条件
            handleResetForm() {
                this.$refs.searchForm.resetFields();
                this.form.startDate = null;
                this.form.endDate = null;
                this.form.pageIndex = this.currentPage = 1;
            },
            // 分页显示个数
            handleSizeChange() {},
            // 分页当前页
            handleCurrentChange(currentPage) {
                this.form.pageIndex = this.currentPage = currentPage;
                this.handleGetTableData(this.form);
            }
        },
        
        created() {
            this.form.userId = this.query.userId;
        },
        
        mounted() {
            // 默认加载资金明细的数据
            this.handleTabClick({ name: 'fund' });
        }
    }
</script>
