<template>
    <el-button type="success" @click="exportExcel">导出Excel</el-button>
</template>
<script>
    export default {
        props: {
            searchForm: {
                type: Object
            },
            apiKey: {
                type: String,
                required: true
            },
            noParams: {
                type: Boolean,
                default: false
            }
        },
        created(){
            this.searchForm.token = sessionStorage.getItem('token');
        },
        methods: {
            exportExcel(){
                if(this.searchForm.beginDate === '' || this.searchForm.auditTimeBegin === ''){
                    this.$message.warning('请选择导出的时间范围');
                    return;
                }
                let url = this.$api[this.apiKey].url + '?';
                if(!this.noParams){
                    for(let key in this.searchForm){
                        url += key + '=' + this.searchForm[key] + '&';
                    }
                }
                window.open(url)
            },
        },
    };
</script>
<style scoped>

</style>
