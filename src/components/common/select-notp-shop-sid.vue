<template>
    <el-select
        v-model="shopSid"
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
            :value="item.sid">
        </el-option>
    </el-select>
</template>
<script>
    /**
     * 选择非太平店铺 sid，双向绑定店铺 sid，注意是 --店铺-- ，不是商家 sid
     * 非太平商家一般指 供货商
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
                shopSid: ''
            }
        },
        created(){
            this.shopSid = this.value;
        },
        watch: {
            value(){
                this.shopSid = this.value;
            }
        },
        methods: {
            // 动态搜索商家信息
            remoteMethod(query) {
                if(query === ''){
                    this.shopSid = '';
                }
                if (query !== '' && query.length > 1) {
                    this.loading = true;
                    this.$http.get(['merchantShopNonTaiping'], {params: {q: query}})
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
                this.$emit('input', this.shopSid)
            }
        }
    }
</script>
<style>

</style>
