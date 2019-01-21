<template>
    <div class="goods-info-wrap">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-header clear">
            <swiper class="carousel-wrap" :options="swiperOption" ref="mySwiper">
                <swiper-slide class="carousel-slide" v-for="(item,index) in goodsInfo.spuImages" :key="index">
                    <img :src="item.path" alt="">
                </swiper-slide>
                <div class="swiper-pagination"  slot="pagination"></div>
            </swiper>
            <div class="goods-text">
                <h3 class="title">{{goodsInfo.title}}</h3>
                <p class="subtitle">{{goodsInfo.subTitle}}</p>
                <p class="price">￥{{goodsInfo.authorCostPrice}}<span>起</span></p>
                <p class="attr-info">
                    <span class="attr">供货价：</span>
                    <span>{{goodsInfo.priceRange}}</span>
                </p>
                <p class="attr-info">
                    <span class="attr">最高利润比：</span>
                    <span>{{goodsInfo.profitRange}}</span>
                </p>
                <p class="attr-info">
                    <span class="attr">库存：</span>
                    <span>{{goodsInfo.inventory}}</span>
                </p>
                <p class="attr-info">
                    <span class="attr">所属品类：</span>
                    <span>{{goodsInfo.categoryName}}</span>
                </p>
            </div>
        </div>

        <div class="goods-cell">
            <div class="title">商品规格</div>
            <table border="1" class="goods-sku-table">
                <tr>
                    <th>图片</th>
                    <th v-for="(item,index) in attrTableHeader">{{item.label}}</th>
                </tr>
                <tr v-for="(item, index) in goodsInfo.skus">
                    <td width="100">
                        <div class="attr-img" v-if="item.imagePath">
                            <img :src="item.imagePath" alt="规格图片">
                        </div>
                        <span v-else>无</span>
                    </td>
                    <td v-for="(value, key) in attrTableHeader">
                        {{item[key]}}
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
    import 'swiper/dist/css/swiper.css';
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import { detailCrumbs, attrTableHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: detailCrumbs,
                attrTableHeader: attrTableHeader,
                // 表格数据
                attrTableData: [],
                goodsInfo: {},
                swiperOption: {
                    autoplay: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    }
                }
            };
        },
        components:{
            jkcBreadcrumb,
            swiper,
            swiperSlide
        },
        created(){
            this.getData();
        },
        methods: {
            // 获取数据
            getData(){
                this.$http.get(['authorSpuDetail', this.$route.query.sid])
                    .then((result) => {
                        if(result.body.code === 200){
                            this.goodsInfo = result.body.data;
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
.detail-header {

}
.detail-header .carousel-wrap {
    width: 300px;
    height: 300px;
    float: left;
    margin-right: 20px;
    border: 1px solid #e4eaee;
}
.detail-header .carousel-wrap .carousel-slide {

}
.detail-header .carousel-wrap .swiper-pagination {
    position: absolute;
    bottom: 10px;
    width: 100%;

}
.detail-header .goods-text {
    width: 644px;
    float: left;
}
.detail-header .goods-text .title {
    font-size: 16px;
    line-height: 26px;
    padding: 5px 0;
    font-weight: 600;
}
.detail-header .goods-text .subtitle {
    font-size: 12px;
    line-height: 20px;
}
.detail-header .goods-text .price {
    font-size: 24px;
    line-height: 30px;
    color: #f00;
    margin: 20px 0;
}
.detail-header .goods-text .price span {
    font-size: 12px;
}
.detail-header .goods-text .attr-info {
    font-size: 12px;
    line-height: 24px;
}
.detail-header .goods-text .attr-info .attr {
    display: inline-block;
    width: 76px;
    text-align: right;
    font-weight: 600;
}
</style>
