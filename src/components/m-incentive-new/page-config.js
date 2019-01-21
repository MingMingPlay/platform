/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '评价管理',
}, {
    title: '店铺评价列表',
}];

export const tableHeader = {
    shopName: {
        label: '被评店铺',
        labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding'
    },
    userName: {
        label: '评价人',
        align: 'center'
    },
    serverScore: {
        label: '卖家服务态度',
        align: 'center'
    },
    sendScore: {
        label: '卖家发货速度',
        align: 'center'
    },
    logisticsScore: {
        label: '物流公司服务',
        align: 'center'
    },
    orderNum: {
        label: '订单号',
        align: 'center'
    },
    createTime: {
        label: '评价时间',
        align: 'center'
    },
    commentStatusName: {
        slot: 'state',
        label: '状态',
    },
};
