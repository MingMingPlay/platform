<template>
	<!--render渲染-->
</template>

<script>
    import JkTabsBar from './jk-tabs-bar.vue'
    
    export default {
        name: 'JkTabsNav',
        
        components: { JkTabsBar },
        
        provide: { tabsnav: "" },
        
        props: {
        	value: {}
        },
        
        data() {
        	return {
        		panes: []
        	}
        },
        
        created() {
        	this.$options.render = h => h('div', {
	    		class: 'jk-tabs-nav'
	    	}, [h('JkTabsBar', {}), this.$slots.default])
       	},
       
       	mounted() {
       		const children = this.$children;
       		this.panes = children.filter(item => {
       			return item.$options.componentName == 'JkTabsPane';
       		})
       	}
        
    }
</script>

<style scoped>
	.jk-tabs-nav {
		position: relative;
		font-size: 0;
	}
    .jk-tabs-nav:after {
    	content: "";
    	position: absolute;
	    left: 0;
	    bottom: 0;
	    width: 100%;
	    height: 2px;
	    background-color: #dfe4ed;
	    z-index: 1;
    }
</style>