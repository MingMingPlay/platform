<template>
    <div class="wallet-account">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>账户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">账户列表</div>
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
                <el-form-item label="查询条件">
                    <el-input placeholder="用户名" v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">查询</el-button>
                    <el-button type="primary" @click="handleExportExcel('walletUserExport', '云平台账户列表')">导出Excel</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--账户列表-->
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="authenticationDate" label="开通时间" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="userRealName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="userIdNumber" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="bizPhone" label="手机号" align="center"></el-table-column>
            <el-table-column prop="totalAmt" label="总金额（元）" align="center"></el-table-column>
            <el-table-column prop="balanceAmt" label="可用金额（元）" align="center"></el-table-column>
            <el-table-column prop="frozenAmt" label="冻结金额（元）" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleAccountDetail(scope.row)">查看明细</el-button>
                </template>
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
    import { pubObj } from '@/assets/unit/public.js'
    import ExportExcel from '../export-excel.vue'
    
    export default {
        name: 'WalletAccountList',
        
        mixins: [ExportExcel],

        data() {
            return {
                form: {},
                loading: false,
                tableData: [],
                currentPage: 1,
                totalRow: 0,
                excelStream: null
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
                    url: ['walletUser'],
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
            // 查看明细
            handleAccountDetail(row) {
                this.$router.push({
                    name: 'WalletAccountDetail',
                    query: { userId: row.userId, userName: row.userName }
                })
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