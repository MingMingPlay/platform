<template>
    <div class="data-total">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">征订数据统计</div>
        <div class="tips">数据更新时间：{{lastSynchTime}}</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="searchForm" :inline="true">
                <el-form-item label="征订开始有效时间：">
                    <el-date-picker
                        v-model="searchForm.date"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="dateChange">
                    </el-date-picker>
                    <p class="search-tips">仅统计征订开始时间在本时间段的征订</p>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <export-excel apiKey="statisOrganReportExportSubscribe" :searchForm="searchForm"></export-excel>
            </el-form>
        </div>

        <!--表格-->
        <recursion-table
            v-if="tableData.length > 0"
            :tableData="tableData"
            :tableHeader="tableHeader"
            :tableLoading="loading">
        </recursion-table>

    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import RecursionTable from '../common/RecursionTable.vue'
    import exportExcel from '../../common/export-excel.vue'
    import { listCrumbs, tableHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: listCrumbs,
                // 表单头部
                tableHeader: tableHeader,
                // 表格数据
                tableData: [],
                lastSynchTime: '',
                // 加载
                loading: false,
                searchForm: {
                    date: '',
                    startDay: "",
                    endDay: "",
                },
            };
        },
        components:{
            jkcBreadcrumb,
            RecursionTable,
            exportExcel,
        },
        created(){
            this.getData(this.searchForm);
        },
        methods: {
            dateChange(date){
                // 修改时间范围回调
                let dataArr = date.split(' - ');
                this.searchForm.startDay = dataArr[0];
                this.searchForm.endDay = dataArr[1];
            },
            handleSearch(){
                this.getData(this.searchForm);
            },
            // 获取评价
            getData(params){
                this.loading = true;
                this.$http.get(['statisOrganReport', 'subscribe'], {params: params})
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            this.lastSynchTime = result.body.lastSynchTime;
                        }else{
                            this.$message.warning(result.body.message)
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            }
        },
    };
</script>
<style>
    .data-total .search-tips {
        font-size: 14px;
        line-height: 26px;
        color: #999;
    }
.data-total .tips {
    margin-bottom: 10px;
    font-size: 14px;
    text-align: right;
}
</style>
