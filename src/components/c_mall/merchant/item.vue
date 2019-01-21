<template>
	<div class="detailItem-wrap">
		<template v-for="item in detailLabels">
			<p v-if="item.type!=='img'">
				<label :class="item.class">{{item.lab}}</label>：
				<span>{{detailData[item.val]}}</span>
				<el-button type="primary" v-if="item.btn">重置密码</el-button>
			</p>
			<p v-else>
				<label :class="item.class">{{item.lab}}</label>：
				<img :src="detailData[item.val]" />
			</p>
		</template>
	</div>
</template>

<script>
	import api from '../../../assets/config/c-api.js'
	import { business, supplier } from '../../../assets/staticData/merchant.js'
	import { pubObj } from '../../../assets/unit/public.js'
	export default {
		name: 'item',
		props: ['optionName', 'suppSid'],
		data() {
			return {
				merSid: this.$route.query.sid,
				detailData: {},
				detailLabels: [],
			}
		},
		mounted() {
			if(this.optionName === 'mercData') {
				this.detailLabels = business.merchantDetail
				this.getDataList()
			} else {
				if(this.optionName === 'suppDetail1') this.detailLabels = supplier.supplierDetail1;
				else this.detailLabels = supplier.supplierDetail2;
				this.handleDetail()
			}
		},
		methods: {
			// 获取商家详情数据，async函数，返回一个promise对象，在then中去执行回调
			getDataList() {
				var $this = this
				// 获取商家详情（不包括图片）
				pubObj.httpRequest($this, {
					url: api.merchant + $this.merSid,
					success(result) {
						$this.detailData = result.data
					}
				})
			},
			// 查看供应链关系详情
			handleDetail(sid) {
				var $this = this;
				pubObj.httpRequest($this, {
					url: api.supplier + $this.suppSid,
					success(result) {
						$this.detailData = result.data // 执行回调函数
					}
				})
			},
		}
	}
</script>

<style>
	.detailItem-wrap {
		position: relative;
		padding-left: 75px;
	}

	.detailItem-wrap p {
		line-height: 36px;
		font-size: 14px;
		margin: 10px 0;
	}

	.detailItem-wrap p label {
		display: inline-block;
		text-align: left;
	}

	.detailItem-wrap p span,
	.detailItem-wrap p img {
		margin-left: 30px;
		vertical-align: middle;
	}

	.detailItem-wrap p img {
		height: 100px;
	}

	.detailItem-wrap .el-button--primary {
		margin-left: 30px;
		padding: 6px 12px;
		line-height: 16px;
	}

	.detailItem-wrap .el-button--primary span {
		margin-left: 0;
	}

	.text-wrap--2 {
		letter-spacing: 56px;
		margin-right: -56px;
	}

	.text-wrap--3 {
		letter-spacing: 21px;
		margin-right: -21px;
	}

	.text-wrap--4 {
		letter-spacing: 9.33333px;
		margin-right: -9.33333px;
	}

	.text-wrap--5 {
		letter-spacing: 3.5px;
		margin-right: -3.5px;
	}
</style>
