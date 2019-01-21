<template>
    <div class="coin-info">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">积分设置</div>

        <div class="detail-wrap" v-loading="loading">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="人民币与积分比值" label-width="190px" prop="scoreToRmb">
                    <span class="desc">1：</span>
                    <el-input
                        class="small-input"
                        @keyup.native="form.scoreToRmb = pubObj.formatInt($event)"
                        v-model="form.scoreToRmb" readonly></el-input> 分　1元 = {{form.scoreToRmb}}积分
                </el-form-item>
                <!--<el-form-item label="评价获得积分" label-width="190px" prop="commentGetScore">-->
                    <!--<el-input-->
                        <!--@keyup.native="form.commentGetScore = pubObj.formatInt($event)"-->
                        <!--v-model="form.commentGetScore"></el-input> 分-->
                <!--</el-form-item>-->
                <!--<el-form-item label="晒单获得积分" label-width="190px" prop="commentSunScore">-->
                    <!--<el-input-->
                        <!--@keyup.native="form.commentSunScore = pubObj.formatInt($event)"-->
                        <!--v-model="form.commentSunScore"></el-input> 分-->
                <!--</el-form-item>-->
                <el-form-item label="转发文章获取积分" label-width="190px" prop="forwardGetScore">
                    <el-input
                        @keyup.native="form.forwardGetScore = pubObj.formatInt($event)"
                        v-model="form.forwardGetScore" readonly></el-input> 分/篇
                </el-form-item>
                <el-form-item label="每日转发文章上限" label-width="190px" prop="forwardGetLimit">
                    <el-input
                        @keyup.native="form.forwardGetLimit = pubObj.formatInt($event)"
                        v-model="form.forwardGetLimit" readonly></el-input> 次
                </el-form-item>
                <!--<el-form-item label="文章评论得积分" label-width="190px" prop="articleGetScore">-->
                    <!--<el-input-->
                        <!--@keyup.native="form.articleGetScore = pubObj.formatInt($event)"-->
                        <!--v-model="form.articleGetScore"></el-input> 分/条-->
                <!--</el-form-item>-->
                <el-form-item label="阅读文章" label-width="190px" prop="articleGetNum">
                    <el-input
                        @keyup.native="form.articleGetNum = pubObj.formatInt($event)"
                        v-model="form.articleGetNum" readonly></el-input> 分/篇
                </el-form-item>
                <el-form-item label="文章点赞" label-width="190px" prop="signGetGrowth">
                    <el-input
                        @keyup.native="form.articleLikeScore = pubObj.formatInt($event)"
                        v-model.number="form.articleLikeScore" readonly></el-input> 分/篇
                </el-form-item>
                <el-form-item label="积分抵扣订单金额" label-width="190px" prop="orderRatioScore">
                    <el-input
                        :maxlength="2"
                        @keyup.native="form.orderRatioScore = pubObj.formatInt($event)"
                        v-model="form.orderRatioScore" readonly></el-input> %（最大抵扣10%）
                </el-form-item>
                <el-form-item label-width="190px">
                    <el-button type="primary"  @click="submitForm('ruleForm')" :loading="submitLoading" disabled>确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import { crumbs, rules } from './page-config.js'
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        data() {
            return {
                pubObj,
                loading: false,
                //面包屑
                crumbs: crumbs,
                //表单
                form:{},
                //验证
                rules: rules,
                submitLoading: false
            };
        },
        created(){
            this.getData();
        },
        components: {
            jkcBreadcrumb
        },
        methods: {
            //获取数据
            getData(){
                this.loading = true;
                this.$http.get(['memberBaseSettings'], )
                .then(result => {
                    this.loading = false;
                    if(result.body.code === 200){
                        this.form = result.body.data;
                    }else{
                        this.$message({type: 'warning', message: result.body.message})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //提交确定
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 把数据转 number 类型
                        for(let i in this.form){
                            this.form[i] = Number(this.form[i])
                        }
                        this.submitLoading = true;
                        this.$http.put(['memberBaseSettings'], this.form)
                            .then((result) => {
                                this.submitLoading = false;
                                if(result.body.code === 200){
                                    this.getData();
                                    this.$message({type: 'success', message: result.body.data});
                                }else{
                                    this.$message({type: 'warning', message: result.body.message})
                                }
                            }).catch((err) => {
                            console.log(err)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    };
</script>
<style>
    .coin-info .el-form-item__content  .el-input{
        width:200px;
    }
    .coin-info .small-input.el-input{
        width: 170px;
    }
    .coin-info .desc{
        display: inline-block;
        width: 26px;
    }
    /*.coin-info .input-padding,.coin-info .el-select{*/
        /*margin-left: 25px;*/
    /*}*/
    /*.coin-info .el-form-item__error{*/
        /*margin-left: 25px;*/
    /*}*/
</style>
