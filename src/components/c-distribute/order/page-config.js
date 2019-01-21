/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '分销管理',
}, {
    title: '分销订单',
}];
export const detailCrumbs = [{
    title: '分销管理',
}, {
    title: '分销订单',
}, {
    title: '订单详情',
}];

export const orderCellHeader = {
    goods: {
        label: '商品',
        slot: 'goods'
    },
    spuCode: {
        label: '商品编号',
        align: 'center',
    },
    attrName: {
        label: '规格',
        align: 'center',
    },
    number: {
        label: '数量',
        align: 'center',
    },
    unitPrice: {
        label: '单价',
        align: 'center',
    },
    amount: {
        label: '小计',
        align: 'center',
    },
    state: {
        label: '状态',
        slot: 'state'
    },
    actualAmount: {
        label: '实付金额',
        slot: 'actualAmount',
    },
};

export const orderLogHeader = {
    createdTime: {
        label: '操作时间',
        align: 'center',
    },
    sourceName: {
        label: '操作人',
        align: 'center',
    },
    content: {
        label: '处理信息',
        align: 'center',
    },
    stateName: {
        label: '状态',
        align: 'center',
    },
};
