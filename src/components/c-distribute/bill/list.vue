<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item>
                    <el-input v-model="form.q" placeholder="店铺名称"></el-input>
                </el-form-item>
                <el-form-item label="账单月份：">
                    <el-date-picker
                        v-model="datePickerMonth"
                        type="month"
                        placeholder="请选择月份"
                        @change="getTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结算状态：">
                    <el-select v-model="form.type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已结算" :value="2"></el-option>
                        <el-option label="未结算" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <export-excel apiKey="authorBillListExcel" :searchForm="form"></export-excel>
            </el-form>
        </div>

        <!--表格-->
        <common-table
            :tableData="tableData"
            :tableHeader="tableHeader"
            :tableLoading="loading">
            <el-table-column slot="period" label="账单周期">
                <template slot-scope="scope">
                    <span>{{scope.row.beginDate}}至{{scope.row.endDate}}</span>
                </template>
            </el-table-column>
            <el-table-column slot="payable" label="本期应付">
                <template slot-scope="scope">
                    <p>{{scope.row.amount}}</p>
                    <p style="color: #999;">{{scope.row.numberTimes}}笔</p>
                </template>
            </el-table-column>
            <el-table-column slot="state" label="状态">
                <template slot-scope="scope">
                    <span>{{billState[scope.row.billType]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" slot="handle">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.billType === 1"
                        size="small"
                        type="text"
                        @click="billConfirm(scope.row.sid)">
                        确认结算
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="$router.push({
                                path: '/c_distribute/bill/detail',
                                query: {sid: scope.row.sid, month: scope.row.billsMonth, shopSid: scope.row.shopSid}
                            })">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </common-table>

        <!--分页-->
        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import exportExcel from '../../common/export-excel.vue'
    import { listCrumbs, tableHeader, billState } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: listCrumbs,
                billState: billState,
                // 表单头部
                tableHeader: tableHeader,
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                datePickerMonth: null,
                form: {
                    q: '',
                    month: '',
                    type: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
            exportExcel,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            getTime(month){
                this.form.month = month;
            },
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            // 获取发放列表
            getData(params){
                this.loading = true;
                this.$http.get(['authorBillList'], {params: params})
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 确认结算
            billConfirm(sid){
                this.$confirm('确认结算吗？', '提示', {type: 'warning'})
                    .then(() => {
                        this.$http.put(['authorBillConfirm', sid])
                            .then((result) => {
                                this.$message.success(result.body.message);
                                this.getData(this.form);
                            }).catch((err) => {
                            console.log(err)
                        })
                    })
            },
            handlePage(pageIndex, pageSize) {
                this.form.pageIndex = pageIndex;
                if(pageIndex === 1){
                    this.form.pageSize = pageSize;
                }
                this.getData(this.form);
            },
        },
    };
</script>
<style scoped>

</style>
