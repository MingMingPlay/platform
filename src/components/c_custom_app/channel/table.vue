<template>
	<el-dialog title="导航栏设置" v-model="dialogVisible">
		<!--为渠道增加导航-->
		<el-tree ref="multipleTree" :data="dialogTableData" node-key="sid" :default-checked-keys="defaultCheckeds" :props="defaultProps" :accordion="true" @check-change="handleCheckChange" show-checkbox>
		</el-tree>
		<template slot="footer">
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="handleSave">保存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import { mixin_dialogTable } from '../../common/jkc-mixin.vue'
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'

	export default {
		mixins: [mixin_dialogTable],
		data() {
			return {
				api: null,
				selectedRole: [], // 提交时被选中的sid数组
				rows: [], // 临时存储-被选中的对象
				postName: 'sid',
				defaultProps: {
					label: 'title',
					children: 'children',
				},
				defaultCheckeds: [],
			}
		},
		computed: {
			bStatus() {
				const val = this.storeB.status;
				if(val === 1) this.api = api.navigation + 'mall/channel/' + this.bSid;
				return val;
			}
		},
		methods: {
			// 向下遍历
			traversal(data) {
				data.forEach(obj => {
					if(obj.children) traversal(obj.children)
					else if(obj.checked === true) this.rows.push(obj)
				})
			},
			// 初始化选中的复选框(针对于table)
			initSelected(data) {
				this.rows = []
				this.defaultCheckeds = []
				this.dialogTableData = data
				data.forEach(obj => {
					if(obj.children) this.traversal(obj.children)
					else if(obj.checked === true) this.rows.push(obj)
				})
				if(this.rows.length > 0) {
					this.rows.forEach(row => {
						this.defaultCheckeds.push(row.sid)
					})
				}
			},
			handleCheckChange() {
				this.isClickSelection = true;
				this.selectedRole = this.$refs.multipleTree.getCheckedKeys(false);
			}
		}
	}
</script>

<style>
	.channel .el-tree {
		height: 360px;
		overflow: auto;
	}
</style>
