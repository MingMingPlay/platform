<template>
    <el-select
        v-model="merchantSid"
        clearable
        filterable
        remote
        placeholder="请输入店铺名称"
        :remote-method="remoteMethod"
        :loading="loading"
        @change="change">
        <el-option
            v-for="item in merchantData"
            :key="item.sid"
            :label="item.nameFull"
            :value="item.merchantSid">
        </el-option>
    </el-select>
</template>
<script>
    /**
     * 选择商家 sid，双向绑定商家 sid，注意是 --商家-- ，不是店铺 sid
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
                merchantData: [],
                loading: false,
                merchantSid: ''
            }
        },
        created(){
            this.merchantSid = this.value;
        },
        watch: {
            value(){
                this.merchantSid = this.value;
            }
        },
        methods: {
            // 动态搜索商家信息
            remoteMethod(query) {
                if(query === ''){
                    this.merchantSid = '';
                }
                if (query !== '' && query.length > 1) {
                    this.loading = true;
                    this.$http.get(['merchantShop'], {params: {q: query}})
                        .then((result) => {
                            this.loading = false;
                            this.merchantData = result.body.data.filter(item => {
                                return item.nameFull.toLowerCase().indexOf(query.toLowerCase()) > -1;
                            });
                        }).catch((err) => {
                        console.log(err)
                    });
                } else {
                    this.merchantData = [];
                }
            },
            change(){
                this.$emit('input', this.merchantSid)
            }
        }
    }
</script>
<style>

</style>
