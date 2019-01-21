<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap">
            <el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
                <el-form-item label="会议名称">
                    <el-input v-model="searchForm.q" placeholder="会议名称"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <time-period :show-quick="false" :change-value="searchForm.start" v-on:emit-time="getTime"></time-period>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.state" clearable placeholder="选择状态">
                        <el-option value="1" label="未开始"></el-option>
                        <el-option value="2" label="征订中"></el-option>
                    </el-select>
                </el-form-item>
                <tp-organ v-model="searchForm.organCode" :tp-all="true"></tp-organ>
                <div class="search-button-group">
                    <el-button type="primary" @click="resetSearch">重置条件</el-button>
                    <el-button type="primary" @click="search">搜索</el-button>
                </div>
            </el-form>
        </div>

        <el-table :data="meetingList" :stripe="true" v-loading="loading">
            <el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
            <el-table-column prop="name" label="会议名称" label-class-name="first-col-no-padding" class-name="first-col-no-padding"></el-table-column>
            <el-table-column prop="meetingCode" label="会议编码"></el-table-column>
            <el-table-column prop="proposer" label="申请人"></el-table-column>
            <el-table-column prop="address" label="详细地址"></el-table-column>
            <el-table-column prop="onlineTime" label="上架时间"></el-table-column>
            <el-table-column prop="statusName" label="门票状态"></el-table-column>
            <el-table-column prop="meetingStateName" label="会议状态"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="text"
                               @click="$router.push({path: $route.path + '/info',query:{btn: $route.query.btn,sid: scope.row.sid}})">详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-wrap" v-if="meetingList.length > 0">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.totalRow">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import TimePeriod from '../../common/time-period.vue'
    import TpOrgan from '../../common/tp-organ.vue'
    export default {
        data() {
            return {
                crumbs: [
                    {
                        title: '商品管理',
                    },
                    {
                        title: '会议列表',
                    }
                ],
                searchForm: {
                    q: '',
                    state: '',
                    start: '',
                    end: '',
                    organCode: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
                meetingList: [],
                pagination: {},
                loading: false,
            }
        },
        components: {
            JkcBreadcrumb,
            TimePeriod,
            TpOrgan
        },
        created(){
            this.getData();
        },
        methods:{
            getTime(start, end){
                this.searchForm.start = start || '';
                this.searchForm.end = end || '';
            },
            search(){
                this.searchForm.pageIndex = 1;
                let data = {};
                for(let key in this.searchForm){
                    if(this.searchForm[key]){
                        data[key] = this.searchForm[key];
                    }
                }
                this.getData(data);
                data = null;
            },
            resetSearch(){
                for(let key in this.searchForm){
                    if(key !== 'pageIndex' || key !== 'pageSize'){
                        this.searchForm[key] = '';
                    }
                }
            },
            getData(param){     // 获取列表数据
                this.loading = true;
                this.$http.get(['ticketMeeting'], {params: param})
                    .then(result => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.meetingList = result.body.data;
                            this.pagination = result.body.pagination;
                        }
                    })
            },
            handleSizeChange(size){
                this.searchForm.pageSize = size;
                this.getData(this.searchForm);
            },
            handleCurrentChange(index){
                this.searchForm.pageIndex = index;
                this.getData(this.searchForm);
            },
        }
    }
</script>
<style>

</style>
