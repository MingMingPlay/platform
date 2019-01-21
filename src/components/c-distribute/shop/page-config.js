/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '分销管理',
}, {
    title: '分销店铺',
}];

export const goodsListCrumbs = [{
    title: '分销管理',
}, {
    title: '分销店铺',
}, {
    title: '店铺详情',
}];

export const tableHeader = {
    shopName: {
        slot: 'shopName',
        label: '店铺信息',
        labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding'
    },
    appTime: {
        label: '开店时间',
    },
    shopTypeName: {
        label: '店铺类型',
    },
    merchandiseSales: {
        label: '在售商品',
    },
    earnings: {
        label: '累计收益',
    },
};

export const goodsTableHeader = {
    goods: {
        slot: 'goods',
        label: '商品',
        labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding'
    },
    inventory: {
        label: '库存',
    },
    salesNumber: {
        label: '总销量',
    },
    createdTime: {
        label: '创建时间',
    },
};
