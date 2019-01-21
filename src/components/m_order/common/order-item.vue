<template>
    <div class="order-item">
        <p class="item-header">
            <span>订单号：{{ orderData.orderId }}</span>
            <span v-if="orderType === 'm'">供货商：{{ orderData.merchantName }}</span>
            <span v-if="orderType === 'a'">代理商：{{ orderData.agentName }}</span>
            <span>下单时间：{{ orderData.createdTime }}</span>
            <span>买家：{{ orderData.userName }}</span>
            <span>来源：{{ orderData.channelName }}</span>
            <!--<strong class="tag">{{ orderData.stateName }}</strong>-->
        </p>
        <el-table :data="[orderData]" border>
            <el-table-column label="商品名称" width="360">
                <template slot-scope="scope">
                    <div class="image-text-wrap inner-cell" style="margin: initial;" v-for="item in scope.row.spus">
                        <div class="image-wrap"><img :src="item.imagePath" /></div>
                        <div class="text-wrap">
                            <p class="text">{{ item.title }}</p>
                            <span
                                class="label"
                                v-if="orderName === 'self' || orderName === 'special' || orderName === 'refund'"
                                v-show="item.promotionNames.length">
                                <span v-for="promotionName in item.promotionNames">{{ promotionName }}</span>
                            </span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品编号">
                <template slot-scope="scope">
                    <div class="inner-cell" v-for="item in scope.row.spus">
                        <p class="vtcal-center">{{ item.spuCode }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品规格">
                <template slot-scope="scope">
                    <div class="inner-cell" v-for="item in scope.row.spus">
                        <p class="vtcal-center">{{ item.name }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="单价">
                <template slot-scope="scope">
                    <div class="inner-cell" v-for="item in scope.row.spus">
                        <p class="vtcal-center">{{ item.unitPrice }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <div class="inner-cell" v-for="item in scope.row.spus">
                        <p class="vtcal-center">{{ item.number }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品小计">
                <template slot-scope="scope">
                    <div class="inner-cell" v-for="item in scope.row.spus">
                        <p class="vtcal-center">{{ item.amount }}</p>
                        <!--<p class="vtcal-center">{{ item.unitPrice * item.number }}</p>-->
                    </div>
                </template>
            </el-table-column>
            <!--</el-table-column>-->
            <template v-if="orderName === 'self' || orderName === 'special' || orderName === 'refund'">
                <el-table-column label="优惠">
                    <template slot-scope="scope">
                        <div class="inner-cell" v-for="item in scope.row.spus">
                            <p class="vtcal-center">{{ item.discountAmount }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="积分">
                    <template slot-scope="scope">
                        <div class="inner-cell" v-for="item in scope.row.spus">
                            <p class="vtcal-center">{{ item.pointCount }}</p>
                        </div>
                    </template>
                </el-table-column>
            </template>
            <!--<el-table-column label="运费">
                <template slot-scope="scope">
                    <div class="inner-cell" v-for="item in scope.row.spus">
                        <p class="vtcal-center">{{ item.shippingFee }}</p>
                    </div>
                </template>
            </el-table-column>-->
            <!--<el-table-column label="商品小计" prop="amount"></el-table-column>-->
            <el-table-column label="状态" prop="orderStateName"></el-table-column>
            <el-table-column label="支付渠道" prop="payChannelName"></el-table-column>
            <el-table-column label="支付时间" prop="payTime"></el-table-column>
            <el-table-column
                label="退款金额"
                prop="refundAmount"
                v-if="orderName == 'refund' && orderType == 'su'">
            </el-table-column>
            <el-table-column
                label="实付金额"
                prop="actualAmount"
                v-if="orderName == 'refund' || (orderData.state != '1' && orderData.state != '5')">
            </el-table-column>
            <!--yjc-->
            <!--<el-table-column label="实付金额">
                <template slot-scope="scope">
                    <span v-if="orderName == 'refund' || orderData.payTime">{{scope.row.actualAmount}}</span>
                    <span v-else>￥0.00</span>
                </template>
            </el-table-column>-->
            <!--yjc end-->
            <el-table-column label="操作" v-if="!isDetail">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        class="vertical-center"
                        @click="handleEnterDetail(scope.row)">订单详情
                    </el-button>
                    <el-button
                        type="text"
                        class="vertical-center"
                        @click="handleDelivery(scope.row.orderId)"
                        v-if="merchantSid !== 'ooo_PJ' && (orderName === 'self' || orderName === 'special') && scope.row.state == 2">确认发货
                        <!--v-if="(orderName == 'self' || (orderName == 'special' && orderType == 'm')) && scope.row.state == 2">确认发货-->
                    </el-button>
                    <el-button
                        type="text"
                        class="vertical-center"
                        @click="handleTransportId(scope.row.orderId)"
                        v-if="merchantSid !== 'ooo_PJ' && (orderName === 'self' || orderName === 'special') && scope.row.state == 3">修改物流
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="statistics-wrapper" v-if="orderData.benefit !== 'All'">
            <div class="statistics">
                <span>商品总金额：</span>
                <span>{{ orderData.amount | formatMoney }}</span>
                <span style="margin: 0 5px;">-</span>
                <span>订单折扣：</span>
                <span>{{ orderData.discountAmount | formatMoney }}</span>
                <span style="margin: 0 5px;">+</span>
                <span>发票税额：</span>
                <span>{{ orderData.invoiceAmount | formatMoney }}</span>
                <span style="margin: 0 5px;">+</span>
                <span>运费：</span>
                <span>{{ orderData.shippingFee | formatMoney }}</span>
                <span style="margin: 0 5px;">-</span>
                <!--<span v-if="orderName === 'self' || orderName === 'special' || orderName === 'refund'">使用积分：</span>
                <span v-else>积分：</span>-->
                <span>积分抵扣：</span>
                <span>{{ orderData.pointAmount | formatMoney }}</span>
                <span style="margin: 0 5px;">=</span>
                <span>实付金额：</span>
                <template v-if="isDetail">
                    <span v-if="orderName == 'refund' || (orderState != '1' && orderState != '5')">
                        {{ orderData.actualAmount | formatMoney }}
                    </span>
                    <span v-else>￥0.00</span>
                </template>
                <template v-else>
                    <span v-if="orderName == 'refund' || (orderData.state != '1' && orderData.state != '5')">
                        {{ orderData.actualAmount | formatMoney }}
                    </span>
                    <span v-else>￥0.00</span>
                </template>
                <template v-if="orderName == 'refund'">
                    <span style="margin-left: 15px;margin-right: 15px;">|</span>
                    <span>退款金额：</span>
                    <span v-if="orderData.refund">{{ orderData.refund.amount | formatMoney }}</span>
                    <span v-else>{{ orderData.refundAmount | formatMoney }}</span>
                </template>
                <!--yjc-->
                <!--<span v-if="orderData.payTime">
                    {{ orderData.actualAmount | formatMoney }}
                </span>
                <span v-else>￥0.00</span>-->
                <!--yjc end-->
            </div>
        </div>
    </div>
</template>

<script>

    import { bus } from '../../../assets/unit/public.js'

    export default {
        props: {
            isDetail: Boolean,
            orderName: {
                type: String
            },
            orderType: {
                type: String
            },
            orderItemData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                orderState: this.$route.query.orderState,
                merchantSid: this.$root.shopInfo.merchantSid
            }
        },
        computed: {
            orderData() {
                return this.orderItemData;
            }
        },
        filters: {
            // 处理NAN和加前缀
            formatMoney(val) {
                return '￥' + parseFloat(val || 0).toFixed(2);
            }
        },
        methods: {
            handleEnterDetail(row) {
                // 告诉父级, 备份查询数据, 便于返回时回到之前的页面
                bus.$emit('backup-search-data');

                this.$router.push({
                    path: '/m_order/'+ this.orderName +'/detail',
                    query: {
                        orderSid: row.sid,
                        orderType: this.orderType,
                        orderState: row.state
                    }
                })
            },
            handleDelivery(orderId) {
                bus.$emit('open-delivery-dialog', orderId)
            },
            // 点击修改物流单号
            handleTransportId(orderId) {
                bus.$emit('open-transport-dialog', orderId)
            }
        }
    }
</script>

<style>
    .order-item { position: relative; margin-bottom: 18px; }
    .order-item .item-header {
        position: relative;
        border: 1px solid #dfe6ec;
        border-left: 4px solid #65AAEF;
        border-bottom: none;
        padding: 10px 18px;
        line-height: 20px;
        font-size: 13px;
        background-color: #F5F8FA;
        overflow: hidden;
    }
    .order-item .item-header span { float: left; font-weight: bold; }
    .order-item .item-header span+span { margin-left: 48px; }
    .order-item .item-header strong { display: inline-block; font-size: 14px; float: right; }
    .order-item .tag { padding: 2px 6px; color: #fff; background-color: #545454; }


    .order-item .el-table { background-color: #F5F8FA; }
    .order-item .el-table tr { background-color: transparent; }
    .order-item .el-table th,
    .order-item .el-table td { text-align: center; }
    .order-item .el-table td { border-right: 1px solid #dfe6ec; }
    .order-item .el-table td .cell { display: block; padding: 0; }

    .order-item .image-text-wrap { position: relative; }
    .order-item .image-wrap { float: left; width: 54px; height: 54px; }
    .order-item .image-wrap img { width: 100%; height: 100%; vertical-align: top; }
    .order-item .text-wrap {
        position: relative;
        margin-left: 64px;
        /*height: 100%;*/
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .order-item .text-wrap .text {
        flex-shrink: 0;
        text-align: left;
        max-height: 36px;
        line-height: 18px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .order-item .text-wrap .label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .order-item .text-wrap .label>span {
        display: inline-block;
        line-height: 14px;
        padding: 2px;
        background-color: #ff4949;
        color: #fff;
    }


    .order-item .inner-cell {
        display: table;
        margin: auto;
        position: relative;
        text-align: center;
        padding: 14px 18px;
        height: 54px;
        line-height: 20px;
        box-sizing: content-box;
    }
    .order-item .inner-cell .vtcal-center {
        display: table-cell;
        vertical-align: middle;
        /*width: -webkit-calc(100% - 36px);
        width: -moz-calc(100% - 36px);
        width: calc(100% - 36px);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);*/
    }
    .order-item .inner-cell+.inner-cell { border-top: 1px solid #dfe6ec; }
    .order-item .el-button+.el-button { margin: auto; margin-top: 6px; }
    .order-item .data-is-null {
        text-align: center; padding: 10px 0; border: 1px solid #d1dbe5; border-top: 1px solid #d1dbe5;
    }
    .order-item .statistics-wrapper {
        border: 1px solid #dfe6ec;
        border-top: none;
        padding: 10px 18px;
    }
    .order-item .statistics {
        font-size: 13px;
        font-weight: 600;
        text-align: right;
    }
</style>
