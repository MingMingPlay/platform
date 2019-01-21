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
                    <div class="cate-title">商品类目与分组</div>
                    <select-category
                        v-model="goodsBasis.categorySid"
                        ref="selectCategory">
                    </select-category>

                    <cell-wraper title="商品品牌" :isRequired="true">
                        <el-form-item required prop="brandSid">
                            <select-brand v-model="goodsBasis.brandSid" @callback="brandCB"></select-brand>
                        </el-form-item>
                    </cell-wraper>

                    <cell-wraper title="商品分组">
                        <el-form-item>
                            <select-group v-model="goodsBasis.spuvoCategories"></select-group>
                        </el-form-item>
                    </cell-wraper>
                </div>

                <div class="cate-wrap">
                    <div class="cate-title">商品详情</div>

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

                    <cell-wraper title="商品详情">
                        <el-form-item required prop="description">
                            <detail-editor v-model="goodsBasis.description"></detail-editor>
                        </el-form-item>
                    </cell-wraper>

                    <cell-wraper title="运费" :isRequired="true">
                        <el-form-item required prop="templateSid">
                            <select-shipping v-model="goodsBasis.templateSid" :joinScoreMall="joinScoreMall"></select-shipping>
                        </el-form-item>
                    </cell-wraper>

                    <cell-wraper title="积分设置">
                        <el-form-item>
                            <el-input
                                class="score-mall"
                                :disabled="goodsBasis.ifPromotion"
                                v-model="goodsBasis.benefitNumber"
                                @keyup.native="goodsBasis.benefitNumber = pubObj.formatInt($event)"
                                @blur="calcScore"></el-input>
                            <span v-if="joinScoreMall">分　<span style="color: #f00;">兑换该商品　</span></span>
                            <span v-else>
                                分　抵扣金额
                                <el-button type="text" :loading="ScoreMoneyLoading">{{ScoreMoney}}</el-button>元　
                            </span>
                            <el-checkbox
                                v-model="joinScoreMall"
                                :disabled="goodsBasis.ifPromotion"
                                @change="calcScore"
                                style="color: #f00;">
                                加入积分商城
                            </el-checkbox>
                            <p v-if="goodsBasis.ifPromotion">该商品已加入促销活动</p>
                        </el-form-item>
                    </cell-wraper>

                    <!--做集采时，把注释放开-->
                    <!--<cell-wraper title="加入集采">-->
                        <!--<el-form-item prop="groupPurchase">-->
                            <!--<edit-purchase-->
                                <!--:ifGroupPurchase="goodsBasis.ifGroupPurchase"-->
                                <!--:groupPurchase="goodsBasis.groupPurchase"-->
                                <!--@change="purchaseCallback">-->
                            <!--</edit-purchase>-->
                        <!--</el-form-item>-->
                    <!--</cell-wraper>-->
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

                    <cell-wraper title="商品库存" :isRequired="true" v-show="showSkuTable">
                        <el-form-item :error="skuErrorTips">
                            <edit-sku
                                :spuSid="goodsBasis.sid"
                                :batchSkuData="batchSkuData"
                                @show-sku="showSku"
                                ref="editSku">
                            </edit-sku>
                        </el-form-item>
                    </cell-wraper>
                </div>
            </div>
        </el-form>

        <div class="button-group" v-show="stepsActive === 0">
            <el-button type="info" v-show="notBrand" @click="nextStep" :loading="buttonLoading">下一步</el-button>
            <el-button type="info" v-show="!notBrand" disabled>请联系平台管理员添加品牌</el-button>
        </div>
        <div class="button-group" v-show="stepsActive === 1">
            <el-button type="info" @click="lastStep">上一步</el-button>
            <el-button type="warning"
                       v-if="shopInfo.exemption"
                       @click="addSkuData('online')"
                       :loading="buttonLoading"
                       :disabled="attrBlockLoading">上架</el-button>
            <el-button type="warning"
                       v-else-if="shopInfo.exemption === false"
                       @click="addSkuData('toaudit')"
                       :loading="buttonLoading"
                       :disabled="attrBlockLoading">提交审核</el-button>
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
import SelectCategory from '../common/SelectCategory.vue'
import SelectBrand from '../common/SelectBrand.vue'
import SelectGroup from '../common/SelectGroup.vue'
import SelectShipping from '../common/SelectShipping.vue'
import EditAttr from '../common/EditAttr.vue'
import EditSku from '../common/EditSku.vue'
import DetailEditor from '../common/DetailEditor.vue'
import MainUpload from '../common/MainUpload.vue'
import EditPurchase from '../common/EditPurchase.vue'
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
                        title:'自营商品',
