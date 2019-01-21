<template>
	<div 
		class="jk-tabs-pane" 
		:class="{ 'is-active': active }"
		@click="handlePaneClick">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: 'JkTabsPane',
		
		componentName: 'JkTabsPane',
		
		inject: ['tabsnav'],
		
		props: {
			label: [String, Number]
		},
		
		computed: {
			active() {
				return this.label === this.tabsNav.value;
			},
			tabsNav() {
				return this.$parent;
			}
		},
		
		methods: {
			handlePaneClick() {
				this.tabsNav.$emit('input', this.label);
				this.tabsNav.$emit('change', this.label);
			}
		},
		
		mounted() {}
	}
</script>

<style scoped>
	.jk-tabs-pane {
		padding: 0 20px;
	    height: 40px;
	    box-sizing: border-box;
	    line-height: 40px;
	    display: inline-block;
	    list-style: none;
	    font-size: 14px;
	    font-weight: 500;
	    color: #2d2f33;
	    position: relative;
	}
	.jk-tabs-pane:nth-child(2) {
		padding-left: 0;
	}
	.jk-tabs-pane:hover {
		color: #409eff;
    	cursor: pointer;
	}
	.jk-tabs-pane.is-active {
	    color: #409eff;
	}
</style>