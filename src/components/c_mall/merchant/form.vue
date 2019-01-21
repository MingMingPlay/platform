<template>
	<el-dialog title="配置店铺" v-model="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
			<el-form-item label="店铺名称" prop="nameFull">
				<el-input v-model="dialogForm.nameFull"></el-input>
			</el-form-item>
			<el-form-item label="店铺简介">
				<el-input type="textarea" v-model="dialogForm.description"></el-input>
			</el-form-item>
			<el-form-item label="LOGO" prop="logoSid">
				<div class="localPreview" v-if="uploadStatus[0]">
					<img :src="dialogForm[imgNameArr[0].imgPathName] | pathIsNull(0, this)" @mouseenter="shadowStatus = true" @error="handleError(0)" />
					<div class="imgShadow" v-show="shadowStatus" @mouseleave="shadowStatus = false">
						<i class="el-icon-delete2" @click="handleDelLocalImg(0)"></i>
					</div>
				</div>
				<el-upload :action="imageApi" :headers="headers" :data="{customMessage: '0'}" list-type="picture-card" :show-file-list="false" :on-success="handleSuccess" :before-upload="handleBefore" v-show="!uploadStatus[0]">
					<i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>
			<el-form-item label="上架审核" prop="exemption" v-if="showExemption">
				<el-radio-group v-model="dialogForm.exemption">
					<el-radio :label="true">免审核</el-radio>
					<el-radio :label="false">要审核</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="主营品类" prop="mainCategorySid">
				<el-select v-model="dialogForm.mainCategorySid" placeholder="全部">
					<el-option v-for="(item,index) in categoryArr" :key="index" :label="item.name" :value="item.sid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="客服电话" prop="servicePhone">
				<el-input v-model="dialogForm.servicePhone" type="number"></el-input>
			</el-form-item>
			<el-form-item label="客服QQ" prop="serviceQQ">
				<el-input v-model="dialogForm.serviceQQ" type="number"></el-input>
			</el-form-item>
			<el-form-item label="客服邮箱" prop="serviceMail">
				<el-input v-model="dialogForm.serviceMail"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="submitForm('dialogForm')">保 存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { mixin_uploadImage, mixin_dialogForm } from '../../common/jkc-mixin.vue'
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'
	import { shopForm } from '../../../assets/staticData/shop.js'

	export default {
		mixins: [mixin_uploadImage, mixin_dialogForm],
		props: ['showExemption'],
		data() {
			return {
				api: null,
				imageApi: null,
				uploadStatus: [false], // 上传对象数组
				curSid: '',
				imgNameArr: [],
				dialogForm: {},
				rules: {
                    nameFull: [{
                        required: true,
                        message: '请填写店铺名称'
                    }, {
                        max: 30,
                        message: '店铺名称不能超过30个字'
                    }, {
                        validator: this.validNameFull,
                        message: '该店铺名称已被占用',
                        trigger: 'blur'
                    }],
				},
				categoryArr: [],
			}
		},
		created() {
			this.api = api.shop;
			this.imageApi = api.attachment + 'companyLogo';
			this.imgNameArr = [{
				imgSidName: 'logoSid',
				imgPathName: 'logoPath',
			}];
			this.dialogForm = shopForm.dialogForm;
		},
		beforeMount() {
			var _this = this;
			pubObj.httpRequest(_this, {
				url: api.category,
				success(result) {
					_this.categoryArr = result.data;
				}
			});
            for (let key in shopForm.rules){
                if(!this.rules[key]){
                    this.rules[key] = shopForm.rules[key];
                }
            }
		},
		methods: {
            // ------yjc start------
            validNameFull (rule, value, callback){		// 验证店铺名称是否重复
                let param = {
                    name: value,
					sid: this.dialogForm.merchantSid
                };
                this.$http.get(api.merchant + 'shop/duplicate', {params: param})
                    .then(result => {
                        if(result.body.code === 200 && result.body.data){
                            callback(new Error(rule.message))
                        } else {
                            callback();
                        }
                    }).catch(error => {
                    callback();
                    console.log(error)
                })
            },
            // ------yjc end------
            // 图片加载失败
            handleError(index) { this.$set(this.uploadStatus, index, false); }
		}
	}
</script>

<style>

</style>
