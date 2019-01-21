<template>
    <div class="goods-info-wrap">
        <jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>
        <product-info :batchSkuData="batchSkuData" :attrWidth="360"></product-info>
    </div>
</template>

<script>
    import { mixin_productInfo } from '../../common/mixin_product_info.vue'
    export default {
        mixins: [mixin_productInfo],
        data (){
            return {
                crumbs: [
                    {
                        title:'商品管理',
                    },
                    {
                        title:'行销商品',
                        to: {path:'/m_product/special', query:this.$route.query}
                    },
                    {
                        title:'商品详情',
                    }
                ],
                batchSkuData: [],		// 批量设置的数据/当前需要填的数据
                batchSkuData0: [		// 供货商
                    {
                        name: '供货价',
                        type: 'costPrice',
                        switch: false,
                        amount: null,
                        disabled: true,
                    },
                    {
                        name: '划线价',
                        type: 'regularPrice',
                        switch: false,
                        amount: null,
                        disabled: false,
                    },
                    {
                        name: '售价',
                        type: 'sellingPrice',
                        switch: false,
                        amount: null,
                        disabled: false,
                    },
                    {
                        name: '员工价',
                        type: 'employeePrice',
                        switch: false,
                        amount: null,
                        disabled: false,
                    },
                    {
                        name: '库存',
                        type: 'inventory',
                        switch: false,
                        amount: null,
                        disabled: true,
                    },
                    {
                        name: '起售数量',
                        type: 'minimum',
                        switch: false,
                        amount: null,
                        disabled: true,
                    },
                ],
                batchSkuData1: [		// 代理商
                    {
                        name: '供货价',
                        type: 'costPrice',
                        switch: false,
                        amount: null,
                        disabled: true,
                    },
                    {
                        name: '划线价',
                        type: 'regularPrice',
                        switch: false,
                        amount: null,
                        disabled: false,
                    },
                    {
                        name: '售价',
                        type: 'sellingPrice',
                        switch: false,
                        amount: null,
                        disabled: false,
                    },
                    {
                        name: '员工价',
                        type: 'employeePrice',
                        switch: false,
                        amount: null,
                        disabled: false,
                    },
                    {
                        name: '库存',
                        type: 'inventory',
                        switch: false,
                        amount: null,
                        disabled: true,
                    },
                    {
                        name: '起售数量',
                        type: 'minimum',
                        switch: false,
                        amount: null,
                        disabled: true,
                    },
                ],
            }
        },
        created(){
            this.batchSkuData = this['batchSkuData' + this.$route.query.agent];
        }
    }
</script>
<style>

</style>
