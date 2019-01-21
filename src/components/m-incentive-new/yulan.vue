<template>
    <el-card class="box-card" style="padding: 0" v-if="goodsList">
        <div class="title divider">{{title}}</div>
        <div class="items">
            <div class="item" v-for="item in goodsList">
                <div class="left">
                    <img class="logo" :src="item.logoPath" alt="logo" v-if="item.logoPath">
                    <span class="logo" v-if="!item.logoPath">暂无图片</span>
                </div>
                <div class="right">
                    <p class="goods-title strong">{{item.goodsTitle}}</p>
                    <p class="goods-info small">{{item.goodsInfo}}</p>
                    <div class="get">
                        <span class="left">直接领取</span>
                        <span class="right">+</span>
                    </div>
                    <div class="cash" v-if="item.cashable">
                        <span class="left">折成现金</span>
                        <span class="right">+</span>
                    </div>
                    <div class="abandon" v-if="item.abandon">
                        <span class="left">放弃</span>
                        <span class="right">+</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="card-footer">
            <div class="left">
                <img src="../../assets/img/cart.png" alt="" class="cart-icon">
            </div>
            <div class="right">
                <el-button :disabled="true">放弃</el-button>
                <el-button :disabled="true">提交</el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "yulan",
        props: ['title','goodsList']
    }
</script>

<style scoped>
    .el-card{
        color: #333333;
    }
    .el-card__body{
        padding: 0;
    }
    .box-card {
        width: 320px;
        min-height: 468px;
        position: relative;
    }
    .title{
        line-height: 20px;
        font-size: 14px;
        text-align: center;
    }
    .box-card .items{
        width: 100%;
        height: 400px;
        overflow: auto;
        margin-bottom: 40px;
    }
    .item{
        border-top: 1px solid #dfe6ec;
        padding-top: 10px;
        overflow: hidden;
        margin-top: 10px;
    }
    .item>.left{
        float: left;
        width: 100px;
    }
    .item>.right{
        float: right;
        padding-left: 10px;
        width: 165px;
    }
    .left .logo{
        display: block;
        width: 100px;
        height: 100px;
        background-color: #c0c4cc;
        color: white;
        text-align: center;
        line-height: 100px;
        font-size: 14px;
        letter-spacing: 1px;
    }
    .strong{
        font-weight: 600;
    }
    .small{
        font-size: 12px;
    }
    .goods-title{
        font-size: 16px;
        color: #333333;
    }
    .goods-info{
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 10px;
        color: #333333;
    }
    .get,.cash,.abandon{
        margin-top: 5px;
        overflow: hidden;
    }
    .get .left,.cash .left,.abandon .left{
        display: block;
        float: left;
        font-size: 14px;
    }
    .get .right,.cash .right,.abandon .right{
        display: block;
        width: 20px;
        height: 20px;
        float: right;
        font-size: 14px;
        border: 1px solid #dfe6ec;
        border-radius: 100%;
        text-align: center;
    }
    .card-footer{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2000;
        background-color: #fff;
        border-top: 1px solid #dfe6ec;
        padding: 10px 20px;
    }
    .card-footer .el-button{
        margin: 0;
    }
    .card-footer .left .cart-icon{
        width: 30px;
        height: auto;
    }
</style>
