<template>
	<el-dialog :title="parentObj.title" v-model="dialogVisible" :close-on-click-modal="false" @close="dialogClose('dialogForm')">
		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
			<template v-if="parentObj.type === 1">
				<el-form-item label="登录账号" prop="loginName">
					<el-input v-model="dialogForm.loginName"></el-input>
				</el-form-item>
				<el-form-item label="登录密码" prop="password">
					<el-input v-model="dialogForm.password"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="mobile" class="is-required">
					<el-input v-model="dialogForm.mobile" :maxlength="11"></el-input>
				</el-form-item>
			</template>
			<!--<template v-else>
				<el-form-item label="登录账号">
					<el-input v-model="dialogForm.loginName" disabled></el-input>
				</el-form-item>
				<el-form-item label="登录密码">
                    <el-input v-model="dialogForm.password" disabled></el-input>
                </el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="dialogForm.mobile" disabled></el-input>
				</el-form-item>
			</template>-->
			<el-form-item label="用户姓名" prop="name">
				<el-input v-model="dialogForm.name"></el-input>
			</el-form-item>
			<el-form-item label="组织机构" prop="organCode" class="is-required">
                <organ-select
                    v-if="dialogVisible"
                    v-model="organCodes"
                    :organ-data="organData">
                </organ-select>
            </el-form-item>
		</el-form>
		<div slot="footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="dialogSubmit('dialogForm')">保 存</el-button>
		</div>
	</el-dialog>
</template>

<script>
    // compo
	import OrganSelect from '../../common/organ-select.vue'
	// mixin
    import DialogForm from '../../mixin/dialog-form.vue'
	// js
	import api from '../../../assets/config/m-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'
	import validator from '../../../assets/unit/validator.js'

	export default {
	    components: { OrganSelect },
	    mixins: [DialogForm],
		props: {
		    organData: {
                type: Array,
                default() { return [] }
            }
		},
		data() {
		    const rules = {
                loginName: [{
                    required: true,
                    message: '请输入登录账号',
                    trigger: 'blur'
                },{
                    validator: this.validUsername,
                    message: '该账号已被占用',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 30,
                    message: '密码长度6~30位',
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                }, {
                    validator: this.validMobile,
                    message: '该手机号已被占用',
                    trigger: 'blur'
                }, {
                    validator: validator.validCellphone,
                    message: '请输入有效的手机号',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                }, {
                    max: 20,
                    message: '姓名最长20字',
                    trigger: 'blur'
                }],
//              organCode: [{
//                  required: true,
//                  message: '请选择组织机构',
//                  trigger: 'blur'
//              }],
            };
			return {
			    organCodes: [],
			    mxDialogForm: {
				    name: 'account-dialog',
				    detailUrl: ['userProfile'],
				    postUrl: ['userManager'],
				    putUrl: ['userProfile'],
				    /*initFormFun: this.interceptors*/
			    },
			    dialogForm: {
			        name: null,
			        mobile: null,
			        password: null,
			        organCode: this.$root.userInfo.organCode,
			        loginName: null,
			        merchantSid: this.$root.userInfo.merchantSid
			    },
			    rules: rules
			}
		},
		watch: {
		    organCodes(val) {
		        this.dialogForm.organCode = val[val.length - 1];
		    }
		},
		methods: {
		    traversalOrgan(data, organPath = []) {
		        try {
		            if(!data) return organPath;
                    organPath.push(data[0].code);
                    return this.traversalOrgan(data[0].children, organPath);
		        } catch(e) {
		            console.log(e)
		        }
		    },
		    interceptors(data, callback) {
		        // 获取上级组织机构
		        pubObj.httpRequest(this, {
		            url: ['organParent', this.dialogForm.merchantSid, '/', data.organCode],
		            success(result) {
		                try {
                            this.organCodes = this.traversalOrgan(result.data);
                            callback(data);
                        } catch(e) {
                            console.log(e)
                        }
		            }
		        });
		    },
            // yjc
            validUsername(rule, value, callback) { // 验证名称是否重复
                let param = {
                    name: value
                };
                this.$http.get(['userCheckRepeat', 'login-name'], {
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
            },
            validMobile(rule, value, callback) { // 验证手机号是否重复
                let param = {
                    mobile: value
                };
                this.$http.get(['userCheckRepeat', 'mobile'], {
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

</style>
