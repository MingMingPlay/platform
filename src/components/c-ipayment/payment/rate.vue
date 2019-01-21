<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="查询条件：">
                    <el-input v-model="form.keyword" placeholder="请输入费率名称"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="handleAdd()">新增</el-button>
            </el-form>
        </div>
        <el-table
            v-loading.body="loading"
            :data="tableData" style="width: 100%" stripe>
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.mode==='OnceCharge' && column.dataIndex === 'rateValue' && scope.row['rateValue']">
                        {{scope.row['rateValue']}}元/笔
                    </span>
                    <span v-else-if="scope.row.mode==='Rate' && column.dataIndex === 'rateValue' && scope.row['rateValue']">
                        {{scope.row['rateValue']}}%
                    </span>
                    <span v-else-if="!scope.row[column.dataIndex]">--</span>
                    <span v-else>{{scope.row[column.dataIndex]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="text"
                        @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.state==='Active'">编辑</el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleDetail(scope.$index, scope.row)" v-if="scope.row.state==='Disabled'">查看</el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.state==='Active'">终止</el-button>
                </template>
            </el-table-column>
        </el-table>
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
    import { rateList } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //表单头部
                columns: rateList.tableColumns,
                //表单详情数据
                tableData: [],
                //面包屑
                crumbs:rateList.crumbs,
                //初始页码
                currentPage: 1,
                //查询条件提交的表单
                form:{
                    keyword:'',
                    pageIndex:1,
                    pageSize:10
                },
                //分页数据
                pagination:{},
                loading: true
            };
        },
        components:{
            listPagination
        },
        created(){
            this.getData();
        },
        methods: {
            //获取数据
            getData(){
                this.loading = true;
                this.$http.get(['financialRates'],{
                    params:this.form
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
                this.form.pageSize = pageSize;
                setTimeout(()=>{
                    this.getData();
                },10)

            },
            handleCurrentChange(pageIndex,pageSize) {
                this.form.pageIndex = pageIndex;
                setTimeout(()=>{
                    this.getData();
                },10)
            },
            //查询
            handleSearch(){
                this.form.pageIndex = 1;
                this.form.pageSize = 10;
                this.getData();
            },
            //新增
            handleAdd(){
                this.$router.push({path:'/c_payment/rate/info',
                    query: {
                        type:'add',
                    }
                })
            },
            //详情
            handleDetail(index,row){
                this.$router.push({path:'/c_payment/rate/detail',
                    query: {
                        type:'edit',
                        sid:row.sid
                    }
                })
            },
            //编辑
            handleEdit(index,row){
                this.$router.push({path:'/c_payment/rate/info',
                    query: {
                        type:'edit',
                        sid:row.sid
                    }
                })
            },
            //删除
            handleDelete(index,row){
                this.$confirm('此操作将永久终止该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$http.put(['financialShut',row.sid])
                        .then((result) => {
                            if(result.body.code == 200){
                                this.$message({type: 'success', message: '终止成功!'});
                                this.getData();
                            }else{
                                this.$message({type: 'warning', message: result.body.message})
                            }
                        }).catch((err) => {
                        console.log(err)
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消终止'
                    })
                })
            }
        }
    };
</script>
<style scoped>

</style>
