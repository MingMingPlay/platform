<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">付款单详情信息</div>
        <div class="search-fil-wrap one-line receiptDetail">
            <ul>
                <li><span>付款单编号：</span><span>{{Detail.settlementId}}</span></li>
                <li><span>付款方式：</span><span>{{Detail.payModeName}}</span></li>
                <li><span>本期应付：</span><span>{{Detail.totalAmountValue | kb}}</span></li>
            </ul>
            <ul>
                <!--<li><span>结算对象：</span><span>{{Detail.accountName}}</span></li>-->
                <li><span>款项类别：</span><span>{{Detail.fundsTypeName}}</span></li>
                <li><span>结算周期：</span><span>{{Detail.payModeName}}</span></li>
                <li><span>付款账号：</span><span>原路返回</span></li>
            </ul>
            <ul>
                <li><span>结算周期开始时间：</span><span>{{Detail.startTime}}</span></li>
                <li><span>结算周期结束时间：</span><span>{{Detail.endTime}}</span></li>
            </ul>
            <el-button v-if="isAuditShow==true" type="primary" style="margin:0 0 10px 40px" @click="dialogFormVisible=true">审批</el-button>
        </div>
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <!--<el-form-item label="起止时间">-->
                    <!--<el-date-picker-->
                        <!--v-model="createTime"-->
                        <!--type="daterange"-->
                        <!--placeholder="选择日期范围"-->
                        <!--@change="logTimeChange" :picker-options="pickerOptions0">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="订单号：">
                    <el-input v-model="orderId" placeholder="请输入订单号" style="width: 180px" @change="handleOrderId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button type="primary" class="green" @click="exportExcel">导出订单Excel</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
            v-loading.body="loading"
            :data="tableData"
            style="width: 100%">
            <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" align="center">
                <template slot-scope="scope">
                    <span
                        v-if="column.dataIndex=='amountValue' && scope.row['amountValue']">
                        {{scope.row['amountValue'] | kb}}
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
        <el-dialog title="审批" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="">
                    此操作将审批该记录, 是否继续？
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="danger" @click="auditFlase">拒 绝</el-button>
                <el-button type="primary" @click="auditTrue">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import api from '../../../assets/config/m-api.js'
    import { paymentDetail } from '../../../assets/staticData/finance.js'
    import listPagination from '../../common/list-pagination.vue'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                dialogFormVisible: false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                //是否显示
                isAuditShow:false,
                //表单头部
                columns: paymentDetail.tableColumns,
                //表单详情数据
                tableData: [],
                //面包屑
                crumbs:paymentDetail.crumbs,
                currentPage4: 1,
                //时间值
                createTime:[],
                //订单号
                orderId:'',
                //提交的表单
                form:{
                    type:'Payment',
                    settlementId:this.$route.query.settlementId
                },
                //初始页码
                currentPage: 1,
                //分页数据
                pagination:{},
                //加载
                loading: true,
                //详情数据
                Detail:{},
                //导出excel传的参，在搜索按钮点击之后
                excelData:{
                    type:'Payment',
                    settlementId:this.$route.query.settlementId
                }
            };
        },
        components:{
            listPagination
        },
        created(){
            switch (this.$route.query.type){
                case 'Audit':
                    this.isAuditShow = true;
                    break;
                case 'Detail':
                    this.isAuditShow = false;
                    break;
            }
            //列表
            this.getData()
            //详情
            this.getDataDetail();
        },
        methods: {
            //获取数据
            getData(){
                this.loading = true;
                this.$http.get(['financialPayments'],{
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
            //详情
            getDataDetail(){
                this.$http.get(['financialSettlementsDetail',this.$route.query.sid],{

                })
                    .then((result) => {
                        if(result.body.code == 200){
                            this.Detail = result.body.data;
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
            //订单号
            handleOrderId(val){
                this.form.orderId = val;
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
                window.open(encodeURI(api.financialSettlementsDetail.url+'detail/excel?' + queryString), '_blank')
            },
            //审批确定
            auditTrue(){
                this.getDataAuditTrue();
            },
            //审批拒绝
            auditFlase(){
                this.getDataAuditFlase();
            },
            //审批同意请求
            getDataAuditTrue(){
                this.$http.put(['financialAudit',this.$route.query.sid, '?pass=', true])
                    .then((result) => {
                        if(result.body.code === 200){
                            this.$message({type: 'success', message: '审批成功'});
                            setTimeout(()=>{
                                this.$router.go(-1)
                            },1000);
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //审批拒绝请求
            getDataAuditFlase(){
                this.$http.put(['financialAudit',this.$route.query.sid, '?pass=', false])
                    .then((result) => {
                        if(result.body.code == 200){
                            this.$message({type: 'warning', message: '审批拒绝'});
                            setTimeout(()=>{
                                this.$router.go(-1)
                            },1000);
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //查询
            handleSearch(){
                this.form.pageIndex = 1;
                this.form.pageSize = 10;
                this.excelData = this.form;
                this.getData();
            }
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
        }
    };
</script>
<style scoped>
    .receiptDetail{
        overflow: hidden;
    }
    .receiptDetail ul{
        float: left;
        margin:0 65px 20px 0;

    }
    .receiptDetail ul li{
        font-size: 13px;
        color: #333333;
        padding: 10px;
    }
    .green{
        background-color: #55B055;
        border: 1px solid #55B055;
    }
</style>
