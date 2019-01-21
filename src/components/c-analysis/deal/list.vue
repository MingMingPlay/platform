<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="tab-wrap">
            <el-tabs v-model="tabsState" type="card" @tab-click="tabClick">
                <el-tab-pane label="组织机构" name="organs"></el-tab-pane>
                <el-tab-pane label="用户交易" name="user"></el-tab-pane>
                <!--<el-tab-pane label="品类交易" name="category"></el-tab-pane>-->
                <el-tab-pane label="店铺交易" name="shop"></el-tab-pane>
            </el-tabs>
            <div class="button-right">
                <el-button type="primary" @click="exportExcel">导出数据</el-button>
            </div>
        </div>

        <div v-if="tableShow">
            <search-form-group
                v-model="searchForm"
                :type="tabsState"
                @handle-search="handleSearch">
            </search-form-group>

            <div class="data-total clear">
                <p class="cell" v-if="totalFields.totalAmountValue">
                    <span class="title">订单累计总金额（元）：</span>
                    <span class="desc">{{totalData[tabsState].totalAmountValue || '0.00' | currencyKb}}</span>
                </p>
                <p class="cell" v-if="totalFields.profitAmountValue && showProfit">
                    <span class="title">累计毛利润（元）：</span>
                    <span class="desc">{{totalData[tabsState].profitAmountValue || '0.00' | currencyKb}}</span>
                </p>
                <p class="cell" v-if="totalFields.spuNumber">
                    <span class="title">所售商品累计个数：</span>
                    <span class="desc">{{totalData[tabsState].spuNumber || 0}}</span>
                </p>
                <p class="cell" v-if="totalFields.orderNumber">
                    <span class="title">累计订单个数：</span>
                    <span class="desc">{{totalData[tabsState].orderNumber || 0}}</span>
                </p>
                <p class="cell" v-if="totalFields.userNumber">
                    <span class="title">累计购买人数：</span>
                    <span class="desc">{{totalData[tabsState].userNumber || 0}}</span>
                </p>
            </div>

            <table-list
                :tableHeader="headerData[tabsState]"
                :tableData="dataList[tabsState]"
                :tableLoading="tableLoading[tabsState]"
                @sort-change="sortChange">
            </table-list>

            <list-pagination
                v-if="!tableLoading[tabsState] && dataList[tabsState].length > 0"
                :pagination="pagination"
                @handleSizeChange="handlePage"
                @handleCurrentChange="handlePage">
            </list-pagination>
        </div>
    </div>
</template>

