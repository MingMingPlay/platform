<template>
    <div class="wallet-record">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>银行卡管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">银行卡管理</div>
        <!--搜索-->
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" label-width="80px">
                <el-form-item label="查询条件">
                    <el-input placeholder="姓名或手机号" v-model="form.nameOrPhone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">查询</el-button>
                    <el-button type="primary" @click="handleExportExcel('walletBankExport', '云平台银行卡管理')">导出Excel</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--列表-->
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column prop="bindDate" label="绑定时间" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="userRealName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="userIdNumber" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="bankPhone" label="手机号" align="center"></el-table-column>
            <el-table-column prop="bankTypeName" label="银行卡类型" align="center"></el-table-column>
            <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
            <el-table-column prop="bankCardNo" label="银行卡号" align="center"></el-table-column>
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
    import { pubObj } from '@/assets/unit/public.js'
    import ExportExcel from '../export-excel.vue'
    
    export default {
        name: 'WalletBankcard',
        
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
            // 获取数据
            handleGetTableData(params = {}) {
                this.loading = true;
                pubObj.httpRequest(this, {
                    url: ['walletBank'],
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
        
        mounted() {
            // 加载数据
            this.handleGetTableData();
        }
    }
</script>