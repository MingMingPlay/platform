<template>
    <div class="invite-merchant">

        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="searchForm" :inline="true">
                <el-form-item>
                    <el-input v-model="searchForm.keyword" placeholder="商家名称/手机号/联系人姓名"></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleSearch" class="button-margin-button-22">搜索</el-button>
            </el-form>
        </div>

        <el-table :data="tableData" class="table-composing" stripe>
            <el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
            <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item.label" :prop="item.prop" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="200px" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.state === 'Wait'"
                               @click="handleRec(scope.row.sid, 'Conduct')">洽谈</el-button>
                    <el-button type="text" v-if="scope.row.state === 'Conduct'"
                               @click="handleRec(scope.row.sid, 'Success')">洽谈成功</el-button>
                    <el-button type="text" v-if="scope.row.state === 'Conduct'"
                               @click="handleRec(scope.row.sid, 'Fail')">洽谈失败</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-wrap" v-if="tableData.length > 0">
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
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import api from '../../../assets/config/c-api.js'
    import { pubObj } from '../../../assets/unit/public.js'

    export default {
        data() {
            return {
                crumbs: [{
                    title: '推荐管理'
                }, {
                    title: '推荐商家'
                }],
                searchForm: {
                    keyword: ''
                },
                tableHead: [{
                    label: '供应商属性',
                    prop: 'typeName'
                }, {
                    label: '商家名称',
                    prop: 'name'
                }, {
                    label: '供应商联系人姓名',
                    prop: 'contact'
                }, {
                    label: '供应商电话',
                    prop: 'mobile'
                }, {
                    label: '推荐人姓名',
                    prop: 'userName'
                }, {
                    label: '推荐日期',
                    prop: 'createdTime'
                }, {
                    label: '状态',
                    prop: 'stateName'
                }],
                tableData: [],
                pagination: {},
            }
        },
        components: {
            jkcBreadcrumb
        },
        created(){
            this.getData();
        },
        methods: {
            getData(param){
                this.$http.get(api.invite_merchant, {params: param})
                    .then(result => {
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                            if(this.pagination.pageIndex === 0){
                                this.pagination.pageIndex = 1;
                            }
                        }else {
                            this.$message.error(result.body.message)
                        }
                    })
            },
            handleSearch(){
                this.getData(this.searchForm)
            },
            handleRec(sid, type){        // 处理洽谈
                this.$http.put(api.invite_merchant + sid,'', {params: {state: type}})
                    .then(result => {
                        if(result.body.code === 200){
                            this.getData(this.searchForm)
                            this.$message.success(result.body.message)
                        }else {
                            this.$message.error(result.body.message)
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
    .invite-merchant .search-fil-wrap .el-form-item__content{
        width: 200px;
    }
    .invite-merchant .pagination-wrap{
        margin-top: 20px;
        text-align: center;
    }
</style>
