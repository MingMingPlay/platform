<template>
    <el-form ref="childForm" :inline="true" :model="childForm" :rules="rules" label-width="40px">
        <el-form-item label="满" prop="limitCondition">
            <el-input type="number" v-model="childForm.limitCondition"></el-input>
        </el-form-item>
        <span>元减</span>
        <el-form-item prop="discountAmount">
            <el-input type="number" v-model="childForm.discountAmount"></el-input>
        </el-form-item>
        <span>元</span>
        <!--加-->
        <el-button 
            type="text" 
            style="margin-left: 20px;"
            v-if="childKey === 0"
            @click="handleAddChildForm"
        >[<i class="el-icon-plus"></i>]
        </el-button>
        <!--减-->
        <el-button 
            type="text" 
            style="margin-left: 20px;"
            v-else
            @click="handleDelChildForm"
        >[<i class="el-icon-minus"></i>]
        </el-button>
    </el-form>
</template>

<script>
    import validator from '../../../../assets/unit/validator.js'
    
    export default {
        componentName: 'childForm',
        
        inject: ['root', 'parent'],
        
        props: {
            childKey: Number,
            charcode: Number,
            required: Boolean,
        },
        
        data() {
            return {
                childForm: {
                    limitCondition: null,
                    discountAmount: null,
                },
                rules: {},
                requiredRules: {
                    limitCondition: [{
                        required: true,
                        message: '请输入限制条件（多少元）',
                        trigger: 'blur'
                    }],
                    discountAmount: [{
                        required: true,
                        message: '请输入限制条件（多少元）',
                        trigger: 'blur'
                    }]
                },
                commonRules: {
                    limitCondition: [{
                        validator: this.limitConditionIncreasing,
                        message: '请输入有效的数据，金额逐步递增',
                        trigger: 'blur'
                    }],
                    discountAmount: [{
                        validator: this.discountAmountIncreasing,
                        message: '请输入有效的数据，金额逐步递增',
                        trigger: 'blur'
                    }, {
                        validator: this.discountAmountLtLimitCondition,
                        message: '当前数额应该小于前者数额',
                        trigger: 'blur'
                    }]
                },
                isDisabled: true,
                isShow: true,
            }
        },
        
        watch: {
            childForm: {
                handler: function (form) {
                    const bool = Object.keys(form).every(key => {
                        return form[key];
                    });
                    if(bool) {
                        const _this = this.root;
                        _this.$set(_this.ruleForm.rules, this.childKey, form);
                    }
                    else this.isDisabled = true;
                },
                deep: true,
            }
        },
        
        methods: {
            // 上一个
            getPrevSibling() {
                const num = this.childKey;
                const charcode = this.charcode;
                if(num === 0) return null;
                else {
                    let refName = String.fromCharCode(charcode - 1);
                    return this.parent.$refs[refName];
                }
            },
            // 下一个
            getNextSibling(num) {
                const charcode = this.charcode;
                let refName = String.fromCharCode(charcode + num);
                return this.parent.$refs[refName];
            },
            // 动态操作rules
            handleActiveRules(required) {
                const requiredRules = this.requiredRules;
                const commonRules = this.commonRules;
                if(required) {
                    Object.keys(commonRules).forEach(key => {
                        this.rules[key] = commonRules[key].concat(requiredRules[key]);
                    });
                }
            },
            // 金额递增
            limitConditionIncreasing(rule, value, callback) {
                const sibling = this.getPrevSibling();
                if(sibling) {
                    if(parseInt(sibling.childForm.limitCondition) > parseInt(value)) {
                        callback(new Error(rule.message));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            // 金额递增
            discountAmountIncreasing(rule, value, callback) {
                const sibling = this.getPrevSibling();
                if(sibling) {
                    if(parseInt(sibling.childForm.discountAmount) > parseInt(value)) {
                        callback(new Error(rule.message));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            // 小于前者
            discountAmountLtLimitCondition(rule, value, callback) {
                const limitCondition = this.childForm.limitCondition;
                const discountAmount = this.childForm.discountAmount;
                if(parseInt(discountAmount) > parseInt(limitCondition)) {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            },
            // 添加
            handleAddChildForm() {
                if(this.parent.currentChild === 4) {
                    this.$message.info('最多只能添加五条规则！');
                    return;
                } else {
                    this.handleValidate(function() {
                        const _this = this.parent;
                        _this.$set(_this.showList, _this.currentChild, true);
                        this.getNextSibling(_this.currentChild).handleActiveRules(true);
                    });
                }
            },
            // 删除
            handleDelChildForm() {
                this.$refs.childForm.resetFields();
                this.rules = JSON.parse(JSON.stringify(this.commonRules));
                const _this = this.parent;
                _this.$set(_this.showList, this.childKey - 1, false);
            },
            // 验证
            handleValidate(callback) {
                this.$refs.childForm.validate((valid) => {
                    if(valid) {
                        callback.call(this);
                    } else {
                        this.parent.$set(this.parent.validList, this.childKey, false);
                        return false;
                    }
                });
            }
        },
        
        created() {
            this.handleActiveRules(this.required);
        }
    }
</script>