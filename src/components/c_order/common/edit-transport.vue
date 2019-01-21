<template>
    <el-dialog title="修改物流单号" v-model="dialogVisible" :close-on-click-modal="false">
        <el-form :model="transportForm" :rules="rules" ref="transportForm" label-width="80px">
            <el-form-item label="物流单号" prop="transportId">
                <el-input v-model="transportForm.transportId"></el-input>
            </el-form-item>
            <el-form-item label="物流公司" prop="company">
                <el-input v-model="transportForm.company"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('transportForm')">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    
    import api from '../../../assets/config/c-api.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'
    
    export default {
        data() {
            const rules = {
                transportId: [{
                    required: true,
                    message: '请填写物流单号'
                }],
                company: [{
                    required: true,
                    message: '请输入物流公司'
                }]
            }
            return {
                dialogVisible: false,
                transportForm: {},
                rules: rules
            }
        },
        mounted() {
            this.$nextTick(() => {
                bus.$on('open-transport-dialog', (orderId) => {
                    pubObj.httpRequest(this, {
                        url: api.transport + orderId,
                        success(result) {
                            this.transportForm = result.data;
                            this.dialogVisible = true;
                        }
                    })
                })
            })
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        pubObj.httpRequest(this, {
                            url: api.transport + this.transportForm.sid,
                            method: 'PUT',
                            body: this.transportForm,
                            success(result) {
                                this.$message.success(result.message);
                                this.dialogVisible = false;
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