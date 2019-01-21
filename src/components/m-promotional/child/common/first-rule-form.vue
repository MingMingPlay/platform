<template>
	<el-form ref="childForm" :inline="true" :model="childForm" :rules="rules" label-width="40px">
        <el-form-item label="满" prop="limitCondition">
            <el-input type="number" v-model="childForm.limitCondition"></el-input>
        </el-form-item>
        <span>件</span>
        <el-form-item prop="discountAmount">
            <el-input type="number" v-model="childForm.discountAmount"></el-input>
        </el-form-item>
        <span>元</span>
        <!--<el-checkbox class="font-size" v-model="checked">免运费</el-checkbox>-->
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
				    shippingFree: null,
				},
				rules: {},
				requiredRules: {
                    limitCondition: [{
                        required: true,
                        message: '请输入限制条件（多少件）',
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
                        validator: validator.validRange(100),
                        message: '件数只能是1~100之间的整数',
                        trigger: 'blur'
                    }, {
                        validator: this.limitConditionIncreasing,
                        message: '请输入有效的数据，件数逐步递增',
                        trigger: 'blur'
                    }],
                    discountAmount: [{
                        validator: this.discountAmountGt0,
                        message: '输入金额必须大于0元',
                        trigger: 'blur'
                    }, {
                        validator: this.discountAmountIncreasing,
                        message: '请输入有效的数据，金额逐步递增',
                        trigger: 'blur'
                    }]
                },
				checked: false,
				isDisabled: true,
				isShow: true,
			}
		},
		
		watch: {
		    checked(val) {
		        val ? this.childForm.shippingFree = 0 : this.childForm.shippingFree = 1;
		    },
		    childForm: {
		        handler: function (form) {
		        	const bool = Object.keys(form).every(key => {
		        	    if(key == 'shippingFree') return true;
		        	    else return form[key];
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
		    // 件数递增
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
		    // 金额大于0
		    discountAmountGt0(rule, value, callback) {
		        value = parseInt(value);
                if(value === 0 || value < 0) {
                    callback(new Error(rule.message));
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