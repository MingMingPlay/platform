<template>
    <el-table
        class="recursion-table"
        :data="tableData"
        :border="border"
        v-loading="tableLoading"
        :row-key="rowKey"
        :expand-row-keys="expandRowKeys">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <div v-if="scope.row.subOrgans">
                    <recursion-table
                        :tableData="scope.row.subOrgans"
                        :tableHeader="tableHeader">
                    </recursion-table>
                </div>
            </template>
        </el-table-column>
        <template v-for="(value, key) in currentTableHeader">
            <el-table-column
                v-if="!value.button"
                :key="key"
                :prop="key"
                :label="value.label"
                :width="value.width"
                :align="value.align"
                :label-class-name="value.labelClassName"
                :class-name="value.className">
            </el-table-column>
            <el-table-column
                :key="key"
                :prop="key"
                :label="value.label"
                :width="value.width"
                :align="value.align"
                :label-class-name="value.labelClassName"
                :class-name="value.className"
                v-else-if="value.button">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        v-if="scope.row.subOrgans"
                        @click="handleExpand(scope.row)">
                        {{scope.row[key]}}
                    </el-button>
                    <span v-else>{{scope.row[key]}}</span>
                </template>
            </el-table-column>
        </template>
        <slot name="handle"></slot>
    </el-table>
</template>
<script>
    import RecursionTable from './RecursionTable.vue'
    export default {
        name: 'recursion-table',
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
            border: {
                required: false,
                default: false
            }
        },
        components: {
            RecursionTable
        },
        data() {
            return {
                expandRowKeys: [],//展开列
                currentTableHeader: {},
                level: {
                    2: {
                        organ: '二级机构名称',
                        idName: '二级机构ID'
                    },
                    3: {
                        organ: '三级机构名称',
                        idName: '三级机构ID'
                    },
                    4: {
                        organ: '四级机构名称',
                        idName: '四级机构ID'
                    },
                    5: {
                        organ: '五级机构名称',
                        idName: '五级机构ID'
                    },
                }
            }
        },
        created(){
            // 对表头做处理
            this.currentTableHeader = JSON.parse(JSON.stringify(this.tableHeader));
            this.currentTableHeader.organName.label = this.level[this.tableData[0].organLevel].organ;
            this.currentTableHeader.organID.label = this.level[this.tableData[0].organLevel].idName;
        },
        methods: {
            rowKey(row, a){
                return row.organID;
            },
            handleExpand(row){
                let index = this.expandRowKeys.indexOf(row.organID);
                if(index !== -1){
                    this.expandRowKeys.splice(index, 1);
                }else {
                    this.expandRowKeys.push(row.organID);
                }
            }
        }
    }
</script>
<style>
.recursion-table .el-table__expanded-cell {
    padding: 20px 10px 20px 20px;
}
.recursion-table .el-table__expand-icon {
    display: none;
}
.recursion-table td {
    border-bottom: 1px solid #e4eaee;
}
</style>
