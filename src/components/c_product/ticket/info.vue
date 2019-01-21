<template>
    <div class="goods-info-wrap ticket-info">
        <jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>
        <ticket-detail :type="type"></ticket-detail>
    </div>
</template>
<script>
    // 征订商品详情
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import ticketDetail from '../../common/ticket-detail.vue'
    export default {
        data() {
            return {
                crumbs: [
                    {
                        title:'商品管理',
                    },
                    {
                        title:'征订商品',
                        to: {path:'/c_product/ticket', query:this.$route.query}
                    },
                    {
                        title:'商品详情',
                    }
                ],
                type: 'p'
            }
        },
        components: {
            jkcBreadcrumb,
            ticketDetail
        },
    }
</script>
<style>

</style>
