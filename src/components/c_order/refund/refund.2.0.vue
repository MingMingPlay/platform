<template>
    <div class="refund-order">

        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="state-tab-wrapper">
            <el-radio-group v-model="orderType" @change="handleOrderTypeChange">
                <el-radio-button label="se">自营商品</el-radio-button>
                <el-radio-button label="sp">行销商品</el-radio-button>
                <el-radio-button label="su">征订商品</el-radio-button>
                <el-radio-button label="vi">虚拟商品</el-radio-button>
            </el-radio-group>
        </div>


        <search-form
            :order-type="orderType"
            :init-form="searchForm"
            :goods-type="queryObject.orderType"
            @search-order="handleSearchOrder">
        </search-form>

        <div class="state-btn-wrapper">

            <jk-tabs-nav v-model="queryObject.state" @change="handleStateChange">
                <jk-tabs-pane :label="0">全部</jk-tabs-pane>
                <jk-tabs-pane :label="1">待处理
                    <sup class="red-badge" v-show="awaitingAmount > 0"></sup>
                </jk-tabs-pane>
                <template v-if="orderType == 'vi'">
                    <jk-tabs-pane :label="2">已同意</jk-tabs-pane>
                    <jk-tabs-pane :label="3">已完成</jk-tabs-pane>
                </template>
                <template v-else>
                    <jk-tabs-pane :label="2">已拒绝</jk-tabs-pane>
                    <jk-tabs-pane :label="4">已同意</jk-tabs-pane>
                    <jk-tabs-pane :label="3">已完成</jk-tabs-pane>
                </template>
            </jk-tabs-nav>

            <el-button
                type="primary"
                class="export-order-btn"
                :loading="exportButtonLoading"
                @click="handleExport">{{exportButtonText}}
            </el-button>

        </div>

        <div v-loading="loading">
            <div style="height: 200px;" v-show="loading"></div>
            <template v-if="orderType == 'vi'">
                <virtual-order-item
                    v-for="(orderItem,index) in tableData"
                    :key="index"
                    :order-item-data="orderItem">
                </virtual-order-item>
            </template>
            <template v-else>
                <order-item
                    order-name="refund"
                    :order-type="orderType"
                    v-for="(orderItem,index) in tableData"
                    :key="index"
                    :order-item-data="orderItem"
                    @refresh-data="handleRefreshData">
                </order-item>
            </template>
        </div>

        <no-data :total-row="pagiTotal"></no-data>

        <pagination
            event-name="refund-pagination"
            :pagination="pagination"
            :total="pagiTotal"
            @refund-pagination="handlePagination">
        </pagination>

        <confirm-refund @refresh-data="handleRefreshData"></confirm-refund>


    </div>
</template>

