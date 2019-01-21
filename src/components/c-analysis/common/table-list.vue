<template>
    <el-table :data="tableData"
              :stripe="true"
              @sort-change="sortChange"
              v-loading="tableLoading">
        <el-table-column v-if="index" type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
        <el-table-column v-for="(value, key) in tableHeader"
                         :key="key"
                         :prop="key"
                         :label="value.label"
                         :sortable="value.sort"
                         :width="value.width"
                         :align="value.align"
                         :label-class-name="value.labelClassName"
                         :class-name="value.className">
        </el-table-column>
        <slot name="handle"></slot>
    </el-table>
</template>
<script>
    export default {
        props: {
            /* 表格的数据 */
            tableData: {
                type: Array,
                required: true,
                default: []
            },
            /*
             * 表格列的数据
             * {     和 element 表格组件参数一致
             *   label   列名称 必传
             *   width   列宽度
             *   align   列的对齐方式
             *   labelClassName  参见 element
             *   className   参见 element
             * }
             * */
            tableHeader: {
                type: Object,
                required: true
            },
            /* 是否显示序列，默认true */
            index: {
                required: false,
                default: true
            },
            /* 表格的 loading 状态 */
            tableLoading: {
                required: true
            }
        },
        data() {
            return {
                tableShow: false,
            }
        },
        watch: {
            tableHeader(){
                // 当头部数据发生变化时，对表格进行重构
                this.tableShow = false;
                setTimeout(() => {
                    this.tableShow = true;
                })
            }
        },
        methods: {
            sortChange(obj){
                this.$emit('sort-change', obj)
            }
        }
    }
</script>
<style>

</style>
