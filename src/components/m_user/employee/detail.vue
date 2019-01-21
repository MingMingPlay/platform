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
                        title: '员工列表',
                        to: {path:'/m_user/employee'}
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
