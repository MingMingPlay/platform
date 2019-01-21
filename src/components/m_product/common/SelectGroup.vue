<template>
    <div class="goods-group-wrap">
        <el-checkbox-group v-model="sids" @change="change">
            <template v-for="item in groupData">
                <el-checkbox
                    :disabled="item.state === 'Disabled'"
                    :label="item.sid"
                    v-if="!item.children || item.children.length === 0">
                    {{item.nameAbbr}}
                </el-checkbox>
                <div class="group-item" v-if="item.children">
                    <div class="title">{{item.nameAbbr}}</div>
                    <el-checkbox
                        :disabled="item1.state === 'Disabled'"
                        :label="item1.sid"
                        v-for="item1 in item.children"
                        :key="$index">
                        {{item1.nameAbbr}}
                    </el-checkbox>
                </div>
            </template>
        </el-checkbox-group>
    </div>
</template>
<script>
    /**
     * @name    选择商品分组
     * */
    export default {
        props: {
            value: ''
        },
        data() {
            return {
                sids: '',
                groupData: []
            }
        },
        created(){
            this.getGroup();
            this.sids = this.value;
        },
        watch: {
            value(newVal, oldVal){
                this.sids = this.value;
            }
        },
        methods: {
            getGroup (){
                // 获取商家自定义分组
                this.$http.get(['shopBizCate', 'Mall'])
                    .then((result) => {
                        this.groupData = result.body.data;
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
