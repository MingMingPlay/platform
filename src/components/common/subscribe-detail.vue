<template>
    <div>
        <div class="goods-title">
            <div class="title">{{goodsInfo.title}}<span class="state">{{goodsInfo.stateName}}</span></div>
            <div class="sub-title">{{goodsInfo.subTitle}}</div>
        </div>
        <div class="goods-cell">
            <div class="title">商品基本信息</div>
            <div class="goods-info clear">
                <div class="left">
                    <p class="info-cell clear">
                        <span class="info-title">商品类型：</span>
                        <span class="info-content">{{goodsInfo.typeName}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">所属店铺：</span>
                        <span class="info-content">{{goodsInfo.shopName}}</span>
                    </p>
                </div>
                <div class="right">
                    <div class="goods-image-wrap" v-for="(item, index) in goodsInfo.spuImagesvo">
                        <img class="goods-image" :src="item.path" alt="商品图片">
                        <p class="main" v-if="index == 0">主图</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="goods-cell">
            <div class="title">征订数据</div>
            <div class="goods-info clear">
                <p class="goods-data">
                    <span class="data-title">开始时间：</span>
                    <span class="data-content">{{goodsInfo.startTime || '--'}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">结束时间：</span>
                    <span class="data-content">{{goodsInfo.endTime || '--'}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">下架时间：</span>
                    <span class="data-content">{{goodsInfo.subOfflineTime || '--'}}</span>
                </p>
                <p class="goods-data"></p>
                <p class="goods-data">
                    <span class="data-title">价格：</span>
                    <span class="data-content">{{goodsInfo.price || '--'}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">库存：</span>
                    <span class="data-content">{{goodsInfo.subInventory || '--'}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">最小数量：</span>
                    <span class="data-content">{{goodsInfo.minimum || '--'}}</span>
                </p>
                <p class="goods-data">
                    <span class="data-title">最大数量：</span>
                    <span class="data-content">{{goodsInfo.maximum || '--'}}</span>
                </p>
            </div>
        </div>
        <div class="goods-cell">
            <div class="title">商品规格</div>
            <table border="1" class="goods-sku-table">
                <tr>
                    <th>图片</th>
                    <th v-for="item in attrData" v-if="item.children.length > 0">{{item.name}}</th>
                </tr>
                <tr v-for="(item, index) in attrTableData">
                    <td width="100" v-if="item[0].isShow" :rowspan="item[0].rowspan">
                        <div class="attr-img" v-if="item[0].imagePath">
                            <img :src="item[0].imagePath" alt="规格图片">
                        </div>
                        <span v-else>无</span>
                    </td>
                    <td v-for="(value, n) in item" v-if="value.isShow" :rowspan="value.rowspan">
                        {{value.name}}
                    </td>
                </tr>
            </table>
        </div>

        <div class="goods-cell">
            <div class="title">商品详情</div>
            <div class="goods-info">
                <div class="goods-detail-wrap" v-html="goodsInfo.description"></div>
            </div>
        </div>
    </div>
</template>
<script>
    // 征订商品详情
    import { pubObj } from '../../assets/unit/public.js'
    export default {
        data() {
            return {
                goodsInfo: {},
                attrSkuData: {},    // 库存相关
                attrTableData: [],  // 规格格式化后的数据
                attrData: [],       // 规格的实际数据
            }
        },
        created (){
            this.getGoodsInfo();
            this.getGoodsAttr();
        },
        methods: {
            getGoodsInfo (){		// 获取商品信息
                this.$http.get(['spuSubscribe', this.$root.platform + '/', this.$route.query.spuSid])
                    .then((result) => {
                        if(result.body.code === 200){
                            this.goodsInfo = result.body.data;
                        }else {
                            this.$message.warning(result.body.message)
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },
            getGoodsAttr (){		// 获取商品的规格
                this.$http.get(this.$api.sku + 'skuattr/' + this.$route.query.spuSid, {
                    headers: {
                        'api-ver': '2.0.0'
                    }
                }).then((result) => {
                        if(result.body.code === 200){
                            let data = result.body.data;
                            this.attrData = data;
                            this.attrTableData = pubObj.refactorData(data);
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
        }
    }
</script>
<style>

</style>
