<template>
    <div>
        <cell-wraper :title="'商品' + cateTitle[index] + '级类目'" :isRequired="true" v-for="(item, index) in cateTempData" :key="index">
            <el-form-item :error="cateErrorTips[index]">
                <label class="custom-button" v-for="value in item" @change="change(item,index)">
                    <input type="radio" :value="value" v-model="cateForm[index]"/>
                    <span>{{value.name}}</span>
                </label>
            </el-form-item>
        </cell-wraper>
    </div>
</template>
<script>
    /**
     * @name    选择品类
     * */
    import CellWraper from './CellWraper.vue'
    export default {
        props: {
            value: ''
        },
        data() {
            return {
                cateDefaultData:[],// 类目数据
                cateTempData: [],// 用于类目层级
                cateForm: [],	// 用于临时储存已选
                cateTitle: ['一','二','三','四','五','六'],
                cateErrorTips: [],		// 选择类目数据异常提示
                sid: '',// 选中的值
            }
        },
        created(){
            this.getCate();
        },
        watch: {
            value(){
                this.sid = this.value;
                if(this.cateDefaultData.length > 0 && this.sid !== this.value){
                    this.initCate();
                }
            }
        },
        components: {
            CellWraper
        },
        methods: {
            getCate (){		// 获取类目
                this.$http.get(this.$api.category)
                    .then((result) => {
                        this.cateDefaultData = result.body.data;
                        this.cateTempData.push(result.body.data);
                        if(this.value){
                            this.initCate();
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            initCate (){
                // 初始化已选中的商品类目
                var cSid = this.value;
                for(let i=0;i<this.cateDefaultData.length;i++){		// 初始化类目数据
                    if(this.cateDefaultData[i].sid === cSid){
                        this.cateForm.push(this.cateDefaultData[i]);
                        if(this.cateDefaultData[i].children && this.cateDefaultData[i].children.length > 0){
                            this.cateTempData.push(this.cateDefaultData[i].children);
                        }
                        break;
                    }
                    if(this.cateDefaultData[i].children){
                        for(let j=0;j<this.cateDefaultData[i].children.length;j++){
                            if(this.cateDefaultData[i].children[j].sid === cSid){
                                this.cateTempData.push(this.cateDefaultData[i].children);
                                this.cateForm.push(this.cateDefaultData[i]);
                                this.cateForm.push(this.cateDefaultData[i].children[j]);
                                break;
                            }
                        }
                    }
                }
            },
            change (value,index){	// 选择类目
                this.cateErrorTips = [];
                if(this.cateForm[index].children){
                    this.$set(this.cateTempData, index + 1, this.cateForm[index].children)
                }
                if(this.cateForm[index].children){
                    this.cateTempData.splice(index + 2, 10);
                }else{
                    this.cateTempData.splice(index + 1, 10);
                }
                this.cateForm.splice(index + 1, 10);
                this.sid = this.cateForm[this.cateForm.length - 1].sid;
                this.$emit('input', this.sid);
            },
            checkData(){
                if(!this.sid){
                    this.$set(this.cateErrorTips, 0, '请选择类目！');
                    return false;
                }else {
                    for(let i=0;i<this.cateDefaultData.length;i++){
                        if(this.sid === this.cateDefaultData[i].sid){
                            if(this.cateDefaultData[i].children && this.cateDefaultData[i].children.length > 0){
                                this.$set(this.cateErrorTips, 1, '请选择类目！');
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        }
    }
</script>
<style>

</style>
