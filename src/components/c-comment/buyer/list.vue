<template>
    <div class="buyer-list">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-title">买家评价列表</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="评分：">
                    <el-select v-model="form.productScore">
                        <el-option label="全部评分" :value="-1"></el-option>
                        <el-option label="5分" :value="5"></el-option>
                        <el-option label="4分" :value="4"></el-option>
                        <el-option label="3分" :value="3"></el-option>
                        <el-option label="2分" :value="2"></el-option>
                        <el-option label="1分" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="form.orderNum" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="form.isPic" :true-label="1" :false-label="-1">只看有图片的评价</el-checkbox>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <export-excel apiKey="memberProCommentExcel" :searchForm="form"></export-excel>
            </el-form>
        </div>
        <!--tags-->
        <el-tabs v-model="tagState" @tab-click="handleClick">
            <el-tab-pane label="全部评价" name="all"></el-tab-pane>
            <el-tab-pane label="待审核的评价" name="audit"></el-tab-pane>
            <el-tab-pane label="已删除的评价" name="del"></el-tab-pane>
        </el-tabs>

        <div style="margin-bottom: 15px"  v-if="tagState === 'audit'">
            <el-button type="success" @click="handleState(1, 'batch')">审核通过</el-button>
            <el-button type="danger" @click="handleState(2, 'batch')">审核拒绝</el-button>
        </div>

        <!--表格-->
        <buyer-table
            :tableHeader="tableHeader"
            :tableData="tableData"
            :tableLoading="loading"
            :select="tagState === 'audit'"
            @imgModel="showBigImg"
            @select="select"
            @select-all="select">
            <comment-state-col slot="state"></comment-state-col>
            <el-table-column label="操作" slot="handle" align="center" v-if="tagState !== 'del'">
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
                        @click="handleState(3, scope.row)">删除</el-button>
                    <span v-else-if="scope.row.commentStatus === 4">申诉中</span>
                </template>
            </el-table-column>
        </buyer-table>

        <!--分页-->
        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>

        <el-dialog title="商品评价审核" v-model="dialogVisible" @close="dialogClose">
            <div class="title">商品评价是否审核通过？</div>
            <div>
                <el-checkbox v-model="auditForm.isEssence" :true-label="1" :false-label="0">是否为精华评论</el-checkbox>
                <el-checkbox v-model="auditForm.isTop" :true-label="1" :false-label="0">是否置顶</el-checkbox>
            </div>
            <div slot="footer">
                <el-button type="success" @click="handleState(1)">审核通过</el-button>
                <el-button type="danger" @click="handleState(2)">审核拒绝</el-button>
            </div>
        </el-dialog>
        <div class="img-dialog">
            <el-dialog
                :before-close="destoryImg"
                :visible.sync="centerDialogVisible"
                width="80%"
                center>
                <div class="img-dialog-img">
                    <img v-if="commentImg" :src="commentImg" alt=""/>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import buyerTable from '../../common/comment/buyer-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import exportExcel from '../../common/export-excel.vue'
    import commentStateCol from '../../common/comment/comment-state-col.vue'
    import { listCrumbs, tableHeader } from './page-config.js'
    export default {
        data() {
            return {
                centerDialogVisible: false,
                commentImg: '',
                //面包屑
                crumbs: listCrumbs,
                tagState: 'all',
                //表单头部
                tableHeader: tableHeader,
                //表单详情数据
                tableData: [],
                //分页数据
                pagination: {},
                //加载
                loading: false,
                form: {
                    // 评论状态  不传全部 0 待审核 1审核通过 2审核拒绝 3删除 4申诉中
                    commentStatus: -1,
                    // 只看有图片的评价
                    isPic: -1,
                    // 订单编号
                    orderNum: '',
                    // 评分
                    productScore: -1,
                    pageIndex: 1,
                    pageSize: 10,
                },
                //批量选择
                multipleSelection: [],
                dialogVisible: false,
                auditForm: {
                    // 审核状态
                    auditStatus: null,
                    // 是否加精，1 加精，0 不加精
                    isEssence: null,
                    // 是否加精，1 置顶，0 不置顶
                    isTop: null,
                    // 数组或 string
                    resourceId: null,
                }
            };
        },
        components:{
            jkcBreadcrumb,
            buyerTable,
            listPagination,
            exportExcel,
            commentStateCol,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            destoryImg (done) {
                this.commentImg = '';
                done();
            },
            showBigImg (url) {
                this.centerDialogVisible = true;
                url = url.replace(/-w\d+/,'-w1080');
                this.commentImg = url;
            },
            //tags切换
            handleClick(tab, event) {
                this.multipleSelection = [];
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
            // 获取评价
            getData(params){
                this.loading = true;
                this.$http.post(['memberProComment'], params)
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
            // 查询
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            handleAudit(row){
                this.dialogVisible = true;
                this.auditForm.resourceId = row.commentId;
            },
            select(selection, row){
                this.multipleSelection = selection;
            },
            // 操作状态，审核/删除
            handleState(status, row){
                this.auditForm.auditStatus = status;
                let postData = null;
                let apiKey = '';
                let tips = '';
                if(status === 1){
                    tips = '是否审核通过？';
                }else if(status === 2){
                    tips = '是否审核不通过？';
                }else if(status === 3){
                    this.auditForm.resourceId = row.commentId;
                    tips = '是否删除该条记录？';
                }
                if(row === 'batch'){
                    // 如果是批量操作
                    apiKey = 'memberAuditBatchPro';
                    postData = this.multipleSelection.map(value => {
                        let item = JSON.parse(JSON.stringify(this.auditForm))
                        item.resourceId = value.commentId;
                        return item;
                    });
                }else {
                    apiKey = 'memberAuditPro';
                    postData = this.auditForm;
                }
                this.$confirm(tips, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post([apiKey], postData)
                        .then((result) => {
                            if(result.body.code === 200){
                                this.$message({type: 'success', message: result.body.data});
                                this.dialogVisible = false;
                                this.getData(this.form);
                            }else{
                                this.$message({type: 'warning', message: result.body.message})
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                }).catch(() => {})
            },
            dialogClose(){
                for(let key in this.auditForm){
                    this.auditForm[key] = null;
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
<style>
.buyer-list .el-dialog .el-dialog__body{
    height: 100px;
    text-align: center;
}
.buyer-list .el-dialog .el-dialog__body .title{
    font-size: 18px;
    line-height: 50px;
}
.buyer-list .el-dialog .el-dialog__footer{
    text-align: center;
}

.img-dialog .el-dialog .el-dialog__body{
    height: 600px;
    width: 800px;
    display: table;
    vertical-align: middle;
    padding: 0 34px 34px 34px;
    margin: 0;
}
.img-dialog .el-dialog .el-dialog__title {
    border: none;
}
.img-dialog-img{
    height: 500px;
    display: table-cell;
    vertical-align: middle;

}
.img-dialog .el-dialog--small{
    width: 800px;
}
.img-dialog-img img{
    min-width: 300px;
    max-width: 100%;
    max-height: 100%;
}
</style>
