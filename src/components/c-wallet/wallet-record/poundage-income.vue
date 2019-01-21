<template>
    <div class="wallet-record">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>手续费收入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">手续费收入</div>
        <!--搜索-->
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" label-width="80px">
                <el-form-item label="起止时间">
                    <el-date-picker
                        placeholder="选择日期范围"
                        v-model="form.rangeTime"
                        type="daterange"
                        :picker-options="{ disabledDate: setAvailableDate }"
                        @change="handleRangeTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="订单号">
                    <el-input type="number" placeholder="订单号" v-model="form.orderNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="流水号">
                    <el-input type="number" placeholder="流水号" v-model="form.tradeNo" style="width: 180px"></el-input>
                </el-form-item>
                <!--<el-form-item label="用户名">
                    <el-input placeholder="用户名" v-model="form.username" style="width: 180px"></el-input>
                </el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--列表-->
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column prop="applyTime" label="时间" align="center"></el-table-column>
            <el-table-column prop="settOrderNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="tradeNo" label="流水号" align="center"></el-table-column>
            <el-table-column prop="settTypeName" label="交易类型" align="center"></el-table-column>
            <el-table-column prop="amt" label="提现金额（元）" align="center"></el-table-column>
            <el-table-column prop="settFee" label="收入（元）" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        </el-table>
        <!--总收入-->
        <div class="fee-total">
            <span>手续费总计：</span>
            <span v-text="totalIncome"></span>
            <span>元</span>
        </div>
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
    import { pubObj } from '@/assets/unit/public.js'
    
    export default {
        name: 'PoundageIncome',
        
        data() {
            return {
                form: {},
                loading: false,
                tableData: [],
                totalIncome: null,
                currentPage: 1,
                totalRow: 0,
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
                    url: ['feeIncomeList'],
                    method: 'POST',
                    params: params,
                    success(result) {
                        this.tableData = result.data.list;
                        this.totalIncome = result.data.totalIncome;
                        this.totalRow = result.pagination ? result.pagination.totalRow : 0;
                    }
                })
            },
            // 查询
            handleFormSearch() {
                this.form.pageIndex = this.currentPage = 1;
                this.handleGetTableData(this.form);
            },
            // 分页显示个数
            handleSizeChange() {},
            // 分页当前页
            handleCurrentChange(currentPage) {
                this.form.pageIndex = this.currentPage = currentPage;
                this.handleGetTableData(this.form);
            }
        },
        
        mounted() {
            // 加载数据
            this.handleGetTableData();
        }
    }
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