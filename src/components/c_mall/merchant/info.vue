<template>
    <div class="merchant-info">

        <jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>

        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="84px">
            <div class="detail-title">基础信息</div>
            <div class="detail-wrap">
                <el-form-item label="LOGO" prop="logoSid">
                    <image-upload
                        v-model="dialogForm.logoSid"
                        action-type="CompanyLogo"
                        :action-path="dialogForm.logoPath">
                    </image-upload>
                </el-form-item>
                <el-form-item label="商家名称" prop="nameFull">
                    <el-input v-model="dialogForm.nameFull"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="legalName">
                    <el-input v-model="dialogForm.legalName"></el-input>
                </el-form-item>
                <el-form-item label="联系手机" prop="contactPhone">
                    <el-input v-model="dialogForm.contactPhone" :maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱" prop="contactEmail">
                    <el-input v-model="dialogForm.contactEmail"></el-input>
                </el-form-item>
                <el-form-item label="商家地址" prop="areaSid">
                    <area-select :default-sid="dialogForm.areaSid" @get-area="handleGetArea"></area-select>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="dialogForm.address" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="商家简介" prop="description">
                    <el-input type="textarea" v-model="dialogForm.description"></el-input>
                </el-form-item>
                <el-form-item label="是否定制" prop="customization">
                    <el-radio-group v-model="dialogForm.customization" v-if="$route.query.type == 1">
                        <el-radio :label="true">定制</el-radio>
                        <el-radio :label="false">非定制</el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="dialogForm.customization" v-else>
                        <el-radio :label="true" disabled>定制</el-radio>
                        <el-radio :label="false" disabled>非定制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="所属渠道" prop="channelSid" v-if="dialogForm.customization">
                    <el-select v-if="$route.query.type == 1" v-model="dialogForm.channelSid" placeholder="请选择">
                        <el-option v-for="(item,index) in channel" :key="index" :label="item.name" :value="item.sid"></el-option>
                    </el-select>
                    <el-input v-model="dialogForm.channelName" disabled v-else></el-input>
                </el-form-item>
            </div>
            <div class="detail-title">资质信息</div>
            <div class="detail-wrap">
                <el-form-item label="商家类型" prop="type">
                    <el-select v-model="dialogForm.type" placeholder="请选择">
                        <el-option label="个人" value="Personal"></el-option>
                        <el-option label="企业" value="Enterprise"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="营业执照" prop="licenseCode" v-if="dialogForm.type == 'Enterprise'">
                    <el-input v-model="dialogForm.licenseCode"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" prop="legalIdType">
                    <el-select v-model="dialogForm.legalIdType" placeholder="请选择">
                        <el-option label="身份证" value="IdentityCard"></el-option>
                        <el-option label="护照" value="Passport"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="is-required" label="证件号码" prop="legalIdCode" v-if="dialogForm.legalIdType == 'IdentityCard'" key="IdentityCard">
                    <el-input v-model="dialogForm.legalIdCode"></el-input>
                </el-form-item>
                <el-form-item label="证件号码" prop="legalIdCode2" class="is-required" v-if="dialogForm.legalIdType == 'Passport'" key="Passport">
                    <el-input v-model="dialogForm.legalIdCode2" @blur="handleBlurPassport"></el-input>
                </el-form-item>
                <el-form-item label="证件照片" prop="legalFrontSid" class="item-width">
                    <image-upload
                        v-model="dialogForm.legalFrontSid"
                        action-type="IdCard"
                        :action-path="dialogForm.legalFrontPath">
                    </image-upload>
                    <image-upload
                        v-model="dialogForm.legalBackSid"
                        action-type="IdCard"
                        :action-path="dialogForm.legalBackPath">
                    </image-upload>
                    <image-upload
                        v-if="dialogForm.type == 'Enterprise'"
                        v-model="dialogForm.licenseImageSid"
                        action-type="CompanyLicense"
                        :action-path="dialogForm.licenseImagePath">
                    </image-upload>
                </el-form-item>
                <el-form-item v-if="$route.query.type == 2">
                    <el-button type="primary" @click="submitForm('dialogForm')">保存</el-button>
                </el-form-item>
            </div>
            <template v-if="!isDisabled">
                <div class="detail-title">店铺信息</div>
                <div class="detail-wrap">
                    <el-form-item label="店铺名称" prop="shopNameFull">
                        <el-input v-model="dialogForm.shopNameFull"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺简称" prop="shopNameAbbr">
                        <el-input v-model="dialogForm.shopNameAbbr"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名称" prop="shopNameEn">
                        <el-input v-model="dialogForm.shopNameEn"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺logo" prop="shopLogoSid">
                        <image-upload
                            v-model="dialogForm.shopLogoSid"
                            action-type="CompanyLogo"
                            :action-path="dialogForm.shopLogoPath">
                        </image-upload>
                        <div style="font-size: 12px;color: #F43838;margin-top: 4px;">建议图片尺寸148*148</div>
                    </el-form-item>
                    <el-form-item label="主营类目" prop="mainCategorySid">
                        <el-select v-model="dialogForm.mainCategorySid" placeholder="请选择" clearable>
                            <el-option v-for="(item,index) in categoryData" :key="index" :label="item.name" :value="item.sid"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上架权限" prop="exemption">
                        <el-radio-group v-model="dialogForm.exemption">
                            <el-radio :label="true">免审核</el-radio>
                            <el-radio :label="false">要审核</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="店铺区域" prop="shopAreaSid">
                        <area-select :default-sid="dialogForm.shopAreaSid" @get-area="handleGetArea2"></area-select>
                    </el-form-item>
                    <el-form-item label="客服电话" prop="shopServicePhone">
                        <el-input v-model="dialogForm.shopServicePhone" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="客服QQ" prop="shopServiceQQ">
                        <el-input v-model="dialogForm.shopServiceQQ" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="客服邮箱" prop="shopServiceMail">
                        <el-input v-model="dialogForm.shopServiceMail"></el-input>
                    </el-form-item>
                    <el-form-item label="招商专员" prop="leaseExecutive">
                        <el-input v-model="dialogForm.leaseExecutive" :maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺简介" prop="shopDescription">
                        <el-input type="textarea" v-model="dialogForm.shopDescription" :maxlength="255"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账号" prop="username">
                        <el-input v-model="dialogForm.username" placeholder="请使用手机或者邮箱注册"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="password">
                        <el-input v-model="dialogForm.password" placeholder="密码长度6-30位"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('dialogForm')">保存</el-button>
                    </el-form-item>
                </div>
            </template>
        </el-form>
    </div>
    </div>
