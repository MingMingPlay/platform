// 1、goods-self.vue
export const goodsMyself = {
	// 面包屑
	crumbs: [{
		title: '商品管理',
	}, {
		title: '自营商品',
	}],
	// 搜索表单对象
	form: {
		goodsInfo: '',
		goodsCate: '',
		startTime: '',
		endTime: '',
		goodsState: '',
		isMerchant: '',
		isBrand: '',
	},
	// 商品状态
	goodsStateOptions: [{
		lab: '全部',
		val: '0',
	}, {
		lab: '销售中',
		val: '1',
	}, {
		lab: '仓库中',
		val: '2',
	}, {
		lab: '待平台审核',
		val: '3',
	}, {
		lab: '待代理商审核',
		val: '4',
	}, {
		lab: '平台审核未通过',
		val: '5',
	}, {
		lab: '代理商审核未通过',
		val: '6',
	}],
	// 排序方式
	sortingWays: [{
		lab: '按库存排序',
		val: '1',
	}, {
		lab: '按价格排序',
		val: '2',
	}, {
		lab: '按销量排序',
		val: '3',
	}, {
		lab: '按浏览次数排序',
		val: '4',
	}, {
		lab: '按浏览人数排序',
		val: '5',
	}],
	// 表头
	tableHead: [{
		pro: 'stock',
		lab: '库存'
	}, {
		pro: 'price',
		lab: '价格'
	}, {
		pro: 'category',
		lab: '品类'
	}, {
		pro: 'brand',
		lab: '品牌'
	}, {
		pro: 'state',
		lab: '状态'
	}],
}

// 2、goods-xing.vue
export const goodsXing = {

}