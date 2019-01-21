<template>
    <el-dialog title="确认退款" v-model="dialogVisible" :close-on-click-modal="false">
        <el-form ref="refundForm" :model="refundForm" :rules="rules" label-width="140px">
            <el-form-item label="订单总价">
                <span>￥{{ refundAmount }}</span>
                <span>(</span>
                <span>运费：￥{{ busArgs.shippingFee }}</span>
                <span>；</span>
                <span>商品总价：￥{{ busArgs.amount }}</span>
                <span>)</span>
            </el-form-item>
            <el-form-item prop="refundPrice">
                <template slot="label">
                    <el-tooltip effect="dark" placement="bottom">
                        <div slot="content">
                            <p style="margin-bottom: 5px;">用户使用钱包支付的订单，申请退款时，管理员可设置本次</p>
                            <p>退款金额，该金额会返回至该用户的钱包账户</p>
                        </div>
                        <i class="el-icon-information"></i>
                    </el-tooltip>请输入退款金额
                </template>
                <el-input type="number" v-model="refundForm.refundPrice" style="width: 100%;"></el-input>
            </el-form-item>
            <el-form-item label="退款备注">
                <el-input type="textarea" :maxlength="200" v-model="refundForm.content"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('refundForm')">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import api from '../../../../assets/config/c-api.js'
    import { pubObj, bus } from '../../../../assets/unit/public.js'

    export default {
        data() {
            const validatePrice = (rule, value, callback) => {
                var index = value.indexOf('.');
                if(index < 0);
                else {
                    var length = value.length;
                    var len = length - (index + 1);
                }
                if(value.match(/^\-/) == '-') {
                    callback(new Error('金额不允许出现负数！'));
                } else if(parseFloat(value) > this.refundAmount) {
                    callback(new Error('退款金额超过订单总价！'));
                } else if(parseFloat(value) < 0.01) {
                    callback(new Error('退款金额最小为 0.01！'));
                } else if(len > 2) {
                    callback(new Error('最多只保留两位小数！'));
                } else callback();
            };
            const rules = {
                refundPrice: [{
                    required: true,
                    message: '请输入退款金额'
                }, {
                    validator: validatePrice,
                    trigger: 'blur'
                }]
            }
            return {
                dialogVisible: false,
                refundForm: {},
                rules: rules,
                busArgs: {},
            }
        },
        mounted() {
            this.$nextTick(() => {
                bus.$on('open-confirm-dialog', (obj) => {
                    this.busArgs = obj;
                    this.dialogVisible = true;
                })
            })
        },
        computed: {
            refundAmount() {
                return (parseFloat(this.busArgs.actualAmount)).toFixed(2);
//              return (parseFloat(this.busArgs.amount) + parseFloat(this.busArgs.shippingFee)).toFixed(2);
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.refundForm.orderId = this.busArgs.orderId;
                        pubObj.httpRequest(this, {
                            method: 'POST',
                            url: api.order + 'refund/agree/',
                            body: this.refundForm,
                            success(result) {
                                this.$message.success(result.message);
                                this.dialogVisible = false;
                                this.$emit('refresh-data');
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>

</style>
