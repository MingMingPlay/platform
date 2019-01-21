export const common_detail__item = {
    block_first: [{
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
        prop: 'content',
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
    block_second: [{
        label: '收货人',
        prop: 'name',
    }, {
        label: '收货人电话',
        prop: 'phone',
    }, {
        label: '收货地址',
        prop: 'fullAddress',
    }],
    block_third: [
    /*{
        label: '交易流水号',
        prop: 'paymentId',
    }, {
        label: '付款方式',
        prop: 'payChannelName',
    }, */
    {
        label: '物流公司',
        prop: 'transportCompany',
    }, {
        type: 'btn',
        label: '物流单号',
        prop: 'transportId',
    }],
    block_fourth: [{
        label: '下单时间',
        prop: 'orderTime',
    }, {
        label: '付款时间',
        prop: 'payTime',
    }, {
        label: '发货时间',
        prop: 'deliverTime',
    }, {
        label: '完成时间',
        prop: 'completeTime',
    }, {
        label: '关闭时间',
        prop: 'closeTime',
    }]
}
export const self_detail__item = {}
export const special_detail__item = {
    block_first: [{
        label: '代理商',
        prop: 'agentName',
    }, {
        label: '供应商',
        prop: 'merchantName',
    }]
}
export const refund_detail__item = {
    block_first: [{
        label: '代理商',
        prop: 'agentName',
    }, {
        label: '供应商',
        prop: 'merchantName',
    }],
    block_fifth: [{
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
    }, {
        label: '退款单号',
        prop: 'refundId',
    }]
}
export const virtual_detail__item = {
    block_first: [{
        label: '买家姓名',
        prop: 'userName'
    }, {
        label: '买家手机',
        prop: 'mobile'
    }, {
        label: '订单来源',
        prop: 'channelName'
    }, {
        label: '订单类型',
        prop: 'orderTypeName'
    }, {
        label: '店铺名称',
        prop: 'shopName'
    }, {
        label: '买家留言',
        prop: 'content'
    }, {
        label: '发票抬头',
        prop: 'invoiceTitle'
    }, {
        label: '发票内容',
        prop: 'invoiceContent'
    }, {
        label: '纳税人识别号',
        prop: 'invoiceTaxCode'
    }],
    block_fifth: [{
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
    }, {
        label: '退款单号',
        prop: 'refundId',
    }]
}