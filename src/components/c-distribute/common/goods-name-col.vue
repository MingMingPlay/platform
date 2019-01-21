<template>
    <el-table-column label="商品" :min-width="minWidth">
        <template slot-scope="scope">
            <div class="goods-title-info">
                <img v-if="scope.row.mainImagePath" :src="scope.row.mainImagePath" alt="">
                <img v-if="scope.row.imagePath" :src="scope.row.imagePath" alt="">
                <div class="info">
                    <p class="title">{{scope.row.title}}</p>
                    <p class="tag-list" v-if="scope.row.promotionNames">
                        <span class="tag" v-for="(item,index) in scope.row.promotionNames" :key="index">{{item}}</span>
                    </p>
                    <p class="price" v-else>￥{{scope.row.costPrice}}</p>
                </div>
            </div>
        </template>
    </el-table-column>
</template>
<script>
    export default {
        props: {
            minWidth: {
                default: '200'
            }
        },
        data() {
            return {}
        },
    }
</script>
<style scoped>
.goods-title-info {
    padding: 5px 0;
    position: relative;
}
.goods-title-info img {
    position: absolute;
    width: 60px;
    height: 60px;
    left: 0;
    top: 5px;
}
.goods-title-info .info {
    margin-left: 65px;
}
.goods-title-info .info .title{
    font-size: 12px;
    line-height: 18px;
    height: 36px;
    overflow: hidden;
}
.goods-title-info .info .price{
    font-size: 14px;
    line-height: 18px;
    color: #f00;
    margin-top: 6px;
}
.goods-title-info .info .tag-list{
    min-height: 18px;
    margin-top: 6px;
}
.goods-title-info .info .tag-list .tag{
    display: inline-block;
    padding: 3px;
    background: #f00;
    color: #fff;
    line-height: 14px;
    font-size: 12px;
}
.goods-title-info .info .tag-list .tag + .tag{
    margin-left: 5px;
}
</style>
