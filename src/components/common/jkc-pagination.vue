<template>
	<el-pagination 
		@size-change="handleSizeChange" 
		@current-change="handlePageChange" 
		:current-page="pageIndex" 
		:page-size="pageSize" 
		:page-sizes="[10, 20, 50, 100]" 
		layout="total, sizes, prev, pager, next, jumper" 
		:total="total"
		v-show="total !== 0">
	</el-pagination>
</template>

<script>
	export default {
		props: {
			total: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {
				pageIndex: 1,
				pageSize: 10,
			}
		},
		methods: {
			// 每页显示个数改变
			handleSizeChange(val) {
				this.pageSize = val;
				this.$store.commit('cPage', [0, val]);
			},
			// 当前页改变
			handlePageChange(val) {
				this.pageIndex = val;
				this.$store.commit('cPage', [1, val]);
			},
		}
	}
</script>

<style>
	.el-pagination {
		margin-top: 30px;
		text-align: center;
	}
</style>