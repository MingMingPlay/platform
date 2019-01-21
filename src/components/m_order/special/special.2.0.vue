<template>
    <div class="special-order">

        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <search-form
            :order-type="orderType"
            :init-form="searchForm"
            @search-order="handleSearchOrder">
        </search-form>

        <div class="state-btn-wrapper">

            <jk-tabs-nav v-model="queryObject.state" @change="handleStateChange">
                <jk-tabs-pane :label="0">全部</jk-tabs-pane>
                <jk-tabs-pane :label="1">待付款</jk-tabs-pane>
                <jk-tabs-pane :label="2">待发货
                    <sup class="red-badge" v-show="awaitingAmount > 0"></sup>
                </jk-tabs-pane>
                <jk-tabs-pane :label="3">已发货</jk-tabs-pane>
                <jk-tabs-pane :label="4">已完成</jk-tabs-pane>
                <jk-tabs-pane :label="5">已关闭</jk-tabs-pane>
            </jk-tabs-nav>

            <el-button
                type="primary"
                class="export-order-btn"
                @click="handleExportExcel($api.order + 'special/excel', '行销品订单')">导出订单Excel
            </el-button>

        </div>
        
        <div v-loading="loading">
            <div style="height: 200px;" v-show="loading"></div>
            <order-item
                order-name="special"
                :order-type="orderType"
                v-for="(orderItem,index) in tableData"
                :key="index"
                :order-item-data="orderItem">
            </order-item>
        </div>
        
        <no-data :total-row="pagiTotal"></no-data>

        <pagination
            event-name="special-pagination"
            :pagination="pagination"
            :total="pagiTotal"
            @special-pagination="handlePagination">
        </pagination>

        <order-delivery @refresh-data="handleRefreshData"></order-delivery>

        <edit-transport></edit-transport>


    </div>
</template>

