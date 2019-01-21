<template>
    <div class="pageInfo">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div>
            <el-form :model="formInfo" :rules="rules" ref="ruleForm" label-width="110px">
                <div class="detail-title">商户信息录入</div>
                <div class="detail-wrap">
                    <el-form-item label="企业名称" label-width="108px" prop="name">
                        <el-input v-model="formInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="营业执照" label-width="108px" prop="license">
                        <el-input :maxlength="16" v-model="formInfo.license"></el-input>
                    </el-form-item>
                    <el-form-item label="组织机构代码" label-width="108px" prop="organizationCode">
                        <el-input :maxlength="19" v-model="formInfo.organizationCode"></el-input>
                    </el-form-item>
                    <el-form-item label="法人姓名" label-width="108px" prop="legalName">
                        <el-input v-model="formInfo.legalName"></el-input>
                    </el-form-item>
                    <el-form-item class="pageInfoSelect" label="法人证件类型" label-width="108px" prop="identityType">
                        <el-select v-model="formInfo.identityType" placeholder="请选择">
                            <el-option label="身份证" value="IdentityCard"></el-option>
                            <el-option label="护照" value="Passport"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--身份证号码-->
                    <el-form-item v-if="formInfo.identityType == 'IdentityCard'" label="法人证件号码" label-width="108px" prop="identityCode">
                        <el-input v-model="formInfo.identityCode"></el-input>
                    </el-form-item>
                    <!--护照号码-->
                    <el-form-item v-if="formInfo.identityType == 'Passport'" label="法人护照号码" label-width="108px" prop="Passport">
                        <el-input :maxlength="10" v-model="formInfo.Passport"></el-input>
                    </el-form-item>
                    <el-form-item label="法人手机号码" label-width="108px" prop="legalPhone">
                        <el-input :maxlength="11" v-model="formInfo.legalPhone"></el-input>
                    </el-form-item>

                    <el-form-item label="开户行" label-width="108px" prop="parentBankName">
                        <el-input v-model="formInfo.parentBankName"></el-input>
                    </el-form-item>
                    <el-form-item label="收款人名称" label-width="108px" prop="accountName">
                        <el-input v-model="formInfo.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="开户支行" label-width="108px" prop="bankName">
                        <el-input v-model="formInfo.bankName"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账户" label-width="108px" prop="accountNo">
                        <el-input v-model="formInfo.accountNo"></el-input>
                    </el-form-item>
                    <el-form-item label="账户类型" label-width="108px">
                        <template  v-model="formInfo.type">
                            <el-radio class="radio" v-model="formInfo.type" label="Public">对公</el-radio>
                            <el-radio class="radio" v-model="formInfo.type" label="Private">对私</el-radio>
                        </template>
                    </el-form-item>
                    <el-form-item class="pageInfoSelect" label="结算对象" label-width="108px" prop="settlementObjectSid">
                        <el-select v-model="formInfo.settlementObjectSid" placeholder="请选择">
                            <el-option v-for="(item,index) in settlement" :key="index" 
                                :label="item.name" :value="item.sid"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="pageInfoSelect" label="商户" label-width="108px" prop="merchantSid">
                        <el-select v-model="formInfo.merchantSid" placeholder="请选择">
                            <el-option label="太平" value="_PJ"></el-option>
                            <el-option label="言味" value="zPcD"></el-option>
                            <!--<el-option label="测试1" value="JvZ5"></el-option>-->
                            <!--<el-option label="测试商户1" value="twm"></el-option>-->
                            <!--<el-option label="测试商户2" value="2wh"></el-option>-->
                            <!--<el-option label="测试商户3" value="nw"></el-option>-->
                            <!--<el-option label="测试商户4" value="Fw3"></el-option>-->
                            <!--<el-option label="测试商户5" value="Gib"></el-option>-->
                            <!--<el-option label="测试商户6" value="8iP"></el-option>-->
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import api from '../../../assets/config/c-api.js'
    import { bankList } from '../../../assets/staticData/finance.js'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //表单头部
                columns: bankList.tableColumns,
                //面包屑
                crumbs:bankList.crumbsInfo,
                //查询条件提交的表单
                form:{
                    bankAccount:'',
                },
                //结算对象
                settlement:[],
                //新增或修改提交表单
                formInfo:{
                    "merchantSid": "",   //oonP8X
                    "name": "",
                    "license": "",
                    "organizationCode": "",
                    "legalName": "",
                    "identityType": "IdentityCard",
                    "identityCode": "",
                    "legalPhone": "",
                    "parentBankName": "",
                    "bankName": "",
                    "accountNo": "",
                    "accountName": "",
                    "type": "Public",
                    "settlementObjectSid":'',
                    "settlementObjectName":''
                },
                //验证
                rules:bankList.rules,
                type:this.$route.query.type
            };
        },
        created(){
            switch (this.type){
                case 'edit':
                    //银行账户明细
                    this.ajaxSettlementDetail();
                    break;
                case 'add':
                    //结算对象列表不分页
                    this.ajaxSettlement();
                    break;
            }
        },
        methods: {
            //修改银行账户
            ajaxSettlementEdit(){
                this.$http.put(['accountCompanyDetail',this.$route.query.sid],this.formInfo)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.$message({type: 'success', message: '修改成功'})
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
            //银行账户明细
            ajaxSettlementDetail(){
                this.$http.get(['accountCompanyDetail',this.$route.query.sid])
                .then((result) => {
                    if(result.body.code == 200){
                        this.formInfo = result.body.data;
                        //结算对象列表不分页
                        this.ajaxSettlement();
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //结算对象列表不分页--获取未绑定的结算对象
            ajaxSettlement(){
                this.$http.get(['financialObject'],{params:{bounded:false}})
                .then((result) => {
                    if(result.body.code == 200){
                        this.settlement = result.body.data;
                        if(this.type==='edit'){
                            this.settlement.unshift({"sid":this.formInfo.settlementObjectSid,"name":this.formInfo.settlementObjectName})
                        }
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //新增
            ajaxSettlementAdd(){
                this.$http.post(['accountCompany'],this.formInfo)
                .then((result) => {
                    if(result.body.code == 200){
                        this.$message({type: 'success', message: result.body.message});
                        setTimeout(()=>{
                            this.$router.go(-1)
                        },1000)
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //提交确定
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //如果选择的是护照
                        if(this.formInfo.identityType == 'Passport'){
                            this.formInfo.identityCode = this.formInfo.Passport;
                        }
                        switch (this.type){
                            case 'add':
                                this.ajaxSettlementAdd();
                                break;
                            case 'edit':
                                this.ajaxSettlementEdit();
                                break;
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    };
</script>
<style scoped>
    .pageInfo .el-form-item .el-input{
        width: 400px;
    }
    .pageInfo .pageInfoSelect .el-input{
        width: 200px;
    }
</style>
