<template>
	<div>
		<div class="home-wrap">
			<img src="../../assets/img/platform_home.png" alt="阅商机">
		</div>
		<change-password
			:isVisible="isVisible" 
			title="您是首次登录系统，建议您修改密码！" 
			v-if="isFirstLogin === 'true' && isVisible" 
			@cancel="changeValue">
		</change-password>
	</div>
</template>

<script>
	import ChangePassword from '../common/change-password.vue'

	export default {
		components: {
			ChangePassword
		},
		data() {
			return {
				isFirstLogin: null,
				isVisible: true
			}
		},
		created() {
			this.isFirstLogin = sessionStorage.firstLogin;
		},
		methods: {
			changeValue(val) {
				this.isVisible = val;
			}
		}
	}
</script>
<style>
	.home-wrap{
		width: 900px;
		margin: 0 auto;
		padding-top: 100px;
	}
	.home-wrap img{
		max-width: 100%;
	}
</style>