<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="rate-info">
            <el-form :model="formInfo" :rules="rules" ref="ruleForm" label-width="110px">
                <div class="detail-title">基础信息</div>
                <div class="detail-wrap">
                    <el-form-item label="费率编号" label-width="108px" prop="number">
                        <el-input v-model="formInfo.number"></el-input>
                    </el-form-item>
                    <el-form-item label="费率名称" label-width="108px" prop="name">
                        <el-input v-model="formInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="付费方" label-width="108px" prop="payObjectSid">
                        <el-select  v-model="formInfo.payObjectSid" placeholder="请选择">
                            <el-option v-for="(item,index) in Buyer" :key="index" :label="item.name" :value="item.merchantSid"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收费方" label-width="108px" prop="chargeType">
                        <el-select v-model="formInfo.chargeType" placeholder="请选择">
                            <el-option label="通联支付" value="TongLian"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付渠道" label-width="108px" prop="payChannel">
                        <el-select v-model="formInfo.payChannel" placeholder="请选择">
                            <el-option label="微信支付" value="Weixinpay"></el-option>
                            <el-option label="支付宝" value="Alipay"></el-option>
                            <el-option label="B2C网关" value="B2CGateWay"></el-option>
                            <el-option label="B2B网关" value="B2BGateWay"></el-option>
                            <el-option label="代付" value="ReplacePay"></el-option>
                            <el-option label="通联快捷支付" value="RealNamePay"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单类型" label-width="108px" prop="orderGenre">
                        <el-select v-model="formInfo.orderGenre" placeholder="请选择">
                            <el-option label="支付订单" value="Payment"></el-option>
                            <el-option label="用户充值订单" value="UserRecharge"></el-option>
                            <el-option label="商家充值订单" value="Recharge"></el-option>
                            <el-option label="提现订单" value="Withdraw"></el-option>
                            <el-option label="转账订单" value="Transfer"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="固定费率" label-width="108px">
                        <el-radio-group v-model="formInfo.mode" style>
                            <el-radio :label="'Rate'">按订单金额<br/></el-radio>
                            <el-radio :label="'OnceCharge'">按笔收取</el-radio>
                        </el-radio-group>
                        <el-form-item class="samllInput" v-if="formInfo.mode==='OnceCharge'" prop="money">
                            每笔 <el-input :maxlength="13" v-model="formInfo.money" @change="handleMoney"></el-input> 元
                        </el-form-item>
                        <el-form-item class="samllInput" v-if="formInfo.mode==='Rate'" prop="rate">
                            <el-input :maxlength="5" v-model="formInfo.rate"  @change="handleRate"></el-input> %
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="收费日期" class="ipayDate" prop="createTime">
                        <el-date-picker
                            v-model="formInfo.createTime"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="logTimeChange" :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="merchant-info" v-if="type==='edit'">
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
            if(this.type==='edit'){
                this.ajaxDetail();
                this.getDataLogs();
            }
            this.ajaxBill();
        },
        components:{
            listPagination
        },
        methods: {
            //起止时间选择
            logTimeChange(datetime) {
                const index = datetime.indexOf(' - ');
                this.formInfo.startTime = datetime.slice(0, index);
                this.formInfo.endTime = datetime.slice(index + 3);
            },
            handleRate(val){
                this.formInfo.rateValue = val;
            },
            handleMoney(val){
                this.formInfo.rateValue = val;
            },
            //提交确定
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //接口状态200弹窗移除
                        switch (this.type){
                            case 'add':
                                this.ajaxAdd();
                                break;
                            case 'edit':
                                this.ajaxEdit();
                                break;
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //付费方--银行账户管理-全部-接口
            ajaxBill(){
                this.$http.get(['accountCompanyAll'])
                .then((result) => {
                    if(result.body.code == 200){

                        this.Buyer = result.body.data;
                        console.log(this.Buyer)
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //新增请求
            ajaxAdd(){
                this.$http.post(['financialRate'],this.formInfo)
                .then((result) => {
                    if(result.body.code == 200){
                        this.$message({type: 'success', message: '新增成功!'});
                        setTimeout(()=>{
                            this.$router.go(-1);
                        },1000)
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //修改请求
            ajaxEdit(){
                this.$http.put(['financialRate','/',this.$route.query.sid],this.formInfo)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.$message({type: 'success', message: '修改成功!'})
                            setTimeout(()=>{
                                this.$router.go(-1);
                            },1000)
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //查看详情
            ajaxDetail(){
                this.$http.get(['financialRate','/',this.$route.query.sid])
                    .then((result) => {
                        if(result.body.code == 200){
                            let data =  result.body.data;
                            data.createTime = [data.startTime,data.endTime];
                            this.formInfo = result.body.data;
                            switch (data.mode){
                                case 'Rate':
                                    this.formInfo.rate = data.rateValue;
                                    break;
                                case 'OnceCharge':
                                    this.formInfo.money = data.rateValue;
                                    break;
                            }
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
