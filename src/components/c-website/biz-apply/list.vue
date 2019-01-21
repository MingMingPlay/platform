<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item>
                    <el-input v-model="form.merchantName" placeholder="请输入公司名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.merchantPhone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.merchantStatus">
                        <el-option label="全部" :value="-1"></el-option>
                        <el-option label="已处理" :value="2"></el-option>
                        <el-option label="未处理" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form>
        </div>

        <common-table :tableData="tableData"
                      :tableHeader="tableHeader"
                      :tableLoading="loading">
            <el-table-column label="操作" align="center" slot="handle">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.merchantStatus === 1"
                        size="small"
                        type="text"
                        @click="submitAudit(scope.row)">处理</el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </common-table>
        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>

        <el-dialog title="详情" v-model="dialogSwitch">
            <el-form label-width="150px">
                <el-form-item label="公司名称">
                    <span>{{detail.merchantName || '--'}}</span>
                </el-form-item>
                <el-form-item label="联系人">
                    <span>{{detail.merchantContacts || '--'}}</span>
                </el-form-item>
                <el-form-item label="联系电话">
                    <span>{{detail.merchantPhone || '--'}}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                    <span>{{detail.merchantEmail || '--'}}</span>
                </el-form-item>
                <el-form-item label="公司地址">
                    <span>{{detail.merchantAddress || '--'}}</span>
                </el-form-item>
                <el-form-item label="职务">
                    <span>{{detail.merchantJob || '--'}}</span>
                </el-form-item>
                <el-form-item label="想了解的业务">
                    <span>{{detail.merchantBusinessName || '--'}}</span>
                </el-form-item>
                <el-form-item label="了解到我们的渠道">
                    <span>{{detail.merchantPlatformName || '--'}}</span>
                </el-form-item>
                <el-form-item label="问题和建议">
                    <span>{{detail.merchantRemark || '--'}}</span>
                </el-form-item>
                <el-form-item label="提交时间">
                    <span>{{detail.createDate || '--'}}</span>
                </el-form-item>
                <el-form-item label="状态">
                    <span>{{detail.merchantStatusName || '--'}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center" v-if="detail.merchantStatus === 1">
                <el-button type="success" @click="submitAudit">处理</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
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
                    merchantName: '',
                    merchantPhone: '',
                    merchantStatus: -1,
                    pageIndex: 1,
                    pageSize: 10
                },
                // 分页数据
                pagination:{},
                // 加载状态
                loading: true,
                // 时间
                createTime:[],
                dialogSwitch: false,
                detail: {},
                appealForm: {
                    auditStatus: null,
                    resourceId: ''
                }
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            //获取数据
            getData(params){
                this.loading = true;
                this.$http.post(['memberMerchantApplyQuery'],params)
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
            // 提交审核
            submitAudit(row){
                if(row.id){
                    this.appealForm.resourceId = row.id;
                }else {
                    this.appealForm.resourceId = this.detail.id;
                }
                this.appealForm.auditStatus = 2;
                this.$confirm('确定已处理？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post(['memberMerchantApply'], this.appealForm)
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
            handleDetail(row){
                this.dialogSwitch = true;
                this.detail = row;
            },
        }
    };
</script>
<style scoped>

</style>
