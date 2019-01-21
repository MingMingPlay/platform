<template>
    <div class="jk-tabs__active-bar" :style="barStyle"></div>
</template>

<script>
    export default {
    	name: 'JkTabsBar',

    	componentName: 'JkTabsBar',

        inject: ['tabsnav'],

        computed: {
        	barStyle() {
        		let ret = {};
        		let offset = 0;
          		let barWidth = 0;
        		const panes = this.panes;
        		if(panes.length) {
        			panes.every((pane, index) => {
        				const el = pane.$el;
        				if(pane.active) {
        					if(index === 0) barWidth = el.clientWidth - 20;
        					else barWidth = el.clientWidth - 40;
        					return false;
        				} else {
        					if(index === 0) offset += el.clientWidth + 20;
        					else offset += el.clientWidth;
        					return true;
        				}
        			})
        		}
        		ret.width = barWidth + 'px';
        		const transform = `translateX(${offset}px)`;
	          	ret.transform = transform;
	          	ret.msTransform = transform;
	          	ret.webkitTransform = transform;

          		return ret;

        	},
        	panes() {
        		return this.tabsNav.panes;
        	},
        	tabsNav() {
        		return this.$parent;
        	}
        },

        watch: {
        	panes(val) {
        		//console.log(val)
        	}
        },

        mounted() {}
    }
</script>

<style scoped>
    .jk-tabs__active-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background-color: #409eff;
        z-index: 2;
        transition: transform .3s cubic-bezier(.645,.045,.355,1);
        list-style: none;
    }
</style>
