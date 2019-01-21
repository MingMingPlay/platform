<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="rate-info">
            <el-form :model="formInfo" label-width="110px">
                <div class="detail-title">基础信息</div>
                <div class="detail-wrap">
                    <el-form-item label="费率编号" label-width="108px">
                        <span>{{formInfo.number}}</span>
                    </el-form-item>
                    <el-form-item label="费率名称" label-width="108px" >
                        <span>{{formInfo.name}}</span>
                    </el-form-item>
                    <el-form-item label="付费方" label-width="108px">
                        <span>{{formInfo.payObjectName}}</span>
                    </el-form-item>
                    <el-form-item label="收费方" label-width="108px">
                        <span>{{formInfo.chargeType}}</span>
                    </el-form-item>
                    <el-form-item label="支付渠道" label-width="108px">
                        <span>{{formInfo.payChannel}}</span>
                    </el-form-item>
                    <el-form-item label="订单类型" label-width="108px">
                        <span>{{formInfo.orderGenre}}</span>
                    </el-form-item>
                    <el-form-item label="固定费率" label-width="108px">
                        <span v-if="formInfo.mode==='OnceCharge'">按笔收取：每笔{{formInfo.money}}元</span>
                        <span v-if="formInfo.mode==='Rate'">按订单金额：{{formInfo.rate}}%</span>
                    </el-form-item>
                    <el-form-item label="收费日期" class="ipayDate">
                        <span>{{formInfo.startTime}}&nbsp; 至 &nbsp;{{formInfo.endTime}}</span>
                    </el-form-item>
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="handleEdit">编辑</el-button>-->
                    <!--</el-form-item>-->
                </div>
            </el-form>
            <div class="merchant-info">
                <div class="detail-title">修改日志</div>
                <el-table
                    v-loading.body="loading"
                    :data="tableData"
                    border
                    style="width: 100%" stripe>
                    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text">
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
    import { rateList } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },
                //表单头部
                columns: rateList.tableColumns,
                //面包屑
                crumbs:rateList.crumbsInfo,
                //查询条件提交的表单
                form:{
                    bankAccount:'',
                },
                //新增或修改提交表单
                formInfo:{
                    //支付渠道
                    payChannel:'',
                    //费率模式
                    mode:'Rate',
                    //订单类型
                    orderGenre:'',
                    //收费方
                    chargeType:'',
                    //付费方  oozPcD
                    payObjectSid:'',
                    payObjectName:'',
                    //时间值
                    createTime:[],
                    money:'',
                    rate:'',
                    rateValue:'',
                },
                //验证
                rules:rateList.rules,
                //is 新增 编辑
                type:this.$route.query.type,
                //付费方
                Buyer:[],
                columns:[{
                    text: '操作人',
                    dataIndex: 'operatorName'
                },{
                    text: '行为',
                    dataIndex: 'changeData'
                },{
                    text: '修改时间',
                    dataIndex: 'updateTime'
                }],
                tableData:[],
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,

            };
        },
        created(){
            this.ajaxDetail();
            this.getDataLogs();
        },
        components:{
            listPagination
        },
        methods: {
            //编辑
            handleEdit(){
                this.$router.push({path:'/c_payment/rate/info',
                    query: {
                        type:'edit',
                        sid:this.$route.query.sid
                    }
                })
            },
            //查看详情
            ajaxDetail(){
                this.$http.get(['financialRate','/',this.$route.query.sid])
                    .then((result) => {
                        if(result.body.code == 200){
                            result.body.data.createTime = [result.body.data.startTime,result.body.data.endTime];
                            this.formInfo = result.body.data;
                            switch (result.body.data.mode){
                                case 'Rate':
                                    this.formInfo.rate = result.body.data.rateValue;
                                    break;
                                case 'OnceCharge':
                                    this.formInfo.money = result.body.data.rateValue;
                                    break;
                            }
                            console.log(this.formInfo)
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //修改记录日志
            getDataLogs(){
                this.$http.get(['financialRateLogs',this.$route.query.sid],{
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
                    this.getDataLogs();
                },10)

            },
            handleCurrentChange(pageIndex,pageSize) {
                this.form.pageIndex = pageIndex;
                setTimeout(()=>{
                    this.getDataLogs();
                },10)
            },
        }
    };
</script>
<style scoped>
    .rate-info .el-form-item__content .el-input {
        width: 400px;
    }
    .ipayDate .el-form-item__content  .el-input{
        width:200px;
    }
    .rate-info .samllInput  .el-input{
        width: 200px;
    }
</style>
