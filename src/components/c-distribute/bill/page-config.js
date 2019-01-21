/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '分销管理',
}, {
    title: '账单管理',
}];

export const detailListCrumbs = [{
    title: '分销管理',
}, {
    title: '账单管理',
}, {
    title: '账单详情',
}];

export const tableHeader = {
    shopName: {
        label: '店铺名称',
        labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding'
    },
    billsMonth: {
        label: '账单月份',
    },
    period: {
        slot: 'period',
        label: '账单周期',
    },
    generateDate: {
        label: '账单生成时间',
    },
    payable: {
        slot: 'payable',
        label: '本期应付'
    },
    state: {
        slot: 'state',
        label: '状态',
    },
};

export const billState = {
    '1': '未结算',
    '2': '已结算',
};

export const detailTableHeader = {
    orderId: {
        label: '订单号',
        labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding'
    },
    orderDate: {
        label: '下单日期',
    },
    orderSum: {
        label: '订单金额（元）',
    },
    income: {
        label: '店铺收入（元）',
    },
};
