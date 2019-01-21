<template>
    <el-select
        v-model="brandSid"
        placeholder="请选择品牌"
        no-data-text="暂无品牌"
        @change="change">
        <el-option
            v-for="item in brandData"
            :key="item.sid"
            :label="item.brandName"
            :value="item.sid">
        </el-option>
    </el-select>
</template>
<script>
    /**
     * @name     选择商户品牌双向绑定组件
     * @attribute    {String} value
     * */
    export default {
        props: {
            value: ''
        },
        data() {
            return {
                brandSid: '',
                brandData: []
            }
        },
        created(){
            this.getBrand();
            this.brandSid = this.value;
        },
        watch: {
            value(newVal, oldVal){
                this.brandSid = this.value;
            }
        },
        methods: {
            getBrand (){
                // 获取商户自己的品牌
                this.$http.get(this.$api.merchantBrand + 'mall')
                    .then((result) => {
                        if(result.body.code == 200){
                            this.brandData = result.body.data;
                            if(this.brandData.length > 0){
                                this.$emit('callback', true)
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            change(value){
                this.$emit('input', value);
            }
        }
    }
</script>
<style>

</style>
