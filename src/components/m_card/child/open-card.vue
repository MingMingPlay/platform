<template>
	<el-dialog class="open-card" title="批量开通营销名片" v-model="dialogVisible" :close-on-click-modal="false">

		<el-form :inline="true" :model="form">
			<p style="display: inline-block; line-height: 2;">选择需要开通营销名片的用户</p>
			<el-form-item class="right">
				<el-input placeholder="手机号" icon="search" v-model="form.keyword" :on-icon-click="handleSearch"></el-input>
			</el-form-item>
		</el-form>

		<el-table stripe :data="tableData" ref="selectTable" v-loading="loading" @select="handleSelect">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column label="用户姓名" prop="name" width="90"></el-table-column>
			<el-table-column label="昵称" width="100" prop="nickname" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="注册渠道" prop="channelName" width="120" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="注册时间" prop="createdTime"></el-table-column>
		</el-table>

		<jkc-pagination :total="pagiTotal" v-if="pagiTotal !== 0"></jkc-pagination>

		<div slot="footer" class="footer">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleConfirm">确定</el-button>
		</div>

	</el-dialog>
</template>

<script>
	import { mixin_pagination } from '../../common/jkc-mixin.vue'
	import { pubObj } from '../../../assets/unit/public.js'
	import api from '../../../assets/config/m-api.js'
	export default {
		mixins: [mixin_pagination],
		props: ['visible'],
		data() {
			return {
				form: {},
				loading: true,
				tableData: [],
				sids: [],
			}
		},
		computed: {
			dialogVisible: {
				get() { return this.visible; },
				set(val) { if(val); else this.$emit('update:visible', false); }
			}
		},
		mounted() {
			this.getTableList();
		},
		methods: {
		    handleSearch() { this.getTableList(); },
			// 获取列表
			getTableList() {
				pubObj.httpRequest(this, {
					url: api.card + 'fans/',
					params: this.form,
					success(result) {
						this.tableData = result.data;
						if(result.pagination) this.pagiTotal = result.pagination.totalRow; // 分页
						else this.pagiTotal = 0;
						this.$store.commit('refresh', 0) // 复位刷新
					}
				})
			},
			handleCancel() {
				this.$emit('update:visible', false);
			},
			handleConfirm() {
				pubObj.httpRequest(this, {
					method: 'PUT',
					url: api.card + 'dredge/',
					body: this.sids,
					success(result) {
						this.$message.success(result.message);
						this.$emit('update:visible', false);
					}
				})
			},
			handleSelect(selection) {
				const tempArr = [];
				selection.forEach((item) => {
					tempArr.push(item.sid);
				});
				this.sids = tempArr;
			}
		}
	}
</script>

<style scoped>
	.open-card .footer { text-align: center; }
	.open-card .right{ float: right; }
</style>
