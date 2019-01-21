<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-title">申诉记录</div>
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
                <export-excel apiKey="memberAppealQueryExcel" :searchForm="form"></export-excel>
            </el-form>
        </div>

        <common-table :tableData="tableData"
                      :tableHeader="tableHeader"
                      :tableLoading="loading">
            <el-table-column label="操作" align="center" slot="handle">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.appealStatus === 0"
                        size="small"
                        type="text"
                        @click="handleAudit(scope.row)">审核</el-button>
                    <span v-else>--</span>
                </template>
            </el-table-column>
        </common-table>
        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>

        <el-dialog title="申诉审核" v-model="dialogSwitch" @close="dialogClose">
            <el-form :model="appealForm">
                <el-form-item label="备注" label-width="60px">
                    <el-input type="textarea" v-model="appealForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center">
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
    import datePicker from '../../common/date-picker.vue'
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
                // 查询条件提交的表单
                form:{
                    beginDate: '',
                    endDate: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                // 分页数据
                pagination:{},
                // 加载状态
                loading: false,
                // 时间
                createTime:[],
                dialogSwitch: false,
                appealForm: {
                    approvalStatus: '',
                    remark: '',
                    id: ''
                }
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
            getTime(start, end){
                this.form.beginDate = start;
                this.form.endDate = end;
            },
            //获取数据
            getData(params){
                this.loading = true;
                this.$http.post(['memberAppealQuery'],params)
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
            // 打开审核
            handleAudit(row){
                this.dialogSwitch = true;
                this.appealForm.id = row.id;
            },
            // 提交审核
            submitAudit(status){
                let tips = '';
                if(status === 1){
                    tips = '是否审核通过？';
                } else if(status === 2){
                    tips = '是否审核不通过？';
                }
                this.appealForm.approvalStatus = status;
                this.$confirm(tips, '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.put(['memberAppeal'], this.appealForm)
                        .then((result) => {
                            if(result.body.code === 200){
                                this.$message({type: 'success', message: result.body.data});
                                this.getData(this.form);
                                this.dialogSwitch = false;
                            }else{
                                this.$message({type: 'warning', message: result.body.message})
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                }).catch(() => {

                })
            },
            dialogClose(){
                for(let key in this.appealForm){
                    this.appealForm[key] = '';
                }
            }
        }
    };
</script>
<style scoped>

</style>
