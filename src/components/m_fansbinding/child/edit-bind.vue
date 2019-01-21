<template>
	<el-dialog class="edit-bind" title="修改自然用户粉丝绑定规则" v-model="dialogVisible" :close-on-click-modal="false">

		<div class="info">
			<i class="el-icon-warning"></i>
			<p>自然用户 是指通过APP Store、安卓应用市场、官方渠道等自然下载用户</p>
		</div>

		<el-form :inline="true" :model="form">
			<p style="display: inline-block; line-height: 2;">粉丝绑定的对象，最多可选择5个</p>
			<el-form-item class="right">
				<el-input placeholder="手机号、称谓" icon="search" v-model="form.keyword" :on-icon-click="handleIconClick"></el-input>
			</el-form-item>
		</el-form>

		<el-table stripe :data="tableData" ref="selectTable" v-loading="loading" @select="handleSelect" @select-all="handleSelectAll">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column label="手机号码" width="120" prop="phone"></el-table-column>
			<el-table-column label="称谓" width="120" prop="title"></el-table-column>
			<el-table-column label="开通时间" prop="runTime"></el-table-column>
		</el-table>

		<jkc-pagination :total="pagiTotal" v-if="pagiTotal !== 0"></jkc-pagination>

		<div style="margin-top: 20px;">
			<label style="margin-right: 20px;">自然用户自动绑定给</label>
			<span>{{ selectPeople }}</span>
		</div>

		<div style="margin-top: 20px;">
			<label style="margin-right: 20px;">分配原则</label>
			<template>
			   <el-radio class="radio" v-model="bodyData.type" label="Personal">随机规则</el-radio>
			   <el-radio class="radio" v-model="bodyData.type" label="Enterprise">轮位规则</el-radio>
			</template>
		</div>

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
		props: ['visible', 'sid', 'initData'],
		data() {
			return {
				loading: true,
				form: {},
				tableData: [],
				selectPeople: null,
				bodyData: { type: 'Personal', }
			}
		},
		computed: {
			dialogVisible: {
				get() { return this.visible; },
				set(val) { if(val); else this.$emit('update:visible', false); }
			},
			ruleSid() { return this.sid; },
			selectedData() { return this.initData; }
		},
		mounted() { this.getTableList(); },
		methods: {
			// 编辑中的搜索
			handleIconClick() { this.loading = true; this.getTableList(); },
			// 初始化选中数据
			selectInitData(data) {
			    this.selectedData.forEach((item) => {
			        data.forEach((row) => {
			            if(item.sid === row.sid) this.$refs.selectTable.toggleRowSelection(row);
			        })
			    })
			},
			// 获取列表
			getTableList() {
				pubObj.httpRequest(this, {
					url: api.bind + 'cards/',
					params: this.form,
					success(result) {
						this.tableData = result.data;
						if(result.pagination) this.pagiTotal = result.pagination.totalRow; // 分页
						else this.pagiTotal = 0;
						// 设置默认勾选
						setTimeout(() => {
						    this.selectInitData(result.data);
                        }, 100)
//						this.$store.commit('refresh', 0) // 复位刷新
					}
				})
			},
			handleCancel() {
				this.$emit('update:visible', false);
			},
			handleConfirm() {
				this.bodyData.sid = this.ruleSid;
				pubObj.httpRequest(this, {
					method: 'POST',
					url: api.bind,
					body: this.bodyData,
					success(result) {
						this.$message.success(result.message);
						this.$emit('update:visible', false);
						this.$emit('success');
					}
				})
			},
			// 最多可选五个
			handleSelectMax(selection) {
				if(selection.length < 6) {
					const arr = [], cardListe = [];
					selection.forEach((item) => {
						arr.push(item.title);
						cardListe.push({ sid: item.sid, title: item.title});
					});
					this.selectPeople = arr.join('，');
					this.bodyData.cardListe = cardListe;
				} else {
					this.$message.warning('粉丝绑定的对象，最多可选择5个');
				}
			},
			handleSelect(selection) {
				this.handleSelectMax(selection);
			},
			handleSelectAll(selection) {
				this.handleSelectMax(selection);
			}
		}
	}
</script>

<style>
	.edit-bind .el-dialog { max-height: 700px; }
	.edit-bind .el-dialog__body { max-height: 563px; overflow: auto; }
	.edit-bind .info{ background-color: #F6FAFF; padding: 10px; margin-bottom: 20px; }
	.edit-bind .info p{ display: inline-block; }
	.edit-bind .right{ float: right; }
	.edit-bind .footer{ text-align: center; }
</style>
