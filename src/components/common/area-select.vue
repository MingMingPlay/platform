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
    // 接收一个默认区域sid，参数名：defaultSid，注意驼峰变中横线
    // 回调方法名:'get-area'，回传一个data对象，包含三个值
    // data: {
    //     areaSid: '',     所选区域的sid
    //     mergedName: '',  所选区域的组合名称
    //     level: null,     所选区域所属等级，有1 2 3 个等级，分别代表省市区
    // }
    export default {
        props: ['defaultSid'],
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
                // 注释仅接受一次默认数据，因为不利于联动
                // watchDefaultInit: true, // 改变量为监听默认数据传入（后台返回数据有延迟）；仅仅只接收第一次
            }
        },
        created(){
            this.getProv();
            if(this.defaultSid){
                this.defaultInit = true;
                this.getChain(this.defaultSid);
            }
        },
        watch: {
            defaultSid(newVal, oldVal){
//                if(this.defaultSid && this.watchDefaultInit){
//                    this.defaultInit = true;
//                    this.watchDefaultInit = false;
//                    this.getChain(this.defaultSid);
//                }
                if(this.defaultSid){
                    this.defaultInit = true;
                    this.getChain(this.defaultSid);
                }
                if(!newVal && oldVal){
                    this.provinceSid = '';
                    this.clearData('province');
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
                                this.$emit('get-area', this.data);
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
                this.$emit('get-area', this.data);
            },
            clearData(type){
                if(type === 'province'){
                    this.citySid = '';
                    this.areaSid = '';
                    this.city = [];
                    this.area = [];
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
                this.$emit('get-area', this.data);
            },
        }
    }
</script>
<style>

</style>
