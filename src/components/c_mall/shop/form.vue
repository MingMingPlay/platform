<template>
	<el-dialog :title="parentObj.title" v-model="dialogVisible" :close-on-click-modal="false" @close="dialogClose('dialogForm')">
		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
		    <el-form-item label="店铺名称" prop="nameFull">
                <el-input v-model="dialogForm.nameFull"></el-input>
            </el-form-item>
            <el-form-item label="店铺简称" prop="nameAbbr">
                <el-input v-model="dialogForm.nameAbbr"></el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="nameEn">
                <el-input v-model="dialogForm.nameEn"></el-input>
            </el-form-item>
            <el-form-item label="店铺简介" prop="description">
                <el-input type="textarea" v-model="dialogForm.description" :maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="LOGO" prop="logoSid">
                <image-upload 
                    v-if="dialogVisible"
                    v-model="dialogForm.logoSid"
                    action-type="companyLogo"
                    :action-path="dialogForm.logoPath">
                </image-upload>
                <div style="font-size: 12px;color: #F43838;margin-top: 4px;">建议图片尺寸148*148</div>
            </el-form-item>
			<el-form-item label="上架审核" prop="exemption" v-if="showExemption">
				<el-radio-group v-model="dialogForm.exemption">
					<el-radio :label="true">免审核</el-radio>
					<el-radio :label="false">要审核</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="主营类目" prop="mainCategorySid">
                <el-select v-model="dialogForm.mainCategorySid" placeholder="全部" clearable>
                    <el-option v-for="(item,index) in categoryData" :key="index" :label="item.name" :value="item.sid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所在区域" prop="areaSid">
                <area-select 
                    :default-sid="dialogForm.areaSid" 
                    @get-area="handleGetArea"
                    v-if="dialogVisible">
                </area-select>
            </el-form-item>
            <el-form-item label="客服电话" prop="servicePhone">
                <el-input v-model="dialogForm.servicePhone" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="客服QQ" prop="serviceQQ">
                <el-input v-model="dialogForm.serviceQQ" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="客服邮箱" prop="serviceMail">
                <el-input v-model="dialogForm.serviceMail" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="招商专员" prop="leaseExecutive">
                <el-input v-model="dialogForm.leaseExecutive" :maxlength="10"></el-input>
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
    import AreaSelect from '../../common/area-select.vue'
    import ImageUpload from '../../common/image-upload.vue'
    // mixin
    import DialogForm from '../../mixin/dialog-form.vue'
    
//	import api from '../../../assets/config/c-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'
	import validator from '../../../assets/unit/validator.js'

	export default {
	    components: { AreaSelect, ImageUpload },
	    
		mixins: [DialogForm],
		
		props: {
		    showExemption: Boolean,
		},
		
		data() {
		    const rules = {
                nameFull: [{
                    required: true,
                    message: '请输入店铺名称',
                    trigger: 'blur'
                }, {
                    max: 30,
                    message: '店铺名称不能超过30个字',
                    trigger: 'blur'
                }, {
                    validator: this.validNameFull,
                    message: '该店铺名称已被占用',
                    trigger: 'blur'
                }, {
                    validator: validator.validName,
                    message: '店铺名称只能输入中文或英文',
                    trigger: 'blur'
                }],
                nameAbbr: [{
                    max: 15,
                    message: '最多不超过15个字'
                }, {
                    validator: validator.validName,
                    message: '店铺简称只能输入中文或英文',
                    trigger: 'blur'
                }],
                nameEn: [{
                    max: 100,
                    message: '最多不超过100个字符'
                }, {
                    validator: validator.validNameEn,
                    message: '请输入英文名称',
                    trigger: 'blur'
                }],
                logoSid: [{
                    required: true,
                    message: '请上传店铺LOGO'
                }],
                mainCategorySid: [{
                    required: true,
                    message: '请选择主营品类',
                }],
                areaSid: [{
                    required: true,
                    message: '请选择地区',
                }],
                servicePhone: [{
                    validator: validator.validLandline,
                    message: '请输入正确的电话号码',
                    trigger: 'blur'
                }],
                serviceQQ: [{
                    validator: validator.validUserQQ,
                    message: '请输入正确的QQ号',
                    trigger: 'blur'
                }],
                serviceMail: [{
                    type: 'email',
                    message: '请输入正确的邮箱格式'
                }],
                leaseExecutive: [{
                    validator: validator.validName,
                    message: '请输入名称格式',
                    trigger: 'blur'
                }]
            };
			return {
			    categoryData: [],
				dialogForm: {
				    nameEn: null,
				    areaSid: null,
				    logoSid: null,
				    logoPath: null,
                    nameFull: null,
                    nameAbbr: null,
                    exemption: null,
                    serviceQQ: null,
                    serviceMail: null,
                    leaseExecutive: null,
                    merchantSid: null,
                    description: null,
                    servicePhone: null,
                    mainCategorySid: null,
                },
				rules: rules,
				mxDialogForm: {
                    name: 'shop-dialog',
                    url: ['moreShop'],
                }
			}
		},
		created() {
		    this.$nextTick(() => {
		        pubObj.httpRequest(this, {
		            url: this.$api.category,
		            success(result) {
		                this.categoryData = result.data;
		            }
		        })
		    })
		},
		methods: {
            handleGetArea(obj) {
                this.dialogForm.areaSid = obj.areaSid;
            },
			validNameFull(rule, value, callback) { // 验证店铺名称是否重复
				let param = {
					name: value,
					sid: this.dialogForm.merchantSid
				};
				this.$http.get(this.$api.merchant + 'shop/duplicate', {
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
		}
	}
</script>

<style>
    .el-dialog .area-select .el-select { width: 32%; float: left; }
    .el-dialog .area-select .el-select+.el-select { margin-left: 2%; }
</style>
