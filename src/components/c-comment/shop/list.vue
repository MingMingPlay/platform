<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">店铺评价列表</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="订单号：">
                    <el-input v-model="form.orderNum" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="店铺名称：">
                    <el-input v-model="form.shopName" placeholder="请输入店铺名称"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <export-excel apiKey="memberShopCommentQueryExcel" :searchForm="form"></export-excel>
            </el-form>
        </div>
        <!--tags-->
        <el-tabs v-model="tagState" @tab-click="handleClick">
            <el-tab-pane label="全部评价" name="all"></el-tab-pane>
            <el-tab-pane label="待审核的评价" name="audit"></el-tab-pane>
            <el-tab-pane label="已删除的评价" name="del"></el-tab-pane>
        </el-tabs>
        <!--表格-->
        <common-table :tableData="tableData"
                      :tableHeader="tableHeader"
                      :tableLoading="loading">
            <comment-state-col slot="state"></comment-state-col>
            <el-table-column label="操作" align="center" slot="handle" v-if="tagState !== 'del'">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.commentStatus === 0"
                        size="small"
                        type="text"
                        @click="handleAudit(scope.row)">审核</el-button>
                    <el-button
                        v-else-if="scope.row.commentStatus === 1 || scope.row.commentStatus === 2"
                        size="small"
                        type="text"
                        @click="submitAudit(3, scope.row)">删除</el-button>
                    <span v-else>--</span>
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

        <el-dialog v-model="dialogSwitch" title="店铺评论审核">
            <div slot="footer" style="text-align: center;">
                <el-button type="success" @click="submitAudit(1)">审核通过</el-button>
                <el-button type="danger" @click="submitAudit(2)">审核拒绝</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import exportExcel from '../../common/export-excel.vue'
    import commentStateCol from '../../common/comment/comment-state-col.vue'
    import { listCrumbs, tableHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: listCrumbs,
                // tags状态
                tagState: 'all',
                // 表单头部
                tableHeader: tableHeader,
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    commentStatus: -1,
                    // 订单号
                    orderNum: "",
                    // 店铺名称
                    shopName: "",
                    pageIndex: 1,
                    pageSize: 10,
                },
                dialogSwitch: false,
                // 操作的 form
                submitForm: {
                    auditStatus: '',
                    resourceId: ''
                }
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
            exportExcel,
            commentStateCol,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            // tags 切换
            handleClick(tab, event) {
                switch (tab.name){
                    case 'all':
                        this.form.commentStatus = -1;
                        break;
                    case 'audit':
                        this.form.commentStatus = 0;
                        break;
                    case 'del':
                        this.form.commentStatus = 3;
                }
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            // 获取评价
            getData(params){
                this.loading = true;
                this.$http.post(['memberShopCommentQuery'], params)
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
            handleAudit(row){
                this.submitForm.resourceId = row.id;
                this.dialogSwitch = true;
            },
            submitAudit(status, row){
                let tips = '';
                if(status === 1){
                    tips = '是否审核通过？';
                }else if(status === 2){
                    tips = '是否审核不通过？';
                }else if(status === 3){
                    this.submitForm.resourceId = row.id;
                    tips = '是否删除该条记录？';
                }
                this.submitForm.auditStatus = status;
                this.$confirm(tips, {type: 'warning'})
                    .then(() => {
                        this.$http.post(['memberAuditShop'], this.submitForm)
                            .then((result) => {
                                if(result.body.code === 200){
                                    this.$message({type: 'success', message: result.body.data});
                                    this.dialogSwitch = false;
                                    this.getData(this.form);
                                }else{
                                    this.$message({type: 'warning', message: result.body.message})
                                }
                            }).catch((err) => {
                            console.log(err)
                        })
                    }).catch(() => {})
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
