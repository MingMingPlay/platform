<template>
    <div>
        <el-select
            v-model="sid"
            clearable
            filterable
            remote
            placeholder="输入店铺名称查询店铺"
            :remote-method="getAgentData"
            :loading="getAgentLoading"
            @change="change">
            <el-option
                v-for="item in agentData"
                :key="item.sid"
                :label="item.nameFull"
                :value="item.sid">
            </el-option>
        </el-select>
        <div class="agent-explain">
            <span class="desc">代理店铺是什么？</span>
            <div class="agent-explain-wrap">
                <p class="title">代理店铺是什么？</p>
                <p class="text">代理店铺是可以帮您销售商品的商家的店铺。</p>
                <p class="text">您可以选择供货给某个特定代理商的店铺。</p>
            </div>
        </div>
    </div>
</template>
<script>
    /**
     * @name    选择商品分组
     * */
    export default {
        props: {
            value: '',
            agentName: ''
        },
        data() {
            return {
                sid: '',
                agentData: [],
                getAgentLoading: false,
            }
        },
        created(){
            this.sid = this.value;
        },
        watch: {
            value(newVal, oldVal){
                this.sid = this.value;
            },
//            agentName(){
//                if(this.agentName){
//                    this.getAgentData(this.agentName);
//                }
//            }
        },
        methods: {
            getAgentData (query){		// 获取代理商店铺（太平所有店铺）
                this.getAgentLoading = true;
                this.$http.get(['merchantShopTp'], {params: {q: query}})
                    .then((result) => {
                        this.getAgentLoading = false;
                        if(result.body.code === 200){
                            this.agentData = result.body.data.filter(item => {
                                return item.nameFull.toLowerCase().indexOf(query.toLowerCase()) > -1;
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            change(value){
                this.$emit('input', value)
            }
        }
    }
</script>
<style>

</style>
