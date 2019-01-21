<template>
    <div>
        <el-select v-model="sid" placeholder="请选择运费模板" no-data-text="暂无运费模板" @change="change">
            <el-option
                v-for="item in shippingData"
                :key="item.templateVO.sid"
                :label="item.templateVO.name"
                :value="item.templateVO.sid">
            </el-option>
        </el-select>
        <router-link to="/m_shipping/template" style="margin-left: 10px;">管理运费模板</router-link>
        <p v-if="joinScoreMall" style="color: #f00;">注：加入积分商城的商品运费必须为包邮</p>
    </div>
</template>
<script>
    /**
     * @name    选择运费模板
     * */
    export default {
        props: {
            value: '',
            joinScoreMall: ''
        },
        data() {
            return {
                sid: '',
                shippingData: [],  // 运费模板列表
            }
        },
        created(){
            this.getShipping();
        },
        watch: {
            value(){
                this.sid = this.value;
            }
        },
        methods: {
            getShipping (){
                // 获取运费模板
                this.$http.get(['shippingTemplate', '?pageSize=1000&shopSid=' + this.$root.shopInfo.sid])
                    .then((result) => {
                        this.shippingData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            change(data){
                this.$emit('input', data);
            }
        }
    }
</script>
<style>

</style>
