<template>
	<div class="login-bg">
		<div class="login-wrap">
            <div class="login-left">
                <img src="../../assets/img/login/computer.png" alt="" style="width: 100%;height: auto;">
                <p style="color: #fff; font-size: 28px;position: absolute;top: 265px;left: 150px;">云平台管理系统</p>
            </div>
			<div class="login-header">
				<p class="login-title">登录</p>
                <el-form :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item prop="username">
                        <img class="cell-icon" src="../../assets/img/login/icon_user.png" />
                        <el-autocomplete v-model="loginForm.username"  placeholder="账号" :fetch-suggestions="querySearch" @keyup.native="tabInput($event, 'u')" v-focus></el-autocomplete>
                    </el-form-item>
                    <el-form-item prop="password">
                        <img class="cell-icon" src="../../assets/img/login/icon_password.png" />
                        <el-input type="password" v-model="loginForm.password" placeholder="密码" @keyup.native="tabInput($event, 'p')"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <img class="cell-icon" src="../../assets/img/login/icon_code.png" />
                        <el-input v-model="loginForm.captcha" placeholder="验证码" @keyup.native="tabInput($event, 'c')" :maxlength="4"></el-input>
                        <img class="captcha" :src="captcha" alt="验证码"
                             @click="captchaLoad">
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="loadingState" @click="submitForm('loginForm')">登录</el-button>
                    </el-form-item>
                    <el-form-item class="remember-password">
                        <el-checkbox v-model="remember" label="记住账号" name="type"></el-checkbox>
                    </el-form-item>
                </el-form>
			</div>

		</div>
	</div>
</template>
<script>
    import { pubObj } from '../../assets/unit/public.js' //获取公共方法

    export default {
        name: 'login',
        data() {
            return {
                captcha: this.$api.url + '/captcha/cloud.png' + '?' + Math.random(),
                loginForm: {
                    username: '',
                    password: '',
                    captcha: '',
                    captchaHashing: '',
                    lifecycle: 'Normal'
                },
                rules: {
                    username: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur,change'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }],
                    captcha: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }, {
                        validator: this.trimSpace,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }]
                },
                loadingState: false,
                restaurants: [],
                remember: true,
            }
        },
        created() {
            if(localStorage.getItem('loginInfo')) {
                this.restaurants = JSON.parse(localStorage.getItem('loginInfo'));
            }
            if(this.restaurants.length > 0){
                this.loginForm.username = this.restaurants[0].value;
            }
        },
        directives: {
            focus: {
                inserted(el){
					el.getElementsByTagName('input')[0].focus();
				}
			}
		},
        methods: {
            trimSpace(rule, value, callback){
                if(!value.trim()){
                    callback(new Error(rule.message));
                }else {
                    callback();
                }
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) { // 过滤曾经登录过的
                return(restaurant) => {
                    return(restaurant.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            captchaLoad() {
                this.captcha = this.$api.url + '/captcha/cloud.png' + '?' + Math.random();
            },
            tabInput(ev, type) {
				if(ev.keyCode === 13){
                    if(type === 'u'){
                        this.$refs.loginForm.$children[1].$el.getElementsByTagName('input')[0].focus();
					}else  if(type === 'p'){
                        this.$refs.loginForm.$children[2].$el.getElementsByTagName('input')[0].focus();
					}else  if(type === 'c'){
						this.submitForm('loginForm')
					}
				}
            },
            submitForm(formName) { // 提交登录
                // 获取cookie信息
                this.loginForm.captchaHashing = pubObj.getCookie('kaptcha');
                // 加密
                let data = JSON.parse(JSON.stringify(this.loginForm));
                let base = new pubObj.Base64();
                data.password = base.encode(data.username + '|' + data.captcha + '|' + data.password);
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        //验证成功，调接口
                        this.loadingState = true;
                        this.$http.post(['cloudLogin'], data)
                            .then(result => {
                                if(result.body.code === 200) {
                                    sessionStorage.backstage = 'c';
                                    sessionStorage.token = result.body.data.token; // 存token
                                    sessionStorage.firstLogin = result.body.data.firstLogin; // 是否首次登录
                                    sessionStorage.userInfo = JSON.stringify(result.body.data); // 存用户数据
                                    this.$root.userInfo = result.body.data; // 给页面数据
                                    if(this.remember) { // 存登录名
                                        var user = JSON.parse(localStorage.getItem('loginInfo')) || [];
                                        for(var i = 0; i < user.length; i++) {
                                            if(user[i].value === data.username) {
                                                user.splice(i, 1);
                                            }
                                        }
                                        user.unshift({
                                            value: data.username
                                        });
                                        localStorage.setItem('loginInfo', JSON.stringify(user));
                                    }
                                    this.$router.push('/'); // 跳走
                                } else {
                                    this.$message({
                                        type: 'info',
                                        message: result.body.message
                                    })
                                    this.loadingState = false;
                                    this.captcha = this.$api.url + '/captcha/cloud.png' + '?' + Math.random();
                                }
                            }, function(err) {
                                console.log(err)
                            })
                    } else {
                        console.log('error submit!!'); // 验证失败
                        return false;
                    }
                });
            },
        }
    }
