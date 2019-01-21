<template>
    <div class="create-shop">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="detail-title">创建店铺</div>
        <div class="detail-wrap">
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
                        v-model="dialogForm.logoSid"
                        action-type="companyLogo">
                    </image-upload>
                </el-form-item>
                <el-form-item label="主营类目" prop="mainCategorySid">
                    <el-select v-model="dialogForm.mainCategorySid" placeholder="全部" clearable>
                        <el-option v-for="(item,index) in categoryData"
                            :key="index"
                            :label="item.name" :value="item.sid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在区域" prop="areaSid">
                    <area-select :default-sid="dialogForm.areaSid" @get-area="handleGetArea"></area-select>
                </el-form-item>
                <el-form-item label="组织机构" prop="organCode">
                    <organ-select :organ-data="organData" v-model="organCodes"></organ-select>
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
                <el-form-item>
                    <el-button 
                        type="primary" 
                        :disabled="organData.length ? false : true"
                        @click="handleSave('dialogForm')">创 建
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import AreaSelect from '../../common/area-select.vue'
    import OrganSelect from '../../common/organ-select.vue'
    import ImageUpload from '../../common/image-upload.vue'
    
    import { pubObj } from '../../../assets/unit/public.js'
    import validator from '../../../assets/unit/validator.js'

    export default {
        components: { JkcBreadcrumb, AreaSelect, OrganSelect, ImageUpload },
        data() {
            const rules = {
                nameFull: [{
                    required: true,
                    message: '请输入店铺名称'
                }, {
                    max: 30,
                    message: '店铺名称不能超过30个字'
                }, {
                    validator: validator.validName,
                    message: '店铺名称只能输入中文或英文',
                    trigger: 'blur'
                }, {
                    validator: this.validNameFull,
                    message: '该店铺名称已被占用',
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
                organCode: [{
                    required: true,
                    message: '请选择组织机构',
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
                }]
            };
            return {
                dialogForm: {
                    mainCategorySid: null
                },
                rules: rules,
                categoryData: [],
                organData: [],
                organCodes: []
            }
        },
        watch: {
            organCodes(val) {
                this.dialogForm.organCode = val[val.length - 1];
            }
        },
        created() {
           this.crumbs = [{ title: '店铺管理' }, { title: '创建店铺' }];
        },
        beforeMount() {
            // 品类数据
            pubObj.httpRequest(this, {
                url: this.$api.category,
                success(result) {
                    this.categoryData = result.data;
                }
            });
            // 组织机构
            pubObj.httpRequest(this, {
                url: ['organChildren', this.$root.userInfo.merchantSid, '/', this.$root.userInfo.organCode],
                success(result) {
                    this.organData = result.data;
                    if(!result.data.length) {
                        this.$notify({
                            type: 'info',
                            title: '通知',
                            message: '您没有权限创建店铺，一个组织机构只能创建一个店铺',
                            duration: 0
                        })
                    }
                }
            })
        },
        methods: {
            handleGetArea(obj) {
                this.dialogForm.areaSid = obj.areaSid;
            },
            handleSave(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        pubObj.httpRequest(this, {
                            method: 'POST',
                            url: ['moreShop'],
                            body: this.dialogForm,
                            success(result) {
                                this.$message.success(result.message);
                                setTimeout(() => {
                                    this.$emit('go-back');
                                }, 1000)
                            }
                        })
                    } else {
                        return false;
                    }
                })
            },
            validNameFull (rule, value, callback){      // 验证店铺名称是否重复
                let param = {
                    name: value,
                    sid: this.dialogForm.merchantSid
                };
                this.$http.get(this.$api.merchant + 'shop/duplicate', {params: param})
                    .then(result => {
                        if(result.body.code === 200 && result.body.data){
                            callback(new Error(rule.message))
                        } else {
                            callback();
                        }
                    }).catch(error => {
                    callback();
                })
            }
        }
    }
</script>

<style>
    .create-shop .el-form-item__content { width: 400px; }
    .create-shop .area-select .el-select { width: 32%; float: left; }
    .create-shop .area-select .el-select+.el-select { margin-left: 2%; }
</style>
