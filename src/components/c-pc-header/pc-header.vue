<template>
	<div class="pc-header">
		<div class="header-menu">
			<router-link to="/" class="logo">{{title}}</router-link>

			<div class="user-wrap">
				<p>欢迎您，
					<el-dropdown trigger="click" @command="handleCommand">
						<a href="javascript:void(0)" class="self">
							{{userInfo.nickname}}
							<i class="el-icon-caret-bottom el-icon--right"></i>
						</a>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="password">修改密码</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					|
					<a href="javascript:void(0)" @click="handleLogout">注销</a>
				</p>
			</div>
		</div>

		<change-password :isVisible="isVisible" title="修改密码" v-if="isVisible" @cancel="changeValue"></change-password>

	</div>
</template>

<script>
	import ChangePassword from '../common/change-password.vue'
	import api from '../../assets/config/c-api.js'
	import { pubObj } from '../../assets/unit/public.js'
	import { router, vm } from '../../pages/platform.js'

	export default {
		components: {
			ChangePassword
		},
		data() {
			return {
				isVisible: false,
				userInfo: {
					nickname: null,
				},
				title: '云平台'
			}
		},
		created() {
			if(vm.userInfo) {
				this.userInfo = vm.userInfo;
			}
		},
		methods: {
			changeValue(val) {
				this.isVisible = val;
			},
			// 退出登录
			handleLogout() {
				var $th = this;
				this.$confirm('确定要退出登录账号吗?', '退出登录', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					pubObj.httpRequest($th, {
						url: ['cloudLogin'],
                        method: 'delete',
						success(result) {
							if(result.code === 200) {
								sessionStorage.clear();
								$th.$message.success({
									message: '退出成功',
									duration: 1000,
									onClose() {
										router.push('/login')
									}
								})
							}
						}
					})
				}).catch(() => {
					console.log('已取消当前操作！')
				});
			},
			handleCommand(command) {
				if(command === 'password') {
					this.isVisible = true;
				}
			}
		}
	}
</script>

<style scoped>
	.pc-header {
		min-width: 1200px;
		border-bottom: 1px solid #dfdfdf;
	}

	.pc-header .user-wrap a {
		color: #20a0ff;
	}

	.pc-header .user-wrap a.self>i {
		transform: scale(0.6);
		-ms-transform: scale(0.6);
		-webkit-transform: scale(0.6);
		-moz-transform: scale(0.6);
		margin-left: -2px;
	}

	.pc-header .header-menu {
		min-width: 1200px;
		height: 45px;
		position: relative;
	}

	.pc-header .logo {
		float: left;
		line-height: 45px;
		color: #000;
		font-size: 20px;
		font-weight: bold;
		width: 176px;
		text-align: center;
	}

	.pc-header .user-wrap {
		float: right;
		height: 45px;
		line-height: 45px;
		font-size: 14px;
		margin-right: 40px;
	}

	.pc-header .user-wrap p {
		color: #000;
	}
</style>
