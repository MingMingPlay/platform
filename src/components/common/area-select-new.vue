<template>
    <div class="area-select">
        <el-select v-model="provinceSid" placeholder="请选择" @change="handleChange('province')" clearable @clear="clearData('province')">
            <el-option v-for="(item,index) in province" :key="index" :label="item.name" :value="item.sid"></el-option>
        </el-select>
        <el-select v-model="citySid" placeholder="请选择" @change="handleChange('city')" clearable @clear="clearData('city')">
            <el-option v-for="(item,index) in city" :key="index" :label="item.name" :value="item.sid"></el-option>
        </el-select>
        <el-select v-model="areaSid" placeholder="请选择" @change="handleChange('area')" clearable @clear="clearData('area')">
            <el-option v-for="(item,index) in area" :key="index" :label="item.name" :value="item.sid"></el-option>
        </el-select>
    </div>
</template>
<script>
    // 如果只是用于 sid ，用 v-model 即可
    // 也有一个回答方法
    // 回调方法名:'get-area'，回传一个data对象，包含三个值
    // data: {
    //     areaSid: '',     所选区域的sid
    //     mergedName: '',  所选区域的组合名称
    //     level: null,     所选区域所属等级，有1 2 3 个等级，分别代表省市区
    // }
    export default {
        props: ['value'],
        data() {
            return {
                provinceSid: '',
                citySid: '',
                areaSid: '',
                province: [],
                city: [],
                area: [],
                data: {
                    areaSid: '',
                    mergedName: '',
                    level: null,
                },
                defaultInit: false,     // 该变量为默认数据在初始化过程中防止用户操作
            }
        },
        created(){
            this.getProv();
            if(this.value){
                this.defaultInit = true;
                this.getChain(this.value);
            }
        },
        watch: {
            value(newVal, oldVal){
                if(!newVal && oldVal){
                    this.provinceSid = '';
                    this.clearData('province');
                }
                if(newVal && newVal !== oldVal){
                    this.defaultInit = true;
                    this.getChain(this.value);
                }
            }
        },
        methods: {
            getProv(){      // 获取省份数据
                this.$http.get(this.$api.area + 'provinces')
                    .then(response => {
                        if(response.body.code === 200){
                            this.province = response.body.data;
                        }
                    })
            },
            getProvChildren(sid, type){      // 获取省份下级数据
                this.$http.get(this.$api.area + 'parent/' + sid)
                    .then(response => {
                        if(response.body.code === 200){
                            this[type] = response.body.data[0].children;
                        }
                    })
            },
            getChain(sid){     // 获取城市链
                this.$http.get(this.$api.area + 'chain/' + sid)
                    .then(response => {
                        if(response.body.code === 200){
                            let data = response.body.data;
                            if(data instanceof Array && data.length > 0) {
                                this.provinceSid = data[0] ? data[0].sid : '';
                                this.citySid = data[1] ? data[1].sid : '';
                                this.areaSid = data[2] ? data[2].sid : '';
                                this.data.areaSid = data[data.length - 1].sid;
                                this.data.mergedName = data[data.length - 1].mergedName;
                                this.data.level = data[data.length - 1].level;
                                if(data[0]) this.getProvChildren(data[0].sid, 'city');
                                if(data[1]) this.getProvChildren(data[1].sid, 'area');
                                // 如果值来自外面就不回调了
                                /*this.$emit('input', this.data.areaSid);
                                this.$emit('get-area', this.data);*/
                            }
                            setTimeout(() => {
                                this.defaultInit = false;
                            },100)
                        }
                    })
            },
            handleChange(type){
                if(this.defaultInit){
                    return false;
                }
                if((type === 'province' && !this.provinceSid) || (type === 'city' && !this.citySid) || (type === 'area' && !this.areaSid)){
                    return false;
                }
                if(type === 'province'){
                    this.citySid = '';
                    this.areaSid = '';
                    this.area = [];
                    this.getProvChildren(this.provinceSid, 'city');
                }else if(type === 'city'){
                    this.areaSid = '';
                    this.getProvChildren(this.citySid, 'area');
                }
                this[type].forEach((value) => {
                    if(value.sid === this[`${type}Sid`]){
                        this.data.areaSid = value.sid;
                        this.data.mergedName = value.mergedName;
                        this.data.level = value.level;
                    }
                });
                this.$emit('input', this.data.areaSid);
                this.$emit('get-area', this.data);
            },
            clearData(type){
                if(type === 'province'){
                    this.citySid = '';
                    this.areaSid = '';
                    this.city = [];
                    this.area = [];
                    this.$emit('input', '');
                    this.$emit('get-area', '');
                    return false;
                }else if(type === 'city'){
                    this.areaSid = '';
                    this.area = [];
                    this.province.forEach((value) => {
                        if(value.sid === this.provinceSid){
                            this.data.areaSid = value.sid;
                            this.data.mergedName = value.mergedName;
                            this.data.level = value.level;
                        }
                    });
                }else if(type === 'area'){
                    this.city.forEach((value) => {
                        if(value.sid === this.citySid){
                            this.data.areaSid = value.sid;
                            this.data.mergedName = value.mergedName;
                            this.data.level = value.level;
                        }
                    });
                }
                this.$emit('input', this.data.areaSid);
                this.$emit('get-area', this.data);
            },
        }
    }
</script>
<style>

</style>
