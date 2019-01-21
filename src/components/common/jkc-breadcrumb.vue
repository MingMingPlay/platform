<template>
	<div class="breadcrumb-wrap">
		<el-breadcrumb :separator="separator || '>'" class="crumbs">
			<el-breadcrumb-item v-for="(item,index) in crumbs" :key="index"  :to="item.to" :class="{'disabled':!item.to}" :replace="item.replace">{{item.title}}</el-breadcrumb-item>
		</el-breadcrumb>
		<a href="javascript:void(0)" class="backTo" v-if="goBack" @click="handleClick">&lt;返回</a>
	</div>
</template>

<script>
	// 参数说明：
	// crumbs为列表数组，每一项为面包屑一个层级，对象的四个值分别 标题，导航路由（可选），是否替换页面（可选）;
	// [
	// 	{
	// 		title: '一级',
	// 		to: '/',
	// 		replace: true,
	// 	}
	// ]
	// separator 分隔符号（可选），默认为'>'
	// goBack 为数字，一般为负数，传值即代表显示返回按钮


	export default {
		name: 'jkc-breadcrumb',
		props: ['crumbs', 'separator', 'goBack', 'queryString'],
		data() {
			return {}
		},
		methods: {
			handleClick() {
				if(typeof this.goBack === 'number') this.$router.go(this.goBack);
				else {
					this.$router.push({
						path: this.goBack,
						query: this.queryString
					})
				}
			}
		}
	}
</script>

<style>
	.breadcrumb-wrap {
		position: relative;
	}

	.breadcrumb-wrap .crumbs {
		padding: 14px 0;
	}

	.breadcrumb-wrap .crumbs .disabled .el-breadcrumb__item__inner {
		color: #97a8be;
		cursor: text;
	}

	.breadcrumb-wrap .backTo {
		position: absolute;
		top: 11px;
		right: 20px;
		font-size: 13px;
		color: #48576a;
	}
</style>
