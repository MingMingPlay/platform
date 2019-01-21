<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="merchant-info">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px">
                <div class="detail-title">基础信息</div>
                <div class="detail-wrap">
                    <el-form-item class="infoInput"  label="结算对象名称" prop="name">
                        <el-input v-model="form.name" placeholder="请填写结算对象名称"></el-input>
                    </el-form-item>
                    <el-form-item label="结算对象类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option label="卖家" value="Merchant"></el-option>
                            <!--<el-option label="平台" value="Platform"></el-option>-->
                            <!--<el-option label="物流" value="Logistics"></el-option>-->
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="结算规则组" prop="rule">-->
                        <!--<el-select v-model="form.rule" placeholder="请选择">-->
                            <!--<el-option label="规则1" value="规则1"></el-option>-->
                            <!--<el-option label="规则2" value="规则2"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label="是否有效" prop="valid"  v-if="type=='add'">
                        <el-select v-if="type=='add'" v-model="form.valid" placeholder="请选择">
                        <el-option label="是" value="true"></el-option>
                        <el-option label="否" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否有效" prop="validShow"  v-if="type=='edit'">
                        <el-select v-model="form.valid" placeholder="请选择">
                            <el-option label="是" :value='true'></el-option>
                            <el-option label="否" :value='false'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="结算周期" prop="period">
                        <el-select v-model="form.period" placeholder="请选择">
                            <el-option label="日结" value="Day"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
    import { settlementList } from '../../../assets/staticData/finance.js'
    export default {
        mixins: [mixin_breadcrumb],
        data() {
            return {
                //提交表单
                form: {
                    name:'',
                    type:'',
                    rule:'1',
                    valid:'',
                    period:'',
                    validShow:''
                },
                //面包屑
                crumbs:settlementList.crumbsAdd,
                //验证
                rules: settlementList.rules,
                type:this.$route.query.type
            }
        },
        created(){
            if(this.$route.query.type==='edit')this.getDetail();
        },
        methods:{
            //获取数据
            getDetail(){
                this.$http.get(['financialObjectPage','/',this.$route.query.sid])
                    .then((result) => {
                        if(result.body.code == 200){
                            this.form = result.body.data;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //新增请求
            ajaxAdd(){
                this.$http.post(['financialObjectPage'],this.form)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.$message({type: 'success', message: '新增成功!'});
                            setTimeout(()=>{
                                this.$router.go(-1);
                            },1000)
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            //修改请求
            ajaxEdit(){
                this.$http.put(['financialObjectPage','/',this.$route.query.sid],this.form)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.$message({type: 'success', message: '修改成功!'});
                            setTimeout(()=>{
                                this.$router.go(-1);
                            },1000)
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            submitForm(ruleForm){
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        console.log(this.form)
                        switch (this.$route.query.type){
                            case 'add':
                                this.ajaxAdd();
                                break;
                            case 'edit':
                                this.ajaxEdit();
                                break;
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>
<style>
    .merchant-info .infoInput .el-input{
        width: 400px;
    }
</style>
