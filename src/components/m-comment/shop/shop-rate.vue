<template>
    <div class="shop-rate">
        <div class="rate-top">
            <div class="title-1">店铺综合评价</div>
            <el-rate
                v-model="statistic.shopScore"
                disabled>
            </el-rate>
            <span>{{statistic.shopScore}}分</span>
        </div>
        <div class="rate-center">
            <div class="rate-item">
                <div class="rate-title">
                    <div class="title-2">商品满意度</div>
                    <el-rate
                        v-model="statistic.productScore"
                        disabled text-color="#ff9900">
                    </el-rate>
                </div>
                <div class="desc">{{statistic.userProductNum}}人打分</div>
                <div class="rate-slider">
                    <div class="tips-box" :style="{left: (statistic.productScore/5*100) + '%'}">
                        <span class="text">{{statistic.productScore}}</span>
                        <span class="arrow"></span>
                    </div>
                    <div class="slider"></div>
                </div>
            </div>
            <div class="rate-item">
                <div class="rate-title">
                    <div class="title-2">服务满意度</div>
                    <el-rate
                        v-model="statistic.serverScore"
                        disabled text-color="#ff9900">
                    </el-rate>
                </div>
                <div class="desc">{{statistic.userShopNum}}人打分</div>
                <div class="rate-slider">
                    <div class="tips-box" :style="{left: (statistic.serverScore/5*100) + '%'}">
                        <span class="text">{{statistic.serverScore}}</span>
                        <span class="arrow"></span>
                    </div>
                    <div class="slider"></div>
                </div>
            </div>
            <div class="rate-item">
                <div class="rate-title">
                    <div class="title-2">物流满意度</div>
                    <el-rate
                        v-model="statistic.logisticsScore"
                        disabled text-color="#ff9900">
                    </el-rate>
                </div>
                <div class="desc">{{statistic.userShopNum}}人打分</div>
                <div class="rate-slider">
                    <div class="tips-box" :style="{left: (statistic.logisticsScore/5*100) + '%'}">
                        <span class="text">{{statistic.logisticsScore}}</span>
                        <span class="arrow"></span>
                    </div>
                    <div class="slider"></div>
                </div>
            </div>
            <div class="rate-item">
                <div class="rate-title">
                    <div class="title-2">发货及时性</div>
                    <el-rate
                        v-model="statistic.sendScore"
                        disabled text-color="#ff9900">
                    </el-rate>
                </div>
                <div class="desc">{{statistic.userShopNum}}人打分</div>
                <div class="rate-slider">
                    <div class="tips-box" :style="{left: (statistic.sendScore/5*100) + '%'}">
                        <span class="text">{{statistic.sendScore}}</span>
                        <span class="arrow"></span>
                    </div>
                    <div class="slider"></div>
                </div>
            </div>
        </div>
        <div class="rate-bottom">
            <ul class="rate-desc">
                <li>
                    <p>1分</p>
                    <p>非常不满意</p>
                </li>
                <li>
                    <p>2分</p>
                    <p>不满意</p>
                </li>
                <li>
                    <p>3分</p>
                    <p>一般</p>
                </li>
                <li>
                    <p>4分</p>
                    <p>满意</p>
                </li>
                <li>
                    <p>5分</p>
                    <p>非常满意</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            statistic: {
                type: Object,
                required: true
            }
        },
        data() {
            return {}
        },
    }
</script>
<style scoped>
    .shop-rate {
        margin-bottom: 15px;
    }
    .shop-rate .rate-top {
        border: 1px solid #e4eaee;
        padding: 10px 20px;
    }
    .shop-rate .rate-top .title-1 {
        font-size: 18px;
        line-height: 24px;
        font-weight: bold;
        display: inline-block;
        margin-right: 10px;
    }
    .shop-rate .rate-top .el-rate {
        display: inline-block;
        line-height: 24px;
        height: 24px;
    }
    .shop-rate .rate-center {
        padding: 10px 20px;
        border-left: 1px solid #e4eaee;
        border-right: 1px solid #e4eaee;
    }
    .shop-rate .rate-center .rate-item {
        position: relative;
        margin-bottom: 10px;
    }
    .shop-rate .rate-center .rate-item .rate-title {

    }
    .shop-rate .rate-center .rate-item .title-2 {
        display: inline-block;
        font-size: 15px;
        line-height: 20px;
        margin-right: 10px;
    }
    .shop-rate .rate-center .rate-item .el-rate {
        display: inline-block;
        vertical-align: bottom;
    }
    .shop-rate .rate-center .rate-item .desc {
        font-size: 14px;
        color: #999;
        margin-top: 2px;
    }
    .shop-rate .rate-center .rate-item .rate-slider {
        position: absolute;
        left: 250px;
        top: 0;
        width: 400px;
        height: 40px;
    }
    .shop-rate .rate-center .rate-item .tips-box {
        position: absolute;
        width: 28px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        text-align: center;
        background: #f00;
        border-radius: 3px;
        top: 2px;
        left: 0;
    }
    .shop-rate .rate-center .rate-item .tips-box .text {
        color: #fff;
    }
    .shop-rate .rate-center .rate-item .tips-box .arrow {
        border-top: 5px solid #f00;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        width: 6px;
        position: absolute;
        bottom: -5px;
        left: 11px;
    }
    .shop-rate .rate-center .rate-item .slider {
        position: absolute;
        left: 14px;
        top: 24px;
        width: 400px;
        height: 8px;
        background: #fab86e;
        background: linear-gradient(left, #fbfe9d, #fa864d);
    }
    .shop-rate .rate-bottom {
        padding: 10px 20px;
        border: 1px solid #e4eaee;
        background-color: #f5f8fa;
        text-align: center;
    }
    .shop-rate .rate-bottom .rate-desc{
        display: inline-block;
    }
    .shop-rate .rate-bottom .rate-desc li{
        float: left;
        margin-right: 70px;
    }
    .shop-rate .rate-bottom .rate-desc li p{
        font-size: 14px;
        line-height: 18px;
    }
</style>
