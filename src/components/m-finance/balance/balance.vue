<template>
    <div class="balance">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="merchant-info">
            <el-form :model="tableData"  label-width="110px"  v-loading.body="loading">
                <div class="detail-title">账户信息</div>
                <div class="detail-wrap">
                    <el-form-item label="商户">
                        <span>{{ tableData.name }}</span>
                    </el-form-item>
                    <el-form-item label="账户总金额">
                        <span
                            v-if="tableData.balance || tableData.balance==='0.00'">
                            {{tableData.balance | kb}}元
                        </span>
                        <span v-else>查询失败</span> &nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button type="primary" @click="handleDetail">查看明细</el-button>
                        <!--是否可以充值-->
                        <el-button type="primary"
                                   @click="handleRecharge"
                                   v-if="tableData.canDeposit == true && (tableData.balance || tableData.balance==='0.00')">充值
                        </el-button>
                        <!--是否可以提现-->
                        <el-button
                            v-if="tableData.canWithdraw  == true && (tableData.balance || tableData.balance==='0.00')"
                            type="primary"
                            @click="dialogVisibleWithdraw=true"
                            :disabled="tableData.balance==='0.00'">提现
                        </el-button>
                        <el-button type="primary" @click="handleTransfer">转账</el-button>
                    </el-form-item>
                    <el-form-item label="冻结金额">
                        <span>{{ tableData.frozenBalance }}元</span>
                    </el-form-item>
                    <el-form-item label="结算方式" >
                        <span v-if="tableData.canWithdraw==true">手动</span>
                        <span v-else>自动</span>
                    </el-form-item>
                    <el-form-item label="提现方式">
                        <span>{{tableData.settlementType}}</span>
                    </el-form-item>
                    <el-form-item label="开户行">
                        <span>{{tableData.bank}}</span>
                    </el-form-item>
                    <el-form-item label="银行账户">
                        <span>{{tableData.accountNo}}</span>
                    </el-form-item>
                </div>
            </el-form>
            <!--充值-->
            <el-dialog class="bankDialog" title="充值" v-model="dialogVisible" @close="closeCallBack()" >
                <el-form :model="form" :rules="rules" ref="ruleForm">
                    <el-form-item label="账户余额" label-width="84px">
                        <span class="red">{{tableData.balance | kb }}</span>元
                    </el-form-item>
                    <el-form-item label="充值金额" label-width="84px" prop="amount">
                        <el-input :maxlength="13" @keyup.native="form.amount = pubObj.formatFloat($event)" v-model="form.amount" auto-complete="off" style="width: 200px"></el-input> 元
                    </el-form-item>
                    <el-tabs :value="form.payType" @tab-click="handleTabClick">
                        <el-tab-pane name="b2cPersonalDebit" label="网银支付" v-if="accountMsg == true">
                            <el-form-item label="" label-width="0" prop="bank">
                                <div class="bankImg" v-for="item in banksPersonal" v-loading.body="loadingBank">
                                    <el-radio
                                        class="radio"
                                        v-model="form.bank"
                                        :label="item.shortName">
                                        <img :src="'../../../../static/bank/'+item.shortName+'.png'" :alt="item.name">
                                    </el-radio>
                                </div>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane name="b2bEnterprise" label="企业网银">
                            <el-form-item label="" label-width="0" prop="bank">
                                <div class="bankImg" v-for="item in banksEnter" v-loading.body="loadingBank">
                                    <el-radio
                                        class="radio"
                                        v-model="form.bank"
                                        :label="item.shortName">
                                        <img :src="'../../../../static/bank/'+item.shortName+'.png'" :alt="item.name">
                                    </el-radio>
                                </div>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureFrom('ruleForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!--提现-->
            <el-dialog class="bankDialog" title="提现" v-model="dialogVisibleWithdraw" @close="closeCallBackWithdraw()">
                <el-form :model="formWithdraw" :rules="rules" ref="formWithdraw">
                    <el-form-item label="账户余额" label-width="84px">
                        <span class="redActive">{{tableData.balance  | kb}}</span>元
                    </el-form-item>
                    <el-form-item label="提现金额" label-width="105px" prop="amount">
                        <el-input :maxlength="13" @keyup.native="formWithdraw.amount = pubObj.formatFloat($event)" v-model="formWithdraw.amount" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="交易密码" label-width="105px" prop="password">
                        <el-input :maxlength="20" type="password" v-model="formWithdraw.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" label-width="105px">{{tableData.bindingPhone | phone}}
                    </el-form-item>
                    <el-form-item label="短信验证码" label-width="105px">
                        <el-input v-model="formWithdraw.verificationCode" auto-complete="off" style="width: 200px"></el-input>
                        <el-button type="primary" v-if="verifyState==false" @click="handleVerification('formWithdraw')">发送验证码</el-button>
                        <el-button type="primary" v-if="verifyState==true" @click="handleVerification">{{sixtySecond}}S后重发</el-button>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleWithdraw = false">取 消</el-button>
                    <el-button type="primary" @click="sureFromWithdraw('formWithdraw')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import { balanceList } from '../../../assets/staticData/finance.js'
    import { pubObj } from '../../../assets/unit/public.js'
    import sha1 from 'sha1'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                pubObj,
                //提交表单
                form: {
                    amount:'',
                    bank: '',
                    merchantSid:"ooWP1h",
                    payType:"b2bEnterprise",
                    payMethod:"Gateway"
                },
                //面包屑
                crumbs:balanceList.crumbs,
                columns:[{
                    text: '操作人',
                    dataIndex: ''
                },{
                    text: '行为',
                    dataIndex: ''
                },{
                    text: '修改时间',
                    dataIndex: ''
                }],
                tableData:{},
                //充值弹层
                dialogVisible:false,
                //提现弹层
                dialogVisibleWithdraw:false,
                //个人银行列表
                banksPersonal:[],
                //企业银行列表
                banksEnter:[],
                //验证规则
                rules:balanceList.rules,
                //当前is太平登录
                accountMsg:true,
                //提现表单
                formWithdraw:{},
                //发送验证码状态
                verifyState:false,
                //秒
                sixtySecond:60,
                //获取验证码之后储存订单id
                orderSid:'',
                loading:true,
                loadingBank:true
            }
        },
        filters: {
            kb(money){
                if (money) {
                    var re = /\d{1,3}(?=(\d{3})+$)/g;
                    var money = money.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
                        return s1.replace(re, "$&,") + s2;
                    });
                    return money;
                }
            },
            phone(phone){
                if(phone){
                    phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                    return phone;
                }
            }
        },
        created(){
            this.getData();
            //银行列表
            this.getBanks();
            //如果充值成功状态okd
            let str = this.getUrlParam();
            if(str.rps){
                let strObject = JSON.parse(str.rps)
                if(strObject.status === 'OK'){
                    this.$router.push({
                        path: '/m_finance/account',
                        query: {
                            btn:'ooBXqe'
                        }
                    })
                    this.$message({type: 'success', message: '操作充值成功,余额更新稍有延迟'})
                }
            }
        },
        methods:{
            // 转账
            handleTransfer() {
                this.$router.push({
                    name: 'WalletTransfer'
                });
            },
            handleTabClick(pane) {
                this.form.payType = pane.name;
            },
            //关闭回调，重置表单 --- 充值
            closeCallBack() {
                this.$refs['ruleForm'].resetFields();
                this.form.bank = '';
                this.form.amount = '';
            },
            //关闭回调，重置表单 --- 提现
            closeCallBackWithdraw() {
                this.$refs['formWithdraw'].resetFields();
                this.formWithdraw.amount = '';
                this.formWithdraw.verificationCode= '';
                this.formWithdraw.password ='';
            },
            //账户总览
            getData(){
                this.$http.get(['financialSummary'])
                    .then((result) => {
                        if(result.body.code == 200){
                            this.tableData = result.body.data;
                            this.loading = false;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //银行列表
            getBanks(){
                this.$http.get(['financialBanks'])
                    .then((result) => {
                        if(result.body.code == 200){
                            let person = result.body.data.b2cPersonalDebit;
                            let enter = result.body.data.b2bEnterprise;
                            //如果存在个人网银
                            if(person){
                                this.banksPersonal = person;
                                this.form.payType = 'b2cPersonalDebit';
                            }else{
                                this.accountMsg = false;
                            }
                            if(enter){
                                this.banksEnter = enter;
                            }
                            this.loadingBank = false;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //充值按钮
            handleRecharge(){
                this.dialogVisible=true;
            },
            //获取地址栏中url参数
            getUrlParam() {
                var parameter = new Object();
                var name,value;
                var str = decodeURIComponent(window.location.href);
                var num = str.split("?");
                str = num[num.length-1];
                var arr = str.split("&");
                for(var i=0;i < arr.length;i++){
                    num=arr[i].indexOf("=");
                    if(num>0){
                        name=arr[i].substring(0,num);
                        value=arr[i].substr(num+1);
                        parameter[name] = value;
                    }
                }
                return parameter;
            },
            //详情
            handleDetail(){
                this.$router.push({path:'/m_finance/transaction',
                    query: {
                        type:'fund'
                    }
                })
            },
            //确定充值
            sureFrom(ruleForm){
                console.log(this.form)
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$router.push({
                            path: '/m_finance/bankpay',
                            query: this.form,
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //确定提现
            sureFromWithdraw(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.orderSid==''){
                            this.$message({type: 'warning', message: '请先获取验证码'});
                        }else{
                            this.encryptPassword(this.ajaxWithdraw);
                        }
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //确定提现请求
            ajaxWithdraw(obj){
                let form = {
                    orderSid:this.orderSid,
                    verificationCode:this.formWithdraw.verificationCode
                }
                Object.assign(form, obj);
                this.$http.post(['financialWithdrawPay'],form)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.$message({type: 'success', message: result.body.message});
                            this.dialogVisibleWithdraw = false;
                            this.getData();
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 密码加密
            encryptPassword(callback) {
                // step1: 获取服务器标准时间戳
                pubObj.httpRequest(this, {
                    url: ['financialPlatform', '/timestamp'],
                    success(result) {
                        const timestamp = result.data;
                        // step2: sha1加密明文密码
//                        const sha1 = require('sha1');
                        const passwordStr = sha1(this.formWithdraw.password);
                        // step3: sha1加密（step2得到的字符串和时间戳拼接字符串）
                        let encryptObj = {
                            timestamp: timestamp,
                            sign: sha1(passwordStr + timestamp)
                        }
                        // 执行回调
                        callback(encryptObj);
                    }
                })
            },
            //发送验证码
            handleVerification(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 密码加密
                        this.encryptPassword(this.ajaxCode);
                        /*this.ajaxCode();*/
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //发送验证码请求
            ajaxCode(obj){
                Object.assign(this.formWithdraw, obj);
                this.$http.post(['financialWithdrawApply'],this.formWithdraw)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.$message({type: 'success', message: '发送成功'})
                            this.orderSid = result.body.data;
                            this.verifyState = true;
                            let timer = null;
                            timer=setInterval(()=>{
                                this.sixtySecond--;
                                if(this.sixtySecond==0){
                                    clearInterval(timer)
                                    this.verifyState = false;
                                    this.sixtySecond = 60;
                                }
                            },1000)
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>
<style>
    .balance .red{
        color: red;
    }
    .bankImg{
        float: left;
        width: 160px;
        height: 30px;
        border:1px solid #ccc;
        margin:0 20px 20PX 0;
        padding: 0 5px;
    }
    .bankImg img{
        vertical-align: text-bottom;
        height: 20px;
    }
    .redActive{
        color: #ea1a22;
    }
</style>

