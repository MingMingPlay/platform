<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">积分账户列表</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="用户名：">
                    <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <export-excel apiKey="memberExtendQueryExcel" :searchForm="form" :noParams="true"></export-excel>
            </el-form>
        </div>

        <!--表格-->
        <common-table :tableData="tableData"
                      :tableHeader="tableHeader"
                      :tableLoading="loading">
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
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    userName: '',
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
            exportExcel,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            handleSearch(){
                this.getData(this.form);
            },
            // 获取账户列表
            getData(params){
                this.loading = true;
                this.$http.put(['memberExtendQuery'], params)
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            let time = new Date().toLocaleDateString().replace(/\//g, '-');
                            this.tableData.forEach(value => {
                                value.nowTime = time;
                            })
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
