<template>
    <div class="goods-info-wrap">
        <jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>
        <subscribe-detail></subscribe-detail>
    </div>
</template>

<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import subscribeDetail from '../../common/subscribe-detail.vue'
    export default {
        data (){
            return {
                crumbs: [
                    {
                        title:'商品管理',
                    },
                    {
                        title:'征订商品',
                        to: {path:'/m_product/subscribe', query:this.$route.query}
                    },
                    {
                        title:'商品详情',
                    }
                ],
            }
        },
        components: {
            jkcBreadcrumb,
            subscribeDetail,
        }
    }
</script>
<style>

</style>
