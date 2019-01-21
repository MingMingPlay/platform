<template>
    <div class="goods-add">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <el-steps :space="250" :active="stepsActive" :center="true" :align-center="true">
            <el-step title="商品基本信息"></el-step>
            <el-step title="商品规格与库存"></el-step>
        </el-steps>


        <el-form :model="goodsBasis" ref="basisForm" :rules="rules">
            <!-- 商品基本信息 -->
            <div v-show="stepsActive === 0">

                <div class="cate-wrap">
                    <div class="cate-title">商品基本信息</div>

                    <cell-wraper title="商品信息">
                        <el-form-item label="商品主标题:" prop="title" label-width="100px">
                            <el-input v-model="goodsBasis.title"></el-input>
                        </el-form-item>
                        <el-form-item label="商品副标题:" prop="subTitle" label-width="100px">
                            <el-input v-model="goodsBasis.subTitle"></el-input>
                        </el-form-item>

                        <el-form-item label="商品图:" required prop="spuImagesvo" label-width="100px">
                            <main-upload v-model="goodsBasis.spuImagesvo"></main-upload>
                        </el-form-item>
                    </cell-wraper>

                    <cell-wraper title="征订规则">
                        <el-form-item label="征订价格:" required prop="price" label-width="150px">
                            <el-input v-model="goodsBasis.price" style="width:193px;"
                                      :disabled="goodsBasis.state === 'Online' || goodsBasis.state === 'SubscribeEnd' || goodsBasis.state === 'Refunding' || goodsBasis.state === 'Completed'"
                                      @keyup.native="goodsBasis.price = pubObj.formatFloat($event)"></el-input>
                        </el-form-item>
                        <el-form-item label="征订库存:" label-width="150px">
                            <el-input v-model="goodsBasis.subInventory" style="width:193px;"
                                      :disabled="goodsBasis.state === 'Online' || goodsBasis.state === 'SubscribeEnd' || goodsBasis.state === 'Refunding' || goodsBasis.state === 'Completed'"
                                      @keyup.native="goodsBasis.subInventory = pubObj.formatInt($event)"></el-input>
                        </el-form-item>
                        <el-form-item label="征订开始日期:" required prop="startTime" label-width="150px">
                            <el-date-picker
                                v-model="subscribeDate.startDate"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                                @change="handleStart"
                                :clearable="false">
                            </el-date-picker>
                            <el-time-picker
                                v-model="subscribeDate.startTime"
                                placeholder="选择时间"
                                @change="handleStartTime"
                                :clearable="false">
                            </el-time-picker>
                        </el-form-item>
                        <el-form-item label="征订结束日期:" required prop="endTime" label-width="150px">
                            <el-date-picker
                                v-model="subscribeDate.endDate"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                                @change="handleEnd"
                                :clearable="false">
                            </el-date-picker>
                            <el-time-picker
                                v-model="subscribeDate.endTime"
                                placeholder="选择时间"
                                @change="handleEndTime"
                                :clearable="false">
                            </el-time-picker>
                        </el-form-item>
                        <el-form-item label="商品下架日期:" required prop="subOfflineTime" label-width="150px">
                            <el-date-picker
                                v-model="subscribeDate.offlineDate"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                                @change="handleOffline"
                                :clearable="false">
                            </el-date-picker>
                            <el-time-picker
                                v-model="subscribeDate.offlineTime"
                                placeholder="选择时间"
                                @change="handleOfflineTime"
                                :clearable="false">
                            </el-time-picker>
                        </el-form-item>
                        <el-form-item label="每个用户ID起购数量:" label-width="150px">
                            <el-input v-model="goodsBasis.minimum" style="width:193px;"
                                      @keyup.native="goodsBasis.minimum = pubObj.formatInt($event)"></el-input>
                        </el-form-item>
                        <el-form-item label="每个用户ID购买上限:" label-width="150px">
                            <el-input v-model="goodsBasis.maximum" style="width:193px;"
                                      @keyup.native="goodsBasis.maximum = pubObj.formatInt($event)"></el-input>
                        </el-form-item>
                    </cell-wraper>

                    <cell-wraper title="商品详情">
                        <el-form-item required prop="description">
                            <detail-editor v-model="goodsBasis.description"></detail-editor>
                        </el-form-item>
                    </cell-wraper>
                </div>
            </div>

            <div v-show="stepsActive === 1">
                <div class="cate-wrap" v-show="stepsActive === 1">
                    <div class="cate-title">商品规格与库存</div>
                    <!--<el-form v-loading="attrBlockLoading">-->
                    <cell-wraper title="商品规格" :isRequired="true">
                        <el-form-item :error="attrErrorTips">
                            <edit-attr
                                :spuSid="goodsBasis.sid"
                                ref="editAttr">
                            </edit-attr>
                        </el-form-item>
                    </cell-wraper>

                    <cell-wraper title="规格表格" v-show="showSkuTable">
                        <el-form-item :error="skuErrorTips">
                            <sku-table
                                :spuSid="goodsBasis.sid"
                                :batchSkuData="batchSkuData"
                                @show-sku="showSku"
                                ref="editSku">
                            </sku-table>
                        </el-form-item>
                    </cell-wraper>
                </div>
            </div>
        </el-form>

        <div class="button-group" v-show="stepsActive === 0">
            <el-button type="info" @click="nextStep" :loading="buttonLoading">下一步</el-button>
        </div>
        <div class="button-group" v-show="stepsActive === 1">
            <el-button type="info" @click="lastStep">上一步</el-button>
            <el-button type="warning"
                       @click="addSkuData('online')"
                       :loading="buttonLoading"
                       :disabled="attrBlockLoading">发布</el-button>
            <el-button type="success"
                       @click="addSkuData('save')"
                       :loading="buttonLoading"
                       :disabled="attrBlockLoading">保存</el-button>
        </div>
    </div>
