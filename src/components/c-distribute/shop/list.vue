<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item>
                    <el-input v-model="form.q" placeholder="店铺名称"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form>
        </div>

        <!--表格-->
        <common-table
            :tableData="tableData"
            :tableHeader="tableHeader"
            :tableLoading="loading">
            <el-table-column slot="shopName" label="店铺信息">
                <template slot-scope="scope">
                    <div class="shop-name">
                        <img class="avatar" :src="scope.row.image" alt="">
                        <p class="name">{{scope.row.name}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" slot="handle">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="$router.push({
                                path: '/c_distribute/shop/detail',
                                query: {sid: scope.row.sid}
                            })">
                        查看
                    </el-button>
                </template>
            </el-table-column>
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
    import { listCrumbs, tableHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: listCrumbs,
                // 表单头部
                tableHeader: tableHeader,
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            // 获取发放列表
            getData(params){
                this.loading = true;
                this.$http.get(['authorShop'], {params: params})
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
.shop-name {
    position: relative;
    margin: 5px;
}
.shop-name .avatar {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
}
.shop-name .name {
    padding: 10px 0;
    line-height: 20px;
    margin-left: 45px;
}
</style>
