<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <user-detail></user-detail>
    </div>
</template>
<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import UserDetail from '../../common/user-detail.vue'
    export default {
        data() {
            return {
                crumbs: [
                    {
                        title: '用户管理',
                    },
                    {
                        title: '店铺管理员',
                        to: {path:'/c_user/manager'}
                    },
                    {
                        title: '用户详情',
                    }
                ],
            }
        },
        components: {
            JkcBreadcrumb,
            UserDetail
        },
    }
</script>
<style>

</style>
