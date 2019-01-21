<template>
	<div class="fans">

		<jkc-breadcrumb :crumbs="staticData.crumbs" goBack="/c_card/card" :queryString="$route.query.state"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<div class="personal-card-wrapper">
				<div class="personal-info">
					<div class="title">
						<label>{{ cardData.title }}</label>
						<span>{{ cardData.stateName }}</span>
					</div>
					<div class="content">
						<p>用户身份：{{ cardData.typeName }}</p>
						<p>关联商户：{{ cardData.relevanceName }}</p>
						<p>联系电话：{{ cardData.phone }}</p>
					</div>
				</div>
				<div class="summary">
					<div class="total-fans">
						<label>{{ cardData.totalFans }}</label>
						<span>总粉丝量</span>
					</div>
					<div class="total-exposure">
						<label>{{ cardData.totalExposure }}</label>
						<span>总曝光量</span>
					</div>
				</div>
			</div>
		</div>

		<!--<div class="operate-wrapper">
			<el-button type="primary" @click="handleMove">移动粉丝</el-button>
			<el-select class="right" v-model="form.sorting" placeholder="按注册时间排序">
		    	<el-option label="按注册时间排序" value="0"></el-option>
		   </el-select>
		</div>-->

		<el-table stripe :data="tableData" v-loading="loading" @sort-change="handleSortChange">
			<el-table-column label="用户昵称" prop="nickname" width="200"></el-table-column>
			<el-table-column label="电话号码" prop="mobile" width="200"></el-table-column>
			<el-table-column label="绑定时间" prop="bindTime" width="200" sortable="custom"></el-table-column>
			<el-table-column label="转发量" prop="shareCount" width="200" sortable="custom"></el-table-column>
			<el-table-column label="曝光量" prop="exposureCount" width="200" sortable="custom"></el-table-column>
			<el-table-column label="注册信息" prop="registerInfo"></el-table-column>
		</el-table>

		<jkc-pagination :total="pagiTotal"></jkc-pagination>

		<transfer-fans :visible.sync="showTransferFans" :sids="sids" v-if="isTransferFans"></transfer-fans>

	</div>
</template>

<script>
	import { mixin_pagination } from '../common/jkc-mixin.vue'
	import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
	import TransferFans from './child/transfer-fans.vue'
	import { pubObj } from '../../assets/unit/public.js'
	import api from '../../assets/config/c-api.js'
	export default {
		mixins: [mixin_pagination],
		components: { JkcBreadcrumb, TransferFans },
		data() {
			return {
				loading: false,
				staticData: {},
				form: {},
				cardData: {},
				tableData: [],
				// 转移粉丝-是否加载
				isTransferFans: false,
				// 转移粉丝-是否显示
				showTransferFans: false,
				// 编辑名片-是否加载
			}
		},
		created() {
			this.staticData.crumbs = [{ title: '营销名片' }, { title: '粉丝列表' }];
		},
		mounted() {
			this.getCardDetail();
			this.getTableList();
		},
		methods: {
			// 获取名片详情
			getCardDetail() {
				pubObj.httpRequest(this, {
					url: api.card + this.$route.query.sid,
					success(result) {
						this.cardData = result.data;
					}
				})
			},
			// 获取列表
			getTableList() {
				pubObj.httpRequest(this, {
					url: api.fans + 'fans/' + this.$route.query.sid,
					params: this.form,
					success(result) {
						this.tableData = result.data;
						if(result.pagination) this.pagiTotal = result.pagination.totalRow; // 分页
						this.$store.commit('refresh', 0) // 复位刷新
					}
				})
			},
			handleSortChange(obj) {
				// 以哪种条件排序
				if(obj.prop === 'bindTime') {
					this.form.order = 'RegisterTime';
				} else if(obj.prop === 'shareCount') {
					this.form.order = 'ShareCount';
				} else if(obj.prop === 'exposureCount') {
					this.form.order = 'ExposureCount';
				} else delete this.form.order;
				// 升序还是降序
				if(obj.order === 'ascending') {
					this.form.sort = 'ASC';
				} else if(obj.order === 'descending') {
					this.form.sort = 'DESC';
				} else delete this.form.sort;
				this.getTableList();
			}
//			// 移动粉丝
//			handleMove() {
//				// 当选择对象中包括不符合要条件的对象时，弹出提示框
//				/*this.showMoveMessageFail();*/
//				// 当选择对象全部符合前置条件，则弹出转移粉丝弹出框
//				if(this.isTransferFans);
//				else { this.isTransferFans = true; }
//				if(this.sids.length === 0) this.$message.warning('请选择名片！');
//				else { this.showTransferFans = true; }
//			},
//			// 前置条件：关联用户身份=本商户认证员工  且   营销名片状态=禁用
//			// 当选择对象中包括不符合要条件的对象时，弹出提示框
//			showMoveMessageFail() {
//				pubObj.showMessage(this, {
//					title: '提示信息',
//					content: '移动粉丝，只限本商户认证员工的已经禁用的营销名片',
//					showCancelButton: false,
//					confirm(args) {
//						console.log('sure')
//					}
//				})
//			}
		}
	}
</script>

<style scoped>
	.fans { font-size: 14px; }
	.fans .personal-card-wrapper { position: relative; }
	.fans .personal-info .title { margin-bottom: 10px; overflow: hidden; line-height: 32px; }
	.fans .personal-info .title label { float: left; font-size: 16px; margin-right: 15px; }
	.fans .personal-info .title span { color: #FAB113;display: inline-block; }
	.fans .personal-info .content p { line-height: 2; }
	.fans .summary { position: absolute; top: 0; right: 0; bottom: 0; width: 50%; }
	.fans .total-fans, .fans .total-exposure { float: left; position: relative; top: 0; left: 0; bottom: 0; margin-top: 20px; }
	.fans .total-fans label, .fans .total-exposure label { display: block; font-size: 26px; margin-bottom: 10px; }
	.fans .total-fans span, .fans .total-exposure span { display: block; text-align: center; }
	.fans .total-fans { margin-right: 100px; }
	.fans .operate-wrapper { height: 28px; }
	.fans .right { float: right; margin-bottom: 18px; }
</style>
