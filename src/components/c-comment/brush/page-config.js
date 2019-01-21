/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '评价管理',
}, {
    title: '评价刷单',
}];

export const detailCrumbs = [{
    title: '评价管理',
}, {
    title: '评价刷单',
}, {
    title: '新增刷单',
}];

export const tableHeader = {
    createTime: {
        label: '评价时间',
        labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding'
    },
    title: {
        label: '商品信息',
    },
    shopName: {
        label: '店铺名称',
        align: 'center'
    },
    productScore: {
        label: '商品评分',
        align: 'center',
        width: 90
    },
    serverScore: {
        label: '卖家服务态度',
        align: 'center',
        width: 120
    },
    sendScore: {
        label: '卖家发货速度',
        align: 'center',
        width: 120
    },
    logisticsScore: {
        label: '物流公司服务',
        align: 'center',
        width: 120
    },
    commentStatusName: {
        slot: 'state',
        label: '状态',
    },
};
