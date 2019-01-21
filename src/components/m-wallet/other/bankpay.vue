<template>
    <div></div>
</template>

<script>
    export default {
        
        created() {
            const query = this.$route.query;
            let queryString = query.bankurl;
            const tempArray = Object.entries(query).slice(1).map(function (arr) {
            	return arr[0]+'='+arr[1];
            });
            queryString = queryString+'&'+tempArray.join('&');
            window.location.replace(queryString);
        }
        
    }
</script>

