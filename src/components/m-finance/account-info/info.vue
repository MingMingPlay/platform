<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">安全设置</div>
        <div class="search-fil-wrap one-line">
            <el-form>
                <el-form-item label="设置交易密码">
                    <el-button type="text" @click="handleSet">设置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--修改交易密码-->
        <el-dialog title="修改交易密码" v-model="dialogVisibleTrade"  @close="closeCallBack()" >
            <el-form :model="formTrade" :rules="rules" ref="formTrade" label-width="110px">
                <el-form-item label="当前交易密码" prop="oldPassword">
                    <el-input v-model="formTrade.oldPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新交易密码" prop="password">
                    <el-input v-model="formTrade.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认交易密码" prop="repassword">
                    <el-input v-model="formTrade.repassword" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleTrade = false">取 消</el-button>
                <el-button type="primary" @click="submitFormTrade('formTrade')">修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import api from '../../../assets/config/m-api.js'
    import { getThis,passwordSet } from '../../../assets/staticData/finance.js'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //登录密码
                isVisible: false,
                //交易密码
                dialogVisibleTrade:false,
                //交易密码信息
                formTrade:{},
                //面包屑
                crumbs:passwordSet.crumbs,
                //验证规则
                rules:passwordSet.rules,
            };
        },
        created(){
            getThis(this);
        },
        methods: {
            //关闭回调，重置表单
            closeCallBack() {
                this.$refs['formTrade'].resetFields();
                for(var key in this.formTrade) {
                    this.formTrade[key] = '';
                }
            },
            //交易密码修改
            submitFormTrade(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('ok')
                        this.changePassword();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSet(){
                this.dialogVisibleTrade = true;
            },
            changePassword(){
                let data={
                    oldPassword:this.formTrade.oldPassword,
                    password:this.formTrade.password
                }
                this.$http.put(['cashPassword'],data)
                    .then((result) => {
                        console.log(result)
                        if(result.body.code == 200){
                            this.$message({type: 'success', message: '修改成功!'});
                            this.dialogVisibleTrade = false;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
        }
    };
</script>
<style>

</style>
