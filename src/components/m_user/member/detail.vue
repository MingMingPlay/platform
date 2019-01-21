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
                        title: '注册用户',
                        to: {path:'/m_user/member'}
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