<script type="es6">
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import tableList from '../common/table-list.vue'
    import listPagination from '../../common/list-pagination.vue'
    import searchFormGroup from './search-form-group.vue'
    import { listCrumbs, tableHeader, searchForm, totalFields, allApiKey, } from './page-config.js'
    export default {
        data (){
            return {
                headerData: JSON.parse(JSON.stringify(tableHeader)),
                crumbs: listCrumbs,
                tabsState: 'organs',      // tab状态
                searchForm: {},
                tableShow: true,    // 该变量用于通过 v-if 让组件重构渲染
                totalFields: {},
                showProfit: true,
                dataList: {
                    organs: [],
                    user: [],
                    category: [],
                    shop: [],
                },
                tableLoading: {
                    organs: false,
                    user: false,
                    category: false,
                    shop: false,
                },
                totalData: {
                    organs: {},
                    user: {},
                    category: {},
                    shop: {},
                },
                pagination: {},
            }
        },
        components: {
            jkcBreadcrumb,
            listPagination,
            searchFormGroup,
            tableList
        },
        created (){
            this.searchForm = JSON.parse(JSON.stringify(searchForm[this.tabsState]));
            this.totalFields = totalFields[this.tabsState];
            this.getDataBefore(this.searchForm);
        },
        methods: {
            // 切换状态列表
            tabClick (tab, event){
                this.searchForm = JSON.parse(JSON.stringify(searchForm[this.tabsState]));
                this.totalFields = totalFields[this.tabsState];
                this.getDataBefore(this.searchForm);
                this.tableShow = false;
                setTimeout(() => {
                    this.tableShow = true;
                })
            },
            getDataBefore(params){
                let listApiKey = allApiKey[this.tabsState].listApiKey;
                let totalApiKey = allApiKey[this.tabsState].totalApiKey;
                if(this.searchForm.orderType === 'Subscribe' || this.searchForm.orderType === 'Ticket'){
                    // 征订和门票去掉毛利润
                    delete this.headerData[this.tabsState].profitAmountValue;
                    this.showProfit = false;
                }else {
                    this.showProfit = true;
                    this.headerData = JSON.parse(JSON.stringify(tableHeader));
                }
                this.getData(listApiKey, params);
                this.getTotalData(totalApiKey, params);
            },
            // 获取数据列表
            getData (apiKey, params){
                this.dataList[this.tabsState] = [];
                this.tableLoading[this.tabsState] = true;
                this.$http.get([apiKey], {params : params})
                    .then((result) => {
                        this.tableLoading[this.tabsState] = false;
                        if(result.body.code === 200){
                            this.dataList[this.tabsState] = result.body.data;
                            this.pagination = result.body.pagination;
                            if(this.pagination && this.pagination.pageIndex === 0){
                                this.pagination.pageIndex = 1;
                            }
                        }else{
                            this.$message.warning(result.body.message);
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 获取统计数据
            getTotalData (apiKey, params){
                this.totalData[this.tabsState] = [];
                this.$http.get([apiKey], {params: params})
                    .then((result) => {
                        if(result.body.code === 200){
                            this.totalData[this.tabsState] = result.body.data;
                        }else{
                            this.$message.warning(result.body.message);
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            handleSearch (){			// 搜索数据
                this.searchForm.pageIndex = 1;
                this.getDataBefore(this.searchForm);
            },
            sortChange(obj){
                // 订单总金额 TotalAmount("total_amount"),
                // 毛利润 ProfitAmount("profit_amount"),
                // 商品个数 SpuNumber("spu_numer"),
                // 订单个数 OrderNumber("order_number"),
                // 用户数 UserNumber("user_number");
                if(obj.prop === 'totalAmountValue'){
                    this.searchForm.orderField = 'TotalAmount';
                }else if(obj.prop === 'profitAmountValue'){
                    this.searchForm.orderField = 'ProfitAmount';
                }else if(obj.prop === 'spuNumber'){
                    this.searchForm.orderField = 'SpuNumber';
                }else if(obj.prop === 'orderNumber'){
                    this.searchForm.orderField = 'OrderNumber';
                }else if(obj.prop === 'userNumber'){
                    this.searchForm.orderField = 'UserNumber';
                }else {
                    this.searchForm.orderField = '';
                }
                if(obj.order === 'descending'){
                    this.searchForm.order = true;
                }else if(obj.order === 'ascending'){
                    this.searchForm.order = false
                }else {
                    this.searchForm.order = '';
                }
                this.getDataBefore(this.searchForm);
            },
            // 导出数据
            exportExcel (){
                let excelApiKey = allApiKey[this.tabsState].excelApiKey;
                let str = '';
                for(let key in this.searchForm){
                    str += `&${key}=${this.searchForm[key]}`;
                }
                window.open(this.$api[excelApiKey].url + '?token=' + sessionStorage.getItem('token') + str)
            },
            handlePage(pageIndex, pageSize) {
                this.searchForm.pageIndex = pageIndex;
                if(pageIndex === 1){
                    this.searchForm.pageSize = pageSize;
                }
                this.getDataBefore(this.searchForm);
            },
        }
    }
</script>

<style scoped>
    .data-total{
        margin-bottom: 15px;
    }
    .data-total .cell{
        display: flex;
        line-height: 30px;
        margin-right: 30px;
        float: left;
    }
    .data-total .cell .title{
        display: inline-block;
        font-size: 14px;
        font-weight: 600;
    }
    .data-total .cell .desc{
        display: inline-block;
        font-size: 24px;
        color: #20a0ff;
    }
    .tab-wrap {
        position: relative;
    }
    .tab-wrap .button-right{
        position: absolute;
        right: 0;
        top: 6px;
    }
</style>
