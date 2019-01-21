<template>
    <div class="comment-list">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">店铺评价列表</div>

        <!--评分展示组件-->
        <shop-rate :statistic="statistic"></shop-rate>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="订单号：">
                    <el-input v-model="form.orderNum" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <export-excel apiKey="memberShopCommentExcel" :searchForm="form"></export-excel>
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
            <el-table-column label="操作" align="center" slot="handle">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.commentStatus === 0"
                        size="small"
                        type="text"
                        @click="handleDialog(scope.row)">申诉</el-button>
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

        <dialog-appeal
            v-if="showDialog"
            :rows="dialogRow"
            :showDialog="showDialog"
            @close="dialogClose">
        </dialog-appeal>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import shopRate from './shop-rate.vue'
    import dialogAppeal from './dialog-appeal.vue'
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
                form:{
                    commentStatus: -1,
                    // 订单号
                    orderNum: "",
                    pageIndex: 1,
                    pageSize: 10,
                    // 商家 sid
                    merchantSid: this.$root.userInfo.merchantSid
                },
                // 统计数据
                statistic: {
                    // 店铺评分
                    shopScore: 0,
                    // 店铺评分人数
                    userShopNum: 0,
                    // 商品评分
                    productScore: 0,
                    // 评论商品人数
                    userProductNum: 0,
                    // 服务评分
                    serverScore: 0,
                    // 物流评分
                    logisticsScore: 0,
                    // 发货评分
                    sendScore: 0,
                },
                showDialog: false,
                dialogRow: {},
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
            shopRate,
            dialogAppeal,
            exportExcel,
            commentStateCol,
        },
        created(){
            this.getData(this.form);
            this.getStatistic();
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
            // 获取评价
            getStatistic(){
                this.$http.post(['memberShopCommentStatistic'])
                    .then((result) => {
                        if(result.body.code === 200){
                            this.statistic = result.body.data;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 操作dialog
            handleDialog(row){
                this.dialogRow = row;
                this.showDialog = true;
            },
            dialogClose(type){
                this.showDialog = false;
                if(type === 'success'){
                    this.getData(this.form);
                }
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

