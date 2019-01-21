<template>
	<div class="badge">
		<button class="badge-button">
			<span>
				<slot></slot>
			</span>
		</button>
		<sup 
			v-if="showBadge" 
			class="badge-sup" 
			@click="handleDelete">X
		</sup>
	</div>
</template>

<script>
	export default {
		props: ['required', 'index'],
		data() {
			return {}
		},
		computed: {
			showBadge() {
				if(this.required === undefined) return true;
				else return false;
			}
		},
		methods: {
			handleDelete() {
				this.$emit('delete', this.index);
			}
		}
	}
</script>

<style scoped>
	.badge { position: relative; display: inline-block; }
	.badge+.badge { margin-left: 15px; }
	.badge .badge-button {
		display: inline-block;
	   line-height: 1;
	   white-space: nowrap;
	   cursor: pointer;
	   background: #fff;
	   border: 1px solid #c4c4c4;
	   color: #1f2d3d;
	   margin: 0;
	   padding: 6px 15px;
	   border-radius: 4px;
	   font-size: 14px;
    	box-sizing: border-box;
	   -webkit-appearance: none;
	   -moz-user-select: none;
	   -webkit-user-select: none;
	   -ms-user-select: none;
	   outline: 0;
	   text-align: center;
	   cursor: default;
	}
	.badge .badge-sup {
		position: absolute;
		top: 0;
		right: 10px;
		-webkit-transform: translateY(-50%) translateX(100%);
		-moz-transform: translateY(-50%) translateX(100%);
		-ms-transform: translateY(-50%) translateX(100%);
    	transform: translateY(-50%) translateX(100%);
		background-color: #ff4949;
	   border-radius: 10px;
	   color: #fff;
	   display: inline-block;
	   font-size: 12px;
	   height: 18px;
	   line-height: 18px;
	   padding: 0 6px;
	   text-align: center;
	   border: 1px solid #fff;
	   cursor: pointer;
	}
</style>