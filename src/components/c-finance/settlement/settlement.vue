<!--商户账户单列表-->
<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">结算对象列表</div>
        <div class="assist-btn-wrap">
            <el-button type="primary" @click="handleInfo">新增</el-button>
        </div>
        <el-table
            v-loading.body="loading"
            :data="tableData"
            style="width: 100%" stripe>
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" align="center" :width="column.width">
                <template slot-scope="scope">
                    <span v-if="column.dataIndex=='number'">{{scope.$index | newIndex(form.pageIndex,form.pageSize)}}</span>
                    <span v-else-if="!scope.row[column.dataIndex]">--</span>
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
                        @click="handleDetail(scope.$index, scope.row)">查看</el-button>
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
    import { settlementList } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //表单头部
                columns:settlementList.tableColumns,
                //表单数据
                tableData: [],
                //面包屑
                crumbs:settlementList.crumbs,
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
                form:{
                    pageIndex:1,
                    pageSize:10
                }
            }
        },
        created(){
            this.getData();
        },
        components:{
            listPagination
        },
        methods: {
            //列表
            getData(){
                this.loading = true;
                this.$http.get(['financialObjectPage'],{
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
            //新增
            handleInfo(){
                this.$router.push({path:'/c_finance/settlement/info',
                    query: {
                        type:"add"
                    }
                })
            },
            //编辑
            handleEdit(index,row){
                console.log(index, row);
                this.$router.push({path:'/c_finance/settlement/info',
                    query: {
                        type:'edit',
                        sid: row.sid
                    }
                })
            },
            //查看
            handleDetail(index, row) {
                this.$router.push({path:'/c_finance/settlement/detail',
                    query: {
                        sid: row.sid
                    }
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
        }

    }
</script>
