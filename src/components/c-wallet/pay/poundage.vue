<template>
    <div class="poundage">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户资金管理</el-breadcrumb-item>
                <el-breadcrumb-item>平台手续费设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">平台手续费设置</div>
        <!--设置-->
        <div class="detail-wrap" v-loading.body="loading">
            <el-form :model="rechargeForm" ref="rechargeForm" :rules="rules" label-width="148px">
                <h4 class="formItem-title">充值手续费设置</h4>
                <el-form-item label="用户充值手续费" prop="fee">
                    <el-input 
                        type="number" 
                        v-model="rechargeForm.fee" 
                        style="width: 180px"
                        @change="(val) => { handleFeeChange(val, 'rechargeForm') }">
                    </el-input> %
                </el-form-item>
                <el-form-item label="充值手续费承担方" prop="undertaker">
                    <el-radio-group v-model="rechargeForm.undertaker">
                        <el-radio label="1">用户</el-radio>
                        <el-radio label="2">言味平台</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form :model="withdrawForm" ref="withdrawForm" :rules="rules" label-width="148px">
                <h4 class="formItem-title">提现手续费设置</h4>
                <el-form-item label="用户提现手续费" prop="fee">
                    <el-input 
                        type="number" 
                        v-model="withdrawForm.fee" 
                        style="width: 180px"
                        @change="(val) => { handleFeeChange(val, 'withdrawForm') }">
                    </el-input> %
                </el-form-item>
                <el-form-item label="提现手续费承担方" prop="undertaker">
                    <el-radio-group v-model="withdrawForm.undertaker">
                        <el-radio label="1">用户</el-radio>
                        <el-radio label="2">言味平台</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleSubmitForm(['rechargeForm', 'withdrawForm'])" class="confirm-btn">确认</el-button>
        </div>
    </div>
</template>

<script>
    import { pubObj } from '@/assets/unit/public.js'
    
    export default {
        name: 'Poundage',
        
        data() {
            const rules = {
                fee: [{
                    type: 'number', required: true, message: '请输入手续费', trigger: 'blur'
                }, {
                    validator: this.validateNumber, trigger: 'blur'
                }],
                undertaker: [{
                    required: true, message: '请选择手续费承担方', trigger: 'blur'
                }]
            };
            
            return {
                // 充值
                rechargeForm: {},
                // 提现
                withdrawForm: {},
                rules: rules,
                loading: true,
            }
        },
        
        methods: {
            // 获取数据
            handleGetFormData() {
                pubObj.httpRequest(this, {
                    url: ['rateSettingList'],
                    method: 'POST',
                    success(result) {
                        result.data.forEach((item) => {
                            item.undertaker = String(item.undertaker);
                            if(item.code === 'user_recharge_fee') {
                                this.rechargeForm = item;
                            } else {
                                this.withdrawForm = item;
                            }
                        })
                    }
                })
            },
            // string转换number
            handleFeeChange(val, formName) {
                this[formName].fee = parseFloat(val);
            },
            // 提交确认
            handleSubmitForm(formNameArr) {
                // 充值
                let rechargeBool = false;
                let withdrawBool = false;
                this.$refs[formNameArr[0]].validate((valid) => {
                    if(valid) {
                        rechargeBool = true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                // 提现
                this.$refs[formNameArr[1]].validate((valid) => {
                    if(valid) {
                        withdrawBool = true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                // 都验证通过
                if(rechargeBool && withdrawBool) {
                    pubObj.httpRequest(this, {
                        url: ['rateSettingEdit'],
                        method: 'POST',
                        body: {
                            list: [this.rechargeForm, this.withdrawForm]
                        },
                        success(result) {
                            this.$message.success(result.message);
                            this.handleGetFormData();
                        }
                    })
                }
            },
            // 自定义验证
            validateNumber(rule, value, callback) {
                const valueLength = value.length;
                value = parseFloat(value);
                if(value < 0 || value > 10) {
                    callback('请输入0-10的数字');
                } else if(valueLength > 4) {
                    callback('请保留两位小数');
                } else {
                    callback();
                }
            }
        },
        
        mounted() {
            // 加载数据
            this.handleGetFormData();
        }
    }
</script>

<style scoped>
    .poundage .formItem-title {
        margin-bottom: 28px;
    }
    .poundage .formItem-title~.formItem-title {
        margin-top: 28px;
    }
    .poundage .el-form-item {
        margin-bottom: 14px;
    }
    .poundage .confirm-btn { margin-left: 148px; margin-top: 30px; }
</style>