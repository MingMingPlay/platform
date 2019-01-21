<template>
	<div>
		<template v-for="item in data" v-if="!item.button">
			<el-menu-item :index="item.url"
			v-if="!item.children || item.children[0].button"
			:route="{path: item.url, query: { btn: item.sid}}">{{item.name}}</el-menu-item>
			<el-submenu :index="item.url" v-else-if="item.children && !item.children[0].button">
				<template slot="title">{{item.name}}</template>
				<pc-menu :data="item.children"></pc-menu>
			</el-submenu>
		</template>
	</div>
</template>

<script>
	export default {
		name: 'pcMenu',
		props: ['data'],
		data() {
			return {

			}
		}
	}
</script>