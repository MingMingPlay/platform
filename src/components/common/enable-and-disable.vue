<template>
    <el-button type="text" @click="handleUser(row.sid, 'Disabled')" v-if="row.state === 'Active' && !row.reserved">禁用</el-button>
    <span v-else-if="row.reserved">--</span>
    <el-button type="text" @click="handleUser(row.sid, 'Active')" v-else-if="!row.reserved">启用</el-button>
</template>
<script>
    /**
     * 禁用启用用户
     * 云平台和阅商机都有
    * */
    export default {
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        data() {
            return {}
        },
        methods: {
            // 禁用或启用用户
            handleUser(sid, type){
                let urlKey = '',
                    notice = '';
                if(type === 'Active'){
                    urlKey = 'userEnable';
                    notice = '确定启用？'
                }else if(type === 'Disabled'){
                    urlKey = 'userDisable';
                    notice = '确定禁用？'
                }
                this.$confirm(notice, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$http.put([urlKey, sid])
                        .then(result => {
                            if(result.body.code === 200){
                                this.$message.success(result.body.message);
                                this.$emit('success')
                            }else {
                                this.$message.error(result.body.message);
                            }
                        })
                });
            },
        }
    }
</script>
<style>

</style>
