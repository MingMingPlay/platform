<template>
	<el-dialog class="transfer" title="转移粉丝" v-model="dialogVisible" :close-on-click-modal="false">

		<el-form :inline="true" :model="form">
			<p style="display: inline-block; line-height: 2;">转移粉丝到</p>
		   <el-form-item class="right">
		   	<el-input placeholder="手机号或称谓" icon="search" v-model="form.keyword" :on-icon-click="handleIconClick">
				</el-input>
		   </el-form-item>
		</el-form>

		<el-table stripe :data="tableData" ref="selectTable" v-loading="loading">
			<el-table-column label="#" width="50">
				<template slot-scope="scope">
					<el-radio v-model="cardId" :label="scope.row.sid"></el-radio>
				</template>
			</el-table-column>
			<el-table-column label="用户身份" prop="typeName" width="90"></el-table-column>
			<el-table-column label="称谓" prop="title" width="100"></el-table-column>
			<el-table-column label="手机号码" prop="phone" width="120"></el-table-column>
			<el-table-column label="关联商户" prop="relevanceName" :show-overflow-tooltip="true"></el-table-column>
		</el-table>

		<jkc-pagination :total="pagiTotal" v-show="pagiTotal !== 0"></jkc-pagination>

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
		props: ['visible', 'sids'],
		data() {
			return {
				form: {},
				loading: true,
				tableData: [],
				cardId: null
			}
		},
		computed: {
			dialogVisible: {
				get() { return this.visible; },
				set(val) { if(val); else this.$emit('update:visible', false); }
			},
			cardSids() { return this.sids; }
		},
		mounted() {
			this.getTableList();
		},
		methods: {
			handleIconClick() { this.getTableList(); },
			// 获取列表
			getTableList() {
				pubObj.httpRequest(this, {
					url: api.card + 'cards/',
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
					url: api.card + 'shift/' + this.cardId,
					body: this.cardSids,
					success(result) {
						this.$message.success(result.message);
						this.$emit('update:visible', false);
					}
				})
			},
		}
	}
</script>

<style scoped>
	.transfer .footer{ text-align: center; }
	.transfer .right{ float: right; }
</style>
