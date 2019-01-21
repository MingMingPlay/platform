// 自营商品
export const orderSelf = {
	crumbs: [{
		title: '订单管理',
	}, {
		title: '自营商品订单',
	}],
	form: {
		orderId: null,
		userKeyword: null,
		/*createdTimeBegin: null,
		createdTimeEnd: null,*/
		merchantSid: null,
		state: 0,
		orderType: 'generally',
		pageIndex: 1,
		pageSize: 10,
	}
}
// 行销品订单
export const orderSpecial = {
	crumbs: [{
		title: '订单管理'
	}, {
		title: '行销品订单'
	}],
	form: {
		orderId: null,
		userKeyword: null,
		receiverPhone: null,
		/*createdTimeBegin: null,
		createdTimeEnd: null,*/
		merchantSid: null,
		agentSid: null,
		state: 0,
		orderType: 'special',
		pageIndex: 1,
		pageSize: 10,
	}
}
// 退款订单
export const orderRefund = {
	crumbs: [{
		title: '订单管理'
	}, {
		title: '退款订单'
	}],
	form: {
		orderId: null,
		userKeyword: null,
		/*createdTimeBegin: null,
		createdTimeEnd: null,*/
		receiverPhone: null,
		merchantSid: null,
		agentSid: null,
		state: 0,
		orderType: 'generally',
		pageIndex: 1,
		pageSize: 10,
	}
}

// order-detail.vue
export const orderDetail = {
	self_crumbs: [{
		title: '订单管理'
	}, {
		title: '自营商品订单',
		to: '/c_order/self'
	}, {
		title: '订单详情'
	}],
	special_crumbs: [{
    title: '订单管理'
  }, {
    title: '行销品订单',
    to: '/c_order/special'
  }, {
    title: '订单详情'
  }],
  refund_crumbs: [{
    title: '订单管理'
  }, {
    title: '退款订单',
    to: '/c_order/refund'
  }, {
    title: '订单详情'
  }],
	selfDeliveryInfoFirst: [{
		label: '买家姓名',
		prop: 'userName',
	}, {
		label: '买家手机',
		prop: 'userPhone',
	}, {
		label: '订单来源',
		prop: 'channelName',
	}, {
		label: '订单类型',
		prop: 'orderTypeName',
	}, {
		label: '商家名称',
		prop: 'merchantName',
	}, {
		label: '买家留言',
		prop: 'message',
	}, {
		label: '发票抬头',
		prop: 'invoiceTitle',
	}, {
		label: '发票内容',
		prop: 'invoiceContent',
	}, {
        label: '纳税人识别号',
        prop: 'invoiceTaxCode',
    }],
	deliveryInfoFirst: [{
		label: '买家姓名',
		prop: 'userName',
	}, {
		label: '买家手机',
		prop: 'userPhone',
	}, {
		label: '订单来源',
		prop: 'channelName',
	}, {
		label: '订单类型',
		prop: 'orderTypeName',
	}, {
		label: '商家名称',
		prop: 'merchantName',
	}, {
		label: '代理商',
		prop: 'agentName',
	}, {
		label: '供应商',
		prop: 'merchantName',
	}, {
		label: '买家留言',
		prop: 'message',
	}, {
		label: '发票抬头',
		prop: 'invoiceTitle',
	}, {
		label: '发票内容',
		prop: 'invoiceContent',
	}, {
        label: '纳税人识别号',
        prop: 'invoiceTaxCode',
    }],
	deliveryInfoSecond: [{
		label: '收货人',
		prop: 'name',
	}, {
		label: '收货人电话',
		prop: 'phone',
	}, {
		label: '收货地址',
		prop: 'fullAddress',
	}],
	deliveryInfoThird: [{
		label: '交易流水号',
		prop: 'paymentId',
	}, {
		label: '付款方式',
		prop: 'payChannelName',
	}, {
		label: '物流公司',
		prop: 'transportCompany',
	}, {
		label: '物流单号',
		prop: 'transportId',
	}],
	deliveryInfoFourth: [{
		label: '下单时间',
		prop: 0,
	}, {
		label: '付款时间',
		prop: 1,
	}, {
		label: '发货时间',
		prop: 2,
	}, {
		label: '完成时间',
		prop: 3,
	}, {
		label: '关闭时间',
		prop: 4,
	}],
	afterSaleInfo: [{
		label: '退款单号',
		prop: 'refundId',
	}, {
		label: '售后类型',
		prop: 'refundTypeName',
	}, {
		label: '货物状态',
		prop: 'goodsStatusName',
	}, {
		label: '退货原因',
		prop: 'content',
	}, {
		type: 'img',
		label: '退货图片',
		prop: ['pic1Url', 'pic2Url', 'pic3Url'],
	}, {
		label: '处理时间',
		prop: 'updatedTime',
	}, {
		label: '处理结果',
		prop: 'refundStateName',
	}, {
        label: '退款备注',
        prop: 'refundContent',
    }],
}