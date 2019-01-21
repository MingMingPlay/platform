<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="page-header-detail">
            <p class="detail">
                <span class="title">店铺名称：</span>
                <span class="desc">{{shopDetail.name}}</span>
            </p>
            <p class="detail">
                <span class="title">开店日期：</span>
                <span class="desc">{{shopDetail.appTime}}</span>
            </p>
            <p class="detail">
                <span class="title">店铺类型：</span>
                <span class="desc">{{shopDetail.shopTypeName}}</span>
            </p>
            <p class="detail">
                <span class="title">累计收益：</span>
                <span class="desc">{{shopDetail.earnings}}</span>
            </p>
        </div>

        <div class="detail-title">在售商品</div>

        <!--表格-->
        <common-table
            :tableData="tableData"
            :tableHeader="tableHeader"
            :tableLoading="loading"
            :index="false">
            <goods-name-col slot="goods" minWidth="250"></goods-name-col>
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
    import goodsNameCol from '../common/goods-name-col.vue'
    import { goodsListCrumbs, goodsTableHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: goodsListCrumbs,
                // 表单头部
                tableHeader: goodsTableHeader,
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    pageIndex: 1,
                    pageSize: 10,
                },
                shopDetail: {}
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            goodsNameCol,
            listPagination,
        },
        created(){
            this.getData(this.form);
            this.getShopDetail();
        },
        methods: {
            // 获取商品列表
            getData(params){
                this.loading = true;
                this.$http.get(['authorShopSpuList', this.$route.query.sid], {params: params})
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                        }else{
                            this.$message.warning(result.body.message)
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 获取店铺详情
            getShopDetail(){
                this.$http.get(['authorShopDetail', this.$route.query.sid])
                    .then((result) => {
                        if(result.body.code === 200){
                            this.shopDetail = result.body.data;
                        }else{
                            this.$message.warning(result.body.message)
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
