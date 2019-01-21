<template>
	<el-collapse accordion>
		<el-collapse-item v-for="(item,index) in data" :key="index" :name="index + 1" v-stripe="index">
			<template slot="title">
				<ul>
					<li class="number"></li>
					<li :class="[item.children ? '' : 'padding-left']">
						<i class="el-collapse-item__header__arrow el-icon-caret-right" v-if="item.children"></i> {{item.name}}
					</li>
					<li>
						<img :src="item.logoPath | imageSize(100)" class="logoImage" />
					</li>
					<li :title="item.description">{{item.description === '' ? '--' : item.description}}</li>
					<li>{{item.rank}}</li>
					<li>{{item.stateName}}</li>
					<li>
						<el-button type="text" @click.stop="handleEdit(item.sid)">修改</el-button>
					</li>
				</ul>
			</template>
			<collapse :data="item.children"></collapse>
		</el-collapse-item>
	</el-collapse>
</template>

<script>
	import { mixin_collapse } from '../../common/jkc-mixin.vue'
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'

	export default {
		name: 'collapse',
		mixins: [mixin_collapse],
		props: ['data'],
		data() {
			return {
				title: '品类',
				api: api.category,
			}
		}
	}
</script>

<style scoped>
	.collapse-wrap .padding-left {
		padding-left: 28px;
	}

	.collapse-wrap .el-collapse li:nth-of-type(1) {
		width: 50px;
	}

	.collapse-wrap .el-collapse li:nth-of-type(2)>i {
		margin: 0;
		margin-left: -2px;
		-webkit-transform: scale(0.6);
		transform: scale(0.6);
	}

	.collapse-wrap .el-collapse-item.is-active>.el-collapse-item__header .el-collapse-item__header__arrow {
		-webkit-transform: scale(0.6) rotate(90deg);
		transform: scale(0.6) rotate(90deg);
	}

	.collapse-wrap .el-collapse li {
		width: 16%;
	}
</style>
