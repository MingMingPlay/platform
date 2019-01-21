<template>
</template>
<script>

    // 导出商品列表Excel
    export const mixin_exportExcel = {
        methods: {
            exportExcel(type){  // 导出商品列表
                let query = '';
                for (let key in this.searchForm){
                    if(this.searchForm[key]){
                        query += '&' + key + '=' + this.searchForm[key];
                    }
                }
                /*let iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.id = 'iframe';
                iframe.src = this.$api.spuExcel.url + '?type=' + type + query;
                // chrome 不兼容
                /!*iframe.onload = iframe.onreadystatechange = function() {
                    console.log(284523489)
                    if (this.readyState && this.readyState !== 'complete') return;
                    else {
                        console.log(9999998787767)
                    }
                }*!/
                document.body.append(iframe);*/

                window.open(this.$api.spuExcel.url + '?type=' + type + query)
            },
        }
    }
</script>
<style>

</style>
