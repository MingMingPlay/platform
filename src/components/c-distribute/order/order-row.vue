<template>
    <div class="order-row" v-loading="loading">
        <div v-for="(item, index) in listData" :key="index">
            <div class="cell-header clear">
                <p class="info">
                    <span class="title">订单号：</span>
                    <span>{{item.orderId}}</span>
                </p>
                <p class="info">
                    <span class="title">来源：</span>
                    <span>{{item.channelName}}</span>
                </p>
                <p class="info">
                    <span class="title">分销商：</span>
                    <span>{{item.authorShopName}}</span>
                </p>
                <p class="info">
                    <span class="title">供应商：</span>
                    <span>{{item.shopName}}</span>
                </p>
                <p class="info">
                    <span class="title">下单时间：</span>
                    <span>{{item.createdTime}}</span>
                </p>
                <p class="order-state">{{item.orderStateName}}</p>
            </div>

            <!--表格-->
            <common-table
                :tableData="item.spus"
                :tableHeader="tableHeader"
                :border="true"
                :index="false">
                <!--<el-table-column label="商品" align="center" slot="goods">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span>{{scope.row.title}}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <goods-name-col slot="goods"></goods-name-col>
                <el-table-column label="状态" align="center" slot="state">
                    <template slot-scope="scope">
                        <span>{{item.orderStateName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实付金额" align="center" slot="actualAmount">
                    <template slot-scope="scope">
                        <span>{{item.actualAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" slot="handle" v-if="!$route.query.sid">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="$router.push({
                                path: '/c_distribute/order/detail',
                                query: {sid: item.sid}
                            })">
                            订单详情
                        </el-button>
                    </template>
                </el-table-column>
            </common-table>

            <div class="cell-footer">
                商品总金额：
                ￥{{item.amount}}
                -
                订单折扣：
                ￥{{item.discountAmount}}
                +
                发票税额
                ￥{{item.invoiceAmount}}
                +
                运费：
                ￥{{item.shippingFee}}
                -
                使用积分
                ￥{{item.pointAmount}}
                =
                订单总金额：
                ￥{{item.totalAmount}}
            </div>
        </div>

        <div class="empty-block" v-if="listData.length === 0">
            <span class="empty-text">暂无数据</span>
        </div>
    </div>
</template>
<script>
    import commonTable from '../../common/common-table.vue'
    import goodsNameCol from '../common/goods-name-col.vue'
    import { orderCellHeader } from './page-config.js'
    export default {
        props: {
            listData: {
                required: true
            },
            loading: {
                required: false
            }
        },
        data() {
            return {
                tableHeader: orderCellHeader,
            }
        },
        components: {
            commonTable,
            goodsNameCol,
        }
    }
</script>
<style>
.order-row {}
.order-row .cell-header {
    font-size: 14px;
    line-height: 24px;
    position: relative;
    border: 1px solid #e4eaee;
    border-bottom: none;
    padding: 10px;
    background-color: #f5f8fa;
}
.order-row .cell-header .info {
    margin-right: 15px;
    float: left;
}
.order-row .cell-header .title {
    font-weight: 600;
}
.order-row .cell-header .order-state {
    position: absolute;
    right: 10px;
    padding: 0 10px;
    background: #42d885;
    color: #fff;
}
.order-row .el-table__row {
    background-color: #f5f8fa;
}
.order-row .el-table__row td {
    border-right: 1px solid #dfe6ec;
}
.order-row .cell-footer {
    font-size: 14px;
    line-height: 24px;
    text-align: right;
    border: 1px solid #e4eaee;
    border-top: none;
    padding: 10px;
    margin-bottom: 20px;
}
.order-row .empty-block {
    border: 1px solid #e4eaee;
    font-size: 12px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #5e7382;
}
</style>