</template>

<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import CellWraper from '../common/CellWraper.vue'
    import SelectAgent from '../common/SelectAgent.vue'
    import SelectCategory from '../common/SelectCategory.vue'
    import SelectBrand from '../common/SelectBrand.vue'
    import SelectGroup from '../common/SelectGroup.vue'
    import SelectShipping from '../common/SelectShipping.vue'
    import EditAttr from '../common/EditAttr.vue'
    import EditSku from '../common/EditSku.vue'
    import DetailEditor from '../common/DetailEditor.vue'
    import MainUpload from '../common/MainUpload.vue'
    import SkuTable from './SkuTable.vue'
    import bus from '../common/bus.js'
    import { rules, batchSkuData } from './page-config.js'
    import { pubObj } from '../../../assets/unit/public.js'
    import { router } from '../../../pages/merchant.js'

    export default {
        data (){
            return {
                pubObj: pubObj,
                shopInfo: this.$root.shopInfo,
                crumbs: [
                    {
                        title:'商品管理',
                    },
                    {
                        title:'征订商品',
//                        to: {path:'/m_product/subscribe', query:this.$route.query}
                    },
                    {
                        title:'发布宝贝',
                    }
                ],
                stepsActive: Number(this.$route.query.step),
                // ------------------步骤一--------------------
                notBrand: false,//是否拥有品牌
                goodsBasis: {
                    title: '',
                    subTitle: '',
                    type: 'Subscribe',	// General(1, "普通商品"),Assist(2, "行销商品"),Subscribe (3, "征订商品")
                    description: '',
                    spuImagesvo: [],
                    price: null,        // 商品征订价格
                    subInventory: null, // 商品征订库存
                    startTime: '',      // 征订开始日期（yyyy-MM-dd HH:MM:DD)
                    endTime: '',        // 征订结束日期 （yyyy-MM-dd HH:MM:DD)
                    subOfflineTime: '',    // 商品下架时间 （yyyy-MM-dd HH:MM:DD)
                    minimum: '',        // 每个用户ID起购数量
                    maximum: '',        // 每个用户ID购买上限
                },
                subscribeDate: {    // 该对象专门用来处理征订时间
                    startDate: null,    // 征订开始日期的时间对象（日期）
                    startCallback: '',    // 征订开始日期的时间对象（日期）
                    endDate: null,
                    endCallback: '',
                    offlineDate: null,
                    offlineCallback: '',
                    startTime: null,    // 征订开始日期的时间对象（时分秒）
                    startTimeCallback: '',    // 征订开始日期的时间对象（时分秒）
                    endTime: null,
                    endTimeCallback: '',
                    offlineTime: null,
                    offlineTimeCallback: '',
                },
                pickerOptions: {        // 日期选择器配置，今天以前的禁用
                    disabledDate(time){
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                rules,// 验证规格

                // ------------------步骤二--------------------
                batchSkuData,
                showSkuTable: false,// 是否显示 SKU 表格
                attrBlockLoading: false,    // 规格模块数据加载中时，不能进行操作，如修改商品时到第二页
                attrErrorTips: '',
                skuErrorTips: '',
                buttonLoading: false,	// 提交按钮们的loading
            }
        },
        components: {
            jkcBreadcrumb,
            CellWraper,
//            SelectAgent,
//            SelectCategory,
//            SelectBrand,
//            SelectGroup,
//            SelectShipping,
            EditAttr,
            EditSku,
            DetailEditor,
            MainUpload,
            SkuTable,
        },
        created (){
            if(this.$route.query.spuSid){
                this.getGoodsInfo();
            }

            // 对商品标题的验证规则增加标题重复验证
            this.rules.title.push({
                validator: this.validGoodsTitle,
                trigger: 'blur'
            });
            // 时间验证
            this.rules.startTime = [{
                required: true,
                message: '请选择日期和时间',
                trigger: 'change, blur'
            }, {
                validator: this.validStart,
            }];
            this.rules.endTime = [{
                required: true,
                message: '请选择日期和时间',
                trigger: 'change, blur'
            }, {
                validator: this.validStart,
            }];
            this.rules.subOfflineTime = [{
                required: true,
                message: '请选择日期和时间',
                trigger: 'change, blur'
            }, {
                validator: this.validStart,
            }];
            console.log(this.rules)
        },
        methods: {
            validGoodsTitle (rule, value, callback){
                // 验证商品标题是否重复
                let param = {
                    title: value,
                    merchantSid: this.$root.userInfo.merchantSid,
                    sid: this.$route.query.spuSid
                };
                this.$http.get(this.$api.spu + 'validate', {params: param})
                    .then(result => {
                        if(result.body.code === 200 && result.body.data){
                            callback(new Error('不能添加商品标题重复的商品'))
                        } else {
                            callback();
                        }
                    }).catch(error => {
                    callback();
                    console.log(error)
                })
            },
            validStart(rule, value, callback){
                // 验证三个征订时间
                // 比较时间大小
                function compareTime(time1, time2){
                    return new Date(time1).getTime() < new Date(time2).getTime();
                }
                if(rule.field === 'startTime'){
                    if(this.goodsBasis.endTime && compareTime(this.goodsBasis.endTime, value)){
                        callback(new Error('开始时间不能晚于结束时间'))
                    }else {
                        callback();
                    }
                }else if(rule.field === 'endTime'){
                    if(this.goodsBasis.subOfflineTime && compareTime(this.goodsBasis.subOfflineTime, value)){
                        callback(new Error('结束时间不能晚于下架时间'))
                    }else if(this.goodsBasis.startTime && compareTime(value, this.goodsBasis.startTime)){
                        callback(new Error('结束时间不能早于开始时间'))
                    }else {
                        callback();
                    }
                }else if(rule.field === 'subOfflineTime'){
                    if(this.goodsBasis.endTime && compareTime(value, this.goodsBasis.endTime)){
                        callback(new Error('下架时间不能早于结束时间'))
                    }else {
                        callback();
                    }
                }
            },
            brandCB(bool){
                // 是否拥有品牌的回调
                this.notBrand = bool;
            },
            getGoodsInfo (){		// 获取商品信息
                this.$http.get(this.$api.spu + 'merchant/' + this.$route.query.spuSid)
                    .then((result) => {
                        this.goodsBasis = result.body.data;
                        if(this.goodsBasis.spuvoCategories == null){	// 代理商的分组后台返回默认为null
                            this.goodsBasis.spuvoCategories = [];
                        }
                        for(let i=0;i<this.goodsBasis.spuImagesvo.length;i++){		// 初始化商品图片内容
                            this.goodsBasis.spuImagesvo[i].url = this.goodsBasis.spuImagesvo[i].path;
                        }
                        this.goodsBasisDefault = JSON.parse(JSON.stringify(this.goodsBasis));
                        // 征订初始化时间
                        let date = this.subscribeDate;
                        date.startDate = Date.stringToDate(this.goodsBasis.startTime);
                        date.startTime = Date.stringToDate(this.goodsBasis.startTime);
                        date.startCallback = this.goodsBasis.startTime.split(' ')[0];
                        date.startTimeCallback = this.goodsBasis.startTime.split(' ')[1];
                        date.endDate = Date.stringToDate(this.goodsBasis.endTime);
                        date.endTime = Date.stringToDate(this.goodsBasis.endTime);
                        date.endCallback = this.goodsBasis.endTime.split(' ')[0];
                        date.endTimeCallback = this.goodsBasis.endTime.split(' ')[1];
                        date.offlineDate = Date.stringToDate(this.goodsBasis.subOfflineTime);
                        date.offlineTime = Date.stringToDate(this.goodsBasis.subOfflineTime);
                        date.offlineCallback = this.goodsBasis.subOfflineTime.split(' ')[0];
                        date.offlineTimeCallback = this.goodsBasis.subOfflineTime.split(' ')[1];
                    }).catch((error) => {
                    console.log(error)
                })
            },
            handleStart(time){  // 一下6个方法用于选择时间的逻辑
                let date = this.subscribeDate;
                date.startCallback = time;
                if(date.startTimeCallback){
                    this.goodsBasis.startTime = time + ' ' + date.startTimeCallback;
                }
            },
            handleEnd(time){
                let date = this.subscribeDate;
                date.endCallback = time;
                if(date.endTimeCallback){
                    this.goodsBasis.endTime = time + ' ' + date.endTimeCallback;
                }
            },
            handleOffline(time){
                let date = this.subscribeDate;
                date.offlineCallback = time;
                if(date.offlineTimeCallback){
                    this.goodsBasis.subOfflineTime = time + ' ' + date.offlineTimeCallback;
                }
            },
            handleStartTime(time){
                let date = this.subscribeDate;
                date.startTimeCallback = time;
                if(date.startCallback){
                    this.goodsBasis.startTime = date.startCallback + ' ' + time;
                }
            },
            handleEndTime(time){
                let date = this.subscribeDate;
                date.endTimeCallback = time;
                if(date.endCallback){
                    this.goodsBasis.endTime = date.endCallback + ' ' + time;
                }
            },
            handleOfflineTime(time){
                let date = this.subscribeDate;
                date.offlineTimeCallback = time;
                if(date.offlineCallback){
                    this.goodsBasis.subOfflineTime = date.offlineCallback + ' ' + time;
                }
            },
            nextStep (){
                // 下一步
                // 验证类目
                let pass = true;
                // 验证可以直接验证的
                this.$refs.basisForm.validate((valid) => {
                    if(!valid){
                        pass = false;
                    }
                });
                if(!pass) return;
                var methodName = 'post';
                var url = ['spuSubscribe'];
                if(this.$route.query.spuSid){
                    // 无改变直接跳过
                    let data = JSON.parse(JSON.stringify(this.goodsBasis));
                    for(let i=0;i<data.spuImagesvo.length;i++){
                        delete data.spuImagesvo[i].uid;
                        delete data.spuImagesvo[i].status
                    }
                    if(JSON.stringify(data) === JSON.stringify(this.goodsBasisDefault)){
                        data = null;
                        let query = JSON.parse(JSON.stringify(this.$route.query));
                        query.step = 1;
                        router.replace({path: this.$route.path,query: query});
                        this.stepsActive = 1;
                        return;
                    }
                    methodName = 'put';
                    url.push(this.$route.query.spuSid);
                }
                // 提交之前如果没有主图把第一张设置为主图
                let hasMain = this.goodsBasis.spuImagesvo.some(value => {
                    return value.main;
                });
                if(!hasMain){
                    this.goodsBasis.spuImagesvo[0].main = true;
                }
                this.buttonLoading = true;	// 禁用按钮
                this.$http[methodName](url,this.goodsBasis)
                    .then((result) => {
                        this.buttonLoading = false;
                        if(result.body.code === 200){
                            this.goodsBasisDefault = JSON.parse(JSON.stringify(this.goodsBasis));
                            for(let i=0;i<this.goodsBasisDefault.spuImagesvo.length;i++){
                                delete this.goodsBasisDefault.spuImagesvo[i].uid;
                                delete this.goodsBasisDefault.spuImagesvo[i].status
                            }
                            let query = JSON.parse(JSON.stringify(this.$route.query))
                            query.step = 1;
                            query.spuSid = this.$route.query.spuSid || result.body.data;
                            router.replace({path: this.$route.path,query: query})
                            this.$route.query.spuSid = result.body.data;
                            this.stepsActive = 1;
//                            this.getDefaultAttr();
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((error) => {
                    console.log(error)
                });
            },
            showSku(bool){
                // 是否应该显示SKU表格的回调
                this.showSkuTable = bool;
            },
            addSkuData (type){
                // 新增或修改库存数据
                // 判断数据是否符合规定
//                let editSkuCheck = this.$refs.editSku.checkData();
//                if(!editSkuCheck.pass){
//                    this.skuErrorTips = editSkuCheck.msg;
//                    this.$message.error(editSkuCheck.msg);
//                    return;
//                }
                // 对比数据是否有改变，仅针对库存数据一块，没有改变直接返回列表
//                var dataChange = true;
//                if(this.$refs.editSku.checkDataChange()){
//                    dataChange = false;
//                    if(type === 'save'){
//                        let query = {btn: this.$route.query.btn, pageIndex: 1, type: 'Assist', agent: 0, states: 'Storage'};
//                        if(this.goodsBasis.state === 'AgentRefuse' || this.goodsBasis.state === 'CloudRefuse'){
//                            query.states = 'Refuse';
//                        }
//                        this.$router.replace({path:'/m_product/special', query: query});
//                        return;
//                    }
//                }
                let editAttrCheck = this.$refs.editAttr.checkData();
                if(!editAttrCheck.pass){
                    this.skuErrorTips = editAttrCheck.msg;
                    this.$message.error(editAttrCheck.msg);
                    return;
                }
                this.buttonLoading = true;
                this.$refs.editSku.submitData(type, result => {
                    this.buttonLoading = false;
                    if(result.body.code === 200){
                        let query = {btn: this.$route.query.btn, pageIndex: 1, type: 'General'};
                        if(type === 'online'){
                            query.states = 'Selling';
                            router.replace({path:'/m_product/subscribe', query: query});
                        }else if(type === 'save'){
                            query.states = 'Storage';
                            router.replace({path:'/m_product/subscribe', query: query});
                        }
                    }else{
                        this.$message({type:'warning',message:result.body.message});
                    }
                });



                // 判断数据是否符合规定
//                if(this.selectTemp.length === 0){
//                    this.attrErrorTips = '请添加商品规格';
//                    return;
//                }
//                let pass= true;
//                for(let i=0;i<this.selectTemp.length;i++){
//                    if(this.selectTemp[i].children.length === 0){
//                        this.attrErrorTips = '商品规格值不能为空';
//                        pass= false;
//                    }
//                }
//                if(!pass) return;
                // 对比数据是否有改变，仅针对库存数据一块
//                var dataChange = true;
//                // 处理提交数据
//                var data= [];
//                if(dataChange){
//                    for(let key in this.attrSkuData){
//                        data.push(this.attrSkuData[key]);
//                    }
//                }
//                var url = '';
//                if(type === 'online'){
//                    // 上架带保存数据
//                    let sid = this.goodsBasis.sid || this.$route.query.spuSid;
//                    url = ['subscribeOnlinesave', sid];
//                }else {
//                    url = ['subscribeSkuSave'];
//                }
//                this.buttonLoading = true;
//                this.$http.post(url, data)
//                    .then((result) => {
//                        this.buttonLoading = false;
//                        if(result.body.code === 200){
//                            let query = {btn: this.$route.query.btn, pageIndex: 1, type: 'General'};
//                            if(type === 'online'){
//                                query.states = 'Selling';
//                                router.replace({path:'/m_product/subscribe', query: query});
//                            }else if(type === 'save'){
//                                query.states = 'Storage';
//                                router.replace({path:'/m_product/subscribe', query: query});
//                            }
//                        }else{
//                            this.$message({type:'warning',message:result.body.message});
//                        }
//                    }).catch((err) => {
//                    console.log(err)
//                })
            },
            lastStep (){	// 上一步
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.step = 0;
                router.replace({path: this.$route.path,query: query});
                this.stepsActive = 0;
            },
        }
    }
</script>

<style>
    .goods-add .score-mall{
        width: 100px;
    }
</style>
