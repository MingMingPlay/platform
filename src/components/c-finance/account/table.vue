<!--商户账户单列表-->
<template>
    <div class="account-list">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">商户账户单列表</div>
        <el-table
            v-loading.body="loading"
            :data="tableData" stripe>
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :align="column.align" :width="column.width">
                <template slot-scope="scope">
                    <span v-if="column.dataIndex=='number'">{{scope.$index | newIndex(form.pageIndex,form.pageSize)}}</span>
                    <span
                        v-else-if="column.dataIndex=='allAmountShow' && scope.row['allAmountShow']"
                        :class="{ black: column.dataIndex=='allAmountShow'}">
                        {{scope.row['allAmountShow'] | kb}}
                    </span>
                    <span
                        v-else-if="column.dataIndex=='frozenAmountShow' && scope.row['frozenAmountShow']"
                        :class="{ black: column.dataIndex=='frozenAmountShow'}">
                        {{scope.row['frozenAmountShow'] | kb}}
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
                        @click="handleRecharge(scope.$index, scope.row)">充值记录</el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleWithdraw(scope.$index, scope.row)">提现记录</el-button>
                    <!--<el-button-->
                        <!--size="small"-->
                        <!--type="text"-->
                        <!--@click="handleDetail(scope.$index, scope.row)">查询明细</el-button>-->
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
    import { merchantList } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //表单头部
                columns:merchantList.tableColumns,
                //表单数据
                tableData: [],
                //面包屑
                crumbs:merchantList.crumbs,
                //提交的表单
                form:{
                    pageSize:10,
                    pageIndex:1
                },
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
            }
        },
        components:{
            listPagination
        },
        created(){
            this.getData();
        },
        filters: {
            kb: function (money) {
                if (money) {
                    var re = /\d{1,3}(?=(\d{3})+$)/g;
                    var money = money.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
                        return s1.replace(re, "$&,") + s2;
                    });
                    return money;
                }
            }
        },
        methods: {
            //获取数据
            getData(){
                this.loading = true;
                this.$http.get(['financialAccount'],{
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
            //充值
            handleRecharge(index,row){
                console.log(index, row);
                this.$router.push({path:'/c_finance/account/detail',
                    query: {
                        type:'recharge',
                        merchantSid: row.merchantSid
                    }
                })
            },
            //提现
            handleWithdraw(index, row) {
                this.$router.push({path:'/c_finance/account/detail',
                    query: {
                        type:'withdraw',
                        merchantSid: row.merchantSid
                    }
                })
            },
            //资金明细
//            handleDetail(index, row) {
//                this.$router.push({path:'/c_finance/account/detail',
//                    query: {
//                        type:'fund',
//                        merchantSid: row.merchantSid
//                    }
//                })
//            },
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
<style scoped>
</style>
