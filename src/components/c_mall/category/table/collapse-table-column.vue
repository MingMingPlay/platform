<template>
    
    <!--row: 默认空对象, 不然一开始 scope.row.name 的时候要报错-->
    <div><slot row="{}"></slot></div>
    
</template>

<script>
    export default {

        componentName: 'tabColumn',

        props: {
            label: String,
            prop: String,
            width: String,
            align: {
            	type: String,
            	default: 'left'
            }
        },

        computed: {
            defaultStyle() {
                let ret = {};
                const labelWidth = this.width || this.table.defaultWidth;
                const align = this.align;
                if(labelWidth) ret.width = labelWidth;
                if(align) ret.textAlign = align;
                return ret;
            },
            table() {
                const parent = this.$parent;
                return parent;
            }
        },

        created() {
//          const scopedSlots = this.$scopedSlots;
//          if(scopedSlots.default) {
//              scopedSlots.default({ row: {} });
//              this.$scopedSlots = scopedSlots;
//          }
        },

        mounted() {
//          setTimeout(() => {
//              const scopedSlots = this.$scopedSlots;
//              if(scopedSlots.default) {
//                  console.log(scopedSlots.default({}))
//              }
//          }, 1000)
        }
    }
</script>