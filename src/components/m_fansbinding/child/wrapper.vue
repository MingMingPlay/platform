<template>
	<div class="wrapper">
		<div class="w-header">
			<slot name="header"></slot>
		</div>
		<div class="w-body">
			<slot name="body"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style scoped>
	.wrapper { border: 1px solid #E4EAEE; background-color: #FFFFFF; }
	.wrapper .w-header { padding: 20px; background-color: #F5F8FA; border-bottom: 1px solid #E4EAEE; }
	.wrapper .w-body { padding: 20px; }
</style>