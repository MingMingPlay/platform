<template>
    <el-form-item label="组织机构" v-if="organData.length > 0">
        <el-cascader
            :options="organData"
            v-model="organCodes"
            change-on-select
            clearable
            :show-all-levels="false"
            @change="handleChangeOrgan">
        </el-cascader>
    </el-form-item>
</template>
<script>
    /**
     * 太平组织机构，主要用于查询太平的组织机构，根据自己所在等级查询或查询太平全部的
     * 组织机构 form 模块
     * 双向绑定 code 值；需要其他值可以用回调函数取
     * goods 为true表示商品部分，不显示 4 5 级
     * tp-all 为true表示太平所有组织机构，不根据其他商家查询
     * 回调为选择的组织机构 [],[{},{}],空数组或有值的数组
     * {
     *  code: 12314,
     *  sid: 'asdfa',
     *  areaSid: 'asdfj'
     * }
     * 暴露的一个方法 reset ，用于重置选择，调用方法 this.$refs[refName].reset();
    * */
    export default {
        props: ['value', 'goods', 'tpAll'],
        data() {
            return {
                organData: [],
                organCodes: [],
            }
        },
        created(){
            this.getData();
        },
        watch: {
            value(){
                if(!this.value){
                    this.organCodes = [];
                }
            }
        },
        methods: {
            getData(){
                let goods = this.goods;
                function transformData(data, re) {      // 仅用于改造数据；改造成级联选择器需要的数据
                    data.forEach(value => {
                        let obj = {};
                        obj.label = value.name;
                        obj.value = {
                            code: value.code,
                            sid: value.sid,
                            areaSid: value.areaSid
                        };
                        if(goods){
                            if(value.level < 3 && value.children && value.children.length > 0){
                                obj.children = [];
                                transformData(value.children, obj.children);
                            }
                        }else {
                            if(value.children && value.children.length > 0){
                                obj.children = [];
                                transformData(value.children, obj.children);
                            }
                        }
                        re.push(obj);
                    });
                    return re;
                }
                let httpParams = null;
                if(this.tpAll){
                    httpParams = ['organ', 'ooo_PJ'];
                }else {
                    httpParams = ['organChildren', this.$root.userInfo.merchantSid, '/' + this.$root.userInfo.organCode];
                }
                this.$http.get(httpParams)
                    .then((result) => {
                        if(result.body.code === 200){
                            let data = result.body.data;
                            if(data && data.length > 0){
                                this.organData = transformData(data, this.organData);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            handleChangeOrgan(codes){
                this.$emit('callback', codes);
                if(codes.length > 0){
                    this.$emit('input', codes[codes.length - 1].code)
                }else {
                    this.$emit('input', '')
                }
            },
            reset(){
                this.organCodes = [];
            }
        }
    }
</script>
<style>

</style>
