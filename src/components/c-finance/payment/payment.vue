<template>
    <div class="paymentC">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">付款单列表</div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="起止时间">
                    <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="logTimeChange" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结算对象">
                    <el-select v-model="form.merchantSid" placeholder="不限" clearable>
                        <el-option v-for="(item,index) in settlement" :key="index" :label="item.name" :value="item.sid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="款项类别">
                    <el-select v-model="form.fundsType" placeholder="不限" clearable>
                        <el-option label="门票" value="Tickets"></el-option>
                        <el-option label="征订" value="Order"></el-option>
                        <el-option label="物品销售" value="GoodsSell"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="success" @click="exportExcel">导出订单Excel</el-button>
            </el-form>
        </div>
        <el-table
            v-loading.body="loading"
            :data="tableData"
            style="width: 100%" stripe>
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" align="center" :width="column.width">
                <template slot-scope="scope">
                    <!--注释悬浮状态，暂时隐藏-->
                    <!--<div class="bottom" v-if="column.dataIndex=='stateName'">-->
                        <!--<el-tooltip placement="right-end">-->
                            <!--<div slot="content" >-->
                                <!--<ul class="stateList" >-->
                                    <!--<template v-for="(item, index) in stateList[scope.row.state]">-->
                                        <!--<li :class="{-->
                                                <!--red: index <= stateIndex[scope.row.state],-->
                                                <!--gray: index > stateIndex[scope.row.state]}">-->
                                            <!--{{item.label}}-->
                                        <!--</li>-->
                                    <!--</template>-->
                                <!--</ul>-->
                            <!--</div>-->
                            <!--<el-button size="mini" type="text">{{scope.row[column.dataIndex]}}</el-button>-->
                        <!--</el-tooltip>-->
                    <!--</div>-->
                    <span
                        v-if="column.dataIndex=='totalAmountValue' && scope.row['totalAmountValue']"
                        :class="{ black: column.dataIndex=='totalAmountValue'}">
                        {{scope.row['totalAmountValue'] | kb}}
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
                        @click="handleAudit(scope.$index, scope.row)"
                        v-if="scope.row.state=='CloudCheck'">审核</el-button>
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
    import api from '../../../assets/config/c-api.js'
    import { paymentList,receiptList} from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                receiptList,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                //表单头部
                columns: paymentList.tableColumns,
                //表单详情数据
                tableData: [],
                //面包屑
                crumbs:paymentList.crumbs,
                //时间值
                createTime:[],
                //提交的表单
                form:{
                    type:'Payment',
                    pageIndex:1,
                    pageSize:10,
                    //结算对象类型
                    merchantSid:'',
                    //款项类别
                    fundsType:'',
                },
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
                //状态下拉列表
                stateList:receiptList.stateList,
                stateIndex:receiptList.stateIndex,
                //结算对象
                settlement:[],
                //导出excel传的参，在搜索按钮点击之后
                excelData:{
                    type:'Payment',
                }
            };
        },
        components:{
            listPagination
        },
        created(){
            this.getData();
            this.ajaxSettlement();
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
                this.$http.get(['financialSettlements'],{
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
            //起止时间选择
            logTimeChange(datetime) {
                const index = datetime.indexOf(' - ');
                this.form.startTime = datetime.slice(0, index);
                this.form.endTime = datetime.slice(index + 3);
            },
            //款项类别
            handleClauseType(val){
                this.form.clauseType = val;
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
                this.excelData = this.form;
                this.getData()
            },
            // 对象序列化
            getQueryString() {
                const obj = Object.assign({}, this.excelData);
                obj.token = sessionStorage.token;
                let queryString = '';
                Object.keys(obj).forEach((key) => {
                    if(obj[key] == undefined || obj[key] == null) return;
                    else queryString += key + '=' + obj[key] + '&';
                });
                return queryString.slice(0, -1);
            },
            //exportExcel
            exportExcel(){
                const queryString = this.getQueryString();
                window.open(encodeURI(api.financialSettlements.url+'/excel?' + queryString), '_blank')
            },
            //结算对象列表不分页
            ajaxSettlement(){
                this.$http.get(['financialObject'],{
                    params:{
                        bounded:true
                    }
                })
                    .then((result) => {
                        if(result.body.code == 200){
                            this.settlement = result.body.data;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //审核
            handleAudit(index,row){
                this.$router.push({path:'/c_finance/bill/detail',
                    query: {
                        type:"Audit",
                        settlementId:row.settlementId,
                        sid:row.sid
                    }
                })
            },
            //详情
            handleDetail(index,row){
                this.$router.push({path:'/c_finance/bill/detail',
                    query: {
                        type:"Detail",
                        settlementId:row.settlementId,
                        sid:row.sid
                    }
                })
            }
        }
    };
</script>
<style scoped>
    .paymentC .red{
        color: red;
    }
    .paymentC .gray{
        color: gray;
    }
    .stateList li{
        color:gray;
        height: 25px;
        line-height: 12px;
        border-left:1px solid #8c8c8c;
        position: relative;
        padding-left: 10px;
        font-size: 13px;
    }
    .stateList li:last-child{
        border-left:1px solid transparent;
        height: 10px;
    }
    .stateList li:before{
        content: '';
        display: block;
        width: 10px;
        height:10px;
        background: #8c8c8c;
        border-radius: 50%;
        position: absolute;
        top:0;
        left: -5px;
    }
    .stateList li.red{
        color: #ff4949;
    }
    .stateList li.red:before{
        background: #ff4949;
    }
    .black{
        color: #333;
        display: block;
        text-align: right;
        width: 62%;
        background-color:transparent;
        border:0
    }
</style>
