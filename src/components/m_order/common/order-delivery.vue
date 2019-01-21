<template>
    <el-dialog title="确认发货" v-model="dialogVisible" :close-on-click-modal="false" @close="handleClose">
        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
            <el-form-item label="物流公司" prop="company">
                <el-select v-model="dialogForm.company" placeholder="请选择...">
                    <el-option 
                        v-for="(item,index) in companies" 
                        :key="index"
                        :label="item.name" 
                        :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物流编号" prop="transportId">
                <el-input v-model="dialogForm.transportId"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('dialogForm')">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import api from '../../../assets/config/m-api.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'

    export default {
        data() {
            const rules = {
                company: [{
                    required: true,
                    message: '请选择物流公司'
                }],
                transportId: [{
                    required: true,
                    message: '请填写物流编号'
                }]
            };
            return {
                dialogVisible: false,
                dialogForm: {
                    company: null
                },
                rules: rules,
                companies: []
            }
        },
        mounted() {
            this.$nextTick(() => {
                bus.$on('open-delivery-dialog', (orderId) => {
                    this.dialogForm.orderId = orderId;
                    pubObj.httpRequest(this, {
                        url: api.company,
                        success(result) {
                            this.companies = result.data;
                            this.dialogVisible = true;
                        }
                    });
                })
            })
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.handleSubmit()
                    } else {
                        return false;
                    }
                });
            },
            handleSubmit() {
                pubObj.httpRequest(this, {
                    method: 'POST',
                    url: api.sureTransport,
                    body: this.dialogForm,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialogVisible = false;
                        this.$emit('refresh-data');
                    }
                })
            },
            handleClose() {
                this.$refs.dialogForm.resetFields();
            }
        }
    }
</script>

<style>

</style>