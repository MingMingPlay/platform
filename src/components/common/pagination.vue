<template>
    <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleIndexChange" 
        :current-page="pageIndex" 
        :page-size="pageSize" 
        :page-sizes="[10, 20, 50, 100]" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="total" 
        v-show="total !== 0">
    </el-pagination>
</template>

<script>
    import { bus } from '../../assets/unit/public.js'
    export default {
        props: {
            total: {
                type: Number,
                default: 0,
            },
            eventName: { type: String }
        },
        
        data() {
            return {
                pageIndex: 1,
                pageSize: 10
            }
        },
        
        methods: {
            // 当前页改变
            handleIndexChange(val) {
                this.$parent.loading = true;
                this.pageIndex = val;
                bus.$emit(this.eventName, { pageIndex: this.pageIndex, pageSize: this.pageSize });
            },
            // 每页显示个数改变
            handleSizeChange(val) {
                this.$parent.loading = true;
                this.pageSize = val;
                bus.$emit(this.eventName, { pageIndex: this.pageIndex, pageSize: this.pageSize })
            }
        },
        
        mounted() {
            bus.$on('change-pagination', (obj) => {
                this.pageIndex = obj.pageIndex;
                this.pageSize = obj.pageSize;
            })
        }
    }
</script>

<style>
    .el-pagination {
        margin-top: 30px;
        text-align: center;
    }
</style>
