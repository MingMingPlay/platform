<template>
    <el-select v-model="brandSid" @change="change" clearable placeholder="选择品牌" no-data-text="暂无品牌">
        <el-option
            v-for="(item, index) in brandData"
            :key="index"
            :value="item.sid"
            :label="item.nameFull">
        </el-option>
    </el-select>
</template>
<script>
    /**
     * 选择品牌，双向绑定品牌 sid
     * */
    export default {
        props: {
            value: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                brandData: [],
                brandSid: ''
            }
        },
        created(){
            this.brandSid = this.value;
            this.getBrand();
        },
        watch: {
            value(){
                this.brandSid = this.value;
            }
        },
        methods: {
            // 获取品牌
            getBrand (){
                this.$http.get(this.$api.brand)
                    .then((result) => {
                        this.brandData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            change(){
                this.$emit('input', this.brandSid)
            }
        }
    }
</script>
<style>

</style>
