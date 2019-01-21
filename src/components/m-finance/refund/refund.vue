<template>
    <div class="refund-merchant">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">退款单详情信息</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="退款申请起止时间：">
                    <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="logTimeChange" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="state" placeholder="不限" clearable @change="handleState">
                        <el-option label="退款成功" value="RefundSuccess"></el-option>
                        <el-option label="退款失败" value="RefundFail"></el-option>
                        <el-option label="退款中" value="RefundPending"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="流水号：">
                    <el-input v-model="keyword" placeholder="请输入流水号" @change="handleKeyword"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form>
        </div>
        <el-table
            v-loading.body="loading"
            :data="tableData"
            stripe>
            <el-table-column
                v-for="(column, index) in columns" :key="column.dataIndex"
                :label="column.text"
                :align="column.align"
                :width="column.width">
                <template slot-scope="scope">
                    <span
                        v-if="column.dataIndex=='refundAmountValue' && scope.row['refundAmountValue']"
                        :class="{ green: column.dataIndex=='refundAmountValue'}">
                        -{{scope.row['refundAmountValue'] | kb}}
                    </span>
                    <span v-else-if="!scope.row[column.dataIndex]">--</span>
                    <span v-else>{{scope.row[column.dataIndex]}}</span>
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
    import api from '../../../assets/config/m-api.js'
    import { refundListM } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                //表单头部
                columns: refundListM.tableColumns,
                //表单详情数据
                tableData: [],
                //面包屑
                crumbs:refundListM.crumbs,
                //时间值
                createTime:[],
                //提交的表单
                form:{
                    pageIndex:'1',
                    pageSize:'10'
                },
                //状态
                state:'',
                //流水号
                keyword:'',
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
            };
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
                this.$http.get(['financialRefunds'],{
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
            handleKeyword(val){
                this.form.keyword = val;
            },
            handleState(val){
                this.form.state = val;
            },
            //起止时间选择
            logTimeChange(datetime) {
                const index = datetime.indexOf(' - ');
                this.form.startTime = datetime.slice(0, index);
                this.form.endTime = datetime.slice(index + 3);
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
            //搜索
            handleSearch(){
                this.form.pageIndex = 1;
                this.form.pageSize = 10;
                this.getData()
            }
        }
    };
</script>
<style scoped>
    .refund-merchant .green{
        color: green;
    }
</style>
