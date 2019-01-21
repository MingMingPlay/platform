<template>
	<div class="goods-add goods-agent-add">
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<el-steps :space="250" :active="stepsActive" :center="true" :align-center="true">
			<el-step title="商品基本信息"></el-step>
			<el-step title="商品规格与库存"></el-step>
		</el-steps>

		<!-- 商品基本信息 -->
		<div v-show="stepsActive == 0">
			<div class="cate-wrap">
				<div class="cate-title">商品类目与分组</div>
				<div class="cate-cell clear" v-for="(item, index) in cateTempData">
					<div class="cate-subtitle">
						<p class="cell-title"><span class="require">商品{{cateTitle[index]}}级类目</span></p>
					</div>
					<div class="cate">
						<el-form>
							<el-form-item :error="cateErrorTips[index]">
								<label class="custom-button" v-for="value in item" @change="change(item,index)">
									<input type="radio" :value="value" v-model="cateForm[index]" :disabled="cateForm[index] != value"/>
									<span>{{value.name}}</span>
								</label>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span class="require">商品品牌</span></p>
					</div>
					<div class="cate">
						<el-input v-model="goodsBasis.brandName" disabled style="width: 217px;"></el-input>
					</div>
				</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span>商品分组</span></p>
					</div>
					<div class="cate">
						<el-form :model="goodsBasis">
							<el-form-item>
								<div class="goods-group-wrap">
									<el-checkbox-group v-model="goodsBasis.spuvoCategories">
										<template v-for="item in groupData">
											<el-checkbox
													:disabled="item.state == 'Disabled'"
													:label="item.sid"
													v-if="!item.children || item.children.length == 0">
												{{item.name}}
											</el-checkbox>
											<div class="group-item" v-if="item.children">
												<div class="title">{{item.name}}</div>
												<el-checkbox
														:disabled="item1.state == 'Disabled'"
														:label="item1.sid"
														v-for="item1 in item.children">
													{{item1.name}}
												</el-checkbox>
											</div>
										</template>
									</el-checkbox-group>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
			<div class="cate-wrap">
				<div class="cate-title">商品详情</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span>商品信息</span></p>
					</div>
					<div class="cate">
						<el-form ref="basisForm2" :model="goodsBasis" label-width="100px" :rules="rules">
							<el-form-item label="商品主标题:" required prop="title">
								<el-input v-model="goodsBasis.title" disabled></el-input>
							</el-form-item>
							<el-form-item label="商品副标题:" required prop="subTitle">
								<el-input v-model="goodsBasis.subTitle"disabled></el-input>
							</el-form-item>
						</el-form>
						<el-form class="img-margin" ref="basisForm3" :model="goodsBasis" label-width="100px" :rules="rules">
							<el-form-item label="商品图:" required prop="spuImagesvo">
								<el-upload
										   list-type="picture-card"
										   :action="uploadApi"
										   :headers="uploadHeader"
										   :on-preview="handlePictureCardPreview"
										   :file-list="goodsBasis.spuImagesvo"
										   :class="{'hide-upload':true}">
									<i class="el-icon-plus"></i>
								</el-upload>
                                <div>
                                    <p style="width: 114px;text-align: center;">主图</p>
                                </div>
								<!-- 点击预览的dialog -->
								<el-dialog v-model="dialogVisible" size="tiny" title="商品图片">
									<img width="100%" :src="dialogImageUrl" alt="">
								</el-dialog>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span class="require">商品详情</span></p>
					</div>
					<div class="cate ueditor">
						<el-form ref="basisForm4" :model="goodsBasis" :rules="rules">
							<el-form-item required prop="description">
								<div class="editor-upload-img" id="editor-upload-img">
									<label class="button-img">
										<input style="display: none;"
												type="file"
												ref="editorImageFile"
												@change="editorUpload">
									</label>
								</div>
								<VueUeditor ueditorPath="/static/ueditor1_4_3_3/" @ready="editorReady"
											:ueditorConfig="editorConfig"></VueUeditor>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>

		<!-- 商品规格与库存 -->
		<div v-show="stepsActive == 1">
			<div class="cate-wrap" v-show="stepsActive == 1">
				<div class="cate-title">商品规格与库存</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span class="require">商品规格</span></p>
					</div>
					<div class="cate">
						<el-form>
							<el-form-item :error="attrErrorTips">
								<div class="attr-wrap">
									<div v-for="(item, index) in selectTemp">
										<div class="attr-title">
											<span class="attr-name">{{item.name}}</span>
											<i class="el-icon-circle-cross" @click="delAttr(item.sid)"></i>
										</div>
										<div class="attr-value-wrap clear">
											<div class="attr-value" v-for="(item1, index1) in item.children">
												<i class="el-icon-circle-cross" @click="delAttr(item1.sid)"></i>
												<p class="title">{{item1.name}}</p>
												<div class="attr-img" v-if="goodsAttr.attrImg && index == 0 && item1.imagePath">
													<el-upload class="image"
															   :action="uploadApi"
															   :headers="uploadHeader"
															   :show-file-list="false"
															   :data="{'customMessage': item1.sid}"
															   :on-success="attrUploadSuccess"
															   :on-error="attrUploadError"
															   :before-upload="attrUploadBefore"
															   :disabled="true">
														<img v-if="item1.imagePath" :src="item1.imagePath" class="avatar">
														<i v-else class="el-icon-plus"></i>
													</el-upload>
												</div>
											</div>
											<div class="attr-value" v-if="false">
												<el-button type="text" @click="openAddPanel(item)">+ 添加</el-button>
												<div class="attr-value-select" v-if="item.attrSwitch">
													<el-select
															v-model="goodsAttr['attrSelect' + index]"
															filterable
															allow-create
															placeholder="可添加自定义规格">
														<el-option
																v-for="item1 in item.childrenTemp"
																:key="item1.sid"
																:label="item1.name"
																:value="item1.sid">
														</el-option>
													</el-select>
													<el-button type="primary" @click="selectAttrConfirm(goodsAttr['attrSelect' + index], index, item.childrenTemp)" :loading="submitAttrSwitch">确定</el-button>
													<el-button @click="selectAttrConfirm('cancel', index)">取消</el-button>
												</div>
											</div>
											<!--<div class="attr-img-desc" v-if="goodsAttr.attrImg && index == 0 && item.children.length > 0">规格图片建议尺寸：1000x1000像素，非必传！</div>-->
										</div>
									</div>
									<div class="attr-title" v-if="false">
										<el-button icon="plus" type="primary" v-if="!selectSwitch" @click="openAddParentPanel()">添加规格</el-button>
										<div v-if="selectSwitch">
											<el-select
													v-model="goodsAttr.skuSelect"
													filterable
													allow-create
													placeholder="可添加自定义规格">
												<el-option
														v-for="item in defaultAttr"
														:key="item.sid"
														:label="item.name"
														:value="item.sid">
												</el-option>
											</el-select>
											<el-button type="primary" @click="selectSku(goodsAttr.skuSelect, defaultAttr)" :loading="submitAttrSwitch">确定</el-button>
											<el-button @click="selectSku('cancel')">取消</el-button>
										</div>
									</div>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="cate-cell clear" v-if="selectTableTitle.length > 0">
					<div class="cate-subtitle">
						<p class="cell-title"><span class="require">商品库存</span></p>
					</div>
					<div class="cate">
						<el-form>
							<el-form-item :error="skuErrorTips">
								<div class="attr-wrap">
									<div class="table-wrap">
										<table border="1" class="sku-table">
											<tr>
												<th v-for="item in selectTableTitle" v-if="item.children.length > 0">{{item.name}}</th>
												<th v-for="item in batchSkuData">
													<span :class="{'require': item.required}">{{item.name}}</span>
												</th>
											</tr>
											<tr v-for="(value, key, n) in attrSkuData" :class="errorClass(value)">
												<td v-for="(item, index) in selectTableTitle"
													:rowspan="rowspan(index)"
													v-if="isShow(n, index)"
												>{{currentText(n, index)}}</td>
												<td v-for="item in batchSkuData">
													<el-input
                                                            v-if="item.type === 'inventory' || item.type === 'minimum'"
                                                            :maxlength="7"
															v-model="value[item.type]"
															@change="editPrice(item.type)"
															:class="{'custom-error': item.required}"
															@keyup.native="value[item.type] = pubObj.formatInt($event)"
															:disabled="item.disabled || !value.costPrice">
													</el-input>
													<el-input
                                                            v-else
                                                            :maxlength="10"
															v-model="value[item.type]"
															@change="editPrice(item.type)"
															:class="{'custom-error': item.required}"
															@keyup.native="value[item.type] = pubObj.formatFloat($event)"
															:disabled="item.disabled || !value.costPrice">
													</el-input>
												</td>
											</tr>
										</table>
									</div>
									<div class="batch-set">
										<span>批量设置：</span>
										<div class="batch-set-wrap" v-for="item in batchSkuData" v-if="!item.disabled">
											<el-button type="text" @click="openBatchSet(item)">{{item.name}}</el-button>
											<div class="attr-value-select" v-if="item.switch">
                                                <el-input v-model="item.amount"
                                                          v-if="item.type === 'inventory' || item.type === 'minimum'"
                                                          :maxlength="7"
                                                          @keyup.native="item.amount = pubObj.formatInt($event)"></el-input>
                                                <el-input v-model="item.amount"
                                                          v-else
                                                          :maxlength="10"
                                                          @keyup.native="item.amount = pubObj.formatFloat($event)"></el-input>
												<el-button type="primary" @click="batchSetPrice(item)">确定</el-button>
												<el-button @click="item.switch = false">取消</el-button>
											</div>
										</div>
									</div>
									<div class="batch-set">
										<span class="total">总库存：</span>
										<div class="batch-set-wrap">
											<el-input class="total-input" v-model="attrSkuTotal" disabled></el-input>
										</div>
									</div>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>

		<div class="button-group" v-show="stepsActive == 0">
			<el-button type="info" @click="nextStep" :loading="buttonLoading">下一步</el-button>
		</div>
		<div class="button-group" v-show="stepsActive == 1">
			<el-button type="info" @click="lastStep">上一步</el-button>
			<el-button type="warning" @click="addSkuData('online')" :loading="buttonLoading" v-if="shopInfo.exemption">上架</el-button>
			<el-button type="warning" v-else-if="shopInfo.exemption === false" @click="addSkuData('toaudit')" :loading="buttonLoading">提交审核</el-button>
			<el-button type="success" @click="addSkuData('save')" :loading="buttonLoading">保存</el-button>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import VueUeditor from 'vue-ueditor'
	import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	import { mixin_uploadImage } from '../../common/jkc-mixin.vue'
    import { mixin_validGoodsTitle, mixin_UEditor } from '../mixins/add_mixins.vue'
	import api from '../../../assets/config/m-api.js'
    import { pubObj } from '../../../assets/unit/public.js'
	import { router } from '../../../pages/merchant.js'

    export default {
		mixins: [mixin_uploadImage, mixin_validGoodsTitle, mixin_UEditor],
        data (){
            return {
                pubObj: pubObj,
                shopInfo: this.$root.shopInfo,
                crumbs: [
                    {
                        title:'商品管理',
                    },
                    {
                        title:'行销商品',
                        to: {path:'/m_product/special', query:this.$route.query}
                    },
                    {
                        title:'发布行销商品',
                    }
                ],
                stepsActive: Number(this.$route.query.step),
                // ------------------步骤一--------------------
                cateDefaultData:[],// 类目数据
                cateTempData:[],// 用于类目层级
                cateForm:[],	// 用于临时储存已选
                cateTitle: ['一','二','三','四','五','六'],
                agentData: [],
                brandData: [],
                groupData: [],
                goodsBasis: {
                    title: '',
                    subTitle: '',
                    agentSid: '',
                    brandSid: '',
                    type: 'Assist',	// General(1, "普通商品"),Assist(2, "行销商品")
                    categorySid: '',
                    shippingFee: null,
                    description: '',
                    spuImagesvo: [],
                    spuvoCategories: [],
                    firstPieces: null,
                    firstFee: null,
                    secondPieces: null,
                    secondFee: null,
                },
                cateErrorTips: [],		// 选择类目数据异常提示
                postageTips: '',		// 邮费数据异常提示
                dialogVisible: false,
                dialogImageUrl: '',
                uploadApi: api.attachment + 'cm/product',
                uploadHeader: pubObj.getHttpHeader(),
                uploadSwitch: false,
                rules: {
                    agentSid: [{
                        required: true,
                        message: '请选择代理商',
                        trigger: 'change'
                    }],
                    brandSid: [{
                        required: true,
                        message: '请选择品牌',
                        trigger: 'change'
                    }],
                    subTitle: [{
                        required: true,
                        message: '请输入副标题',
                        trigger: 'blur'
                    },{
                        message: '副标题长度不能大于32个字符',
                        max: 32,
                        trigger: 'blur'
                    }],
                    spuImagesvo: [{
                        type: 'array',
                        required: true,
                        min: 1,
                        max: 5,
                        message: '请上传商品图片',
                        trigger: 'blur,change'
                    }],
                    description: [{
                        required: true,
                        message: '请编辑商品详情',
                        trigger: 'blur,change'
                    }],
                    spuvoCategories: [{
                        type: 'array',
                        required: true,
                        min: 1,
                        message: '请选择商品分组',
                        trigger: 'change'
                    }],
                },
                // ------------------步骤二--------------------
                defaultAttr: [],	// 后台获取的默认配置
                selectTemp: [],		// 选择后临时储存和修改时后台返回的
                selectTableTitle: [],		// 储存规格有规格值的，用于表格头
                selectSwitch: false,	// 选择规格的开关
                selectAttrSwitch: false,	// 选择规格的开关
                submitAttrSwitch: false,	// 提交规格按钮的loading
                goodsAttr: {			// 属性的一些临时字段，这里的012345是每一行规格的规格值的变量，事先定义是显示需要
                    attrImg: true,
                    skuSelect: '',
                    attrSelect0: '',
                    attrSelect1: '',
                    attrSelect2: '',
                    attrSelect3: '',
                    attrSelect4: '',
                    attrSelect5: '',
                },
                batchSkuData: [		// 批量设置的数据/当前需要填的数据
                    {
                        name: '供货价',
                        type: 'costPrice',
                        switch: false,
                        amount: null,
						disabled: true,
                        required: false,     // 是否必填
                    },
                    {
                        name: '划线价',
                        type: 'regularPrice',
                        switch: false,
                        amount: null,
						disabled: false,
                        required: false,
                    },
                    {
                        name: '售价',
                        type: 'sellingPrice',
                        switch: false,
                        amount: null,
						disabled: false,
                        required: true,
                    },
                    {
                        name: '员工价',
                        type: 'employeePrice',
                        switch: false,
                        amount: null,
						disabled: false,
                        required: true,
                    },
                    {
                        name: '库存',
                        type: 'inventory',
                        switch: false,
                        amount: null,
						disabled: true,
                        required: false,
                    },
                    {
                        name: '起售数量',
                        type: 'minimum',
                        switch: false,
                        amount: null,
                        disabled: true,
                        required: false,
                    },
                ],
                attrSkuData: {},		// 库存那一部分的数据
                attrSkuDataTemp: {},	// 库存那一部分的数据，后台返回
                attrSkuDataLen: null,	// 库存数据的总长度
                attrSkuTotal: 0,		// 总库存
                attrErrorTips: '',
                skuErrorTips: '',
                buttonLoading: false,	// 提交按钮们的loading
            }
        },
        components: {
            jkcBreadcrumb,
            VueUeditor,
        },
        created (){
            console.log(this)
//            this.getAgentData(this.$root.userInfo.merchantSid);
            this.getCate();
            this.getBrand();
            this.getGroup();
            if(this.$route.query.spuSid){
                this.getGoodsInfo();
            }
            if(this.$route.query.spuSid && this.stepsActive == 1){
                this.getDefaultAttr();
            }
        },
        methods: {
            getAgentData (sid){		// 获取代理商
                this.$http.get(api.merchant + 'relationship/Supplier/' + sid)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.agentData = result.body.data;
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getCate (){		// 获取类目
                this.$http.get(api.category)
                    .then((result) => {
                        this.cateDefaultData = result.body.data;
                        this.cateTempData.push(result.body.data);
                        if(this.goodsBasis.categorySid){
                            this.initCate();
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getBrand (){		// 获取商户自己的品牌
                this.$http.get(api.merchantBrand + 'mall')
                    .then((result) => {
                        this.brandData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getGroup (){		// 获取商家自定义分组
                this.$http.get(['shopBizCate', 'Mall'])
                    .then((result) => {
                        this.groupData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            change (value,index){	// 选择类目
                this.cateErrorTips = [];
                if(this.cateForm[index].children){
                    Vue.set(this.cateTempData, index + 1, this.cateForm[index].children)
                }
                if(this.cateForm[index].children){
                    this.cateTempData.splice(index + 2, 10);
                }else{
                    this.cateTempData.splice(index + 1, 10);
                }
                this.cateForm.splice(index + 1, 10);
                this.goodsBasis.categorySid = this.cateForm[this.cateForm.length - 1].sid;
            },
            getGoodsInfo (){		// 获取商品信息
                this.$http.get(api.spu + 'merchant/' + this.$route.query.spuSid)
                    .then((result) => {
						if(result.body.code == 200){
							this.goodsBasis = result.body.data;
                            if(this.goodsBasis.spuvoCategories == null){	// 代理商的分组后台返回默认为null
                                this.goodsBasis.spuvoCategories = [];
                            }
							if(this.cateDefaultData.length > 0){
								this.initCate();
							}
                            if(this.goodsBasis.spuImagesvo.length === 5){
                                this.uploadSwitch = true;
                            }
							for(let i=0;i<this.goodsBasis.spuImagesvo.length;i++){		// 初始化商品图片内容
								this.goodsBasis.spuImagesvo[i].url = this.goodsBasis.spuImagesvo[i].path;
							}
							this.goodsBasisDefault = JSON.parse(JSON.stringify(this.goodsBasis));
							if(this.editor){	// 初始化编辑器内容
								this.editor.setContent(this.goodsBasis.description);
							}
						}
                    }).catch((error) => {
                    console.log(error)
                })
            },
            initCate (){	// 初始化已选中的商品类目
                var cSid = this.goodsBasis.categorySid;
                for(let i=0;i<this.cateDefaultData.length;i++){		// 初始化类目数据
                    if(this.cateDefaultData[i].sid == cSid){
                        this.cateForm.push(this.cateDefaultData[i]);
                        break;
                    }
                    if(this.cateDefaultData[i].children){
                        for(let j=0;j<this.cateDefaultData[i].children.length;j++){
                            if(this.cateDefaultData[i].children[j].sid == cSid){
                                this.cateTempData.push(this.cateDefaultData[i].children);
                                this.cateForm.push(this.cateDefaultData[i]);
                                this.cateForm.push(this.cateDefaultData[i].children[j]);
                                break;
                            }
                        }
                    }
                }
            },
            handlePictureCardPreview (file){	// 点击已上传图片的预览按钮
                this.dialogVisible = true;
                this.dialogImageUrl = file.url;
            },
            editorReady (editor) { // 编辑器相关
				// 初始化后把自定义的上传按钮移动的编辑器的DOM内部
				let a = document.getElementById('editor-upload-img');
//                a.style.display = 'block';
				let b = document.getElementsByClassName('edui-toolbar')[0];
				b.appendChild(a);
                this.editor = editor;
                this.editor.setContent(this.goodsBasis.description);
                this.editor.setDisabled([]);		// 禁用编辑器
                this.editor.addListener('contentChange',() => {
                    this.$refs.basisForm4.resetFields();
                    this.goodsBasis.description = this.editor.getContent();
                });
//                this.editor.addListener('beforeinsertimage',(a, b) => {})
            },
            nextStep (){	// 下一步
                // 验证类目
                let pass = true;
//                if(!this.goodsBasis.categorySid){
//                    Vue.set(this.cateErrorTips, 0, '请选择类目！');
//                    pass = false;
//                }else {
//                    for(let i=0;i<this.cateDefaultData.length;i++){
//                        if(this.goodsBasis.categorySid == this.cateDefaultData[i].sid){
//                            if(this.cateDefaultData[i].children && this.cateDefaultData[i].children.length > 0){
//                                Vue.set(this.cateErrorTips, 1, '请选择类目！');
//                                pass = false;
//                            }
//                        }
//                    }
//                }
                // 验证可以直接验证的
//                for(let key in this.$refs){
//				    if(key.indexOf('basisForm') != -1){
//						this.$refs[key].validate((valid) => {
//							if(!valid){
//								pass = false;
//							}
//						})
//					}
//                }
                // 验证邮费
                let fee = ['firstPieces', 'firstFee', 'secondPieces', 'secondFee']	// 需要验证的字段
                let a = true;
                let b = true;
                for(let i=0;i<fee.length;i++){
                    if(pubObj.validNum(this.goodsBasis[fee[i]])){
                        a = false;
                    }
                    if(!pubObj.validNum(this.goodsBasis[fee[i]])){
                        b = false;
                    }
                }
                if(!a && !b){
                    this.postageTips = '请完善邮费信息！';
                    pass = false;
                }

                if(!pass) return;
                var methodName = 'post';
                var url = api.spu;
                if(this.$route.query.spuSid){
                    // 无改变直接跳过
                    let data = JSON.parse(JSON.stringify(this.goodsBasis));
                    for(let i=0;i<data.spuImagesvo.length;i++){
                        delete data.spuImagesvo[i].uid;
                        delete data.spuImagesvo[i].status
                    }
                    if(JSON.stringify(data) == JSON.stringify(this.goodsBasisDefault)){
                        data = null;
                        let query = JSON.parse(JSON.stringify(this.$route.query));
                        query.step = 1;
                        router.replace({path: this.$route.path,query: query});
                        this.stepsActive = 1;
                        this.getDefaultAttr();
                        return;
                    }
                    methodName = 'put';
                    url += this.$route.query.spuSid;
                }
                // 提交之前把图片第一张设置为主图
                this.goodsBasis.spuImagesvo[0].main = true;
                this.buttonLoading = true;	// 禁用按钮
                this.$http[methodName](url,this.goodsBasis)
                    .then((result) => {
                        this.buttonLoading = false;
                        if(result.body.code == 200){
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
                            this.getDefaultAttr();
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((error) => {
                    console.log(error)
                });
            },
            getDefaultAttr (){		// 获取系统默认规格
                this.$http.get(api.attribute)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.defaultAttr = result.body.data;
                            this.getGoodsAttr();
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            getGoodsAttr (param){		// 获取商品的规格，这个参数只在修改和删除会传进来，值为edit，目的是记录当前添加规格图片是否勾上，解决的问题是当用户主动取消勾选，而数据发生删改，会重新获取新数据，避免被下面的逻辑重新勾上(暂时注释了勾选)
                this.$http.get(api.sku + 'skuattr/' + this.$route.query.spuSid)
                    .then((result) => {
                        if(result.body.code == 200){
                            var data = result.body.data;
                            if(data.length > 0 && data[0].children && param != 'edit'){	// 第一个有图片把添加规格图片勾上
                                for(let i=0;i<data[0].children.length;i++){
                                    if(data[0].children[i].imageSid){
                                        this.goodsAttr.attrImg = true;
                                    }
                                }
                            }
                            for(let i=0;i<data.length;i++){
                                for(let j=0;j<this.defaultAttr.length;j++){
                                    if(data[i].name == this.defaultAttr[j].name){
                                        data[i].childrenTemp = this.defaultAttr[j].children;
                                    }
                                }
                                data[i].attrSwitch = false;		// 添加规格值小弹窗开关
                            }
                            this.selectTemp = data;
                            this.selectTableTitle = this.delNotChildren(this.selectTemp);
                            this.formatSkuData();
                            this.getSkuData();
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            selectSku (sid, data){		// 选择系统的规格
                if(sid == 'cancel'){
                    this.selectSwitch = false;
                    this.goodsAttr.skuSelect = '';
                    return;
                }
                let value = '';
                data.forEach((item) => {
                    if(item.sid === sid){
                        value = item;
                    }
                });
                if(!value){
                    value = sid;
                }
                // 判断重复
                var s = false;
                for(let i=0;i<this.selectTemp.length;i++){
                    if(this.selectTemp[i].name == value.name){
                        this.$message({type:'warning',message:'不能添加相同的规格'});
                        this.goodsAttr.skuSelect = '';
                        s = true;
                    }
                }
                if(s || !value) return false;
                var obj = {};
                if(typeof value == 'string'){
                    obj.name = value;
                }else{
                    obj = JSON.parse(JSON.stringify(value));
                    obj.childrenTemp = value.children;
                }
                obj.attrSwitch = false;
                obj.children = [];
                obj.spuSid = this.$route.query.spuSid;
                if(this.selectTemp.length > 0){
                    obj.rank = this.selectTemp[this.selectTemp.length - 1].rank + 1;
                }else{
                    obj.rank = 1;
                }
                this.addAttr(obj);
            },
            openAddParentPanel (){
                this.attrErrorTips = '';
                this.selectSwitch = true;
            },
            openAddPanel (item){		// 打开新增规格值的小弹窗
                this.attrErrorTips = '';
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].attrSwitch = false;
                }
                item.attrSwitch = true;
            },
            selectAttrConfirm (sid, index, item){	// 选择系统规格值后确定或取消
                if(sid == 'cancel'){
                    this.selectTemp[index].attrSwitch = false;
                    return;
                }
                let data = '';
                item.forEach((value) => {
                    if(value.sid === sid){
                        data = value;
                    }
                });
                if(!data){
                    data = sid;
                }
                // 判断重复
                let temp = this.selectTemp[index].children;
                var s = false;
                for(let i=0;i<temp.length;i++){
                    if((typeof data == 'string' && temp[i].name == data) || (typeof data == 'object' && temp[i].name == data.name)){
                        this.$message({type:'warning',message:'不能添加相同的规格值'});
                        this.goodsAttr['attrSelect' + index] = '';
                        s = true;
                    }
                }
                if(s || !data) return false;
                var obj = {};
                if(typeof data == 'string'){
                    obj = {
                        spuSid: this.$route.query.spuSid,
                        name: data,
                        rank: 0,
                        parentCode: this.selectTemp[index].code,
                    }
                }else{
                    obj = data;
                    obj.spuSid = this.$route.query.spuSid;
                    obj.parentCode = this.selectTemp[index].code;
                }
                if(this.selectTemp[index].children.length > 0){
                    obj.rank = this.selectTemp[index].children[this.selectTemp[index].children.length - 1].rank + 1;
                }else{
                    obj.rank = 1;
                }
                this.addAttr(obj, index)
            },
            addAttr (data, index){		// 新增规格
                if(data.sid){
                    delete data.sid;
                }
                this.submitAttrSwitch = true;
                this.$http.post(api.sku + 'skuattr', data)
                    .then((result) => {
                        this.submitAttrSwitch = false;
                        if(result.body.code == 200){
                            for(let key in result.body.data){
                                data[key] = result.body.data[key];
                            }
                            if(index != undefined){
                                this.selectTemp[index].children.push(data);
                            }else{
                                this.selectTemp.push(data);
                                this.selectSwitch = false;
                            }
                            this.selectTableTitle = this.delNotChildren(this.selectTemp);
                            this.formatSkuData();
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                        if(index != undefined){
                            this.goodsAttr['attrSelect' + index] = '';
                            this.selectTemp[index].attrSwitch = false;
                        }else{
                            this.goodsAttr.skuSelect = '';
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            delAttr (sid){		// 删除规格
                this.attrErrorTips = '';
                this.skuErrorTips = '';
                this.$confirm('删除后不可恢复，并且会同时删除与之相对应的价格和库存信息，确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(api.sku + 'skuattr/' + sid)
                        .then((result) => {
                            if(result.body.code == 200){
                                this.$message({type:'success',message:result.body.message});
                                this.getGoodsAttr('edit');
                            }else{
                                this.$message({type:'warning',message:result.body.message});
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                });
            },
            attrUploadBefore (file){	// 规格值图片上传之前
            },
            attrUploadSuccess (response, file, fileList){	// 规格值上传成功
                if(response.code == 200){
                    for(let i=0;i<response.data.length;i++){
                        for(let j=0;j<this.selectTemp[0].children.length;j++){
                            if(this.selectTemp[0].children[j].sid == response.data[i].customMessage){
                                this.selectTemp[0].children[j].imageSid = response.data[i].sid;
                                this.editAttrConfirm([this.selectTemp[0].children[j]]);
                            }
                        }
                    }
                }
            },
            attrUploadError (err, file, fileList){		// 规格值上传失败
            },
            editAttrConfirm (item){		// 修改规格，暂时只是规格值图片用到了
                this.$http.put(api.sku + 'skuattr/updatebatch', item)
                    .then((result) => {
                        if(result.body.code == 200){
                            this.getGoodsAttr('edit');
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            getSkuData (){		// 获取库存信息
                this.$http.get(api.sku + this.$route.query.spuSid)
                    .then((result) => {
                        if(result.body.code == 200){
//                        this.attrSkuTotal = 0;
                            for(let i=0;i<result.body.data.length;i++){
                                this.attrSkuDataTemp[result.body.data[i].attrCode] = result.body.data[i];
//							this.attrSkuTotal += result.body.data[i].inventory;
                            }
                            if(result.body.data.length == 0){
                                this.attrSkuDataTemp = {};
                            }
                            this.formatSkuData();
                            this.attrSkuDataDefault = JSON.parse(JSON.stringify(this.attrSkuData));	// 存默认方便保存时比对
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            formatSkuData (){		// 把规格的数据组合成库存需要的数据
                var spuSid = this.$route.query.spuSid;
                var attrSkuDataTemp = this.attrSkuDataTemp;
                function format(obj1, obj2) {		// 组合数据的方法
                    if(JSON.stringify(obj1) == '{}'){
                        for(let j=0;j<obj2.length;j++){
                            if(attrSkuDataTemp[obj2[j].code]){
                                obj1[obj2[j].code] = attrSkuDataTemp[obj2[j].code];
                            }else{
                                obj1[obj2[j].code] = {
                                    spuSid: spuSid,
                                    attrCode: obj2[j].code,
                                    sellingPrice: null,
                                    regularPrice: null,
                                    costPrice: null,
                                    emloyeePrice: null,
                                    inventory: null,
                                    barcode: '',
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
                                        spuSid: spuSid,
                                        attrCode: key +'|'+ obj2[a].code,
                                        sellingPrice: null,
                                        regularPrice: null,
                                        costPrice: null,
                                        emloyeePrice: null,
                                        inventory: null,
                                        barcode: '',
                                    };
                                }
                            }
                            delete obj1[key]
                        }
                    }
                    return obj1;
                }
                this.attrSkuData = {};
                this.attrSkuDataLen = 1;
                this.attrSkuTotal = 0;
                for(let i=0;i<this.selectTemp.length;i++){	// 循环调用组合数据方法
                    if(JSON.stringify(this.selectTemp[i].children) !== '[]'){
                        this.attrSkuData = format(this.attrSkuData, this.selectTemp[i].children);
                        this.attrSkuDataLen = this.attrSkuDataLen * this.selectTemp[i].children.length
                    }
                }
                for(let key in this.attrSkuData){
                    this.attrSkuTotal += this.attrSkuData[key].inventory;
                }
            },
            delNotChildren (params){		// 删除this.selectTemp的空数据，表格展示有用
                var data = [];
                for(let i=0;i<params.length;i++){
                    if(JSON.stringify(params[i].children) !== '[]'){
                        data.push(params[i]);
                    }
                }
                return data;
            },
            rowspan (index){		// 生产库存表格向下合并的行
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
                    return n%(this.attrSkuDataLen/t) == 0;
                }
            },
            currentText (n, index){		// 显示的行当前应该显示的数据
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
                var re = this.selectTableTitle[index].children[a]?this.selectTableTitle[index].children[a].name:'';
                return re;
            },
            errorClass (value){		// tr上验证数据错误的class
                let typeSwitch1 = false;
                let typeSwitch2 = false;
                for(let i=0;i<this.batchSkuData.length;i++){
                    let item = this.batchSkuData[i];
                    if(item.required && pubObj.isEmpty(value[item.type])){
                        typeSwitch1 = true;
                    }
                    if(item.required && !pubObj.isEmpty(value[item.type])){
                        typeSwitch2 = true;
                    }
                }
                if(typeSwitch1 && typeSwitch2){
                    return 'is-empty';
                }
            },
            editPrice (type){		// 编辑库存相关信息
                this.skuErrorTips = '';
                if(type === 'inventory'){
                    this.attrSkuTotal = 0;
                    for(let key in this.attrSkuData){
                        this.attrSkuTotal += Number(this.attrSkuData[key].inventory);
                    }
                }
            },
            openBatchSet (item){		// 打开批量设置弹窗
                this.skuErrorTips = '';
                for(let i=0;i<this.batchSkuData.length;i++){
                    this.batchSkuData[i].switch = false;
                }
                item.switch = true;
            },
            batchSetPrice (item){		// 批量设置数据
                if(item.amount){
                    if(item.type === 'inventory'){
                        this.attrSkuTotal = 0;
                    }
                    for(let key in this.attrSkuData){
                        if(this.attrSkuData[key].costPrice){
                            this.attrSkuData[key][item.type] = item.amount;
                        }
                        if(item.type === 'inventory'){
                            this.attrSkuTotal += Number(item.amount);
                        }
                    }
                    item.switch = false;
                }
            },
            addSkuData (type){		// 新增或修改库存数据
                // 判断数据是否符合规定
                if(this.selectTemp.length === 0){
                    this.attrErrorTips = '请添加商品规格';
                    return;
                }
                let pass = true;
                for(let i=0;i<this.selectTemp.length;i++){
                    if(this.selectTemp[i].children.length === 0){
                        this.attrErrorTips = '商品规格值不能为空';
                        pass = false;
                    }
                }
                let priceZero = false;  // 价格不能为0
                let required = false;  // 已供应的规格必填
                for(let key in this.attrSkuData){
                    for(let i=0;i<this.batchSkuData.length;i++){
                        let item = this.batchSkuData[i];
                        let value = this.attrSkuData[key][item.type];
                        if(this.attrSkuData[key].costPrice){
                            if(item.required && !pubObj.isEmpty(value)){
                                required = true;
                            }
                            if(pubObj.isEmpty(value) && value <= 0){
                                if(item.type === 'regularPrice' || item.type === 'sellingPrice' || item.type === 'employeePrice'){
                                    priceZero = true;
                                }
                            }
                        }
                    }
                }
                if(required){
                    this.skuErrorTips = '请将信息填写完整';
                    pass = false;
                    return false;
                }
                if(priceZero){
                    this.skuErrorTips = '价格不能为0';
                    pass = false;
                    return false;
                }
                if(!pass) return;
                // 对比数据是否有改变，仅针对库存数据一块
                var dataChange = true;
                if(JSON.stringify(this.attrSkuDataDefault) === JSON.stringify(this.attrSkuData)){
                    dataChange = false;
                    if(type === 'save'){
                        let query = {btn: this.$route.query.btn, pageIndex: 1, type: 'Assist', agent: 1, states: 'AStorage'};
                        if(this.goodsBasis.state === 'CloudRefuse'){
                            query.states = 'Refuse';
                        }
                        router.replace({path:'/m_product/special', query: query});
                        return;
                    }
                }
                // 验证规格图片是否勾选
//				var attrImage = false;
//				if(!this.goodsAttr.attrImg){		// 如果为false，再看是否有规格图片，有就调修改接口删除
//					for (let i=0;i<this.selectTemp[0].children.length;i++){
//                        if(this.selectTemp[0].children[i].imageSid){
//                            this.selectTemp[0].children[i].imageSid = null;
//                            this.selectTemp[0].children[i].imagePath = null;
//                            attrImage = true;
//						}
//					}
//                    if(attrImage){
//                        console.log('去掉规格图片');
//                        this.editAttrConfirm(this.selectTemp[0].children);
//                    }
//                }
//                if(!dataChange && !type && !attrImage){
//                    this.$message({type:'info',message:'数据未发生改变'});
//                    return;
//				}else if(!dataChange && !type && attrImage){
//                    return;
//                }
                // 处理提交数据
                var data = [];
                if(dataChange){
                    for(let key in this.attrSkuData){
                        data.push(this.attrSkuData[key]);
                    }
                }
                var url = '';
                if(type && type !== 'save'){
                    // 提交审核或上架数据如果没有发生改变调不带保存的接口
                    url = api.spu + 'audit/' + (dataChange?type + 'save':type) + '/' + this.$route.query.spuSid;
                }else {
                    url = api.sku;
                }
                this.buttonLoading = true;	// 禁用按钮
                this.$http.post(url, data)
                    .then((result) => {
                        this.buttonLoading = false;
                        if(result.body.code === 200){
                            this.$message({type:'success',message:result.body.message});
                            let query = {btn: this.$route.query.btn, pageIndex: 1, type: 'Assist', agent: 1};
                            if(type === 'toaudit'){
                                query.states = 'Check';
                                router.replace({path:'/m_product/special', query: query});
                            }else if(type === 'online'){
                                query.states = 'Selling';
                                router.replace({path:'/m_product/special', query: query});
                            }else if(type === 'save'){
                                if(this.goodsBasis.state === 'CloudRefuse'){
                                    query.states = 'Refuse';
                                }else{
                                    query.states = 'AStorage';
                                }
                                router.replace({path:'/m_product/special', query: query});
                            }
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                    console.log(err)
                })
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
	.goods-add.goods-agent-add .cate-wrap .cate .custom-button span{
		cursor: no-drop;
	}
	.goods-add.goods-agent-add .cate-wrap .cate .custom-button input:disabled + span{
		color: #cccccc;
	}
	.goods-add.goods-agent-add .cate-wrap .cate .custom-button input:disabled + span:hover{
		background: #eee;
		color: #cccccc;
	}
	.goods-add.goods-agent-add .cate-wrap .cate .hide-upload .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete{
		display: none !important;
	}
	.goods-add.goods-agent-add .attr-wrap .attr-title:hover .el-icon-circle-cross{
		display: none;
	}
	.goods-add.goods-agent-add .attr-wrap .attr-value:hover .el-icon-circle-cross{
		display: none;
	}
	.goods-add.goods-agent-add .attr-wrap .attr-value .attr-img .el-upload{
		cursor: no-drop;
	}
</style>
