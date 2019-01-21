<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="merchant-info">
            <el-form :model="form"  label-width="110px">
                <div class="detail-title">基础信息</div>
                <div class="detail-wrap">
                    <el-form-item label="结算对象名称">
                        <span>{{detailData.name}}</span>
                    </el-form-item>
                    <el-form-item label="结算对象类型" >
                        <span>{{detailData.typeShow}}</span>
                    </el-form-item>
                    <el-form-item label="结算规则组">
                        <span>{{detailData.rule}}</span>
                    </el-form-item>
                    <el-form-item label="是否有效">
                        <span>{{detailData.validShow}}</span>
                    </el-form-item>
                    <el-form-item label="结算周期">
                        <span>{{detailData.periodShow}}</span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleEdit">编辑</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <div class="merchant-info">
                <div class="detail-title">修改日志</div>
                <el-table
                    v-loading.body="loading"
                    :data="tableData"
                    border
                    style="width: 100%" stripe>
                    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" >
                        <template slot-scope="scope">
                            <span>{{scope.row[column.dataIndex]}}</span>
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

        </div>
    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import api from '../../../assets/config/c-api.js'
    import { settlementList } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //提交表单
                form: {
                    name:'name',
                    type:'123',
                    rule:'rule',
                    valid:'valid',
                    pageIndex:1,
                    pageSize:10,
                    start:'',
                    end:''
                },
                //面包屑
                crumbs:settlementList.crumbsDetail,
                columns:[{
                    text: '操作人',
                    dataIndex: 'operatorName'
                },{
                    text: '行为',
                    dataIndex: 'changedData'
                },{
                    text: '修改时间',
                    dataIndex: 'updatedTimeShow'
                }],
                //详情数据
                detailData:{},
                //表单数据
                tableData:[],
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
                //修改记录日志
                formLogs:{
                    pageIndex:1,
                    pageSize:10,
                }
            }
        },
        components:{
            listPagination
        },
        created(){
            this.getData();
            this.getDataLogs();
        },
        methods:{
            //获取数据
            getData(){
                this.$http.get(['financialObjectPage','/',this.$route.query.sid])
                .then((result) => {
                    if(result.body.code == 200){
                        console.log( result.body.data)
                        this.detailData = result.body.data;
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //修改记录日志
            getDataLogs(){
                this.$http.get(['financialObjectLogs','/',this.$route.query.sid],{
                    params:this.formLogs
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
                this.formLogs.pageSize = pageSize;
                setTimeout(()=>{
                    this.getDataLogs();
                },10)

            },
            handleCurrentChange(pageIndex,pageSize) {
                this.formLogs.pageIndex = pageIndex;
                setTimeout(()=>{
                    this.getDataLogs();
                },10)
            },
            //编辑
            handleEdit(){
                this.$router.push({path:'/c_finance/settlement/info',
                    query: {
                        type:'edit',
                        sid: this.$route.query.sid
                    }
                })
            },
        }
    }
</script>
<style>
</style>
