<!--
    说明：
    pagination 需为对象格式
    pagination:{
        pageIndex: 1,
        pageSize: 10,
        totalRow:23
    }
-->
<template>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :layout="layout"
        :total="pagination.totalRow"
        v-if="pagination.totalRow !== 0">
    </el-pagination>
</template>

<script>
    export default {
        props: {
            pagination: {
                type: Object,
                default: function() {
                    return Object
                }
            },
            /**
             * 如果有不需要的功能，传进来
             * 例：'total,sizes'
             * 中间用逗号隔开
             * */
            notLayout: {
                type: String
            }
        },
        data(){
           return{
               pageIndex: 1,
               pageSize: 10,
               layout: 'total,sizes,prev,pager,next,jumper'
           }
        },
        created(){
            if(this.notLayout){
                this.layout = this.layout.replace(this.notLayout, '').replace(',,', ',');
                if(this.layout.indexOf(',') === 0){
                    this.layout = this.layout.substring(1);
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
                this.$emit("handleSizeChange", this.pageIndex,this.pageSize)
                this.$emit("paginationChange",{pageIndex:this.pageIndex,pageSize:this.pageSize});
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.$emit("handleCurrentChange", this.pageIndex,this.pageSize);
                this.$emit("paginationChange",{pageIndex:this.pageIndex,pageSize:this.pageSize});
            },

        }
    }
</script>

<style>
    .el-pagination {
        margin-top: 30px;
        text-align: center;
    }
</style>
