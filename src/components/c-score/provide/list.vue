<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">积分发放列表</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="起止时间：">
                    <date-picker
                        :shortcut="true"
                        :disabledAfter="true"
                        @get-time="getTime"
                    ></date-picker>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <export-excel apiKey="memberScoreHistoryExcel" :searchForm="form"></export-excel>
            </el-form>
        </div>

        <!--tags-->
        <el-tabs v-model="tagState" @tab-click="handleClick">
            <el-tab-pane label="商城" name="mall"></el-tab-pane>
            <el-tab-pane label="内容" name="content"></el-tab-pane>
        </el-tabs>

        <!--表格-->
        <common-table :tableData="tableData"
                      :tableHeader="tableHeader[tagState]"
                      :tableLoading="loading">
            <el-table-column slot="comment" label="评价" align="center" width="60">
                <template slot-scope="scope">
                    <span>1</span>
                </template>
            </el-table-column>
            <el-table-column slot="comment1" label="晒单" align="center" width="60">
                <template slot-scope="scope">
                    <span>{{scope.row.isDisplay === 1 ? '有' : '暂无'}}</span>
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
    import datePicker from '../../common/date-picker.vue'
    import exportExcel from '../../common/export-excel.vue'
    import { listCrumbs, tableHeader } from './page-config.js'
    export default {
        data() {
            return {
                tagState: 'mall',
                // 面包屑
                crumbs: listCrumbs,
                // 表单头部
                tableHeader: tableHeader,
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    beginDate: '',
                    endDate: '',
                    type: 1,
                    pageIndex:1,
                    pageSize:10,
                },
                dialogSwitch: false,
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
            datePicker,
            exportExcel,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            // tags 切换
            handleClick(tab, event) {
                switch (tab.name){
                    case 'mall':
                        this.form.type = 1;
                        break;
                    case 'content':
                        this.form.type = 2;
                }
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            getTime(start, end){
                this.form.beginDate = start;
                this.form.endDate = end;
            },
            handleSearch(){
                this.getData(this.form);
            },
            // 获取发放列表
            getData(params){
                this.loading = true;
                this.$http.post(['memberScoreHistory'], params)
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
