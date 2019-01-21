<template>
    <div class="wallet-record">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">资金记录</div>
        <!--搜索-->
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="起止时间">
                    <el-date-picker
                        placeholder="选择日期范围"
                        v-model="form.rangeTime"
                        type="daterange"
                        :picker-options="{ disabledDate: setAvailableDate }"
                        @change="handleRangeTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.payStatus" placeholder="全部" clearable>
                        <el-option label="未支付" :value="1"></el-option>
                        <el-option label="已支付" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单号">
                    <el-input type="number" placeholder="订单号" v-model="form.orderNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="流水号">
                    <el-input type="number" placeholder="流水号" v-model="form.tradeNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">查询</el-button>
                    <el-button type="primary" @click="handleExportExcel('walletUserAccDetailExport', '云平台资金记录')">导出Excel</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--列表-->
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column prop="crTime" label="时间" align="center"></el-table-column>
            <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="tradeNo" label="流水号" align="center"></el-table-column>
            <el-table-column prop="tradeTypeName" label="交易类型" align="center"></el-table-column>
            <el-table-column label="收入金额（元）" align="center">
                <template slot-scope="scope">
                    <span style="color: #f56c6c;">{{ scope.row.payType | getAmountIn(scope.row.amt) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="支出金额（元）" align="center">
                <template slot-scope="scope">
                    <span style="color: #67c23a;">-{{ scope.row.payType | getAmountOut(scope.row.amt) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="payStatusName" label="状态" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        </el-table>
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
    import { pubObj } from '../../../assets/unit/public.js'
    import ExportExcel from '../export-excel.vue'
    
    export default {
        name: 'FundRecord',
        
        mixins: [ExportExcel],
        
        data() {
            return {
                form: {},
                loading: false,
                tableData: [],
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
                    url: ['walletUserAccDetail'],
                    method: 'POST',
                    params: params,
                    success(result) {
                        this.tableData = result.data;
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
        
        filters: {
            getAmountIn(val, amt) {
                if(val === 1) { return amt; } else { return null; }
            },
            getAmountOut(val, amt) {
                if(val === 2) { return amt; } else { return null; }
            }
        },
        
        mounted() {
            // 加载数据
            this.handleGetTableData();
        }
    }
</script>

<style>
</style>