<script>

    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import SearchForm from './child/search-form.vue'
    import OrderItem from '../common/order-item.vue'
    import VirtualOrderItem from './child/order-item.vue'
    import Pagination from '../common/pagination.vue'
    import ConfirmRefund from './child/confirm-refund.vue'
    import NoData from '../common/no-data.vue'
    // tab
    import JkTabsNav from '../../common/tab/jk-tabs-nav.vue'
    import JkTabsPane from '../../common/tab/jk-tabs-pane.vue'

    import api from '../../../assets/config/c-api.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'

    import ExportExcel from '../common/export-excel.vue'

    export default {
        mixins: [ExportExcel],
        components: {
            JkcBreadcrumb,
            SearchForm,
            OrderItem,
            VirtualOrderItem,
            Pagination,
            ConfirmRefund,
            NoData,
            JkTabsNav,
            JkTabsPane,
        },

        data() {
            return {
                loading: true,
//              merchantSid: this.$root.userInfo.merchantSid,
                crumbs: [],
                orderType: 'se',
                queryObject: {
                    state: 0,
                    orderType: 'generally'
                },
                tableData: [],
                pagiTotal: 1,
                awaitingAmount: 0,
                exportButtonLoading: false,
                exportButtonText: '导出订单Excel'
            }
        },

        computed: {
            refundExcel() {
                let excelUrl = null;
                const type = this.orderType;
                if(type === 'vi') {
                    excelUrl = this.$api.virtualOrder.url + 'refund/excel';
                } else {
                    excelUrl =  this.$api.order + 'refund/excel';
                };
                return excelUrl;
            }
        },

        created() {
            this.crumbs = [{ title: '订单管理' }, { title: '退款订单' }];

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
            handleOrderTypeChange(val) {
                this.queryObject = { state: 0 };

                if(val === 'se') {
                    this.queryObject.orderType = 'generally';
                } else if(val === 'sp') {
                    this.queryObject.orderType = 'special';
                } else if(val === 'su') {
                    this.queryObject.orderType = 'Subscribe';
                } else {
                    console.log('virtual order');
                }
                this.getTableList(this.queryObject);
                this.getAwaitingOrder();
            },
            // 根据session中的查询参数, 获取列表数据
            isExitSearchData() {
                const searchData = sessionStorage.getItem('searchData');
                if(searchData) {
                    this.orderType = sessionStorage.getItem('orderType');
                    this.queryObject = JSON.parse(searchData);
                    this.getTableList(this.queryObject);
                    // 获取数据之后, 立马删除
                    sessionStorage.removeItem('orderType');
                    sessionStorage.removeItem('searchForm');
                    sessionStorage.removeItem('searchData');
                    sessionStorage.removeItem('pagination');
                } else this.getTableList(this.queryObject);
            },
            // 备份查询数据
            backupSearchData() {
                sessionStorage.orderType = this.orderType;

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
                let url = api.order + 'refund?state=1&';
                if(this.orderType === 'se') url += 'orderType=generally';
                else if(this.orderType === 'sp') url += 'orderType=special';
                else if(this.orderType === 'su') url += 'orderType=Subscribe';
                else url = ['ticketRefund', '?state=1'];
                pubObj.httpRequest(this, {
                    url: url,
                    success(result) {
                        this.awaitingAmount = result.data.length;
                    }
                })
            },
            // 请求数据
            getTableList(params = {}) {
                const url = this.orderType == 'vi' ? ['ticketRefund'] : api.order + 'refund';

                pubObj.httpRequest(this, {
                    url: url,
                    params: params,
                    success(result) {
                        this.tableData = result.data;
                        if(result.pagination) this.pagiTotal = result.pagination.totalRow;
                        else this.pagiTotal = 0;
                        // 如果更新数据时, 是待发货状态, 则更新待发货订单数量
                        if(params.state == 1) this.awaitingAmount = result.data.length;
                    }
                })
            },
            // 条件查询
            handleSearchOrder(form) {
                this.searchForm = form;
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
            handleExport() {
                this.exportButtonLoading = true;
                this.exportButtonText = '生成中，请稍后...';
                this.handleExportExcel(this.refundExcel, '退款订单', (res) => {
                    this.exportButtonLoading = false;
                    this.exportButtonText = '导出订单Excel';
                })
            },
            // 退款成功之后, 刷新数据
            handleRefreshData() {
                this.getTableList(this.queryObject);
            }
        }
    }
</script>

<style>
    .refund-order .state-btn-wrapper,
    .refund-order .state-tab-wrapper { position: relative; margin-bottom: 18px; }
    .refund-order .state-tab-wrapper .el-radio-button__inner {
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
    .refund-order .state-tab-wrapper .is-active .el-radio-button__inner {
        border: 1px solid #d1dbe5;
        border-bottom: 1px solid #fff;
        color: #20a0ff;
        border-radius: 4px 4px 0 0;
    }
    .refund-order .state-tab-wrapper::after {
        content: '';
        display: inline-block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        border-bottom: 1px solid #d1dbe5;
    }
    .refund-order .export-order-btn {
        position: absolute;
        top: 4px;
        right: 20px;
        z-index: 999;
        background-color: #55B055;
        color: #fff;
        border: 1px solid #55B055;
    }
</style>