</template>

<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import AreaSelect from '../../common/area-select.vue'
    import ImageUpload from '../../common/image-upload.vue'
//	import { mixin_pageForm } from '../../common/jkc-mixin.vue'
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'
	import validator from '../../../assets/unit/validator.js'
	import { merchantInfo, getThis } from '../../../assets/staticData/merchant.js'

	export default {
//		mixins: [mixin_pageForm],
		components: { JkcBreadcrumb, AreaSelect, ImageUpload },
		data() {
			return {
				dialogForm: {},
				rules: {
				    nameFull: [{
                        required: true,
                        message: '请输入商家名称'
                    }, {
                        min: 3,
                        max: 30,
                        message: '商家名称在3-30字以内'
                    }, {
                        validator: validator.validName,
                        message: '商家名称只能输入中文和英文字符'
                    }, {
                        validator: this.validNameFull,
                        message: '该商家名称该账号已被占用',
                        trigger: 'blur'
                    }],
                    username: [{
                        required: true,
                        message: '请输入登陆账号'
                    }, {
                        min: 6,
                        max: 18,
                        message: '登陆账号必须是6-18位'
                    }, {
                        validator: this.validUsername,
                        message: '该账号已被占用',
                        trigger: 'blur'
                    }]
				},
				channel: [],
				categoryData: [],
			}
		},
		computed: {
			isDisabled() {
				return this.$route.query.type === 2 ? true : false;
			}
		},
		created() {
		    this.crumbs = this.changeCrumbs(merchantInfo.crumbs);
			getThis(this);
			this.api = api.newMerchant.url;
			this.dialogForm = merchantInfo.dialogForm;
			for(let key in merchantInfo.rules) {
				if(!this.rules[key]) {
					this.rules[key] = merchantInfo.rules[key];
				}
			}
		},
		mounted() {
            this.$route.query.type == 2 ? this.getFormDetail() : "";
        },
		beforeMount() {
		    pubObj.httpRequest(this, {
                url: api.category,
                success(result) {
                    this.categoryData = result.data;
                }
            })
			if(this.$route.query.type == 1) {
				pubObj.httpRequest(this, {
					url: api.channel,
					params: { available: true },
					success(result) {
						this.channel = result.data
					}
				})
			}
		},
		methods: {
		    // 获取店铺区域id
		    handleGetArea(obj) {
		        this.dialogForm.areaSid = obj.areaSid;
		    },
		    handleGetArea2(obj) {
                this.dialogForm.shopAreaSid = obj.areaSid;
            },
			changeCrumbs(crumbs) {
				if(this.$route.query.type === 1) return crumbs;
				else {
					crumbs[2].title = '编辑商家';
					return crumbs;
				}
			},
			handleBlurPassport() {
				this.dialogForm.legalIdCode = this.dialogForm.legalIdCode2;
			},
			// 隐藏自定义的树形选择框
			handleDisplay(event) {
				pubObj.display(this, event)
			},
			// 选择所属分类，添加属性
			handleNodeClick(sid) {
				this.$set(this.dialogForm, 'categorySid', sid);
			},
			// 针对证件类型是“护照”，做特殊处理(修改)
            callbackPassport(data) {
                if(data.legalIdType === 'Passport') {
                    this.$set(data, 'legalIdCode2', data.legalIdCode);
                    data.legalIdCode = null;
                }
            },
			interceptors(result) {
                this.callbackPassport(result.data);
                return result;
            },
			getFormDetail() {
                pubObj.httpRequest(this, {
                    url: ['newMerchant', this.$route.query.sid],
                    success(result) {
                        console.log(result.data)
                        if(typeof this.interceptors === 'function') result = this.interceptors(result);
                        for(let key in result.data) {
                            if(key in this.dialogForm) this.dialogForm[key] = result.data[key];
                            else continue;
                        }
                    }
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        const obj = this.handleOptions(this.$route.query.type);
                        pubObj.httpRequest(this, {
                            url: obj.url,
                            method: obj.method,
                            body: this.dialogForm,
                            success(result) {
                                this.$message.success(result.message);
                                setTimeout(() => {
                                    this.$router.go(-1)
                                }, 500)
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleOptions(type) {
                if(type === 1) {
                    return {
                        url: ['newMerchant'],
                        method: 'POST'
                    }
                } else {
                    return {
                        url: ['newMerchant', this.$route.query.sid],
                        method: 'PUT'
                    }
                }
            },
			// ------yjc start------
			validNameFull(rule, value, callback) { // 验证商家名称是否重复
				let param = {
					name: value,
					sid: this.$route.query.sid
				};
				this.$http.get(api.merchant + 'duplicate', {
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
				})
			},
			validUsername(rule, value, callback) { // 验证商家账号是否重复
				let param = {
					name: value,
				};
				this.$http.get(['businessLoginName'], {
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
				})
			},
			// ------yjc end------
		},
		destroyed() {
			console.info("hook in destroyed...");
			pubObj.resetForm(0, this.dialogForm, ['auditorType', 'type', 'idType']);
		}
	}
</script>

<style>
	.merchant-info {
		font-size: 14px;
		color: #333;
	}
	.merchant-info .item-width .el-form-item__content {
		width: auto;
	}
	.merchant-info .item-width .el-form-item__content>div {
        float: left;
    }
	.merchant-info .el-form-item__content {
		width: 400px;
	}
	.merchant-info .el-select {
		width: 50%;
	}
	.merchant-info .el-upload.el-upload--picture-card {
		position: relative;
	}
	.merchant-info .area-select .el-select { width: 32%; float: left; }
    .merchant-info .area-select .el-select+.el-select { margin-left: 2%; }
</style>
