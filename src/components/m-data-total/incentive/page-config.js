/**
 * 当前模块页面配置
 */

export const listCrumbs = [{
    title: '数据统计',
}, {
    title: '激励',
}];

export const tableHeader = {
    organName: {
        label: '机构名称',
        button: true,
        labelClassName: 'first-col-no-padding',
        className: 'first-col-no-padding'
    },
    organID: {
        label: '机构ID',
        align: 'center'
    },
    inspireNumber: {
        label: '激励次数',
        align: 'center'
    },
    closedInspireNumber: {
        label: '已完结激励',
        align: 'center'
    },
    totalMoney: {
        label: '总金额（元）',
        align: 'center'
    }
};
