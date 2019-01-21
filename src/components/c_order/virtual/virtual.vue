<template>
    <div class="virtual-order">

        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <search-form ref="searchForm" :init-form="searchForm" @search-order="handleSearchOrder"></search-form>

        <div class="state-btn-wrapper">
            <jk-tabs-nav v-model="queryObject.state" @change="handleStateChange">
                <jk-tabs-pane label="All">全部</jk-tabs-pane>
                <jk-tabs-pane label="PayPending">待付款</jk-tabs-pane>
                <jk-tabs-pane label="Success">已预订</jk-tabs-pane>
                <jk-tabs-pane label="AllSuccess">已完成</jk-tabs-pane>
                <jk-tabs-pane label="Closed">已关闭</jk-tabs-pane>
            </jk-tabs-nav>

            <el-button
                v-if="showExportButton"
                type="primary"
                class="export-order-btn"
                :class="[isWaiting ? 'is-disabled' : '']"
                :disabled="isWaiting"
                @click="handleExportVirtual">
                {{ isWaiting ? '导出中...' : '导出订单Excel' }}
            </el-button>
        </div>

        <div v-loading="loading">
            <div style="height: 200px;" v-show="loading"></div>
            <order-item
                v-for="(orderItem,index) in tableData"
                :key="index"
                :order-item-data="orderItem">
            </order-item>
        </div>

        <no-data :total-row="pagiTotal"></no-data>

        <pagination
            event-name="virtual-pagination"
            :pagination="pagination"
            :total="pagiTotal"
            @virtual-pagination="handlePagination">
        </pagination>
    </div>
</template>

<script>

    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import SearchForm from './child/search-form.vue'
    import OrderItem from './child/order-item.vue'
    import Pagination from '../common/pagination.vue'
    import NoData from '../common/no-data.vue'
    // tab
    import JkTabsNav from '../../common/tab/jk-tabs-nav.vue'
    import JkTabsPane from '../../common/tab/jk-tabs-pane.vue'

//  import api from '../../../assets/config/c-api.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'

    import ExportExcel from '../common/export-excel.vue'

    export default {
        mixins: [ExportExcel],
        components: {
            JkcBreadcrumb,
            SearchForm,
            OrderItem,
            Pagination,
            NoData,
            JkTabsNav,
            JkTabsPane,
        },
        data() {
            return {
                loading: true,
                crumbs: [],
                queryObject: {
                    state: "All"
                },
                tableData: [],
                pagiTotal: 1,
                // 导出等待
                isWaiting: false,
                // 导出按钮的显隐，数据大于0条显示
                showExportButton: false,
            }
        },
        created() {
            this.crumbs = [{ title: '订单管理' }, { title: '虚拟商品订单' }]

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
            })
        },
        // 组件销毁时解绑事件，避免组件再次创建时重复绑定事件
        beforeDestroy() { bus.$off() },
        methods: {
            // 根据session中的查询参数, 获取列表数据
            isExitSearchData() {
                const searchData = sessionStorage.getItem('searchData');
                if(searchData) {
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
                const searchForm = this.searchForm;
                if('keyword' in searchForm) sessionStorage.searchForm = JSON.stringify(searchForm);

                sessionStorage.searchData = JSON.stringify(this.queryObject);

                const pagination = this.pagination;
                if('pageIndex' in pagination) sessionStorage.pagination = JSON.stringify(pagination);
            },
            // 深拷贝
            deepCopyObject(obj) {
                const tempObj = Object.assign({}, this.queryObject, obj);
                return this.queryObject = JSON.parse(JSON.stringify(tempObj));
            },
            // 请求数据
            getTableList(params = {}) {
                pubObj.httpRequest(this, {
                    url: ['virtualOrder'],
                    params: params,
                    success(result) {
                        this.tableData = result.data;
                        if(result.pagination) this.pagiTotal = result.pagination.totalRow;
                        else this.pagiTotal = 0;
                        if(this.tableData.length){
                            this.showExportButton = true;
                        }else {
                            this.showExportButton = false;
                        }
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
            handleExportVirtual() {
                this.deepCopyObject(this.$refs.searchForm.form);
                const isRequired = ['createdTimeBegin'].every((key) => {
                    return this.$refs.searchForm.form[key]
                });
                if(isRequired) {
                    this.isWaiting = true;
                    this.handleExportExcel(this.$api.virtualOrder.url + 'excel', '虚拟商品订单', (status) => {
                        this.isWaiting = status
                    })
                } else {
                    this.$message.warning('下单时间必填')
                }
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
//              window.open(encodeURI(this.$api.virtualOrder.url + 'excel?' + queryString), '_blank');
//          }
        }
    }
</script>

<style scoped>
    .virtual-order .state-btn-wrapper { position: relative; margin-bottom: 18px; }
    .virtual-order .export-order-btn {
        position: absolute;
        top: 4px;
        right: 20px;
        z-index: 999;
        background-color: #55B055;
        color: #fff;
        border: 1px solid #55B055;
    }
    .virtual-order .export-order-btn.is-disabled {
        color: #fff;
        background-color: #b3e19d;
        border-color: #b3e19d;
    }
</style>
