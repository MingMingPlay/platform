<template>
	<div class="goods-add">
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<el-steps :space="250" :active="stepsActive" :center="true" :align-center="true">
			<el-step title="商品基本信息"></el-step>
			<el-step title="商品规格"></el-step>
		</el-steps>

		<!-- 商品基本信息 -->
		<div v-show="stepsActive === 0">
			<div class="cate-wrap">
				<div class="cate-title">商品基本信息</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span>商品信息</span></p>
					</div>
					<div class="cate">
						<el-form ref="basisForm1" :model="goodsBasis" label-width="150px" :rules="rules">
							<el-form-item label="商品主标题:" required prop="title">
								<el-input v-model="goodsBasis.title"></el-input>
							</el-form-item>
							<el-form-item label="商品副标题:" required prop="subTitle">
								<el-input v-model="goodsBasis.subTitle"></el-input>
							</el-form-item>
						</el-form>
						<el-form class="img-margin" ref="basisForm2" :model="goodsBasis" label-width="150px" :rules="rules">
							<el-form-item label="商品图:" required prop="spuImagesvo">
								<el-upload
										list-type="picture-card"
                                        multiple
										:action="uploadSpuApi"
										:headers="uploadHeader"
										:on-preview="handlePictureCardPreview"
										:on-remove="handleRemove"
										:on-change="uploadChange"
										:before-upload="beforeUpload"
										:file-list="goodsBasis.spuImagesvo"
                                        :http-request="customUploadSelect"
										:class="{'hide-upload':uploadSwitch}"
                                        :style="{'display':'inline-block'}"
                                        v-loading="customUpLoading">
									<i class="el-icon-plus"></i>
								</el-upload>
                                <div>
                                    <p v-for="item in goodsBasis.spuImagesvo" style="width: 114px;text-align: center;display: inline-block;margin-right: 8px;">
                                        <span @click.prevent="changeMain(item)">
                                            <el-radio v-model="item.main" :label="true">{{item.main?'主图':'设为主图'}}</el-radio>
                                        </span>
                                    </p>
                                </div>
								<!-- 点击预览的dialog -->
								<el-dialog v-model="dialogVisible" size="tiny" title="商品图片">
									<img width="100%" :src="dialogImageUrl" alt="">
								</el-dialog>
							</el-form-item>
							<div class="img-desc">默认第一张为主图，建议尺寸：1000x1000像素</div>
						</el-form>
					</div>
				</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span>征订规则</span></p>
					</div>
					<div class="cate">
						<el-form ref="basisForm4" :model="goodsBasis" label-width="150px" :rules="rules">
							<el-form-item label="征订价格:" required prop="price">
								<el-input v-model="goodsBasis.price" style="width:193px;"
                                          :disabled="goodsBasis.state === 'Online' || goodsBasis.state === 'SubscribeEnd' || goodsBasis.state === 'Refunding' || goodsBasis.state === 'Completed'"
                                          @keyup.native="goodsBasis.price = pubObj.formatFloat($event)"></el-input>
							</el-form-item>
							<el-form-item label="征订库存:">
								<el-input v-model="goodsBasis.subInventory" style="width:193px;"
                                          :disabled="goodsBasis.state === 'Online' || goodsBasis.state === 'SubscribeEnd' || goodsBasis.state === 'Refunding' || goodsBasis.state === 'Completed'"
                                          @keyup.native="goodsBasis.subInventory = pubObj.formatInt($event)"></el-input>
							</el-form-item>
							<el-form-item label="征订开始日期:" required prop="startTime">
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
							<el-form-item label="征订结束日期:" required prop="endTime">
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
							<el-form-item label="商品下架日期:" required prop="subOfflineTime">
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
                            <el-form-item label="每个用户ID起购数量:">
                                <el-input v-model="goodsBasis.minimum" style="width:193px;"
                                          @keyup.native="goodsBasis.minimum = pubObj.formatInt($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="每个用户ID购买上限:">
                                <el-input v-model="goodsBasis.maximum" style="width:193px;"
                                          @keyup.native="goodsBasis.maximum = pubObj.formatInt($event)"></el-input>
                            </el-form-item>
						</el-form>
					</div>
				</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span class="require">商品详情</span></p>
					</div>
					<div class="cate ueditor">
						<el-form ref="basisForm3" :model="goodsBasis" :rules="rules">
							<el-form-item required prop="description" v-loading="editorUpLoading">
								<div class="editor-upload-img" id="editor-upload-img">
									<label class="button-img">
										<input style="display: none;"
												type="file"
                                                multiple
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
		<div v-show="stepsActive === 1">
			<div class="cate-wrap" v-show="stepsActive === 1">
				<div class="cate-title">商品规格</div>
				<div class="cate-cell clear">
					<div class="cate-subtitle">
						<p class="cell-title"><span class="require">商品规格</span></p>
					</div>
					<div class="cate">
						<el-form v-loading="attrBlockLoading">
							<el-form-item :error="attrErrorTips">
								<div class="attr-wrap">
									<div v-for="(item, index) in selectTemp">
										<div class="attr-title">
											<span class="attr-name" @click="openEditParentPanel(item)" v-if="!item.parentAttrSwitch">{{item.name}}</span>
                                            <div v-if="item.parentAttrSwitch">
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
                                                <el-button type="primary" @click="selectSku(goodsAttr.skuSelect, defaultAttr, item)" :loading="submitAttrSwitch">确定</el-button>
                                                <el-button @click="selectSku('cancel', '', item)">取消</el-button>
                                            </div>
											<!--<el-checkbox v-model="goodsAttr.attrImg" v-if="index === 0">添加规格图片</el-checkbox>-->
											<i class="el-icon-circle-cross" @click="delAttr(item.sid)"></i>
										</div>
										<div class="attr-value-wrap clear">
											<div class="attr-value" v-for="(item1, index1) in item.children">
												<i class="el-icon-circle-cross" @click="delAttr(item1.sid)"></i>
												<p class="title" @click="openEditPanel(item1, index)">{{item1.name}}</p>
                                                <div class="attr-value-select" v-if="item1.childrenAttrSwitch">
                                                    <el-select
                                                        v-model="goodsAttr['attrSelect' + index]"
                                                        filterable
                                                        allow-create
                                                        placeholder="可添加自定义规格">
                                                        <el-option
                                                            v-for="item2 in item.childrenTemp"
                                                            :key="item2.sid"
                                                            :label="item2.name"
                                                            :value="item2.sid">
                                                        </el-option>
                                                    </el-select>
                                                    <el-button type="primary" @click="selectAttrConfirm(goodsAttr['attrSelect' + index], index, item.childrenTemp, item1)" :loading="submitAttrSwitch">确定</el-button>
                                                    <el-button @click="selectAttrConfirm('cancel', index, '', item1)">取消</el-button>
                                                </div>
												<div class="attr-img" v-if="goodsAttr.attrImg && index === 0">
													<el-upload class="image"
															   :action="uploadSkuApi"
															   :headers="uploadHeader"
															   :show-file-list="false"
															   :data="{'customMessage': item1.sid}"
															   :on-success="attrUploadSuccess"
															   :on-error="attrUploadError"
															   :before-upload="attrUploadBefore">
														<img v-if="item1.imagePath" :src="item1.imagePath" class="avatar">
														<i v-else class="el-icon-plus"></i>
													</el-upload>
												</div>
											</div>
											<div class="attr-value">
												<el-button type="text" @click="openAddPanel(item, index)">+ 添加</el-button>
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
											<div class="attr-img-desc" v-if="goodsAttr.attrImg && index === 0 && item.children.length > 0">规格图片建议尺寸：1000x1000像素，非必传！</div>
										</div>
									</div>
									<div class="attr-title" v-if="selectTemp.length < 5">
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
						<p class="cell-title">规格表格</p>
					</div>
					<div class="cate">
						<el-form>
							<el-form-item>
								<div class="attr-wrap">
									<div class="table-wrap">
										<table border="1" class="sku-table">
											<tr>
												<th v-for="item in selectTableTitle" v-if="item.children.length > 0">{{item.name}}</th>
											</tr>
											<tr v-for="(value, key, n) in attrSkuData">
												<td v-for="(item, index) in selectTableTitle"
													:rowspan="rowspan(index)"
													v-if="isShow(n, index)"
												>{{currentText(n, index)}}</td>
											</tr>
										</table>
									</div>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>

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
	import VueUeditor from 'vue-ueditor'
	import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	import { mixin_uploadImage } from '../../common/jkc-mixin.vue'
	import { mixin_validGoodsTitle, mixin_UEditor } from '../mixins/add_mixins.vue'
	import api from '../../../assets/config/m-api.js'
	import { pubObj } from '../../../assets/unit/public.js'
	import { router,vm } from '../../../pages/merchant.js'

	export default {
	    mixins: [mixin_uploadImage, mixin_validGoodsTitle, mixin_UEditor],
		data (){
			return {
                pubObj: pubObj,
				crumbs: [
				    {
						title:'商品管理',
					},
					{
						title:'征订商品',
						to: {path:'/m_product/subscribe', query:this.$route.query}
					},
					{
						title:'发布宝贝',
					}
				],
				stepsActive: Number(this.$route.query.step),
				// ------------------步骤一--------------------
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
				dialogVisible: false,
				dialogImageUrl: '',
                pickerOptions: {        // 日期选择器配置，今天以前的禁用
                    disabledDate(time){
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                uploadSpuApi: api.attachment + 'Product',
				uploadSkuApi: api.attachment + 'ProductSpec',
				uploadHeader: pubObj.getHttpHeader(),
				uploadSwitch: false,
                rules: {
                    subTitle: [{
                        required: true,
                        message: '请输入副标题',
                        trigger: 'blur, change'
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
                    price: [{
                        required: true,
                        message: '请输入征订价格',
                        trigger: 'change'
                    }],
                    startTime: [{
                        required: true,
                        message: '请选择日期和时间',
                        trigger: 'change, blur'
                    }, {
                        validator: this.validStart,
                    }],
                    endTime: [{
                        required: true,
                        message: '请选择日期和时间',
                        trigger: 'change, blur'
                    }, {
                        validator: this.validStart,
                    }],
                    subOfflineTime: [{
                        required: true,
                        message: '请选择日期和时间',
                        trigger: 'change, blur'
                    }, {
                        validator: this.validStart,
                    }],
                },
				// ------------------步骤二--------------------
				defaultAttr: [],	// 后台获取的默认配置
				selectTemp: [],		// 选择后临时储存和修改时后台返回的
				selectTableTitle: [],		// 储存规格有规格值的，用于表格头
                attrBlockLoading: false,    // 规格模块数据加载中时，不能进行操作，如修改商品时到第二页
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
				attrSkuData: {},		// 库存那一部分的数据
				attrSkuDataTemp: {},	// 库存那一部分的数据，后台返回
				attrSkuDataLen: null,	// 库存数据的总长度
				attrSkuTotal: 0,		// 总库存
				attrErrorTips: '',
				buttonLoading: false,	// 提交按钮们的loading
			}
		},
		components: {
			jkcBreadcrumb,
			VueUeditor,
		},
		created (){
			if(this.$route.query.spuSid){
				this.getGoodsInfo();
			}
			if(this.$route.query.spuSid && this.stepsActive == 1){
                this.getDefaultAttr();
			}
		},
		methods: {
			getGoodsInfo (){		// 获取商品信息
				this.$http.get(['spuSubscribe', 'merchant/', this.$route.query.spuSid])
				.then((result) => {
					this.goodsBasis = result.body.data;
                    if(this.goodsBasis.spuvoCategories == null){	// 代理商的分组后台返回默认为null
                        this.goodsBasis.spuvoCategories = [];
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
					// 初始化时间
                    let date = this.subscribeDate;
                    date.startDate = new Date(this.goodsBasis.startTime);
                    date.startTime = new Date(this.goodsBasis.startTime);
                    date.startCallback = this.goodsBasis.startTime.split(' ')[0];
                    date.startTimeCallback = this.goodsBasis.startTime.split(' ')[1];
                    date.endDate = new Date(this.goodsBasis.endTime);
                    date.endTime = new Date(this.goodsBasis.endTime);
                    date.endCallback = this.goodsBasis.endTime.split(' ')[0];
                    date.endTimeCallback = this.goodsBasis.endTime.split(' ')[1];
                    date.offlineDate = new Date(this.goodsBasis.subOfflineTime);
                    date.offlineTime = new Date(this.goodsBasis.subOfflineTime);
                    date.offlineCallback = this.goodsBasis.subOfflineTime.split(' ')[0];
                    date.offlineTimeCallback = this.goodsBasis.subOfflineTime.split(' ')[1];
				}).catch((error) => {
					console.log(error)
				})
			},
			handlePictureCardPreview (file){	// 点击已上传图片的预览按钮
				this.dialogVisible = true;
				this.dialogImageUrl = file.url;
			},
			handleRemove (file, fileList){		// 点击已上传图片的删除按钮
                if(!file){
                    return false;
                }
				for(let i=0;i<this.goodsBasis.spuImagesvo.length;i++){
					if(file && this.goodsBasis.spuImagesvo[i].imgSid === file.imgSid){
						this.goodsBasis.spuImagesvo.splice(i,1);
					}
				}
				setTimeout(() => {
					this.uploadSwitch = false;
				},600)
			},
            changeMain (item){      // 改名主图
                this.goodsBasis.spuImagesvo.forEach(value => {
                    if(value.imgSid === item.imgSid){
                        value.main = true;
                    }else {
                        value.main = false;
                    }
                });
                let mainIndex = 0;
                for(let i=0;i<this.goodsBasis.spuImagesvo.length;i++){
                    if(this.goodsBasis.spuImagesvo[i].main && i != 0){
                        mainIndex = i;
                        break;
                    }
                }
                if(mainIndex){
                    setTimeout(() => {
                        let a = this.goodsBasis.spuImagesvo.splice(mainIndex, 1)[0];
                        this.goodsBasis.spuImagesvo.unshift(a);
                    },150);
                }
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
            validStart(rule, value, callback){  // 验证三个征订时间
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
			editorReady (editor) { // 编辑器相关
				// 初始化后把自定义的上传按钮移动的编辑器的DOM内部
				let a = document.getElementById('editor-upload-img');
				a.style.display = 'block';
				let b = document.getElementsByClassName('edui-toolbar')[0];
				b.appendChild(a);
				this.editor = editor;
				this.editor.setContent(this.goodsBasis.description);
				this.editor.addListener('contentChange',() => {
                    this.$refs.basisForm3.resetFields();
					this.goodsBasis.description = this.editor.getContent();
				});
				// 监听插入图片之前，如果需要做什么事
//				this.editor.addListener('beforeinsertimage',(a, b) => {});
			},
			nextStep (){	// 下一步
				// 获取编辑器内容
                this.goodsBasis.description = this.editor.getContent();
                // 验证类目
				let pass = true;
				// 验证可以直接验证的
				for(let key in this.$refs){
				    if(key.indexOf('basisForm') !== -1){
                        this.$refs[key].validate((valid) => {
                            if(!valid){
                                pass = false;
                            }
                        })
					}
				}
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
                        this.getDefaultAttr();
                        return;
                    }
                    methodName = 'put';
//                    url += this.$route.query.spuSid;
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
						this.getDefaultAttr();
					}else{
						this.$message({type:'warning',message:result.body.message});
					}
				}).catch((error) => {
					console.log(error)
				});
			},
			getDefaultAttr (){		// 获取系统默认规格
                // 数据没有返回前页面禁用
                this.attrBlockLoading = true;
				this.$http.get(api.attribute, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                })
				.then((result) => {
					if(result.body.code === 200){
						this.defaultAttr = result.body.data;
						this.getGoodsAttr();
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			getGoodsAttr (param){		// 获取商品的规格，这个参数只在修改和删除会传进来，值为edit，目的是记录当前添加规格图片是否勾上，解决的问题是当用户主动取消勾选，而数据发生删改，会重新获取新数据，避免被下面的逻辑重新勾上(暂时注释了勾选)
                let sid = this.goodsBasis.sid || this.$route.query.spuSid;
				this.$http.get(api.sku + 'skuattr/' + sid, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                })
				.then((result) => {
					if(result.body.code === 200){
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
								if(data[i].name === this.defaultAttr[j].name){
									data[i].childrenTemp = this.defaultAttr[j].children;
								}
							}
							data[i].attrSwitch = false;		// 添加规格值小弹窗开关
							data[i].parentAttrSwitch = false;		// 修改父规格小窗开关
                            if(data[i].children){
                                data[i].children.forEach(value => {
                                    value.childrenAttrSwitch = false;   // 修改规格值小弹窗开关
                                })
                            }
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
			selectSku (sid, data, currentItem){		// 选择系统的规格/自定义规格
				if(sid === 'cancel'){
					this.selectSwitch = false;
					this.goodsAttr.skuSelect = '';
                    if(currentItem){
                        currentItem.parentAttrSwitch = false;
                    }
					return;
				}
				let value = '';
				if (data){
                    data.forEach((item) => {
                        if(item.sid === sid){
                            value = item;
                        }
                    });
                }
				if(!value){
                    value = sid;
                }
				// 判断重复
				var s = false;
				for(let i=0;i<this.selectTemp.length;i++){
                    let name = this.selectTemp[i].name;
                    if((typeof value === 'string' && name === value) || (typeof value === 'object' && name === value.name)){
                        if(currentItem && currentItem.sid === this.selectTemp[i].sid){
                            currentItem.parentAttrSwitch = false;
                        }else {
                            this.$message({type:'warning',message:'不能添加相同的规格'});
                        }
						s = true;
					}
				}
				if(s || !value) return false;
				var obj = {};
                if(typeof value === 'string'){
					obj.name = value;
                    obj.parentAttrSwitch = false;
				}else{
                    obj = JSON.parse(JSON.stringify(value));
                    obj.childrenTemp = value.children;
                    obj.parentAttrSwitch = false;
                }
                obj.attrSwitch = false;
                obj.children = [];
                obj.spuSid = this.goodsBasis.sid || this.$route.query.spuSid;
                if(this.selectTemp.length > 0){
                    obj.rank = this.selectTemp[this.selectTemp.length - 1].rank + 1;
                }else{
                    obj.rank = 1;
                }
                if(currentItem){
                    currentItem.name = obj.name;
                    this.editAttrConfirm([currentItem]);
                }else {
                    this.addAttr(obj);
                }
			},
            openAddParentPanel (){
                this.attrErrorTips = '';
			    this.selectSwitch = true;
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].parentAttrSwitch = false;
                }
                this.goodsAttr.skuSelect = '';
			},
            openEditParentPanel (item){
                this.attrErrorTips = '';
			    this.selectSwitch = false;
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].parentAttrSwitch = false;
                }
                item.parentAttrSwitch = true;
                this.goodsAttr.skuSelect = item.name;
			},
			openAddPanel (item, index){		// 打开新增规格值的小弹窗
                this.attrErrorTips = '';
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].attrSwitch = false;
                    if(this.selectTemp[i].children){
                        this.selectTemp[i].children.forEach(value => {
                            value.childrenAttrSwitch = false;
                        })
                    }
                }
                this.goodsAttr['attrSelect' + index] = '';
				item.attrSwitch = true;
			},
            openEditPanel (item, index){		// 打开编辑规格值的小弹窗
                this.attrErrorTips = '';
                for(let i=0;i<this.selectTemp.length;i++){
                    this.selectTemp[i].attrSwitch = false;
                    if(this.selectTemp[i].children){
                        this.selectTemp[i].children.forEach(value => {
                            value.childrenAttrSwitch = false;
                        })
                    }
                }
				item.childrenAttrSwitch = true;
                this.goodsAttr['attrSelect' + index] = item.name;
			},
			selectAttrConfirm (sid, index, item, childrenItem){	// 选择系统规格值后确定或取消
				if(sid === 'cancel'){
					this.selectTemp[index].attrSwitch = false;
                    this.goodsAttr['attrSelect' + index] = '';
					if(childrenItem){
                        childrenItem.childrenAttrSwitch = false;
                    }
					return;
				}
                let data = '';
				if(item){
                    item.forEach((value) => {
                        if(value.sid === sid){
                            data = value;
                        }
                    });
                }
                if(!data){
                    data = sid;
                }
				// 判断重复
				let temp = this.selectTemp[index].children;
				var s = false;
				for(let i=0;i<temp.length;i++){
					if((typeof data === 'string' && temp[i].name === data) || (typeof data === 'object' && temp[i].name === data.name)){
						if(childrenItem && childrenItem.sid === temp[i].sid){
                            childrenItem.childrenAttrSwitch = false;
                        }else {
                            this.$message({type:'warning',message:'不能添加相同的规格值'});
                        }
                        s = true;
					}
				}
				if(s || !data) return false;
				var obj = {};
                let spuSid = this.goodsBasis.sid || this.$route.query.spuSid;
				if(typeof data === 'string'){
					obj = {
						spuSid: spuSid,
						name: data,
						rank: 0,
						parentCode: this.selectTemp[index].code,
                        childrenAttrSwitch: false,
					}
				}else{
					obj = data;
					obj.spuSid = spuSid;
					obj.parentCode = this.selectTemp[index].code;
                    obj.childrenAttrSwitch = false;
				}
				if(this.selectTemp[index].children.length > 0){
					obj.rank = this.selectTemp[index].children[this.selectTemp[index].children.length - 1].rank + 1;
				}else{
					obj.rank = 1;
				}
				if(childrenItem){
                    childrenItem.name = obj.name;
                    this.editAttrConfirm([childrenItem]);
                }else {
                    this.addAttr(obj, index)
                }
			},
			addAttr (data, index){		// 新增规格
				if(data.sid){
					delete data.sid;
				}
				this.submitAttrSwitch = true;
				this.$http.post(api.sku + 'skuattr', data, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                })
				.then((result) => {
                    this.submitAttrSwitch = false;
					if(result.body.code === 200){
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
                this.$confirm('删除后不可恢复，并且会同时删除与之相对应的价格和库存信息，确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(api.sku + 'skuattr/' + sid, {
                        headers: {
                            'api-ver': '2.0.0'
                        }
                    })
                        .then((result) => {
                            if(result.body.code === 200){
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
				if(response.code === 200){
					for(let i=0;i<response.data.length;i++){
						for(let j=0;j<this.selectTemp[0].children.length;j++){
							if(this.selectTemp[0].children[j].sid === response.data[i].customMessage){
								this.selectTemp[0].children[j].imageSid = response.data[i].sid;
								this.editAttrConfirm([this.selectTemp[0].children[j]]);
							}
						}
					}
				}
			},
			attrUploadError (err, file, fileList){		// 规格值上传失败
			},
			editAttrConfirm (item){		// 修改规格和规格图片
                this.submitAttrSwitch = true;
				this.$http.put(api.sku + 'skuattr/updatebatch', item, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                })
				.then((result) => {
                    this.submitAttrSwitch = false;
                    if(item[0].childrenAttrSwitch != undefined){
                        item[0].childrenAttrSwitch = false;
                    }else if(item[0].parentAttrSwitch != undefined){
                        item[0].parentAttrSwitch = false;
                    }
                    if(result.body.code === 200){
						this.getGoodsAttr('edit');
					}else{
						this.$message({type:'warning',message:result.body.message});
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			getSkuData (){		// 获取库存信息
                let sid = this.goodsBasis.sid || this.$route.query.spuSid;
				this.$http.get(api.sku + sid, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                })
				.then((result) => {
					if(result.body.code === 200){
                        // 数据响应完毕，页面解除禁用
                        this.attrBlockLoading = false;
						for(let i=0;i<result.body.data.length;i++){
							this.attrSkuDataTemp[result.body.data[i].attrCode] = result.body.data[i];
						}
						if(result.body.data.length === 0){
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
				var spuSid = this.goodsBasis.sid || this.$route.query.spuSid;
				var attrSkuDataTemp = this.attrSkuDataTemp;
				function format(obj1, obj2) {		// 组合数据的方法
					if(JSON.stringify(obj1) === '{}'){
						for(let j=0;j<obj2.length;j++){
							if(attrSkuDataTemp[obj2[j].code]){
								obj1[obj2[j].code] = attrSkuDataTemp[obj2[j].code];
							}else{
								obj1[obj2[j].code] = {
									spuSid: spuSid,
									attrCode: obj2[j].code
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
										attrCode: key +'|'+ obj2[a].code
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
					if(JSON.stringify(this.selectTemp[i].children) != '[]'){
						this.attrSkuData = format(this.attrSkuData, this.selectTemp[i].children);
						this.attrSkuDataLen = this.attrSkuDataLen * this.selectTemp[i].children.length
					}
				}
				for(let key in this.attrSkuData){
                    this.attrSkuTotal += Number(this.attrSkuData[key].subInventory);
				}
			},
			delNotChildren (params){		// 删除this.selectTemp的空数据，表格展示有用
				var data = [];
				for(let i=0;i<params.length;i++){
					if(JSON.stringify(params[i].children) != '[]'){
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
					return n%(this.attrSkuDataLen/t) === 0;
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
			addSkuData (type){		// 新增或修改库存数据
				// 判断数据是否符合规定
				if(this.selectTemp.length === 0){
                    this.attrErrorTips = '请添加商品规格';
                    return;
                }
                let pass= true;
                for(let i=0;i<this.selectTemp.length;i++){
					if(this.selectTemp[i].children.length === 0){
                        this.attrErrorTips = '商品规格值不能为空';
                        pass= false;
					}
                }
                if(!pass) return;
				// 对比数据是否有改变，仅针对库存数据一块
				var dataChange = true;
				// 处理提交数据
				var data= [];
				if(dataChange){
                    for(let key in this.attrSkuData){
                        data.push(this.attrSkuData[key]);
                    }
                }
                var url = '';
                if(type === 'online'){
                    // 上架带保存数据
                    let sid = this.goodsBasis.sid || this.$route.query.spuSid;
                    url = ['subscribeOnlinesave', sid];
				}else {
                    url = ['subscribeSkuSave'];
				}
				this.buttonLoading = true;
				this.$http.post(url, data)
				.then((result) => {
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

</style>
