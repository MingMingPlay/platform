<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <user-detail from="all"></user-detail>
        <!--切换tab-->
        <el-tabs v-model="isGoodsArticle" @tab-click="handleClick">
            <el-tab-pane label="商品收藏" name="goods"></el-tab-pane>
            <!--<el-tab-pane label="文章收藏" name="article"></el-tab-pane>-->
        </el-tabs>

        <common-table
            :tableHeader="tableHeader[isGoodsArticle]"
            :tableData="tableData"
            :tableLoading="loading">
        </common-table>

        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>

    </div>
</template>
<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import UserDetail from '../../common/user-detail.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import { favHeader } from './tableHeader.js'
    export default {
        data() {
            return {
                crumbs: [
                    {
                        title: '用户管理',
                    },
                    {
                        title: '所有用户',
                        to: {path:'/c_user/all'}
                    },
                    {
                        title: '用户详情',
                    }
                ],
                isGoodsArticle: 'goods',
                tableHeader: favHeader,
                tableData: [],
                loading: false,
                pagination: {},
                form: {
                    pageIndex: 1,
                    pageSize: 10
                }
            }
        },
        components: {
            JkcBreadcrumb,
            UserDetail,
            commonTable,
            listPagination
        },
        created(){
            this.getListData(this.form);
        },
        methods: {
            //tags切换
            handleClick(tab, event) {
                this.getListData(this.form);
            },
            getListData(params){
                this.loading = true;
                // memberFavProduct
                // memberFavArticle
                let apiKey = '';
                if(this.isGoodsArticle === 'goods'){
                    apiKey = 'memberFavProduct';
                }else if(this.isGoodsArticle === 'article'){
                    apiKey = 'memberFavArticle'
                }
                this.$http.post([apiKey, this.$route.query.sid], params)
                    .then(result => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                        }
                    })
            },
            handlePage(pageIndex, pageSize) {
                this.form.pageIndex = pageIndex;
                if(pageIndex === 1){
                    this.form.pageSize = pageSize;
                }
                this.getListData(this.form);
            },
        }
    }
</script>
<style>

</style>
