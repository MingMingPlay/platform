<template>
    <div class="subscribe-detail">

        <jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>

        <h1 class="detail-title">订单号：{{ orderDetailData.orderId }}</h1>

        <div class="steps-wrap">
            <el-steps space="25%" :active="processes.len" finish-status="success" :align-center="true" :center="true">
                <el-step description="下单" :title="processes.steps[0]"></el-step>
                <el-step description="付款" :title="processes.steps[1]"></el-step>
                <el-step description="完成" :title="processes.steps[2]"></el-step>
            </el-steps>
        </div>

        <order-item order-name="subscribe" :order-item-data="orderDetailData" isDetail></order-item>
        
        <!--<div class="statistics">
            <span>运费：￥{{ orderDetailData.shippingFee }}</span>
            <span>总实付价格：￥{{ orderDetailData.realAmount }}</span>
        </div>-->

        <h1 class="detail-title" style="margin-top: 30px;">订单信息</h1>
        <div class="detail-wrap">
            <detail-block 
                :label-width="84"
                :block-static="selfDetailItem.block_first"
                :block-data="orderDetailData">
            </detail-block>
        </div>
        
        <h1 class="detail-title">收货人信息</h1>
        <div class="detail-wrap">
            <detail-block 
                :label-width="70"
                :block-static="selfDetailItem.block_second"
                :block-data="orderDetailData">
            </detail-block>
        </div>
        
        <h1 class="detail-title">物流信息</h1>
        <div class="detail-wrap">
            <detail-block 
                :label-width="70"
                :block-static="selfDetailItem.block_third"
                :block-data="orderDetailData">
            </detail-block>
        </div>
        
        <h1 class="detail-title">订单跟踪信息</h1>
        <el-table :data="orderDetailData.orderLogs" stripe>
            <el-table-column label="操作时间" prop="createdTime"></el-table-column>
            <el-table-column label="操作人" prop="sourceName"></el-table-column>
            <el-table-column label="处理信息" prop="content"></el-table-column>
            <el-table-column label="状态" prop="stateName"></el-table-column>
        </el-table>
                
    </div>
</template>

<script>
    
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import OrderItem from '../common/order-item.vue'
    import DetailBlock from '../common/detail-block.vue'
    
    import { pubObj, bus } from '../../../assets/unit/public.js'
    import api from '../../../assets/config/m-api.js'
    import { common_detail__item } from '../../../assets/staticData/order.2.0.js'
    
//  import DeliveryForm from '../common/delivery_form.vue'
//  import { mixin_breadcrumb } from '../../common/jkc-mixin.vue'
//  import { router } from '../../../main.js'

    export default {
        components: { JkcBreadcrumb, OrderItem, DetailBlock },
        data() {
            return {
                crumbs: [],
                processes: {
                    steps: [null, null, null]
                },
                orderDetailData: {},
                selfDetailItem: {},
                blockFourthData: {}
            }
        },
        computed: {
//          aStatus() {
//              return this.$store.state.a.status;
//          },
//          stepSpace() {
//              return(100 / this.processes.length + '%')
//          }
        },
        created() {
            this.crumbs = [{
                title: '订单管理'
            }, {
                title: '征订商品订单',
                to: '/m_order/subscribe'
            }, {
                title: '详情'
            }]
            this.selfDetailItem = this.deepCopyObject(common_detail__item);
        },
        beforeMount() {
            pubObj.httpRequest(this, {
                url: api.order + 'process/' + this.$route.query.orderSid,
                success(result) {
                    const process = result.data.process;
                    const time = result.data.time;
                    
                    this.processes.len = process.length;
                    this.processes.state = result.data.state;
                    
                    process.forEach((item, index) => {
                        this.processes.steps[index] = item.createdTime;
                    })
                    time.forEach((item, index) => {
                        this.$set(this.blockFourthData, this.selfDetailItem.block_fourth[index].prop, item.createdTime)
                    })
                }
            })
        },
        mounted() {
            pubObj.httpRequest(this, {
                url: api.order + 'detail/' + this.$route.query.orderSid,
                headers: { 'api-ver': '2.0.0' },
                success(result) {
                    const sheng = result.data.address.indexOf('省');
                    const shi = result.data.address.indexOf('市');
                    const qu = result.data.address.indexOf('自治区');
                    if(sheng !== -1 || shi !== -1 || qu !== -1) {
                        result.data.fullAddress = result.data.address;
                    } else {
                        result.data.fullAddress = result.data.mergerName + ' ' + result.data.address;
                    }
                    this.orderDetailData = result.data;
                }
            })
        },
        beforeDestroy() { bus.$off(); },
        methods: {
            // 深拷贝
            deepCopyObject(obj) {
                const tempObj = Object.assign({}, obj);
                return JSON.parse(JSON.stringify(tempObj));
            },
            handleDelivery(orderId) {
                bus.$emit('open-delivery-dialog', orderId)
            },
//          handleDeliverySuccess() {
//              setTimeout(() => {
//                  router.push({
//                      path: '/m_order/self',
//                      query: { state: this.$route.query.state }
//                  })
//              }, 500)
//          },
//          // 点击物流单号，查询物流信息
//          handleCompanySearch(val) {
//              const company = this.orderData.transportCompany || '';
//              window.open(encodeURI('http://m-dev.yanwei365.net:9000/shipping/index.html?company=' + company + '&transportId=' + val));
//          }
        },
        filters: {
//          fullName(val) {
//              return val + '时间';
//          },
//          defaultPath(val) {
//              if(!val) return '../../../src/assets/img/upload.png';
//              else return val;
//          }
        }
    }
</script>

<style>
    .subscribe-detail .steps-wrap {
        position: relative; width: 60%; margin: auto; padding: 20px 0;
    }
    .subscribe-detail .steps-wrap .el-steps.is-horizontal { margin-top: 20px; }
    .subscribe-detail .steps-wrap .el-step__description {
        position: absolute; width: 72px; text-align: center; top: -25px; left: -22px;
    }
    
    
    .subscribe-detail .image-text-wrap {
        position: relative; 
        text-align: center;
        padding: 14px 18px; 
        height: 54px; 
        line-height: 20px;
        box-sizing: content-box;
    }
    .subscribe-detail .image-wrap { float: left; width: 54px; height: 54px; }
    .subscribe-detail .image-wrap img { width: 100%; height: 100%; vertical-align: top; }
    .subscribe-detail .text-wrap { position: relative; margin-left: 64px; height: 100%; }
    .subscribe-detail .text-wrap .text {
        text-align: left;
        max-height: 100%;
        line-height: 16px;
        display: -webkit-box; 
        -webkit-box-orient: vertical;   
        -webkit-line-clamp: 2;   
        overflow: hidden;
    }
    
    
    /*.virtual-detail .statistics {
        font-size: 16px; font-weight: bold; margin-top: 16px; text-align: right;
    }
    .virtual-detail .statistics span+span { margin-left: 10px; }*/
    
    
    .subscribe-detail .el-table { border-bottom: none; }
    .subscribe-detail .el-table th,
    .subscribe-detail .el-table td {
        text-align: center;
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
    }
    .subscribe-detail .el-table td .cell { display: block; padding: 0; }
    
    
    .subscribe-detail .detail-wrap {
        margin-top: 20px;
    }
</style>