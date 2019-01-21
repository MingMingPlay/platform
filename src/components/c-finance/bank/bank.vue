<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">商户信息列表</div>
        <div class="search-fil-wrap one-line">
            <el-form :inline="true">
                <el-form-item label="查询条件：">
                    <el-input v-model="params.accountNo" placeholder="请输入银行帐号" @change="handleAccountNo" style="width: 230px"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="handleAdd()">新增</el-button>
            </el-form>
        </div>
        <el-table
            v-loading.body="loading"
            :data="tableData"
            style="width: 100%" stripe>
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" align="center" :width="column.width">
                <template slot-scope="scope">
                    <span v-if="column.dataIndex=='number'">{{scope.$index | newIndex(params.pageIndex,params.pageSize)}}</span>
                    <span v-else>{{scope.row[column.dataIndex]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="text"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <list-pagination
            v-if="loading==false && pagination"
            v-bind:pagination="pagination"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="handleCurrentChange">
        </list-pagination>
    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import api from '../../../assets/config/c-api.js'
    import { bankList } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //表单头部
                columns: bankList.tableColumns,
                //表单详情数据
                tableData: [],
                //面包屑
                crumbs:bankList.crumbs,
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
                //参数
                params:{
                    pageIndex:1,
                    pageSize:10
                },

            };
        },
        components:{
            listPagination
        },
        created(){
            this.getData()
        },
        methods: {
            //获取数据
            getData(){
                this.loading = true;
                this.$http.get(['accountCompany'],{
                    params:this.params
                })
                .then((result) => {
                    if(result.body.code == 200){
                        this.tableData = result.body.data;
                        this.pagination = result.body.pagination;
                        this.loading = false;
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            handleSizeChange(pageIndex,pageSize) {
                this.params.pageSize = pageSize;
                setTimeout(()=>{
                    this.getData();
                },10)

            },
            handleCurrentChange(pageIndex,pageSize) {
                this.params.pageIndex = pageIndex;
                setTimeout(()=>{
                    this.getData();
                },10)
            },
            handleAccountNo(val){
                this.params.accountNo = val;
            },
            //查询
            handleSearch(val){
                this.params.pageIndex = 1;
                this.params.pageSize = 10;
                this.getData();
            },
            //新增
            handleAdd(){
                this.$router.push({path:'/c_finance/biz/info',
                    query: {
                        type:'add'
                    }
                })
            },
            //编辑
            handleEdit(index,row){
                this.$router.push({path:'/c_finance/biz/info',
                    query: {
                        type:'edit',
                        sid:row.merchantSid
                    }
                })
            },
            //删除
            handleDelete(index,row){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$http.delete(['accountCompanyDetail',row.merchantSid])
                        .then((result) => {
                            if(result.body.code == 200){
                                this.$message({type: 'success', message: '删除成功'})
                                setTimeout(()=>{
                                    this.getData();
                                },10)
                            }else{
                                this.$message({type: 'warning', message: result.body.message})
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除'})
                })
            },
            //确定
            submitSure(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.formInfo)
                        //接口状态200弹窗移除
                        //this.dialogFormVisible = false;

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //回调重置
            dialogClose(){
                this.$refs['formInfo'].resetFields();
            }
        }
    };
</script>
<style scoped>

</style>
