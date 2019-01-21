<template>
    <el-select v-model="cateSid" @change="change" clearable placeholder="选择品类">
        <template v-for="item in cateData">
            <el-option
                v-if="!item.children"
                :value="item.sid"
                :label="item.name">
            </el-option>
            <el-option-group
                v-if="item.children"
                :label="item.name">
                <el-option
                    v-for="(item1, index1) in item.children"
                    :key="index1"
                    :label="item1.name"
                    :value="item1.sid">
                </el-option>
            </el-option-group>
        </template>
    </el-select>
</template>
<script>
    /**
     * 选择品类，双向绑定品类 sid
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
                cateData: [],
                cateSid: ''
            }
        },
        created(){
            this.cateSid = this.value;
            this.getCate();
        },
        watch: {
            value(){
                this.cateSid = this.value;
            }
        },
        methods: {
            // 获取品类
            getCate (){
                this.$http.get(this.$api.category)
                    .then((result) => {
                        this.cateData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            change(){
                this.$emit('input', this.cateSid)
            }
        }
    }
</script>
<style>

</style>
