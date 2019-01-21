<template>
    <div class="virtual-detail">

        <jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>

        <h1 class="detail-title">订单号：{{ orderDetailData.orderId }}</h1>
        <el-table :data="[orderDetailData]" border>
            <el-table-column label="商品" prop="meetingName" width="360"></el-table-column>
            <el-table-column label="商品编码" prop="meetingCode"></el-table-column>
            <el-table-column label="单价" prop="unitPrice"></el-table-column>
            <el-table-column label="数量" prop="number"></el-table-column>
            <el-table-column label="小计" prop="amount"></el-table-column>
            <el-table-column label="运费" prop="shippingFee"></el-table-column>
            <el-table-column label="状态" prop="orderStateName"></el-table-column>
            <el-table-column label="支付渠道" prop="payChannelName"></el-table-column>
            <el-table-column label="支付时间" prop="payTime"></el-table-column>
            <el-table-column label="实付金额" prop="merchandiseAmount"></el-table-column>
        </el-table>
        <div class="statistics-wrapper">
            <div class="statistics">
                <span>商品总金额：</span>
                <span>{{ orderDetailData.amount | formatMoney }}</span>
                <span style="margin: 0 5px;">-</span>
                <span>订单折扣：</span>
                <span>{{ orderDetailData.discountAmount | formatMoney }}</span>
                <span style="margin: 0 5px;">+</span>
                <span>发票税额：</span>
                <span>{{ orderDetailData.invoiceAmount | formatMoney }}</span>
                <span style="margin: 0 5px;">+</span>
                <span>运费：</span>
                <span>{{ orderDetailData.shippingFee | formatMoney }}</span>
                <span style="margin: 0 5px;">-</span>
                <span>积分：</span>
                <span>{{ orderDetailData.pointAmount | formatMoney }}</span>
                <span style="margin: 0 5px;">=</span>
                <span>实付金额：</span>
                <span>{{ orderDetailData.merchandiseAmount | formatMoney }}</span>
            </div>
        </div>
        
        <h1 class="detail-title" style="margin-top: 30px;">卡券信息</h1>
        <el-table :data="orderDetailData.ticketCouponLogs" border>
            <el-table-column label="商品劵码" prop="code"></el-table-column>
            <el-table-column label="核销时间" prop="checkTime"></el-table-column>
            <el-table-column label="核销人">
                <template slot-scope="scope">
                    <p>
                        <span>{{ scope.row.checkerName }}</span>
                        <span>{{ scope.row.checkerMobile }}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="核销机构" prop="checkerOrganName"></el-table-column>
            <el-table-column label="状态" prop="stateName"></el-table-column>
            <el-table-column label="激活信息">
                <template slot-scope="scope">
                    <p>
                        <span>{{ scope.row.name }}</span>
                        <span>{{ scope.row.mobile }}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="激活时间" prop="activeTime"></el-table-column>
        </el-table>

        <h1 class="detail-title" style="margin-top: 30px;">订单信息</h1>
        <div class="detail-wrap">
            <detail-block 
                :label-width="84"
                :block-static="virtualDetailItem.block_first"
                :block-data="orderDetailData">
            </detail-block>
        </div>
        
        <h1 class="detail-title" style="margin-top: 30px;">订单售后信息</h1>
        <div class="detail-wrap">
            <detail-block 
                :label-width="70"
                :block-static="virtualDetailItem.block_fifth"
                :block-data="orderDetailData">
            </detail-block>
        </div>
        
        <h1 class="detail-title" style="margin-top: 30px;">订单跟踪信息</h1>
        <el-table :data="orderDetailData.orderLogs" border>
            <el-table-column label="操作时间" prop="createdTime"></el-table-column>
            <el-table-column label="操作人" prop="userType"></el-table-column>
            <el-table-column label="处理信息" prop="content"></el-table-column>
            <el-table-column label="状态" prop="stateName"></el-table-column>
        </el-table>
        
    </div>
</template>

<script>
    
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import DetailBlock from '../common/detail-block.vue'
    
    import { pubObj, bus } from '../../../assets/unit/public.js'
//  import api from '../../../assets/config/c-api.js'
    import { virtual_detail__item } from '../../../assets/staticData/order.2.0.js'

    export default {
        components: { JkcBreadcrumb, DetailBlock },
        data() {
            return {
                crumbs: [],
                orderDetailData: {},
                deliveryInfoFirst: [],
                virtualDetailItem: {},
            }
        },
        created() {
            this.crumbs = [{
                title: '订单管理'
            }, {
                title: '虚拟商品订单退款',
                to: '/c_order/refund'
            }, {
                title: '详情'
            }];
            this.virtualDetailItem = this.deepCopyObject(virtual_detail__item);
        },
        mounted() {
            pubObj.httpRequest(this, {
                url: ['ticketRefund', this.$route.query.orderSid],
                success(result) {
                    this.orderDetailData = result.data;
                }
            })
        },
        methods: {
            // 深拷贝
            deepCopyObject(obj) {
                const tempObj = Object.assign({}, obj);
                return JSON.parse(JSON.stringify(tempObj));
            }
        },
        filters: {
            formatMoney(val) {
                return '￥' + parseFloat(val).toFixed(2);
            }
        }
    }
</script>

<style>
    
    .virtual-detail .statistics-wrapper {
        border: 1px solid #dfe6ec;
        border-top: none;
        padding: 10px 18px;
    }
    .virtual-detail .statistics {
        font-size: 13px;
        font-weight: 600;
        text-align: right;
    }
    .virtual-detail .el-table { border-bottom: none; }
    .virtual-detail .el-table th,
    .virtual-detail .el-table td {
        text-align: center;
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
    }
    .virtual-detail .el-table td .cell { display: block; padding: 0 18px; }
    .virtual-detail .detail-wrap {
        margin-top: 20px;
    }
</style>