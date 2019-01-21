<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-title">
            {{totalData.shopName}}，{{totalData.billsMonth}}账单详情
            <div style="position: absolute;right: 0;top: 0;">
                <export-excel apiKey="authorBillDetailListExcel" :searchForm="form"></export-excel>
            </div>
        </div>

        <div class="page-header-detail">
            <p class="detail">
                <span class="title">账单金额：</span>
                <span class="desc">{{totalData.amount}}</span>
            </p>
            <p class="detail">
                <span class="title">起始日期：</span>
                <span class="desc">{{totalData.beginDate}}</span>
            </p>
            <p class="detail">
                <span class="title">终止日期：</span>
                <span class="desc">{{totalData.endDate}}</span>
            </p>
            <p class="detail">
                <span class="title">账单状态：</span>
                <span class="desc">{{billState[totalData.billType]}}</span>
            </p>
        </div>

        <!--表格-->
        <common-table
            :tableData="tableData"
            :tableHeader="tableHeader"
            :tableLoading="loading">
        </common-table>

        <!--分页-->
        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import exportExcel from '../../common/export-excel.vue'
    import { detailListCrumbs, billState, detailTableHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: detailListCrumbs,
                // 表单头部
                tableHeader: detailTableHeader,
                billState: billState,
                totalData: {},
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    month: this.$route.query.month.replace('年', '-').replace('月', ''),
                    shopSid: this.$route.query.shopSid,
                    pageIndex: 1,
                    pageSize: 10,
                },
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
            exportExcel,
        },
        created(){
            this.getTotal();
            this.getData(this.form);
        },
        methods: {
            // 获取统计详情
            getTotal(){
                this.$http.get(['authorBillDetail', this.$route.query.sid])
                    .then((result) => {
                        if(result.body.code === 200){
                            this.totalData = result.body.data;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 获取详情列表
            getData(params){
                this.loading = true;
                this.$http.get(['authorBillDetailList'], {
                    params: params,
                    headers: {
                        shopSid: this.$route.query.shopSid
                    }
                }).then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                        }else{
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            handlePage(pageIndex, pageSize) {
                this.form.pageIndex = pageIndex;
                if(pageIndex === 1){
                    this.form.pageSize = pageSize;
                }
                this.getData(this.form);
            },
        },
    };
</script>
<style scoped>

</style>
