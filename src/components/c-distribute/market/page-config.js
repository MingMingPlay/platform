/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '分销管理',
}, {
    title: '分销市场',
}];

export const addCrumbs = [{
    title: '分销管理',
}, {
    title: '分销市场',
}, {
    title: '添加商品',
}];

export const detailCrumbs = [{
    title: '分销管理',
}, {
    title: '分销市场',
}, {
    title: '商品详情',
}];

export const tableHeader = {
    // 这一列是为了处理序号会被放到第一位的问题
    a: {
        width: 1
    },
    goods: {
        slot: 'goods',
        label: '商品',
    },
    categoryName: {
        label: '品类',
    },
    costPrice: {
        label: '供应商供货价',
    },
    authorCostPrice: {
        label: '作者供应价',
    },
    profitRatio: {
        slot: 'profitRatio',
        label: '分润比例'
    },
    inventory: {
        label: '库存',
    },
    merchantNumber: {
        label: '分销商',
    },
    createdTime: {
        label: '创建时间',
    },
};

export const addTableHeader = {
    goods: {
        slot: 'goods',
        label: '商品',
    },
    categoryName: {
        label: '品类',
    },
    costPrice: {
        label: '供应商供货价',
    },
};

export const attrTableHeader = {
    name: {
        label: '规格',
    },
    costPrice: {
        label: '供应商供货价',
    },
    authorCostPrice: {
        label: '作者供应价',
    },
    inventory: {
        label: '库存',
    },
};
