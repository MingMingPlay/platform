<template>
    <div style="display: inline-block;text-align: left;margin-right: 10px;">
        <el-button type="text" @click="showDialog = true">退款金额</el-button>
        <el-dialog v-model="showDialog" size="tiny" title="退款金额">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                <el-form-item prop="refund" label="退款金额">
                    <el-input v-model="form.refund" @keyup.native="form.refund = pubObj.formatFloat($event)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="showDialog = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    /**
     * 重置用户密码
     * 云平台和阅商机都有
     * */
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                pubObj,
                showDialog: false,
                form: {
                    refund: ''
                },
                rules: {
                    refund: [
                        {
                            required: true,
                            message: '请输入退款金额',
                            trigger: 'blur'
                        },
                        {
                            validator: this.refundCheck,
                            message: '退款金额不能大于商品总价',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            // 验证退款金额是否正常
            refundCheck(rule, value, callback){
                if(value && Number(value) > Number(this.row.price)){
                    callback(new Error(rule.message))
                }else {
                    callback();
                }
            },
            // 退款金额提交
            submit(){
                this.$refs.form.validate(valid => {
                    if(valid){
                        this.$confirm('退款将会对每笔订单发起退款，是否确定？', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.$http.get(['subscribeRefund', this.row.sid], {params: this.form})
                                .then(result => {
                                    if(result.body.code === 200){
                                        this.$message.success(result.body.message);
                                        this.showDialog = false;
                                        this.$emit('callback');
                                        this.$refs.form.resetFields();
                                    }else {
                                        this.$message.error(result.body.message);
                                    }
                                })
                        })

                    }
                })
            },
        }
    }
</script>
<style>

</style>
