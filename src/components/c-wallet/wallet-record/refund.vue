<template>
    <div class="wallet-record">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>退款记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">退款记录</div>
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
                    <el-select v-model="form.status" placeholder="全部" clearable>
                        <el-option label="待审核" value="1"></el-option>
                        <el-option label="提现中" value="2"></el-option>
                        <el-option label="提现成功" value="3"></el-option>
                        <el-option label="提现失败" value="4"></el-option>
                        <el-option label="审核未通过" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询条件">
                    <el-input type="number" placeholder="订单号或流水号" v-model="form.orderNoOrTradeNo" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">查询</el-button>
                    <el-button type="primary" @click="handleExportExcel('walletRefundExport', '云平台退款记录')">导出Excel</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--列表-->
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column 
                v-for="(column,index) in tableHeader"
                :key="index" 
                :prop="column.dataIndex" 
                :label="column.text" 
                :align="column.align" 
                :width="column.width">
            </el-table-column>
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
    import { merchantDetail } from '../../../assets/staticData/wallet.js'
    import commonTable from '../../common/product-table.vue'
    import { pubObj } from '../../../assets/unit/public.js'
    import ExportExcel from '../export-excel.vue'
    
    export default {
        name: 'WalletRefundRecord',
        
        mixins: [ExportExcel],
        
        components: { commonTable },
        
        data() {
            return {
                form: {},
                loading: false,
                tableHeader: [],
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
                    url: ['WalletRefundRecord'],
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
        
        created() {
            const withdraw = JSON.parse(JSON.stringify(merchantDetail.tableColumnsRefund));
            this.tableHeader = withdraw;
        },
        
        mounted() {
            this.handleGetTableData();
        }
    }
</script>