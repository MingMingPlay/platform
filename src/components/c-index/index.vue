<template>
	<div id="index" class="pc-wrap">
		<pc-header></pc-header>
		<div class="content-wrap">
			<pc-sidebar></pc-sidebar>
			<div class="pc-main">
				<div class="pc-content">
					<router-view></router-view>
				</div>
				<div class="pc-footer">©云平台版权所有</div>
			</div>
		</div>
	</div>
</template>
<script>
	import PcHeader from '../c-pc-header/pc-header.vue'
	import PcSidebar from '../pc-sidebar/pc-sidebar.vue'

	export default {
		name: 'index',
		data() {
			return {
			}
		},
		components: {
			PcHeader,
			PcSidebar
		}
	}
</script>
<style>
	.pc-wrap{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		overflow: auto;
	}
	.content-wrap{
		min-width: 1200px;
		min-height: calc(100% - 46px);
		position: relative;
	}
	.pc-main {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 176px;
		right: 0;
		background-color: #fff;
		padding: 0 30px 0;
		overflow-y: auto;
	}
	.pc-main .pc-content{
		position: relative;
		padding-bottom: 60px;
		min-height: 90%;
	}
	.pc-footer {
		height: 50px;
		line-height: 50px;
		text-align: center;
		border-top: 2px solid #fcfcfc;
		font-size: 12px;
	}
</style>
