/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '积分管理',
}, {
    title: '积分发放列表',
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
        code: {
            label: '商品编号',
        },
        merchantName: {
            label: '归属商家',
            align: 'center',
            width: 100
        },
        // 评价
        isDisplay: {
            slot: 'comment',
            label: '评价'
        },
        isDisplay1: {
            slot: 'comment1',
            label: '晒单'
        },
        sellingPrice: {
            label: '商品金额（元）',
            align: 'center',
            width: 120
        },
        scoreVal: {
            label: '发放积分数（分）',
            align: 'center'
        },
        userName: {
            label: '用户名',
            align: 'center'
        },
        createTime: {
            label: '积分发放日期'
        },
        expiryDate: {
            label: '积分过期日期'
        },
    },
    content: {
        createDate: {
            label: '时间',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        reasonName: {
            label: '类型',
            align: 'center'
        },
        scoreVal: {
            label: '发放积分数（分）',
            align: 'center'
        },
        userName: {
            label: '用户名',
            align: 'center'
        },
        createTime: {
            label: '积分发放日期',
            align: 'center'
        },
        expiryDate: {
            label: '积分过期日期',
            align: 'center'
        },
    }
};
