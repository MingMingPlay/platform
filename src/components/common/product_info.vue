<template>
    <div class="product-info-template">
        <div class="goods-title">
            <div class="title">{{goodsInfo.title}}<span class="state">{{goodsInfo.stateName}}</span></div>
            <div class="sub-title">{{goodsInfo.subTitle}}</div>
        </div>
        <div class="goods-cell">
            <div class="title">商品基本信息</div>
            <div class="goods-info clear">
                <div class="left">
                    <p class="info-cell clear">
                        <span class="info-title">商品类型：</span>
                        <span class="info-content">{{goodsInfo.typeName}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">商品分类：</span>
                        <span class="info-content">{{goodsInfo.categoryName}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">商品品牌：</span>
                        <span class="info-content">{{goodsInfo.brandName}}</span>
                    </p>
                    <p class="info-cell clear" v-if="goodsInfo.type == 'General'">
                        <span class="info-title">所属店铺：</span>
                        <span class="info-content">{{goodsInfo.shopName}}</span>
                    </p>
                    <p class="info-cell clear" v-if="goodsInfo.type == 'Assist'">
                        <span class="info-title">供货店铺：</span>
                        <span class="info-content">{{goodsInfo.shopName}}</span>
                    </p>
                    <p class="info-cell clear" v-if="goodsInfo.type == 'Assist'">
                        <span class="info-title">代理店铺：</span>
                        <span class="info-content">{{goodsInfo.agentShopName}}</span>
                    </p>
                </div>
                <div class="right">
                    <div class="goods-image-wrap" v-for="(item, index) in goodsInfo.spuImagesvo">
                        <img class="goods-image" :src="item.path" alt="商品图片">
                        <p class="main" v-if="index == 0">主图</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="goods-cell">
            <div class="title">商品数据</div>
            <div class="goods-info clear">
                <p class="goods-data">
                    <span class="data-title">库存余量：</span>
                    <span class="data-content">{{goodsInfo.inventory}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">创建时间：</span>
                    <span class="data-content">{{goodsInfo.createdTime || '--'}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">上架时间：</span>
                    <span class="data-content">{{goodsInfo.onlineTime || '--'}}</span>
                </p>
                <!--做集采时，把注释放开-->
                <!--<p class="goods-data">-->
                    <!--<span class="data-title" style="width: 90px;">集采：</span>-->
                    <!--<span class="data-content">{{goodsInfo.ifGroupPurchase ? '是' : '否'}}</span>-->
                <!--</p>-->
                <p class="goods-data"></p>
                <p class="goods-data">
                    <span class="data-title">销售总量：</span>
                    <span class="data-content">{{goodsInfo.merchantSpuNum}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">审核时间：</span>
                    <span class="data-content">{{goodsInfo.auditTime || '--'}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">下架时间：</span>
                    <span class="data-content">{{goodsInfo.offlineTime || '--'}}</span>
                </p>
                <!--做集采时，把注释放开-->
                <!--<p class="goods-data" v-if="goodsInfo.ifGroupPurchase">-->
                    <!--<span class="data-title" style="width: 90px;">集采起售数量：</span>-->
                    <!--<span class="data-content">{{goodsInfo.groupPurchase || '&#45;&#45;'}}</span>-->
                <!--</p>-->
                <p class="goods-data"></p>
                <p class="goods-data" v-if="goodsInfo.benefit === 2">
                    <span class="data-title">积分抵扣：</span>
                    <span class="data-content">{{goodsInfo.benefitNumber + '分' || '--'}}</span>
                </p>
                <p class="goods-data" v-if="goodsInfo.benefit === 1">
                    <span class="data-title">积分商城：</span>
                    <span class="data-content">已加入</span>
                </p>
                <p class="goods-data" v-if="goodsInfo.benefit === 1">
                    <span class="data-title">积分数量：</span>
                    <span class="data-content">{{goodsInfo.benefitNumber + '分' || '--'}}</span>
                </p>
            </div>
        </div>
        <div class="goods-cell">
            <div class="title">商品规格</div>
            <table border="1" class="goods-sku-table">
                <tr>
                    <th>图片</th>
                    <th v-for="item in selectTableTitle" v-if="item.children.length > 0">{{item.name}}</th>
                    <th v-for="item in batchSkuData">{{item.name}}</th>
                </tr>
                <tr v-for="(value, key, n) in attrSkuData">
                    <td v-for="(item, index) in selectTableTitle"
                        width="100"
                        :rowspan="rowspan(index)"
                        v-if="isShow(n, index) && index == 0">
                        <div class="attr-img" v-if="currentText(n, index, 'img')">
                            <img :src="currentText(n, index, 'img')" alt="规格图片">
                        </div>
                        <span v-else>无</span>
                    </td>
                    <td v-for="(item, index) in selectTableTitle"
                        :width="attrWidth/selectTableTitle.length"
                        :rowspan="rowspan(index)"
                        v-if="isShow(n, index)"
                    >{{currentText(n, index)}}</td>
                    <td width="100" v-for="item in batchSkuData">
                        <div v-if="item.type == 'inventory' || item.type == 'minimum'">
                            {{(value[item.type] === '' || value[item.type] == undefined) ? '--' : value[item.type]}}
                        </div>
                        <div v-else>
                            <span v-if="value[item.type]">{{value[item.type] | currency}}</span>
                            <span v-else>--</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="goods-cell">
            <div class="title">商品运费</div>
            <div class="template-wrapper goods-info" v-if="goodsInfo.templateSid && shippingData.templateVO">
                <div class="header">
                    <div style="overflow: hidden; line-height: 26px;">
                        <span class="template-name">{{ shippingData.templateVO.name }}</span>
                        <span class="template-name" v-if="shippingData.freePolicyVOList.length > 0">(已指定条件包邮)</span>
                    </div>
                </div>
                <div class="content">
                    <el-table stripe :data="shippingData.policyVOList">
                        <el-table-column label="运送方式" prop="shippingTypeName" width="140"></el-table-column>
                        <el-table-column label="运送到" prop="areaNames"></el-table-column>
                        <el-table-column label="首件" prop="minCount" width="140"></el-table-column>
                        <el-table-column label="运费" prop="minAmountValue" width="140"></el-table-column>
                        <el-table-column label="续件" prop="increaseCount" width="140"> </el-table-column>
                        <el-table-column label="运费" prop="increaseAmountValue" width="140"></el-table-column>
                    </el-table>
                </div>
            </div>

            <table border="1" class="goods-sku-table" v-else>
                <tr>
                    <th>首件（个）</th>
                    <th>运费（元）</th>
                    <th>续件（个）</th>
                    <th>运费（元）</th>
                </tr>
                <tr>
                    <td>{{goodsInfo.firstPieces || '--'}}</td>
                    <td>{{goodsInfo.firstFee || '--'}}</td>
                    <td>{{goodsInfo.secondPieces || '--'}}</td>
                    <td>{{goodsInfo.secondFee || '--'}}</td>
                </tr>
            </table>
        </div>

        <div class="goods-cell">
            <div class="title">商品详情</div>
            <div class="goods-info">
                <div class="goods-detail-wrap" v-html="goodsInfo.description"></div>
            </div>
        </div>
        <!-- 下架的dialog -->
        <el-dialog title="下架提示" v-model="offlineDialog" @close="dialogClose" size="tiny">
            <el-form :model="offlineForm" ref="offlineForm" :rules="offlineFormRules">
                <el-form-item>
                    确定将该商品下架吗？<span style="color: #f00">（该商品将停止销售）</span>
                </el-form-item>
                <el-form-item label="下架说明" label-width="84px" prop="opinion">
                    <el-input type="textarea" v-model="offlineForm.opinion"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="offlineDialog = false">取 消</el-button>
                <el-button type="primary" @click="offlineGoodsConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="审核提示" v-model="auditDialog" @close="dialogClose1" size="tiny">
            <el-form :model="auditForm" ref="auditForm" :rules="auditFormRules">
                <el-form-item>
                    确定不通过该商品的审核吗？
                </el-form-item>
                <el-form-item label="审核意见" label-width="84px" prop="opinion">
                    <el-input type="textarea" v-model="auditForm.opinion"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditDialog = false">取 消</el-button>
                <el-button type="primary"
                           v-if="goodsInfo.state == 'CloudCheck'"
                           @click="auditSubmit(goodsInfo.sid, 'CloudRefuse')">确 定</el-button>
                <el-button type="primary"
                           v-if="goodsInfo.state == 'AgentCheck'"
                           @click="auditSubmit(goodsInfo.sid, 'AgentRefuse')">确 定</el-button>
            </div>
        </el-dialog>

        <div class="button-group">
            <el-button type="success" v-if="goodsInfo.state == 'CloudCheck'"
                       @click="onlineGoods(goodsInfo.sid)">审核通过</el-button>
            <el-button type="danger" v-if="goodsInfo.state == 'CloudCheck'"
                       @click="auditGoods(goodsInfo.sid, 'CloudRefuse')">审核不通过</el-button>
            <el-button type="success" v-if="goodsInfo.state == 'AgentCheck'"
                       @click="auditGoods(goodsInfo.sid, 'Approval')">审核通过</el-button>
            <el-button type="danger" v-if="goodsInfo.state == 'AgentCheck'"
                       @click="auditGoods(goodsInfo.sid, 'AgentRefuse')">审核不通过</el-button>
            <el-button type="danger" v-if="goodsInfo.state == 'Online' && $route.query.agent !== '1' && !goodsInfo.ifPromotion"
                       @click="offlineGoods(goodsInfo.sid)">下架</el-button>
        </div>
    </div>
</template>
<script>
    // 商品详情组件
    export default {
        props: ['batchSkuData', 'attrWidth'],
        data() {
            return {
                goodsInfo: {},
                attrSkuData: {},
                selectTableTitle: [],
                attrSkuDataLen: 1,
                shippingData: {},
                offlineForm: {
                    spuSid: '',
                    opinion: ''
                },
                offlineDialog: false,
                offlineFormRules: {
                    opinion: [{
                        required: true,
                        message: '请说明下架理由',
                        targger: 'blur'
                    }]
                },
                auditForm: {
                    spuSid: '',
                    opinion: '',
                    stateCode: ''
                },
                auditDialog: false,
                auditFormRules: {
                    opinion: [{
                        required: true,
                        message: '请说明不通过理由',
                        targger: 'blur'
                    }]
                },
                purchasePrice: {
                    name: '集采价',
                    type: 'purchasePrice',
                    switch: false,
                    amount: null,
                },
            }
        },
        created (){
            this.getGoodsInfo();
            this.getSkuData();
        },
        methods: {
            getGoodsInfo (){		// 获取商品信息
                this.$http.get(this.$api.spu + this.$route.query.spuSid)
                    .then((result) => {
                        this.goodsInfo = result.body.data;
                        if(this.goodsInfo.templateSid){
                            this.getShipping(this.goodsInfo.templateSid);
                        }
                        //做集采时，把注释放开
//                        this.handleBatchData();
                    }).catch((error) => {
                    console.log(error)
                })
            },
            getShipping(sid){   // 获取运费模板详情
                this.$http.get(['shippingTemplateDetail', sid])
                    .then(result => {
                        if(result.body.code === 200){
                            this.shippingData = result.body.data;
                        }
                    })
            },
            getSkuData (){		// 获取库存信息
                this.$http.get(this.$api.sku + this.$route.query.spuSid, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                        if(result.body.code === 200){
                            for(let i=0;i<result.body.data.length;i++){
                                this.attrSkuData[result.body.data[i].attrCode] = result.body.data[i];
                            }
                            this.getGoodsAttr();
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                    console.log(err)
                })
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
                if(this.goodsInfo.ifGroupPurchase && !havePurchase){
                    this.batchSkuData.splice(skuIndex, 0, this.purchasePrice)
                }else if(!this.goodsInfo.ifGroupPurchase && havePurchase){
                    this.batchSkuData.splice(purIndex, 1)
                }
            },
            getGoodsAttr (){		// 获取商品的规格
                this.$http.get(this.$api.sku + 'skuattr/' + this.$route.query.spuSid, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                        if(result.body.code === 200){
                            let data = result.body.data;
                            this.attrSkuDataLen = 1;
                            for(let i=0;i<data.length;i++){
                                this.attrSkuDataLen = this.attrSkuDataLen * data[i].children.length
                            }
                            this.selectTableTitle = this.delNotChildren(data);
                            this.attrSkuData = this.formatSkuData(data);
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            formatSkuData (selectTemp){		// 把规格的数据组合成库存需要的数据
                let attrSkuDataTemp = this.attrSkuData;
                function format(obj1, obj2) {		// 组合数据的方法
                    if(JSON.stringify(obj1) === '{}'){
                        for(let j=0;j<obj2.length;j++){
                            if(attrSkuDataTemp[obj2[j].code]){
                                obj1[obj2[j].code] = attrSkuDataTemp[obj2[j].code];
                            }else{
                                obj1[obj2[j].code] = {
                                    attrCode: obj2[j].code,
                                };
                            }
                        }
                    }else{
                        for(let key in obj1){
                            for(let a=0;a<obj2.length;a++){
                                if(attrSkuDataTemp[key +'|'+ obj2[a].code]){
                                    obj1[key +'|'+ obj2[a].code] = attrSkuDataTemp[key +'|'+ obj2[a].code];
                                }else{
                                    obj1[key +'|'+ obj2[a].code] = {
                                        attrCode: key +'|'+ obj2[a].code,
                                    };
                                }
                            }
                            delete obj1[key]
                        }
                    }
                    return obj1;
                }
                let attrSkuData = {};
                for(let i=0;i<selectTemp.length;i++){	// 循环调用组合数据方法
                    if(JSON.stringify(selectTemp[i].children) != '[]'){
                        attrSkuData = format(attrSkuData, selectTemp[i].children);
                    }
                }
                return attrSkuData;
            },
            delNotChildren (params){		// 删除属性值为空数据，表格展示有用
                var data = [];
                for(let i=0;i<params.length;i++){
                    if(JSON.stringify(params[i].children) !== '[]'){
                        data.push(params[i]);
                    }
                }
                return data;
            },
            rowspan (index){		// 生成库存表格向下合并的行
                if(index === this.selectTableTitle.length - 1){
                    return null;
                }else{
                    var t = 1;
                    for(var i=0;i<=index;i++){
                        t = t * this.selectTableTitle[i].children.length;
                    }
                    return this.attrSkuDataLen/t;
                }
            },
            isShow (n, index){		// 被合并的行不能显示
                if(index === this.selectTableTitle.length - 1){
                    return true;
                }else{
                    var t = 1;
                    for(var i=0;i<=index;i++){
                        t = t * this.selectTableTitle[i].children.length;
                    }
                    return n%(this.attrSkuDataLen/t) === 0;
                }
            },
            currentText (n, index, type){		// 显示的行当前应该显示的数据
                var tem1 = 1,
                    tem2 = 1,
                    row1 = null,	// 一轮数据所跨行
                    row2 = null;	// 自己跨的行
                for(let i=0;i<index;i++){
                    tem1 = tem1 * this.selectTableTitle[i].children.length;
                }
                for(let i=0;i<=index;i++){
                    tem2 = tem2 * this.selectTableTitle[i].children.length;
                }
                row1 = this.attrSkuDataLen/tem1;
                row2 = this.attrSkuDataLen/tem2;
                var a = parseInt(n%row1/row2);
                var re = null;
                if(type === 'img'){
                    re = this.selectTableTitle[index].children[a]?this.selectTableTitle[index].children[a].imagePath:'无';
                }else {
                    re = this.selectTableTitle[index].children[a]?this.selectTableTitle[index].children[a].name:'';
                }
                return re;
            },
            onlineGoods (sid){		// 商品通过审核后上架
                this.$confirm('确定通过审核吗?（通过审核后将直接上架）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$http.post(this.$api.spu + 'audit/online/' + sid)
                        .then((result) => {
                            if(result.body.code == 200){
                                this.$router.go(-1);
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                });
            },
            auditGoods (sid, type){		// 审核商品过程
                this.auditForm.spuSid = sid;
                this.auditForm.stateCode = type;
                if(type === 'AgentRefuse' || type === 'CloudRefuse'){
                    this.auditDialog = true;
                }else {
                    this.auditSubmit(sid, type);
                }
            },
            auditSubmit (sid, type){		// 审核商品提交
                let submitSwitch = false;
                if(type === 'AgentRefuse' || type === 'CloudRefuse'){
                    this.$refs.auditForm.validate(valid => {
                        submitSwitch = valid;
                    })
                }else {
                    submitSwitch = true;
                }
                if(submitSwitch){
                    this.$http.post(this.$api.spu + 'audit/' + sid, this.auditForm)
                        .then((result) => {
                            if(result.body.code === 200){
                                this.$message({type:'success',message:result.body.message});
                                let query = {btn: this.$route.query.btn, pageIndex: 1, type: this.goodsInfo.type};
                                if(this.goodsInfo.state === 'AgentCheck'){
                                    query.agent = 1;
                                }
                                if(type === 'AgentRefuse'){
                                    query.states = 'Refuse';
                                    this.$router.replace({path:'/m_product/special', query: query});
                                }else if(type === 'Approval'){
                                    query.states = 'AStorage';
                                    this.$router.replace({path:'/m_product/special', query: query});
                                }else {
                                    this.$router.go(-1);
                                }
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                }
            },
            offlineGoods (sid){		// 商品下架，打开提示和form弹窗
                this.offlineDialog = true;
                this.offlineForm.spuSid = sid;
            },
            offlineGoodsConfirm (){		// 确认提交下架
                this.$refs.offlineForm.validate((valid) => {
                    if(valid){
                        this.$http.post(this.$api.spu + 'audit/offline', this.offlineForm)
                            .then((result) => {
                                if(result.body.code === 200){
                                    this.$router.go(-1);
                                }
                            }).catch((err) => {
                            console.log(err)
                        })
                    }
                })
            },
            dialogClose (){		// 下架弹窗关闭重置下架表单
                this.$refs.offlineForm.resetFields();
            },
            dialogClose1 (){		// 审核不通过弹窗关闭重置审核表单
                this.$refs.auditForm.resetFields();
            },
        }
    }
</script>
<style>
    .product-info-template .template-wrapper .header {
        padding: 8px 10px;
        background-color: #E8F2FF;
        border: 1px solid #e4eaee;
        border-bottom: none;
    }
    .product-info-template .template-wrapper .template-name {
        font-size: 14px;
        font-weight: bold;
    }
    .product-info-template .template-wrapper .operation-btn-group {
        float: right;
        margin-right: 10px;
    }
</style>
