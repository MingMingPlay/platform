<template>
    <el-table :data="tableData"
              :stripe="true"
              :border="border"
              v-loading="tableLoading"
              @select="selectRow"
              @select-all="selectAll">
        <el-table-column type="selection" v-if="select"></el-table-column>
        <el-table-column v-if="index" type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
        <template v-for="(value, key) in tableHeader">
            <el-table-column
                v-if="!value.slot"
                :key="key"
                :prop="key"
                :label="value.label"
                :width="value.width"
                :align="value.align"
                :label-class-name="value.labelClassName"
                :class-name="value.className">
            </el-table-column>
            <slot v-else-if="value.slot" :name="value.slot"></slot>
        </template>
        <slot name="handle"></slot>
    </el-table>
</template>
<script>
    /**
     * 通用型的表格组件
     * @params: tableData, tableHeader, tableLoading, index, select
     * 在 tableHeader 中通过slot字段传入slot名来确认列的位置
     * 如：
     * isDisplay: {
            slot: 'comment'
        },
     * */
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
             *   slot    特殊参数，可以通过slot传递一个slot名，然后在代码中传入相应的slot
             * }
             * */
            tableHeader: {
                type: Object,
                required: true
            },
            /* 表格的 loading 状态 */
            tableLoading: {
                required: false
            },
            /* 是否显示序列，默认true */
            index: {
                required: false,
                default: true
            },
            /* 是否显示选择框，默认false */
            select: {
                required: false,
                default: false
            },
            border: {
                required: false,
                default: false
            }
        },
        data() {
            return {}
        },
        methods: {
            selectRow(selection, row){
                this.$emit('select', selection, row)
            },
            selectAll(selection){
                this.$emit('select-all', selection)
            },
        }
    }
</script>
<style>

</style>
