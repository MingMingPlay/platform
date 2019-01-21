<template>
	<div class="tree-input">
		<input :value="name" placeholder="请选择" @click="handleClick" class="jkc-input el-input__inner" readonly />
		<el-tree :data="selectData" :props="defaultProps" @node-click="handleNodeClick" v-show="treeVisible"></el-tree>
	</div>
</template>

<script>
	export default {
		props: ['selectData', 'defaultVal', 'label'],
		data() {
			return {
				name: this.defaultVal,
				treeVisible: false,
				defaultProps: {
					label: this.label || 'name',
					children: 'children'
				},
				storeD: this.$store.state.d,
				numberOfClick: 0,
			}
		},
		computed: {
			display() {
				return this.storeD.status
			}
		},
		watch: {
			defaultVal(val) {
				this.name = val;
			},
			display(val) {
				if(val === 1) {
					this.treeVisible = false;
					this.numberOfClick = 0;
					this.$store.commit('dDisplay', 0);
				}
			}
		},
		methods: {
			handleClick() {
				this.numberOfClick = this.numberOfClick + 1;
				if(this.numberOfClick === 1) this.treeVisible = true;
				else if(this.numberOfClick === 2) {
					this.treeVisible = false;
					this.numberOfClick = 0;
				}
			},
			handleNodeClick(data) {
				this.name = data[this.label || 'name'];
				this.$emit('nodeClick', data.sid);
				this.treeVisible = false;
				this.numberOfClick = 0;
			}
		}
	}
</script>

<style>
	.tree-input {
		position: relative;
	}
	
	.tree-input .el-tree {
		position: absolute;
		z-index: 1001;
		top: 34px;
		left: 0;
		right: 0;
		height: 192px;
		overflow: auto;
		border: 1px solid #d1dbe5;
		border-radius: 2px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}
</style>