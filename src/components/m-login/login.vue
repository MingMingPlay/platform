<template>
	<div class="login-bg" ref="login">
        <canvas id="root" :width="canvasWidth" :height="canvasHeight" class="art-canvas"></canvas>
        <div class="login-bg-1"></div>
        <p class="system-name">阅商机管理系统</p>
		<div class="login-wrap">
			<div class="login-header">
				<p class="login-title">欢迎登录</p>
			</div>
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
</template>
<script>
	import { pubObj } from '../../assets/unit/public.js' //获取公共方法
    import CanvasAnimate from '../../assets/unit/canvas.js'

	export default {
		name: 'login',
		data() {
			return {
                captcha: this.$api.url + '/captcha/biz.png' + '?' + Math.random(),
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
                canvasWidth: 0,
                canvasHeight: 0,
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
        mounted(){
		    this.canvasWidth = this.$refs.login.clientWidth;
		    this.canvasHeight = this.$refs.login.clientHeight;
            setTimeout(() => {
                let root = document.querySelector("#root");
                let a = new CanvasAnimate(root, {
                    length: 35,
                    clicked: true,
                    moveon: false,
                    RoundColor: '#fff',
                });
                a.Run();
            },12)
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
			    this.captcha = this.$api.url + '/captcha/biz.png' + '?' + Math.random();
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
						this.$http.post(['bizLogin'], data)
							.then(result => {
								if(result.body.code === 200) {
								    sessionStorage.backstage = 'm';
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
									if(this.$root.userInfo.merchantSid){
                                        this.getShopInfo();
                                    }else {
									    this.$message.error('没有找到商家信息');
                                    }
								} else {
									this.$message.info(result.body.message);
									this.loadingState = false;
                                    this.captcha = this.$api.url + '/captcha/biz.png' + '?' + Math.random();
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
            // 获取店铺信息
            getShopInfo(){
                this.$http.get(['merchantShopDetail'])
                    .then((result) => {
                        if(result.body.code === 200) {
                            sessionStorage.shopInfo = JSON.stringify(result.body.data); // 存店铺数据
                            this.$root.shopInfo = result.body.data; // 给页面店铺数据
                            this.$router.push('/'); // 跳走
                        }else{
                            this.$message.warning(result.body.message + '　请联系管理员');
                            this.loadingState = false;
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            }
			// 获取订单待处理的数据
//			getOrderPending(sid) {
//			    // 自营
//			    pubObj.httpRequest(this, {
//                  url: api.order + 'generally?state=2',
//                  success(result) {
//                      let pagiTotal = null;
//                      if(result.pagination) pagiTotal = result.pagination.totalRow; // 分页
//                      else pagiTotal = 0;
//                      sessionStorage.setItem('selfPending', pagiTotal)
//                  }
//              })
//			    // 行销
//			    pubObj.httpRequest(this, {
//                  url: api.order + 'special?agentSid='+sid+'&state=2',
//                  success(result) {
//                      let pagiTotal = null;
//                      if(result.pagination) pagiTotal = result.pagination.totalRow; // 分页
//                      else pagiTotal = 0;
//                      sessionStorage.setItem('specialPending', pagiTotal)
//                  }
//              })
//			    // 退款
//			    pubObj.httpRequest(this, {
//                  url: api.order + 'refund?orderType=generally&merchantSid='+sid+'&state=1',
//                  success(result) {
//                      let pagiTotal = null;
//                      if(result.pagination) pagiTotal = result.pagination.totalRow; // 分页
//                      else pagiTotal = 0;
//                      sessionStorage.setItem('refundPending', pagiTotal)
//                  }
//              })
//			}
		}
	}
</script>
<style>
	.login-bg{
        background: url("../../assets/img/login/bg-m-4.png") no-repeat 80% 5%,
                    url("../../assets/img/login/bg-m-2.png") no-repeat center top;
        background-size: auto,cover;
        position: relative;
		width: 100%;
		height: 100%;
		min-width: 1200px;
        min-height: 700px;
        overflow: hidden;
	}
    .login-bg .login-bg-1 {
        position: absolute;
        width: 100%;
        height: 50%;
        bottom: 0;
        left: 0;
        background: url("../../assets/img/login/bg-m-3.png") no-repeat center bottom;
        background-size: cover;
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
		width: 400px;
		height: 600px;
		overflow: hidden;
		margin: 10px auto;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}
	.login-bg .login-wrap .login-header{
		width: 100%;
		height: 120px;
		position: relative;
	}
	.login-bg .login-wrap .login-title{
		position: absolute;
		width: 100%;
		text-align: center;
		font-size: 24px;
		line-height: 40px;
		color: #fff;
		bottom: 0;
		text-shadow: rgba(0,0,0,0.3) 0 0 1px;
	}
	.login-bg .login-wrap .el-form{
		padding: 30px 35px 0;
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
    .login-bg .el-checkbox {
        color: #fff;
    }
    .login-bg .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #fff;
    }
    .login-bg .el-checkbox.is-checked .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #fff;
    }
    .login-bg .art-canvas {
        position: absolute;
    }
</style>
