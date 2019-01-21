<template>
    <!--改用render动态渲染-->
</template>

<script>
    export default {
        name: 'collapseTableBody',
        componentName: 'tabBody',
        props: {
            data: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                level: 1,
                display: null
            }
        },
        computed: {
            columns() {
                return this.table.columns;
            },
            table() {
                let parent = this.$parent;
                let parentName = parent.$options.componentName;
                while(parentName !== 'tab') {
                    parent = parent.$parent;
                    parentName = parent.$options.componentName;
                    // 循环到第几层
                    this.level += 1;
                }
                return parent;
            }
        },
        created() {
        	// 初始化
        	this.display = this.table.expand;
            // 渲染
            this.$options.render = h => h('div', {
                class: 'collapse-table-body',
            }, [
                this.data.map((item, index) => {
                    const isExpand = item.children && item.children.length;
                    return h('div', {
                		class: {
                			'table-row': true,
                			'expand-row': isExpand
                		}
                    }, [
                        h('div', {
                        	class: 'table-cell',
                        	on: isExpand ? {
								    click: this.handleExpandchildren
								} : {}
                        }, this.columns.map((column, colIndex, arr) => {
                            if(Object.keys(column.$scopedSlots).length) {
                                return h('div', {
                                    class: 'cell',
                                    style: column.defaultStyle
                                }, column.$scopedSlots.default({ row: item }))
                            } else {
                                // 是展开项且是第一个cell
                                const bool = isExpand && !colIndex;
                                // cell动态样式对象
                                let cellStyle = {};
                                if(colIndex == 0) cellStyle['padding-left'] = this.level * 14 + 'px';
                                return h('div', {
                                    class: 'cell',
                                    style: Object.assign({}, column.defaultStyle, cellStyle),
                                    domProps: !bool ? {
                                        innerHTML: item[column.prop]
                                    } : {}
                                }, [bool ? [h('i', {
                                    class: {
                                        'el-icon-caret-bottom': this.display,
                                        'el-icon-caret-right': !this.display,
                                        'caret-reset': true,
                                    },
                                    attrs: {
                                        'data-position': this.display ? 'right' : 'bottom'
                                    }
                                }), item[column.prop]] : ""])
                            }
                        })),
                        isExpand ? h('collapseTableBody', {
                            attrs: {
                                'data-display': this.display ? 'none' : 'block'
                            },
                            props: {
                                data: item.children
                            }
                        }) : ""
                    ])
                })
            ]);
        },
        methods: {
            // 向上查找指定的父元素
            handleDispatch(eTarget) {
                let pTarget = eTarget.parentElement;
                while(pTarget && pTarget.className.indexOf('table-row') === -1) {
                    pTarget = pTarget.parentElement;
                }
                
                return pTarget;
            },
        	handleExpandchildren(e) {
        	    const parParent = this.handleDispatch(e.target);
        	    // --yjc--
        	    // const parParent = e.path[2];

                /*let parParent = null;
                e.path.forEach(value => {
                    if(value.className && value.className.indexOf('table-row') !== -1){
                        parParent = value;
                    }
                });*/
                // --yjc end--

                const tabBody = parParent.querySelector('.collapse-table-body');
        	    const display = tabBody.dataset.display;
        	    tabBody.style.display = display;

        	    const caret = parParent.querySelector('.caret-reset');
        	    const position = caret.dataset.position;
        	    let className = caret.className;
        	    const tarPos = position == 'right' ? 'bottom' : 'right';
        	    className = className.replace(tarPos, position);
        	    caret.className = className;

        	    tabBody.dataset.display = display == 'none' ? 'block' : 'none';
        	    caret.dataset.position = tarPos;
        	}
        },
        mounted() {
//          setTimeout(() => {}, 1000)
        }
    }
</script>

<style scoped>
    .collapse-table-body:nth-child(n+2) { display: none; }
    .table-expanded .collapse-table-body:nth-child(n+2) {
    	display: block;
    }
    .table-striped .table-row:nth-child(2n+2) { background-color: #fafafa; }
    .table-row.expand-row >.table-cell {
    	cursor: pointer;
    }
    .table-cell {
        width: 100%;
        display: flex;
        align-items: center;
        cursor: default;
    }
    .table-cell:hover {
        background-color: #eef1f6;
    }
    .cell {
        padding: 6px 14px;
        line-height: 20px;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: box;
        -webkit-box-orient: vertical;
        white-space: normal;
        word-break: break-all;
        box-sizing: border-box;
    }
    .cell .caret-reset {
        color: #666;
        -webkit-transform: scale(0.7);
        -moz-transform: scale(0.7);
        -ms-transform: scale(0.7);
        transform: scale(0.7);
    }
    .table-cell .cell:nth-last-of-type(1) { flex-grow: 1; }
    .cell img {
        width: 50px;
        height: 50px;
        vertical-align: top;
    }
</style>
