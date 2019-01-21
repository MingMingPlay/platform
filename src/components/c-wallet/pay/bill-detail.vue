<template>
    <div class="transaction">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="支付订单号">
                    <el-input placeholder="请输入支付订单号" v-model="form.sysOrderId" ></el-input>
                </el-form-item>
                <el-form-item label="起止时间">
                    <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="logTimeChange" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="付费方">
                    <el-select v-model="form.accountSid" placeholder="不限" clearable @change="handleAccountSid">
                        <el-option v-for="(item,index) in Buyer" :key="index" :label="item.name" :value="item.merchantSid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易类型">
                    <el-select v-model="form.type" placeholder="不限" clearable>
                        <el-option label="退款" value="0"></el-option>
                        <el-option label="付款" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="success" @click="exportExcel">导出Excel</el-button>
            </el-form>
        </div>
        <el-table
            v-loading.body="loading"
            :data="tableData"
            style="width: 100%" stripe>
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :align="column.align" :width="column.width">
                <template slot-scope="scope">
                    <span v-if="column.dataIndex=='number'">{{scope.$index | descIndex(pagination.pageIndex, pagination.pageSize, pagination.totalRow)}}</span>
                    <span
                        v-else-if="scope.row[column.dataIndex] && (column.dataIndex=='amountValue' || column.dataIndex=='actualAmountValue' || column.dataIndex=='orderAmountValue' || column.dataIndex=='serviceAmountValue')">
                       {{scope.row[column.dataIndex] | kb}}
                    </span>
                    <span v-else-if="!scope.row[column.dataIndex]">--</span>
                    <span v-else>{{scope.row[column.dataIndex]}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="loading==false" class="billingMoney">
            手续费总金额：<span>{{billingMoney}}</span>元
        </div>
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
    import { billingList } from '../../../assets/staticData/finance.js'
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
                columns: billingList.tableColumns,
                //表单详情数据
                tableData: [],
                //面包屑
                crumbs:billingList.crumbs,
                currentPage4: 1,
                //时间值
                createTime:[],
                //提交的表单
                form:{
                    sysOrderId: '',
                    accountSid:'',
                    pageIndex:1,
                    pageSize:10,
                },
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
                //付费方
                Buyer:[],
                //总金额
                billingMoney:'',
                //导出excel传的参，在搜索按钮点击之后
                excelData:{}
            };
        },
        components:{
            listPagination
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
        created(){
            //列表
            this.getData();
            //付费方
            this.ajaxBill();
            //总手续费
            this.ajaxBillSum();
        },
        methods: {
            //付费方--银行账户管理-全部-接口
            ajaxBill(){
                this.$http.get(['accountCompanyAll'])
                    .then((result) => {
                        if(result.body.code == 200){
                            this.Buyer = result.body.data;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //计费明细-总手续费
            ajaxBillSum(){
                this.$http.get(['financialBillingsSum'],{
                    params:this.form
                })
                .then((result) => {
                    if(result.body.code == 200){
                        this.billingMoney = result.body.data;
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //获取数据
            getData(){
                this.loading = true;
                this.$http.get(['financialBillings'],{
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
            //付费方
            handleAccountSid(val){
                console.log(val)
                this.form.accountSid = val;
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
                this.getData();
                //计费明细-总手续费
                this.ajaxBillSum();
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
                window.open(encodeURI(api.financialBillings.url+'/excel?' + queryString), '_blank')
            },
        }
    };
</script>
<style scoped>
    .billingMoney{
        font-size: 14px;
        padding: 20px;
        color: #333;
    }
    .billingMoney span{
        color: #ea1a22;
    }

</style>
