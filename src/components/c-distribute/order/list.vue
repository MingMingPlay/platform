<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item>
                    <el-input v-model="form.userKeyword" placeholder="订单号/买家电话"></el-input>
                </el-form-item>
                <el-form-item label="下单时间：">
                    <date-picker
                        ref="datePicker"
                        :shortcut="true"
                        :disabledAfter="true"
                        @get-time="getTime"
                    ></date-picker>
                </el-form-item>
                <el-form-item label="供货商：">
                    <select-notp-shop-sid v-model="form.shopSid"></select-notp-shop-sid>
                </el-form-item>
                <el-form-item label="分销商：">
                    <select-author-shop-sid v-model="form.authorShopSid"></select-author-shop-sid>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form>
        </div>

        <!--tags-->
        <el-tabs v-model="form.state" @tab-click="handleClick">
            <el-tab-pane label="全部" name="0"></el-tab-pane>
            <el-tab-pane label="待付款" name="1"></el-tab-pane>
            <el-tab-pane label="待发货" name="2"></el-tab-pane>
            <el-tab-pane label="已发货" name="3"></el-tab-pane>
            <el-tab-pane label="已完成" name="4"></el-tab-pane>
            <el-tab-pane label="已关闭" name="5"></el-tab-pane>
        </el-tabs>

        <order-row :listData="listData" :loading="loading"></order-row>

        <!--分页-->
        <list-pagination
            v-if="!loading && listData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import listPagination from '../../common/list-pagination.vue'
    import datePicker from '../../common/date-picker.vue'
    import orderRow from './order-row.vue'
    import selectNotpShopSid from '../../common/select-notp-shop-sid.vue'
    import selectAuthorShopSid from '../../common/select-author-shop-sid.vue'
    import { listCrumbs } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: listCrumbs,
                // tags状态
                tagState: 'all',
                // 列表数据
                listData: [],
                // 分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    // 订单状态，1:待付款，2:待发货， 3:已发货，4:已完成，5:已关闭，0:全部订单
                    state: '0',
                    createdTimeBegin: '',
                    createdTimeEnd: '',
                    userKeyword: '',
                    shopSid: '',
                    authorShopSid: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
            };
        },
        components:{
            jkcBreadcrumb,
            listPagination,
            datePicker,
            orderRow,
            selectNotpShopSid,
            selectAuthorShopSid,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            // tags 切换
            handleClick(tab, event) {
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            getTime(start, end){
                this.form.createdTimeBegin = start;
                this.form.createdTimeEnd = end;
            },
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            // 获取发放列表
            getData(params){
                this.loading = true;
                this.$http.get(['authorOrder'], {params: params})
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.listData = result.body.data;
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

</style>
