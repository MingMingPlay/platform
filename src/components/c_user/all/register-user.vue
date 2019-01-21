<template>
    <div>
        <el-dialog :title="dialogTitle" v-model="registerShow" @close="closeRegister" size="tiny" :close-on-click-modal="false">
            <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="80px">
                <el-form-item label="登录名" prop="loginName">
                    <el-input v-model="registerForm.loginName" :maxlength="20" placeholder="请输入登录名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" :maxlength="20" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="registerForm.mobile" :maxlength="11" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="所属商家" prop="merchantSid">
                    <el-select v-model="registerForm.merchantSid"
                               placeholder="请输入商家名称查询"
                               filterable
                               remote
                               :remote-method="getBiz"
                               @change="selectBiz">
                        <el-option v-for="(item,index) in merchantData" :key="index" 
                            :label="item.nameFull" :value="item.sid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织机构" prop="organCode" v-if="registerForm.merchantSid && employee">
                    <el-cascader
                        placeholder="请选择组织机构"
                        :options="organData"
                        v-model="organCodes"
                        change-on-select
                        clearable
                        :show-all-levels="false"
                        @change="handleChangeBiz">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="所在区域" prop="areaSid">
                    <area-select v-model="registerForm.areaSid"></area-select>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name">
                    <el-input v-model="registerForm.name" :maxlength="6" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="registerForm.gender" placeholder="请选择性别">
                        <el-option label="男" value="Male"></el-option>
                        <el-option label="女" value="Female"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="registerShow = false">取消</el-button>
                <el-button type="primary" @click="submitRegister">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import validator from '../../../assets/unit/validator'
    import AreaSelect from '../../common/area-select-new.vue'
    export default {
        props: {
            isShow: {
                type: Boolean,
                required: true,
                default: false,
            },
            employee: {
                type: Boolean,
                required: true,
                default: true,
            }
        },
        data() {
            return {
                dialogTitle: this.employee ? '注册员工' : '注册普通用户',
                merchantData: [],
                organData: [],
                // 已选择的组织机构
                organCodes: [],
                registerShow: this.isShow,
                registerForm: {
                    loginName: "",
                    password: "",
                    merchantSid: "",
                    organCode: null,
                    areaSid: "",
                    name: "",
                    gender: "",
                    mobile: "",
                    email: "",
                    // 如果是员工需要传该字段
                    // qualifyType: 'Employee'
                },
                registerRules: {
                    loginName: [{
                        required: true,
                        message: '请输入登录名',
                        trigger: 'blur'
                    }, {
                        validator: this.validLoginName,
                        message: '登录名已注册',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        validator: this.validLoginPsssWord,
                        trigger: 'blur'
                    }, {
                        min: 6,
                        message: '最少输入6位',
                        trigger: 'blur'
                    }],
                    merchantSid: [{
                        required: true,
                        message: '请选择所属商家',
                        trigger: 'blur'
                    }],
                    organCode: [{
                        required: true,
                        type: 'number',
                        message: '请选择组织机构',
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }, {
                        validator: validator.validMobile,
                        trigger: 'blur'
                    }, {
                        validator: this.validMobile,
                        message: '手机号已注册',
                        trigger: 'blur'
                    }],
                    email: [{
                        type: 'email',
                        message: '请输入正确的邮箱',
                        trigger: 'blur'
                    }],
                }
            }
        },
        watch: {
            isShow(newVal){
                this.registerShow = newVal;
            }
        },
        components: {
            AreaSelect,
        },
        methods: {
            // 选择组织机构
            handleChangeBiz(codes){
                this.registerForm.organCode = codes[codes.length - 1].code;
                this.registerForm.areaSid = codes[codes.length - 1].areaSid;
                console.log(this.registerForm.areaSid)
            },
            // 选择商家
            selectBiz(sid){
                if(sid && this.employee){
                    this.registerForm.organCode = null;
                    this.organData = [];
                    this.organCodes = [];
                    this.getOrgan(sid);
                }
            },
            // 获取商家列表
            getBiz(query){
                if(!query) return ;
                this.$http.get(['newMerchant'], {params: {q: query, customization: true}})
                    .then(result => {
                        if(result.body.code === 200){
                            this.merchantData = result.body.data;
                        }
                    })
            },
            // 根据商家 id 获取组织机构
            getOrgan (mSid){		// 获取组织机构
                function transformData(data) {      // 仅用于改造数据；改造成级联选择器需要的数据
                    data.forEach(value => {
                        value.label = value.name;
                        value.value = {
                            code: value.code,
                            sid: value.sid,
                            areaSid: value.areaSid
                        };
                        if(value.children && value.children.length > 0){
                            return transformData(value.children);
                        }
                    });
                    return data;
                }
                this.$http.get(['organ', mSid])
                    .then((result) => {
                        if(result.body.code === 200){
                            let data = result.body.data;
                            if(data && data.length > 0){
                                this.organData = transformData(data);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            // 验证登录名是否重复
            validLoginName(rule, value, callback){
                if(value) {
                    this.$http.get(['userDCLN'], {params: {name: value}})
                        .then(result => {
                            if(result.body.code === 200 && result.body.data){
                                callback(new Error(rule.message))
                            }else {
                                callback();
                            }
                        })
                } else {
                    callback();
                }
            },
            // 验证手机号是否重复
            validMobile(rule, value, callback){
                if(value) {
                    this.$http.get(['userDCM'], {params: {mobile: value}})
                        .then(result => {
                            if(result.body.code === 200 && result.body.data){
                                callback(new Error(rule.message))
                            }else {
                                callback();
                            }
                        })
                } else {
                    callback();
                }
            },
            // 验证手机号是否重复
            validLoginPsssWord(rule, value, callback){
                if(value && !/^[a-zA-Z\d_]+$/.test(value)) {
                    callback('密码格式不正确');
                } else {
                    callback();
                }
            },
            // 关闭注册dialog
            closeRegister(){
                this.$emit('close', this.registerShow);
                this.$refs.registerForm.resetFields();
            },
            submitRegister(){   // 提交用户注册
                this.$refs.registerForm.validate((valid) => {
                    if(valid){
                        if(this.employee){
                            this.registerForm.qualifyType = 'Employee';
                        }
                        this.$http.post(['userMember'],this.registerForm)
                            .then(result => {
                                if(result.body.code === 200){
                                    this.$message.success(result.body.message);
                                    this.registerShow = false;
                                    this.$emit('success');
                                }else {
                                    this.$message.error(result.body.message);
                                }
                            })
                    }
                })
            },
        }
    }
</script>
<style>

</style>
