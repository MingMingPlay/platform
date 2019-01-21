<template>
    <div class="virtual-order-item">
        <p class="item-header">
            <span>订单号：{{ orderData.orderId }}</span>
            <span>来源：{{ orderData.channelName }}</span>
            <!--<strong class="tag">{{ orderData.stateName }}</strong>-->
        </p>
        <el-table :data="[orderData]" border>
            <el-table-column label="商品" width="360">
                <template slot-scope="scope">
                    <div class="text-wrap">
                        <p class="text">{{ scope.row.meetingName }}</p>
                        <!--<span class="label">虚拟商品</span>-->
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格" prop="ticketType"></el-table-column>
            <el-table-column label="数量" prop="number"></el-table-column>
            <el-table-column label="价格(元)" prop="unitPrice"></el-table-column>
            <el-table-column label="实付金额(元)">
                <template slot-scope="scope">
                    <p v-text="scope.row.amount"></p>
                    <p>(含运费)</p>
                </template>
            </el-table-column>
            <el-table-column label="买家" prop="name"></el-table-column>
            <el-table-column label="状态" prop="stateName"></el-table-column>
            <el-table-column label="下单时间" prop="createdTime"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button 
                        type="text" 
                        class="vertical-center" 
                        @click="handleEnterDetail(scope.row.sid)">订单详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    
    import { bus } from '../../../../assets/unit/public.js'
    
    export default {
        props: {
            orderItemData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        computed: {
            orderData() {
                return this.orderItemData;
            }
        },
        methods: {
            handleEnterDetail(sid) {
                // 告诉父级, 备份查询数据, 便于返回时回到之前的页面
                bus.$emit('backup-search-data');
                
                this.$router.push({
                    path: '/c_order/refund/vdetail',
                    query: {
                        orderSid: sid
                    }
                })
            }
        }
    }
</script>

<style>
    .virtual-order-item { position: relative; margin-bottom: 18px; }
    .virtual-order-item .item-header {
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
    .virtual-order-item .item-header span { float: left; font-weight: bold; }
    .virtual-order-item .item-header span+span { margin-left: 48px; }
    .virtual-order-item .item-header strong { display: inline-block; font-size: 14px; float: right; }
    .virtual-order-item .tag { padding: 2px 6px; color: #fff; background-color: #545454; }
    
    
    .virtual-order-item .el-table { background-color: #F5F8FA; }
    .virtual-order-item .el-table tr { background-color: transparent; }
    .virtual-order-item .el-table th,
    .virtual-order-item .el-table td { text-align: center; }
    .virtual-order-item .el-table td { border-right: 1px solid #dfe6ec; }
    .virtual-order-item .el-table td .cell { display: block; }
    
    .virtual-order-item .text-wrap { text-align: left; }
    .virtual-order-item .text-wrap .text {
        text-align: left;
        max-height: 100%;
        line-height: 20px;
        display: -webkit-box; 
        -webkit-box-orient: vertical;   
        -webkit-line-clamp: 2;   
        overflow: hidden;
    }
    .virtual-order-item .text-wrap .label {
        display: inline-block;
        margin-top: 8px;
        line-height: 16px;
        padding: 2px 4px;
        background-color: #545454;
        color: #fff;
    }
    
    
    /*.virtual-order-item .vtcal-center {
        width: -webkit-calc(100% - 36px);
        width: -moz-calc(100% - 36px);
        width: calc(100% - 36px);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }*/
    .virtual-order-item .el-button+.el-button { margin: auto; margin-top: 6px; }
    .virtual-order-item .data-is-null {
        text-align: center; padding: 10px 0; border: 1px solid #d1dbe5; border-top: 1px solid #d1dbe5;
    }
</style>