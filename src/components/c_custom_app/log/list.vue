<template>
    <div class="banner-log">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-title">操作日志</div>

        <el-table :data="tableData" v-loading="loading" stripe>
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="操作人员" prop="name" width="200" align="center"></el-table-column>
            <el-table-column label="操作功能" prop="operatorModuleName" width="200" align="center"></el-table-column>
            <el-table-column label="执行操作" prop="operatingTypeName" width="200" align="center"></el-table-column>
            <el-table-column label="操作时间" prop="createdTime" align="center"></el-table-column>
        </el-table>
        
        <pagination event-name="log-pagination" :total="mxTableList.pagiTotal"></pagination>
    </div>
</template>

<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'
    // js
    import { bus } from '../../../assets/unit/public.js'

    export default {
        components: { JkcBreadcrumb, Pagination },

        mixins: [TableList],

        data() {
            return {
                crumbs: [],
                mxTableList: {
                    url: ['mallDecorateLog'],
                    pagiTotal: 0
                },
            }
        },

        created() {
            this.crumbs = [{ title: '多版本管理' }, { title: '商城装修日志' }, ];
        },
        
        mounted() {
            bus.$on('log-pagination', (obj) => {
                this.getTableList(obj);
            })
        },
        
        destroyed() {
            bus.$off();
        }
    }
</script>

<style scoped>

</style>