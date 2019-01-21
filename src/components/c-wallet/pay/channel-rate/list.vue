<template>
    <div class="channel-rate">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>支付管理</el-breadcrumb-item>
                <el-breadcrumb-item>渠道费率管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--搜索-->
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" label-width="80px">
                <el-form-item label="查询条件">
                    <el-input placeholder="请输入费率名称" v-model="form.keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">查询</el-button>
                    <el-button type="primary" @click="handleAddChannelRate">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--列表-->
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column v-for="(column,index) in tableHeader" :key="index" :prop="column.dataIndex" :label="column.text" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEditChannelRate(scope.row.sid)">编辑</el-button>
                    <el-button type="text" @click="handleLookChannelRate(scope.row.sid)">查看</el-button>
                    <el-button type="text" @click="handleEndChannelRate">终止</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
            :key="currentPage"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total"
            style="margin: 30px 0; text-align: center;">
        </el-pagination>
    </div>
</template>

<script>
    import { rateList } from '@/assets/staticData/wallet.js'
    import { pubObj } from '@/assets/unit/public.js'
    
    export default {
        name: 'ChannelRateList',
        
        data() {
            return {
                form: {},
                tableHeader: [],
                tableData: [],
                loading: true,
                currentPage: 1,
                total: 0,
            }
        },
        
        methods: {
            // 获取数据
            handleGetTableData(query = {}) {
                this.loading = true;
                pubObj.httpRequest(this, {
                    url: ['financialRates'],
                    params: query,
                    success(result) {
                        this.tableData = result.data;
                        this.total = result.pagination.totalRow;
                    }
                })
            },
            // 查询
            handleFormSearch() {
                this.currentPage = this.form.pageIndex = 1;
                this.handleGetTableData(this.form);
            },
            // 新增
            handleAddChannelRate() {
                this.$router.push({
                    name:'ChannelRateInfo',
                    query: { type:'add' }
                })
            },
            // 编辑
            handleEditChannelRate(sid) {
                this.$router.push({
                    name:'ChannelRateInfo',
                    query: { type: 'edit', sid: sid }
                })
            },
            // 查看
            handleLookChannelRate(sid) {
                this.$router.push({
                    name:'ChannelRateDetail',
                    query: { type: 'edit', sid: sid }
                })
            },
            // 终止
            handleEndChannelRate() {},
            // 分页显示个数
            handleSizeChange() {},
            // 分页当前页
            handleCurrentChange(currentPage) {
                this.currentPage = this.form.pageIndex = currentPage;
                this.handleGetTableData(this.form);
            }
        },
        
        created() {
            this.tableHeader = JSON.parse(JSON.stringify(rateList.tableColumns));
        },
        
        mounted() {
            this.handleGetTableData();
        }
    }
</script>

<style>
</style>