<template>
    <div class="collapse-table" 
        :class="{
        	'table-striped': stripe,
        	'table-expanded': expand
        }">
    	
        <!--隐藏列-->
        <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
        
        <!--表头部分-->
        <div class="head-wrapper" ref="headWrapper">
            <collapse-table-head></collapse-table-head>
        </div>
        
        <!--主体部分-->
        <div class="body-wrapper" ref="bodyWrapper">
            <collapse-table-body :data="data"></collapse-table-body>
            <!--表格数据为空时，显示占位符-->
            <div class="body-empty-block" v-if="!data.length">暂无数据</div>
        </div>
                
        
    </div>
</template>

<script>
    
    import CollapseTableHead from './collapse-table-head.vue'
    import CollapseTableBody from './collapse-table-body.vue'
    
    export default {
        componentName: 'tab',
        components: { CollapseTableHead, CollapseTableBody },
        props: {
            data: {
                type: Array,
                default: function () {
                	return [];
                }
            },
            stripe: Boolean,
            expand: Boolean,
        },
        data() {
            return {
                children: []
            }
        },
        beforeCreate() {
//          this.level = 0;
        },
        computed: {
            defaultWidth() {
                let width = "";
                const len = this.columns.length;
                if(len) {
                    width = parseFloat(100 / len).toFixed(4) + '%';
                }
                return width;
            },
            columns() {
                let children = this.children;
                let columns = [];
                for(let i = 0, len = children.length; i < len; i++) {
                    if(children[i].$options.componentName === 'tabColumn') {
                        columns.push(children[i])
                    } else continue;
                }
                return columns;
            }
        },
        mounted() {
            this.children = this.$children;
//          setTimeout(() => {
//              console.log(this.columns)
//          }, 1000)
        }
    }
</script>

<style scoped>
    .collapse-table {
        border: 1px solid #e4eaee;
        font-size: 12px;
        color: #1f2d3d;
    }
    .hidden-columns { visibility: hidden; position: absolute; z-index: -1; }
    .body-empty-block {
        height: 38px;
        line-height: 38px;
        text-align: center;
    }
</style>