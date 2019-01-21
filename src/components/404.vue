<template>
	<section class="four">
		<div class="error-wrapper">
			<el-button type="info" icon="arrow-left" class="btn-bg-008489" @click="handleClick(0)">返回</el-button>
			<el-row>
				<el-col :span="12">
					<h1 class="text-jumbo">Oops!</h1>
					<p class="text-normal">
						gif来源
						<a href="https://zh.airbnb.com/" target="_blank"> airbnb </a>
						页面
					</p>
					<h1 class="text-large">对不起，这个页面暂时进不了......</h1>
					<p class="description">请检查网络或网址是否正确，请点击以下按钮返回上一页或者发送错误报告</p>
					<h6 class="text-small">如有不满请联系你领导</h6>
					<ul class="choosing">
						<li>或者你可以去：</li>
						<li><a href="javascript:void(0)" @click="handleClick(0)">返回上一页</a></li>
						<li><a href="javascript:void(0)" @click="handleClick(1)">返回首页</a></li>
						<li><a href="javascript:void(0)" @click="handleClick(2)">返回登录</a></li>
					</ul>
				</el-col>
				<el-col :span="12" class="center">
					<img src="../assets/img/404.gif" alt="加载失败" style="margin-top: 20px;" />
				</el-col>
			</el-row>
		</div>
	</section>
</template>

<script>

	export default {
		methods: {
			handleClick(flag) {
				if(flag === 0) this.$router.go(-1);
				else if(flag === 1) this.$router.push('/');
				else this.$router.push('/login');
			}
		}
	}
</script>

<style scoped>
	.four {
		position: relative;
		padding: 100px 0;
	}

	.four .error-wrapper {
		width: 800px;
		margin: auto;
	}

	.four .btn-bg-008489 {
		background-color: #008489;
		border-color: #008489;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.four .text-jumbo {
		font-size: 60px;
		font-weight: 700;
		color: #484848;
		margin: 40px 0;
	}

	.four .text-normal {
		font-size: 16px;
		color: #333;
	}

	.four .text-normal>a {
		color: #008489;
	}

	.four .text-large {
		margin: 20px 0;
	}

	.four .text-small {
		color: #333;
		margin: 28px 0;
	}

	.four .description {
		font-size: 14px;
		line-height: 20px;
		color: #484848;
		margin-bottom: 30px;
		padding-right: 42px;
	}

	.four .choosing {
		font-size: 14px;
		padding-left: 40px;
	}

	.four .choosing>li {
		list-style: disc;
		line-height: 20px;
		padding-bottom: 5px;
	}

	.four .choosing>li+li,
	.four .choosing>li+li>a {
		color: #008489;
	}
</style>
