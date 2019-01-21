<template>
	<div class="order-pay">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true">
				<el-form-item label="订单号">
					<el-input type="number" v-model="form.orderId"></el-input>
				</el-form-item>
				<el-form-item label="系统订单号">
					<el-input v-model="form.sysOrderId"></el-input>
				</el-form-item>
				<el-form-item label="第三方支付流水号">
					<el-input v-model="form.paymentId"></el-input>
				</el-form-item>
				<el-form-item label="时间范围">
					<el-date-picker v-model="searchTime" type="daterange" placeholder="选择日期范围"></el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
			</el-form>
		</div>

		<el-table :data="tableData" v-loading="loading" class="table-composing" stripe>
			<el-table-column label="序号" width="60" label-class-name="first-col-no-padding" class-name="first-col-no-padding" header-align="center" align="center">
				<template slot-scope="scope">
					{{scope.$index | newIndex(pageIndex,pageSize)}}
				</template>
			</el-table-column>
			<el-table-column label="第三方支付流水号" prop="paymentId" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="订单号" prop="orderId" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="系统订单号" prop="sysOrderId" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="支付渠道" prop="payChannelName"></el-table-column>
			<el-table-column label="订单类型" prop="orderTypeName"></el-table-column>
			<el-table-column label="订单状态" prop="orderStateName"></el-table-column>
			<el-table-column label="退款状态" prop="refundStateName"></el-table-column>
			<el-table-column label="来源" prop="channelName"></el-table-column>
			<el-table-column label="支付总价" prop="payAmount"></el-table-column>
		</el-table>

		<jkc-pagination :total="pagiTotal"></jkc-pagination>

	</div>
</template>

<script>
	import { mixin_breadcrumb, mixin_search_form, mixin_getList_table, mixin_pagination } from '../../common/jkc-mixin.vue'
	import api from '../../../assets/config/m-api.js'
	import { pubObj } from '../../../assets/unit/public.js'

	export default {
		mixins: [mixin_breadcrumb, mixin_search_form, mixin_getList_table, mixin_pagination],
		data() {
			return {
			    loading: true,
				api: api.order,
				crumbs: [{
					title: '订单管理'
				}, {
					title: '订单支付流水号查询'
				}],
				form: {},
				searchTime: [],
			}
		},
		watch: {
			searchTime(val) {
				this.form.createdTimeBegin = this.handleTime(val[0]);
				this.form.createdTimeEnd = this.handleTime(val[1]);
			}
		},
		methods: {
			handleTime(val) {
				if(!val) return null;
				const yyyy = val.getFullYear();
				const mm = val.getMonth() + 1;
				const dd = val.getDate();
				return yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
			}
		}
	}
</script>

<style>

</style>
