<template>
    <el-form class="shop-coupons" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="110px">
        <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入活动名称" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="beginTime" class="is-required">
            <el-date-picker 
                v-model="ruleForm.activityTime" 
                type="datetimerange" 
                placeholder="请选择活动时间" 
                :picker-options="pickerOptions"
                @change="handleActivityTime">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="领取方式" prop="gainType">
            <el-select v-model="ruleForm.gainType" placeholder="请选择领取方式" clearable>
                <el-option label="客户领取" :value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发行数量" prop="maxNum">
            <el-input type="number" v-model="ruleForm.maxNum" placeholder="请输入发行数量"></el-input>
        </el-form-item>
        <el-form-item label="领券对象" prop="userType">
            <el-select v-model="ruleForm.userType" placeholder="请选择领券对象" clearable>
                <el-option label="不限" :value="0"></el-option>
                <el-option label="太平客户" :value="1"></el-option>
            </el-select>
        </el-form-item>
        <template>
            <el-form ref="childForm" :model="ruleForm.rules[0]" :rules="childRules" label-width="110px">
                <el-form-item label="面额" prop="discountAmount">
                    <el-input type="number" v-model="ruleForm.rules[0].discountAmount"></el-input>
                </el-form-item>
                <el-form-item label="最低订单金额" prop="limitCondition">
                    <el-input type="number" v-model="ruleForm.rules[0].limitCondition"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <div style="text-align: center; margin-top: 30px;">
            <el-button type="success" @click="handleSubmitForm(1)" :loading="btnLoading1">立即发布</el-button>
            <el-button type="primary" @click="handleSubmitForm(0)" :loading="btnLoading0">保存草稿</el-button>
            <el-button type="default" @click="$router.go(-1)">取消</el-button>
        </div>
    </el-form>
</template>

<script>
    import validator from '../../../assets/unit/validator.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'
    
    export default {
        data() {
            const rules = {
                name: [{
                    required: true,
                    message: '请输入活动名称',
                    trigger: 'blur'
                }],
                beginTime: [{
                    required: true,
                    message: '请选择活动时间',
                    trigger: 'blur'
                }],
                gainType: [{
                    type: 'number',
                    required: true,
                    message: '请选择领取方式',
                    trigger: 'blur'
                }],
                maxNum: [{
                    required: true,
                    message: '请输入发行数量',
                    trigger: 'blur'
                },{
                    validator: validator.validNumber,
                    message: '只能输入正整数，不能输入小数',
                    trigger: 'blur'
                },{
                    validator: validator.validRange(300),
                    message: '发行数量最多不超过300张',
                    trigger: 'blur'
                }],
                userType: [{
                    type: 'number',
                    required: true,
                    message: '请选择领取对象',
                    trigger: 'blur'
                }]
            };
            const childRules = {
                discountAmount: [{
                    required: true,
                    message: '请输入面额',
                    trigger: 'blur'
                },{
                    validator: validator.validNumber,
                    message: '请输入数字类型',
                    trigger: 'blur'
                }],
                limitCondition: [{
                    required: true,
                    message: '请输入最低订单金额',
                    trigger: 'blur'
                },{
                    validator: validator.validNumber,
                    message: '请输入数字类型',
                    trigger: 'blur'
                },{
                    validator: this.validRange,
                    message: '最低订单金额必须大于1，且要大于面额',
                    trigger: 'blur'
                }]
            };
            return {
                ruleForm: {                       // 表单
                    shopId: null,
                    type: null,
                    beginTime: null,
                    endTime: null,
                    state: null,
                    maxNum: null,
                    rules: [{
                        discountAmount: null,
                        limitCondition: null,
                    }],
                    activityTime: [],
                },                                
                rules: rules,
                childRules: childRules,
                pickerOptions: {                  // 控制禁止选择的时间
                    disabledDate: this.setDisabledDate,
                },
                // 按钮加载中
                btnLoading0: false,
                btnLoading1: false,
            }
        },
        
        methods: {
            // 只能选择今天之后的时间
            setDisabledDate(date) {
                return ((new Date()).getTime() - 24*60*60*1000) > (new Date(date)).getTime();
            },
            // 拆分时间
            handleActivityTime(datetime) {
                const index = datetime.indexOf(' - ');
                this.ruleForm.beginTime = datetime.slice(0, index);
                this.ruleForm.endTime = datetime.slice(index + 3);
            },
            // 发布或草稿
            handleSubmitForm(state) {
                this.ruleForm.state = state;
                this.ruleForm.allMerchandise = true;
                this.$refs.ruleForm.validate((valid) => {
                    if(valid) {
                        this.$refs.childForm.validate((valid) => {
                            if(valid) {
                                this['btnLoading' + state] = true;
                                pubObj.httpRequest(this, {
                                    url: ['merchantPromo'],
                                    method: 'POST',
                                    body: this.ruleForm,
                                    complete(result) {
                                        this.$message.warning(result.message);
                                        this['btnLoading' + state] = false;
                                    },
                                    success(result) {
                                        this.$message.success(result.message);
                                        setTimeout(() => {
                                            this['btnLoading' + state] = false;
                                            this.$router.go(-1);
                                        }, 1000)
                                    }
                                })
                            } else {
                                return false;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 验证最低订单金额大于1且大于面额
            validRange(rule, value, callback) {
                const val = parseInt(value);
                const discountAmount = parseInt(this.ruleForm.rules[0].discountAmount);
                if(val > 0 && val > discountAmount) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            }
        },
        
        created() {
            this.ruleForm.shopId = this.$root.shopInfo.sid;
            this.ruleForm.type = this.$route.query.type;
        }
    }
</script>

<style>
    .shop-coupons .el-form-item { width: 800px; margin: auto; margin-bottom: 22px; }
</style>