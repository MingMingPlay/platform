<template>
    <div class="promotion-log">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="detail-title">活动操作日志</div>
        <template>
            <div class="log-header">
                <span>
                    <span>活动名称：</span>
                    <span v-text="$route.query.promoName"></span>
                </span>
                <!--<span style="margin-left: 30px;">
                    <span>活动ID：</span>
                    <span>12343</span>
                </span>-->
            </div>
            <el-table :data="tableData" v-loading="loading" stripe>
                <el-table-column label="操作时间" prop="operateTime"></el-table-column>
                <el-table-column label="操作内容" prop="operateContent"></el-table-column>
                <el-table-column label="操作人员" prop="operateName"></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    // mixin
    import TableList from '../mixin/table-list.vue'
    
    export default {
        components: { JkcBreadcrumb },
        
        mixins: [TableList],
        
        data() {
            return {
                crumbs: [],
                form: {},
                mxTableList: {
                    url: ['merchantPromo', 'log/', this.$route.query.promoSid],
                    pagiTotal: 0,
                },
            }
        },
        
        created() {
            this.crumbs = [
                { title: '促销管理' }, 
                { title: '促销列表' },
                { title: '活动详情' },
                { title: '活动日志' }
            ];
        },
    }
</script>

<style scoped>
    .log-header { margin: 30px 0 10px; padding: 0 18px; font-size: 14px; }
</style>