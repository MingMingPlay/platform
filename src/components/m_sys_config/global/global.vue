<template>
    <div class="global goods-info-wrap">
        <!--面包屑-->
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="goods-cell">
            <div class="title">交易设置</div>
            <div class="goods-info input-60 clear">
                <el-form ref="formData" :model="formData" label-width="250px" :rules="rules">
                    <el-form-item label="用户购买商品时，减少库存方式:" required>
                        <el-radio-group v-model="formData.inventory">
                            <el-radio :label="'0'">下单减库存</el-radio>
                            <el-radio :label="'1'">付款减库存</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="用户下单未付款，订单取消时间:" prop="order">
                        <el-input v-model="formData.order" type="number"></el-input>
                        <span>分钟（最低15分钟）</span>
                    </el-form-item>
                    <el-form-item label="卖家发货后，买家自动确认收货:" prop="delivery">
                        <el-input v-model="formData.delivery" type="number"></el-input>
                        <span>天（最低7天）</span>
                    </el-form-item>
                    <el-form-item label="买家确认收货，允许用户售后期限:" prop="drawback">
                        <el-input v-model="formData.drawback" type="number"></el-input>
                        <span>天（最低7天）</span>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="save-button">
            <el-button type="primary" @click="saveData">保存</el-button>
        </div>
    </div>
</template>

<script type="text/javascript">
    import api from '../../../assets/config/m-api.js'
    import { mixin_getButton } from '../../common/jkc-mixin.vue'
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
//    import { vm } from '../../../pages/merchant.js'
    export default {
        mixins: [mixin_getButton],
        data() {
            let minTime = function (rule, value, callback) {
                if(value && parseInt(value) != value){
                    return callback(new Error('不能为小数'));
                }
                if(value < rule.length){
                    callback(new Error(rule.tips));
                }else {
                    callback();
                }
            };
            return {
                crumbs: [
                    {
                        title: '系统设置',
                    },
                    {
                        title: '通用设置',
                    },
                ],
                formData: {
                    inventory: '0',
                    order: null,
                    delivery: null,
                    drawback: null,
                },
                rules: {
                    order: [{
                        required: true,
                        message: '请输入时间',
                        trigger: 'blur'
                    },{
                        validator: minTime,
                        length: 15,
                        tips: '时间最低为15分钟',
                        trigger: 'change,blur'
                    }],
                    delivery: [{
                        required: true,
                        message: '请输入时间',
                        trigger: 'blur'
                    },{
                        validator: minTime,
                        length: 7,
                        tips: '时间最低为7天',
                        trigger: 'change,blur'
                    }],
                    drawback: [{
                        required: true,
                        message: '请输入时间',
                        trigger: 'blur'
                    },{
                        validator: minTime,
                        length: 7,
                        tips: '时间最低为7天',
                        trigger: 'change,blur'
                    }],
                }
            }
        },
        components: {
            JkcBreadcrumb,
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {		// 获取列表数据
                this.$http.get(api.config + 'detail/' + this.$root.userInfo.merchantSid)
                    .then((result) => {
                        if(result.body.code === 200) {
                            this.formData = result.body.data;
                        }else{
                            this.$message({
                                type: 'warning',
                                message: result.body.message
                            })
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            saveData(){
                let method = this.formData.sid?'put':'post';
                let url = api.config + (this.formData.sid?'update':'create') + '/batch/';
                this.$refs.formData.validate(valid => {
                    if(valid){
                        this.$http[method](url, this.formData).then(result => {
                            if(result.body.code === 200){
                                this.$message({
                                    type: 'info',
                                    message: '成功'
                                })
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                })
            }
        }
    }
</script>

<style>
.global .cate-cell{
    border-top: 1px solid #e4eaee;
}
.global .input-60 .el-input{
    width: 60px;
}
.global .save-button{
    margin-top: 20px;
}
</style>