</script>
<style>
	.login-bg{
		position: relative;
		background: url("../../assets/img/login/bg-c.png") no-repeat bottom;
        background-size: cover;
		width: 100%;
		height: 100%;
        overflow: hidden;
		min-width: 1200px;
		min-height: 700px;
	}
    .login-bg .system-name{
        width: 200px;
        position: relative;
        left: 30px;
        top: 20px;
        font-size: 24px;
        color: #fff;
    }
	.login-bg .login-wrap{
        display: flex;
        align-items: center;
        justify-content: space-between;
		min-width: 1200px;
        max-width: 1300px;
		height: 700px;
		overflow: hidden;
		margin: 0 auto;
        padding: 0 40px;
		position: relative;
		top: 45%;
		transform: translateY(-50%);
	}
    .login-bg .login-left{
        width: 604px;
        height: 600px;
        float: left;
        margin-top: -10px;
        position: relative;
    }
	.login-bg .login-wrap .login-header{
		width: 400px;
		height: auto;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 18px rgba(1,161,255,0.2);
        overflow: hidden;
		position: relative;
        float: right;
	}
	.login-bg .login-wrap .login-title{
        text-align: left;
		width: 100%;
        padding: 30px 0 0 35px;
		font-size: 20px;
		line-height: 40px;
		color: #0188ff;
		text-shadow: rgba(0,0,0,0.3) 0 0 1px;
	}
	.login-bg .login-wrap .el-form{
		padding: 10px 35px 0;
	}
	.login-bg .login-wrap .el-form-item{
		margin-bottom: 20px;
	}
	.login-bg .login-wrap .el-autocomplete{
		width: 100%;
	}
	.login-bg .login-wrap .el-input__inner{
		height: 44px;
		padding-left: 45px;
	}
	.login-bg .login-wrap .cell-icon{
		position: absolute;
		left: 20px;
		top: 14px;
		z-index: 1;
	}
	.login-bg .login-wrap .captcha{
		position: absolute;
		right: 2px;
		top: 2px;
		z-index: 1;
		height: 40px;
		width: 137px;
		cursor: pointer;
		border:1px solid #e4eaee;
	}
	.login-bg .login-wrap .el-button{
		height: 44px;
		width: 100%;
		margin-top: 20px;
		font-size: 16px;
        letter-spacing: 5px;
		text-shadow: rgba(0,0,0,0.3) 0 0 1px;
		background: #0197ff;
		background: linear-gradient(to right, #01a6ff,#0187ff);
	}
	.login-bg .login-wrap .remember-password{
		text-align: center;
	}
</style>
