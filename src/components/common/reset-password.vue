<template>
    <div style="display: inline-block;text-align: left;margin-left: 10px;">
        <el-button type="text" @click="showDialog = true" v-if="row.state === 'Active' && !row.reserved">重置密码</el-button>
        <el-dialog v-model="showDialog" size="tiny" title="重置密码">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                <el-form-item prop="password" label="新密码">
                    <el-input v-model="form.password"></el-input>
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
    export default {
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                showDialog: false,
                form: {
                    password: ''
                },
                rules: {
                    password: [
                        {
                            required: true,
                            message: '请输入新密码',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            // 重置密码提交
            submit(){
                this.$refs.form.validate(valid => {
                    if(valid){
                        this.$http.put(['changePassword', this.row.sid], this.form)
                            .then(result => {
                                if(result.body.code === 200){
                                    this.$message.success(result.body.message);
                                    this.showDialog = false;
                                    this.$refs.form.resetFields();
                                }else {
                                    this.$message.error(result.body.message);
                                }
                            })
                    }
                })
            },
        }
    }
</script>
<style>

</style>