//                        to: {path:'/m_product/self', query:this.$route.query}
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
                    brandSid: '',
                    type: 'General',	// General(1, "普通商品"),Assist(2, "行销商品")
                    categorySid: '',
                    description: '',
                    spuImagesvo: [],
                    spuvoCategories: [],
                    templateSid: '',    // 运费模板的sid
                    benefit: '',        // 积分类型（ 1, "全额抵扣",2, "部分抵扣",0, "不抵扣"）
                    benefitNumber: '',  // 积分抵扣数量
                    //做集采时，把注释放开
//                    ifGroupPurchase: '',// 是否加入集采商城
//                    groupPurchase: '',// 集采数量
                },
                rules,
                joinScoreMall: false,   // 是否加入积分商城
                ScoreMoney: 0,          // 抵扣金额
                ScoreMoneyLoading: false,   // 抵扣金额计算获取是的loading

                // ------------------步骤二--------------------
                batchSkuData,
                purchasePrice: {
                    name: '集采价',
                    type: 'purchasePrice',
                    switch: false,
                    amount: null,
                    required: true,
                    allowZero: false,
                    isInt: false,
                },
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
            SelectCategory,
            SelectBrand,
            SelectGroup,
            SelectShipping,
            EditAttr,
            EditSku,
            DetailEditor,
            MainUpload,
            EditPurchase,
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
            // 是否加入集采验证
            this.rules.groupPurchase = [{
                validator: this.validPurchase,
                trigger: 'blur'
            }];
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
            validPurchase(rule, value, callback){
                // 是否加入集采验证
                if(this.goodsBasis.ifGroupPurchase && !value){
                    callback(new Error('请输入集采数量'));
                }else {
                    callback();
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
                        // 初始化是否加入积分商城
                        if(this.goodsBasis.benefit === 1){
                            this.joinScoreMall = true;
                        }else if(this.goodsBasis.benefit === 2){
                            // 如果是部分抵扣，计算抵扣金额
                            this.calcScore();
                        }
                        this.handleBatchData();
                    }).catch((error) => {
                    console.log(error)
                })
            },
            // 计算积分抵扣的金额
            calcScore(){
                if(!this.goodsBasis.benefitNumber){
                    return false;
                }else if(this.goodsBasis.benefitNumber < 100){
                    this.$message.warning('积分数量不能小于100');
                    return false;
                }
                let temp = this.goodsBasis.benefitNumber;
                this.goodsBasis.benefitNumber = parseInt(temp/100, 10)*100;
                if(+temp !== this.goodsBasis.benefitNumber){
                    this.$message.warning('积分数量必须为100的整数倍');
                }
                if(!this.joinScoreMall){
                    this.ScoreMoneyLoading = true;
                    this.$http.get(['memberCalcScore', this.goodsBasis.benefitNumber])
                        .then(result => {
                            if(result.body.code === 200){
                                this.ScoreMoneyLoading = false;
                                this.ScoreMoney = result.body.data;
                            }
                        })
                }
            },
            purchaseCallback(ifGroupPurchase, groupPurchase){
                // 是否加入集采商城操作回调
                this.goodsBasis.ifGroupPurchase = ifGroupPurchase;
                this.goodsBasis.groupPurchase = groupPurchase;
            },
            handleBatchData(){
                // 对需要设置的价格字段根据是否加入集采商城进行调整
                let havePurchase = false;// 是否包含集采价
                let skuIndex = 0;// 库存在数组中的索引，因为要把集采价加到库存前面
                let purIndex = 0;// 集采价在数组中的索引，如果有集采价，但没有加入集采商城时，需要移除
                havePurchase = this.batchSkuData.some((value, index) => {
                    if(value.name === '库存'){
                        skuIndex = index;
                    }
                    if(value.name === '集采价'){
                        purIndex = index;
                        return true;
                    }else {
                        return false;
                    }
                });
                if(this.goodsBasis.ifGroupPurchase && !havePurchase){
                    this.batchSkuData.splice(skuIndex, 0, this.purchasePrice)
                }else if(!this.goodsBasis.ifGroupPurchase && havePurchase){
                    this.batchSkuData.splice(purIndex, 1)
                }
            },
            nextStep (ifValid){
                // 下一步
                // ifValid 参数说明：由于验证规则里面的 title 字段验证包含有异步验证，所以这里的验证结果不是同步返回的，用这个字段绕一下
                // 验证可以直接验证的
                if(ifValid !== true){
                    this.$refs.basisForm.validate((valid) => {
                        if(valid){
                            this.nextStep(true);
                        }
                    });
                    return false;
                }
                // 验证类目，不通过就return
                if(!this.$refs.selectCategory.checkData()) return;
                // 提交之前对积分进行处理
                if(this.goodsBasis.benefitNumber){
                    if(this.joinScoreMall){
                        this.goodsBasis.benefit = 1;
                    }else {
                        this.goodsBasis.benefit = 2;
                    }
                    if(this.goodsBasis.benefitNumber < 100){
                        this.$message.warning('积分数量不能小于100');
                        return false;
                    }
                }else {
                    this.goodsBasis.benefit = 0;
                }
                var methodName = 'post';
                var url = this.$api.spu;
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
                    url += this.$route.query.spuSid;
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
                            if(result.body.data){
                                this.$route.query.spuSid = result.body.data;
                            }
                            this.stepsActive = 1;
                            //做集采时，把注释放开
                            this.handleBatchData();
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
                let editAttrCheck = this.$refs.editAttr.checkData();
                if(!editAttrCheck.pass){
                    this.skuErrorTips = editAttrCheck.msg;
                    this.$message.error(editAttrCheck.msg);
                    return;
                }
                let editSkuCheck = this.$refs.editSku.checkData();
                if(!editSkuCheck.pass){
                    this.skuErrorTips = editSkuCheck.msg;
                    this.$message.error(editSkuCheck.msg);
                    return;
                }
                this.$refs.editSku.clearPurchase();
                // 对比数据是否有改变，仅针对库存数据一块，没有改变直接返回列表
                var dataChange = true;
                if(this.$refs.editSku.checkDataChange()){
                    dataChange = false;
                    if(type === 'save'){
                        let query = {btn: this.$route.query.btn, pageIndex: 1, type: 'General', states: 'Storage'};
                        if(this.goodsBasis.state === 'CloudRefuse'){
                            query.states = 'Refuse';
                        }
                        router.replace({path:'/m_product/self', query: query});
                        return;
                    }
                }
                this.buttonLoading = true;
                this.$refs.editSku.submitData(type, result => {
                    this.buttonLoading = false;
                    if(result.body.code === 200){
                        this.$message.success(result.body.message);
                        let query = {btn: this.$route.query.btn, pageIndex: 1, type: 'General'};
                        if(type === 'toaudit'){
                            query.states = 'CloudCheck';
                            router.replace({path:'/m_product/self', query: query});
                        }else if(type === 'online'){
                            query.states = 'Selling';
                            router.replace({path:'/m_product/self', query: query});
                        }else if(type === 'save'){
                            if(this.goodsBasis.state === 'CloudRefuse'){
                                query.states = 'Refuse';
                            }else{
                                query.states = 'Storage';
                            }
                            router.replace({path:'/m_product/self', query: query});
                        }
                    }else{
                        this.$message.warning(result.body.message);
                    }
                });
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
