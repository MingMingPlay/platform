/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '积分管理',
}, {
    title: '积分趋势图',
}];

export const tableHeader = {
    mall: {
        scoreDate: {
            label: '日期',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        scoreGrantCurrey: {
            label: '积分发放金额（元）',
            align: 'center'
        },
        scoreGrantProductCurrey: {
            label: '积分发放商品金额（元）',
            align: 'center'
        },
        scoreGrantRate: {
            slot: 'scoreGrantRate',
            label: '积分发放百分比',
        },
        scoreUseCurrey: {
            label: '积分使用金额（元）',
            align: 'center'
        },
        scoreUseOrderCurrey: {
            label: '积分使用订单金额（元）',
            align: 'center'
        },
        scoreUseRate: {
            slot: 'scoreUseRate',
            label: '积分使用百分比',
        },
    },
    content: {
        scoreDate: {
            label: '日期',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding'
        },
        articleNum: {
            label: '积分发放金额（元）',
            align: 'center'
        },
        scoreGrantCurrey: {
            label: '内容积分发放（元）',
            align: 'center'
        },
        scoreGrantRate: {
            slot: 'scoreGrantRate',
            label: '积分发放百分比',
        },
        scoreGrantRewardCurrey: {
            label: '积分打赏金额（元）',
            align: 'center'
        },
    }
};

export const chartType = {
    mall: [
        {
            prop: 'scoreGrantCurrey',
            label: '积分发放金额'
        },
        {
            prop: 'scoreGrantProductCurrey',
            label: '积分发放商品金额'
        },
        {
            prop: 'scoreUseCurrey',
            label: '积分使用金额'
        },
        {
            prop: 'scoreUseOrderCurrey',
            label: '积分使用订单金额'
        }
    ],
    content: [
        {
            prop: 'articleNum',
            label: '积分发放金额'
        },
        {
            prop: 'scoreGrantCurrey',
            label: '内容积分发放'
        },
        {
            prop: 'scoreGrantRewardCurrey',
            label: '积分打赏金额'
        }
    ]
};
