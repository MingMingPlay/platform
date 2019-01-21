<template>
    <div class="wallet-record">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>提现记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">提现记录</div>
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
                    <el-button type="primary" @click="handleExportExcel('walletWithdrawExport', '云平台提现记录')">导出Excel</el-button>
                    <el-button type="success" @click="handleWithdrawAudit(1)">审核通过</el-button>
                    <el-button type="danger" @click="handleWithdrawAudit(2)">审核拒绝</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--列表-->
        <el-table :data="tableData" v-loading.body="loading" @selection-change="handleSelectionChange" stripe>
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column v-for="(column,index) in tableHeader" 
                :key="index"
                :prop="column.dataIndex" :label="column.text" :align="column.align" :width="column.width">
                </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                    <div v-if="scope.row.status === 1">
                        <el-button type="text" @click="handleAuditSingle(1, scope.row)">通过</el-button>
                        <el-button type="text" @click="handleAuditSingle(2, scope.row)" class="text-btn-delete">拒绝</el-button>
                    </div>
                    <span v-else>/</span>
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
    import { merchantDetail } from '../../../assets/staticData/wallet.js'
    import commonTable from '../../common/product-table.vue'
    import { pubObj } from '../../../assets/unit/public.js'
    import ExportExcel from '../export-excel.vue'
    
    export default {
        name: 'WithdrawsRecord',
        
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
                // 批量选择
                selectedRows: [],
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
            handleProcessing(result) {
                //result.data.forEach((row) => {});
                //return result;
            },
            // 获取数据
            handleGetTableData(params = {}) {
                this.loading = true;
                pubObj.httpRequest(this, {
                    url: ['walletWithdraw'],
                    method: 'POST',
                    params: params,
                    success(result) {
                        /*result = this.handleProcessing(result);*/
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
            // 提交审核
            submitWithdrawAudit(flag, orderNos) {
                orderNos = orderNos ? [orderNos] : null;
                const rows = orderNos || this.selectedRows;
                pubObj.httpRequest(this, {
                    url: ['withdrawAudit'],
                    method: 'POST',
                    body: {
                        orderNos: rows.map((row) => row.settOrderNo),
                        approveResult: flag
                    },
                    success(result) {
                        this.$message.success(result.message);
                        this.handleGetTableData();
                    }
                })
            },
            // 提现审核-批量
            handleWithdrawAudit(flag) {
                // 未选择
                if(!this.selectedRows.length) {
                    this.$message.info('请选择提现记录');
                    return false;
                };
                const bool = this.selectedRows.some((item) => {
                    return item.status !== 1;
                });
                if(bool) {
                    this.$message.info('存在已审核的记录！');
                    return false;
                };
                // 已选择
                let keyword = null;
                // “通过”还是“拒绝”
                if(flag === 1) { keyword = '通过'; } else { keyword = '拒绝'; };
                pubObj.showMessage(this, {
                    title: `审核${keyword}操作`,
                    content: `确定要${keyword}当前选择的记录，执行之后不可恢复？`,
                    confirm() {
                        this.submitWithdrawAudit(flag);
                    }
                })
            },
            // 单个审核
            handleAuditSingle(flag, row) {
                // 已选择
                let keyword = null;
                // “通过”还是“拒绝”
                if(flag === 1) { keyword = '通过'; } else { keyword = '拒绝'; };
                pubObj.showMessage(this, {
                    title: `审核${keyword}`,
                    content: `确定要${keyword}当前记录，执行之后不可恢复？`,
                    confirmText: keyword,
                    confirm() {
                        this.submitWithdrawAudit(flag, row);
                    }
                })
            },
            // 批量选择
            handleSelectionChange(selection) {
                this.selectedRows = selection;
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
            const withdraw = JSON.parse(JSON.stringify(merchantDetail.tableColumnsWithdraw));
            withdraw.shift();
            withdraw.unshift({ text: '申请提现时间', dataIndex: 'applyTime', align: 'center' });
            withdraw.pop();
            withdraw.push({ text: '提现处理时间', dataIndex: 'dealTime', align: 'center' });
            this.tableHeader = withdraw;
        },
        
        mounted() {
            this.handleGetTableData();
        }
    }
</script>

<style>
</style>