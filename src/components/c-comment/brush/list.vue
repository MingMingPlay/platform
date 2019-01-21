<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-title">评价刷单</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="起止时间">
                    <date-picker
                        :shortcut="true"
                        :disabledAfter="true"
                        @get-time="getTime"
                    ></date-picker>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="handleNav">新增</el-button>
                <export-excel apiKey="memberProCommentQueryExcel" :searchForm="form"></export-excel>
            </el-form>
        </div>

        <common-table :tableData="tableData"
                      :tableHeader="tableHeader"
                      :tableLoading="loading">
            <comment-state-col slot="state"></comment-state-col>
            <el-table-column label="操作" align="center" slot="handle">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="text"
                        @click="handleNav(scope.row)">查看</el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </common-table>
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
    import commentStateCol from '../../common/comment/comment-state-col.vue'
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
                // 查询条件提交的表单
                form: {
                    auditTimeBegin: '',
                    auditTimeEnd: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                // 分页数据
                pagination:{},
                // 加载状态
                loading: false,
                // 时间
                createTime:[],
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
            datePicker,
            exportExcel,
            commentStateCol,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            // 起止时间选择
            getTime(start, end){
                this.form.auditTimeBegin = start;
                this.form.auditTimeEnd = end;
            },
            //获取数据
            getData(params){
                this.loading = true;
                this.$http.post(['memberProCommentQuery'],params)
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
            // 查询
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            // 删除
            handleDelete(row){
                this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(['memberProCommentDel',row.id])
                        .then((result) => {
                            if(result.body.code === 200){
                                this.$message({type: 'success', message: '删除成功'})
                                this.getData(this.form);
                            }else{
                                this.$message({type: 'warning', message: result.body.message})
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                }).catch(() => {

                })
            },
            // 新增/查看
            handleNav(row){
                if(row.content){
                    this.$router.push({
                        path: '/c_comment/brush/detail',
                        query: {
                            type: 'detail',
                            id: row.id,
                        }
                    })
                }else {
                    this.$router.push({
                        path:'/c_comment/brush/detail',
                        query: {
                            type: 'add'
                        }
                    })
                }
            },
        }
    };
</script>
<style scoped>

</style>
