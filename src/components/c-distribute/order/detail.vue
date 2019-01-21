<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <order-row :listData="listData"></order-row>

        <detail-cell-wrap title="订单信息" class="detail-cell-content">
            <p class="cell">
                <span class="name">买家姓名：</span>
                <span>{{detailData.name || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">买家手机：</span>
                <span>{{detailData.phone || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">订单来源：</span>
                <span>{{detailData.channelName || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">订单类型：</span>
                <span>{{detailData.orderTypeName || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">商家名称：</span>
                <span>{{detailData.shopName || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">买家留言：</span>
                <span>{{detailData.message || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">发票抬头：</span>
                <span>{{detailData.invoiceTitle || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">发票内容：</span>
                <span>{{detailData.invoiceContent || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">纳税人识别号：</span>
                <span>{{detailData.invoiceTaxCode || '--'}}</span>
            </p>
        </detail-cell-wrap>

        <detail-cell-wrap title="收货人信息" class="detail-cell-content">
            <p class="cell">
                <span class="name">收货人：</span>
                <span>{{detailData.name || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">收货人电话：</span>
                <span>{{detailData.phone || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">收货地址：</span>
                <span>{{detailData.mergerName || '--'}}</span>
            </p>
        </detail-cell-wrap>

        <detail-cell-wrap title="物流信息" class="detail-cell-content">
            <p class="cell">
                <span class="name">物流公司：</span>
                <span>{{detailData.transportCompany || '--'}}</span>
            </p>
            <p class="cell">
                <span class="name">物流单号：</span>
                <span>{{detailData.transportId || '--'}}</span>
            </p>
        </detail-cell-wrap>

        <detail-cell-wrap title="订单跟踪信息" :contentWrap="false" class="detail-cell-content">
            <common-table
                :tableData="detailData.orderLogs"
                :tableHeader="orderLogHeader"
                :border="true"
                :index="false">
            </common-table>
        </detail-cell-wrap>

    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import detailCellWrap from '../../common/detail-cell-wrap.vue'
    import commonTable from '../../common/common-table.vue'
    import orderRow from './order-row.vue'
    import { detailCrumbs, orderLogHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: detailCrumbs,
                // 详情数据
                detailData: {
                    orderLogs: []
                },
                listData: [],
                orderLogHeader: orderLogHeader,
                // 加载
                loading: false,
            };
        },
        components:{
            jkcBreadcrumb,
            detailCellWrap,
            commonTable,
            orderRow,
        },
        created(){
            this.getData();
        },
        methods: {
            // 获取发放列表
            getData(){
                this.loading = true;
                this.$http.get(['authorOrderDetail', this.$route.query.sid])
//                this.$http.get(this.$api.order + 'detail/' + this.$route.query.sid)
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.detailData = result.body.data;
                            this.listData.push(this.detailData);
                            this.pagination = result.body.pagination;
                        }else{
                            this.$message.warning(result.body.message)
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
        },
    };
</script>
<style scoped>
.detail-cell-content .cell {
    float: left;
    width: 33.33%;
    line-height: 30px;
}
.detail-cell-content .cell .name {
    font-weight: bold;
}
</style>
