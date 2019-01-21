<template>
    <el-table :data="tableData"
              :stripe="true"
              v-loading="tableLoading" @row-dblclick="copySid">
        <el-table-column v-if="index" type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
        <el-table-column v-for="(value, key) in tableHeader"
                         :key="key"
                         :label="value.label"
                         :width="value.width"
                         :align="value.align"
                         :label-class-name="value.labelClassName"
                         :class-name="value.className">
            <template slot-scope="scope">
                <div v-if="key === 'title'" class="goods-title">
                    <img :src="scope.row.mainImagePath" alt="">
                    <p class="title">{{scope.row.title}}</p>
                </div>
                <p v-else-if="key === 'inventory'" :class="{'red':scope.row.inventory < 50}">{{scope.row.inventory}}</p>
                <p v-else-if="key === 'sellingPrice' || key === 'costPrice' || key === 'employeePrice' || key === 'price' || key === 'refund'">
                    <span v-if="scope.row[key]">{{scope.row[key] | currency}}</span>
                    <span v-else>--</span>
                </p>
                <span v-else-if="key === 'state'">{{productState[scope.row.state]}}</span>
                <span v-else>{{scope.row[key]}}</span>
            </template>
        </el-table-column>
        <slot name="handle"></slot>
    </el-table>
</template>
<script>
    import staticData from '../../assets/config/staticData.js'
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
                productState: staticData.productState,
            }
        },
        methods: {
            copySid(row){
                try {
                    window.clipboardData.setData("Text", row.sid);
                }catch (err){}
            },
        }
    }
</script>
<style>

</style>
