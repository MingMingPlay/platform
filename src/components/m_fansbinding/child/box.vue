<template>
	<div class="box">
		<div class="left">
			<slot name="left"></slot>
		</div>
		<div class="middle">
			<slot name="middle"></slot>
		</div>
		<div class="right">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script>
</script>

<style scoped>
	.box { padding: 20px 0; font-size: 14px; overflow: hidden; line-height: 28px; }
	.box+.box { border-top: 1px solid #C9C9C9; }
	.box .left { display: inline-block; margin-right: 30px; float: left; }
	.box .middle { display: inline-block; margin: 0 10px; }
	.box .right { float: right; }
</style>