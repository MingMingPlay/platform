/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '积分管理',
}, {
    title: '积分使用列表',
}];

export const tableHeader = {
    mall: {
        createdTime: {
            label: '下单时间',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        orderNum: {
            label: '订单号',
        },
        shopName: {
            label: '归属商家',
            align: 'center'
        },
        productPrice: {
            label: '订单金额（元）',
            align: 'center'
        },
        scoreVal: {
            label: '使用积分数（分）',
            align: 'center'
        },
        scoreCurrey: {
            label: '使用积分金额（元）',
            align: 'center'
        },
        userName: {
            label: '用户名',
            align: 'center'
        },
    },
    content: {
        createTime: {
            label: '时间',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        type: {
            slot: 'type',
            label: '类型',
        },
        rewardNum: {
            label: '使用积分数（分）',
            align: 'center'
        },
        userName: {
            label: '用户名（打赏者）',
            align: 'center'
        },
        updateTime: {
            label: '积分使用日期',
            align: 'center'
        },
        expiryDate: {
            label: '积分过期日期',
            align: 'center'
        },
        toUserName: {
            label: '用户名（被打赏者）',
            align: 'center'
        },
    }
};
