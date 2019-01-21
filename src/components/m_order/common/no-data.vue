<template>
    <div class="no-data" :style="retStyle">
        <p style="text-align: center; font-weight: bold;">暂无数据</p>
    </div>
</template>

<script>
	export default {
	    props: {
	        totalRow: Number,
	    },
	    
	    computed: {
	        retStyle() {
	            let ret = {};
	            const num = this.totalRow;
	            if(num) {
	                ret.display = 'none';
	            } else {
	                ret.display = 'block';
	            }
	            return ret;
	        }
	    }
	}
</script>

<style>
    .no-data { position: relative; margin: 25px 0; display: none; }
</style>