<template>
	<el-dialog :title="parentObj.title" v-model="dialogVisible" :close-on-click-modal="false" @close="dialogClose('dialogForm')">
		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
			<el-form-item label="品牌名称" prop="nameFull">
				<el-input v-model="dialogForm.nameFull"></el-input>
			</el-form-item>
			<el-form-item label="品牌简称" prop="nameAbbr">
				<el-input v-model="dialogForm.nameAbbr"></el-input>
			</el-form-item>
			<el-form-item label="英文名称" prop="nameEn">
				<el-input v-model="dialogForm.nameEn"></el-input>
			</el-form-item>
			<el-form-item label="品牌logo" prop="logoSid">
				<image-upload 
				    v-if="dialogVisible"
				    v-model="dialogForm.logoSid"
                    action-type="BrandLogo"
                    :action-path="dialogForm.logoPath">
                </image-upload>
				<div style="font-size: 12px;color: #F43838;margin-top: 4px;">建议图片尺寸148*148</div>
			</el-form-item>
			<el-form-item label="排序" prop="rank">
				<el-slider v-model.number="dialogForm.rank" show-input :max="99" :show-tooltip="false"></el-slider>
				<div style="font-size: 12px;">数字越大排序越靠前</div>
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<el-input type="textarea" v-model="dialogForm.description"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="dialogSubmit('dialogForm')" v-text="parentObj.saveText"></el-button>
		</div>
	</el-dialog>
</template>

<script>
    // child
    import ImageUpload from '../../common/image-upload.vue'
    // mixin
	import DialogForm from '../../mixin/dialog-form.vue'
	// js
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'
	import validator from '../../../assets/unit/validator.js'

	export default {
	    components: { ImageUpload },
		mixins: [DialogForm],
		data() {
		    const rules = {
                nameFull: [{
                    required: true,
                    message: '请填写品牌名称',
                    trigger: 'blur'
                }, {
                    max: 20,
                    message: '品牌名称不能超过20个字',
                    trigger: 'blur'
                }, {
                    validator: this.validNameFull,
                    message: '该品牌名称已被占用',
                    trigger: 'blur'
                }],
                nameAbbr: [{
                    required: true,
                    message: '请填写品牌简称',
                    trigger: 'blur'
                }, {
                    max: 20,
                    message: '品牌简称不能超过20个字',
                    trigger: 'blur'
                }],
                nameEn: [{
                    validator: validator.valid_isChar,
                    trigger: 'blur'
                }, {
                    max: 40,
                    message: '品牌简称不能超过40个字',
                    trigger: 'blur'
                }],
                logoSid: [{
                    required: true,
                    message: '请上传图片',
                    trigger: 'blur'
                }],
                rank: [{
                    required: true,
                    type: 'number',
                    message: '排序值不能为空',
                    trigger: 'blur'
                }],
                description: [{
                    max: 100,
                    message: '最多不超过100个字符',
                    trigger: 'blur'
                }]
            }
			return {
				dialogForm: {
				    sid: null,
				    nameFull: null,
                    nameAbbr: null,
                    nameEn: null,
                    logoSid: null,
                    logoPath: null,
                    rank: 1,
                    description: null,
				},
				rules: rules,
				mxDialogForm: {
                    name: 'brand-dialog',
                    url: api.brand,
//                  detailUrl: api.brand
//                  submitUrl: api.brand
                }
			}
		},
		methods: {
			// ------yjc start------
			validNameFull(rule, value, callback) { // 验证名称是否重复
				let param = {
					name: value,
					sid: this.dialogForm.sid
				};
				this.$http.get(api.brand + 'duplicate', {
						params: param
					})
					.then(result => {
						if(result.body.code === 200 && result.body.data) {
							callback(new Error(rule.message))
						} else {
							callback();
						}
					}).catch(error => {
						callback();
						console.log(error)
					})
			}
			// ------yjc end------
		}
	}
</script>

<style>
	.multipleSelect .el-select__tags-text {
		display: inline-block;
		float: left;
		width: 72px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