<script>

    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import SearchForm from './child/search-form.vue'
    import OrderItem from '../common/order-item.vue'
    import Pagination from '../common/pagination.vue'
    import OrderDelivery from '../common/order-delivery.vue'
    import EditTransport from '../common/edit-transport.vue'
    import NoData from '../common/no-data.vue'
    // tab
    import JkTabsNav from '../../common/tab/jk-tabs-nav.vue'
    import JkTabsPane from '../../common/tab/jk-tabs-pane.vue'

    import api from '../../../assets/config/m-api.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'
    
    import ExportExcel from '../common/export-excel.vue'
    
    export default {
        mixins: [ExportExcel],
        components: {
            JkcBreadcrumb,
            SearchForm,
            OrderItem,
            Pagination,
            OrderDelivery,
            EditTransport,
            NoData,
            JkTabsNav,
            JkTabsPane,
        },
        data() {
            return {
                loading: true,
                merchantSid: null,
                crumbs: [],
                orderType: null,
                queryObject: {
                    state: 0
                },
                tableData: [],
                pagiTotal: 1,
                awaitingAmount: 0
            }
        },
        created() {
            this.crumbs = [{ title: '订单管理' }, { title: '行销商品订单' }];
            this.merchantSid = this.$root.userInfo.merchantSid;
            // 是太平还是其他商家
            // 太平
            if(this.merchantSid == 'ooo_PJ') {
                this.queryObject.agentSid = this.merchantSid;
                this.orderType = 'a';
            } else {
                this.queryObject.merchantSid = this.merchantSid;
                this.orderType = 'm';
            }

            if(sessionStorage.searchForm)
                this.searchForm = Object.assign({}, JSON.parse(sessionStorage.searchForm));
            else this.searchForm = {};

            if(sessionStorage.pagination)
                this.pagination = Object.assign({}, JSON.parse(sessionStorage.pagination));
            else this.pagination = {};
        },
        mounted() {
            this.$nextTick(() => {
                bus.$on('backup-search-data', () => {
                    this.backupSearchData();
                });
                // 判断session中, 是否存在查询参数
                this.isExitSearchData();
                this.getAwaitingOrder();
            })
        },
        // 组件销毁时解绑事件，避免组件再次创建时重复绑定事件
        beforeDestroy() { bus.$off() },
        methods: {
//          handleOrderTypeChange(val) {
//              this.queryObject = { state: 0 };
//              if(val === 'm') {
//                  this.queryObject.merchantSid = this.merchantSid;
//                  delete this.queryObject.agentSid;
//              } else {
//                  this.queryObject.agentSid = this.merchantSid;
//                  delete this.queryObject.merchantSid;
//              }
//              this.getTableList(this.queryObject);
//              this.getAwaitingOrder();
//          },
            // 根据session中的查询参数, 获取列表数据
            isExitSearchData() {
                const searchData = sessionStorage.getItem('searchData');
                if(searchData) {
//                  this.orderType = sessionStorage.getItem('orderType');
                    this.queryObject = JSON.parse(searchData);
                    this.getTableList(this.queryObject);
                    // 获取数据之后, 立马删除
                    sessionStorage.removeItem('searchForm');
                    sessionStorage.removeItem('searchData');
                    sessionStorage.removeItem('pagination');
                } else this.getTableList(this.queryObject);
            },
            // 备份查询数据
            backupSearchData() {
//              sessionStorage.orderType = this.orderType;

                const searchForm = this.searchForm;
                if('orderId' in searchForm) sessionStorage.searchForm = JSON.stringify(searchForm);

                sessionStorage.searchData = JSON.stringify(this.queryObject);

                const pagination = this.pagination;
                if('pageIndex' in pagination) sessionStorage.pagination = JSON.stringify(pagination);
            },
            // 深拷贝
            deepCopyObject(obj) {
                const tempObj = Object.assign({}, this.queryObject, obj);
                return this.queryObject = JSON.parse(JSON.stringify(tempObj));
            },
            // 预先请求一次是否存在待发货的订单
            getAwaitingOrder() {
                let action_url = '';
                if(this.orderType === 'm') action_url = 'merchantSid=' + this.merchantSid;
                else action_url = 'agentSid=' + this.merchantSid;
                pubObj.httpRequest(this, {
                    url: api.order + 'special?state=2&' + action_url,
                    success(result) {
                        this.awaitingAmount = result.data.length;
                    }
                })
            },
            // 请求数据
            getTableList(params = {}) {
                pubObj.httpRequest(this, {
                    url: api.order + 'special',
                    params: params,
                    success(result) {
                        this.tableData = result.data;
                        if(result.pagination) this.pagiTotal = result.pagination.totalRow;
                        else this.pagiTotal = 0;
                        // 如果更新数据时, 是待发货状态, 则更新待发货订单数量
                        if(params.state == 2) this.awaitingAmount = result.data.length;
                    }
                })
            },
            // 条件查询
            handleSearchOrder(form) {
                this.searchForm = form;
//              const tempForm = JSON.parse(JSON.stringify(form));
//              if(this.orderType === 'm') delete tempForm.merchantSid;
//              else delete tempForm.agentSid;
                const params = this.deepCopyObject(form);
                this.getTableList(params);
            },
            // 监听分页
            handlePagination(obj) {
                this.pagination = obj;
                const params = this.deepCopyObject(obj)
                this.getTableList(params);
            },
            // 标签改变
            handleStateChange() {
                this.getTableList(this.queryObject);
            },
            // 对象序列化
//          getQueryString() {
//              const obj = Object.assign({}, this.queryObject);
//              obj.token = sessionStorage.token;
//              let queryString = '';
//              Object.keys(obj).forEach((key) => {
//                  if(obj[key] == undefined || obj[key] == null) return;
//                  else queryString += key + '=' + obj[key] + '&';
//              });
//              return queryString.slice(0, -1);
//          },
//          // 导出订单
//          handleExportOrder() {
//              const queryString = this.getQueryString();
//              window.open(encodeURI(api.order + 'special/excel?' + queryString), '_blank')
//          },
            // 发货成功之后, 刷新数据
            handleRefreshData() {
                this.getTableList(this.queryObject);
            }
        }
    }
</script>

<style>
    .special-order .state-btn-wrapper,
    .special-order .state-tab-wrapper { position: relative; margin-bottom: 18px; }
    .special-order .state-tab-wrapper .el-radio-button__inner {
        height: 42px;
        line-height: 42px;
        padding: 0 16px;
        border: 1px solid #fff;
        border-bottom: 1px solid #d1dbe5;
        color: #8391a5;
        background-color: transparent;
        box-shadow: none;
        z-index: 10;
    }
    .special-order .state-tab-wrapper .is-active .el-radio-button__inner {
        border: 1px solid #d1dbe5;
        border-bottom: 1px solid #fff;
        color: #20a0ff;
        border-radius: 4px 4px 0 0;
    }
    .special-order .state-tab-wrapper::after {
        content: '';
        display: inline-block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        border-bottom: 1px solid #d1dbe5;
    }
    .special-order .export-order-btn {
        position: absolute;
        top: 4px;
        right: 20px;
        z-index: 999;
        background-color: #55B055;
        color: #fff;
        border: 1px solid #55B055;
    }
</style>
