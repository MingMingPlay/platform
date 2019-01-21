export const listCrumbs = [{
    title: '运营分析',
}, {
    title: '商品交易数据',
}];

// 每种类型的表格头
export const tableHeader = {
    organs: {
        organCode: {
            label: '机构编码',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding',
        },
        organName: {
            label: '机构名称',
        },
        totalAmountValue: {
            label: '订单总金额',
            align: 'right',
            sort: 'custom'
        },
        profitAmountValue: {
            label: '毛利润',
            align: 'right',
            sort: 'custom'
        },
        spuNumber: {
            label: '所售商品个数',
            align: 'center',
            sort: 'custom'
        },
        orderNumber: {
            label: '订单个数',
            align: 'center',
            sort: 'custom'
        },
        userNumber: {
            label: '购买人数',
            align: 'center',
            sort: 'custom'
        },
    },
    user: {
        userName: {
            label: '用户姓名',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding',
        },
        organCode: {
            label: '机构编码',
        },
        organName: {
            label: '机构名称',
        },
        totalAmountValue: {
            label: '订单总金额',
            align: 'right',
            sort: 'custom'
        },
        profitAmountValue: {
            label: '毛利润',
            align: 'right',
            sort: 'custom'
        },
        spuNumber: {
            label: '所买商品个数',
            align: 'center',
            sort: 'custom'
        },
        orderNumber: {
            label: '订单个数',
            align: 'center',
            sort: 'custom'
        },
    },
    category: {
        name: {
            label: '品类名称',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding',
        },
        totalAmountValue: {
            label: '订单总金额',
            align: 'right',
            sort: 'custom'
        },
        profitAmountValue: {
            label: '毛利润',
            align: 'right',
            sort: 'custom'
        },
        spuNumber: {
            label: '所买商品个数',
            align: 'center',
            sort: 'custom'
        },
    },
    shop: {
        name: {
            label: '店铺名称',
            labelClassName: 'first-col-no-padding',
            className: 'first-col-no-padding',
        },
        totalAmountValue: {
            label: '订单总金额',
            align: 'right',
            sort: 'custom'
        },
        profitAmountValue: {
            label: '毛利润',
            align: 'right',
            sort: 'custom'
        },
        spuNumber: {
            label: '所售商品个数',
            align: 'center',
            sort: 'custom'
        },
    },
};

// 每种类型的搜索form
// 初始化时间
let time = new Date();
let yesterday = time.setTime(time.getTime() - 3600 * 1000 * 24);
let yStr = new Date(yesterday).toLocaleDateString().replace(/\//g, '-');

export const searchForm = {
    organs: {
        orderField: '',
        order: '',
        startDay: yStr,
        endDay: yStr,
        organCode: '',
        orderType: 'Special',
    },
    user: {
        orderField: '',
        order: '',
        startDay: yStr,
        endDay: yStr,
        organCode: '',
        orderType: 'Special',
        userName: '',
    },
    category: {
        orderField: '',
        order: '',
        startDay: yStr,
        endDay: yStr,
        // General(1, "普通商品"), // Assist(2, "行销商品"),
        spuType: 'General',
    },
    shop: {
        orderField: '',
        order: '',
        startDay: yStr,
        endDay: yStr,
        // General(1, "普通商品"), // Assist(2, "行销商品"),
        spuType: 'General',
        // 招商专员
        leaseExecutive: '',
    },
};

// 每种类型需要展示的统计字段，为 true 就是需要展示的
export const totalFields = {
    organs: {
        // 订单总金额
        totalAmountValue: true,
        // 毛利润
        profitAmountValue: true,
        // 所售商品个数
        spuNumber: true,
        // 订单个数
        orderNumber: true,
        // 购买人数
        userNumber: true,
    },
    user: {
        // 订单总金额
        totalAmountValue: true,
        // 毛利润
        profitAmountValue: true,
        // 所售商品个数
        spuNumber: true,
        // 订单个数
        orderNumber: false,
        // 购买人数
        userNumber: false,
    },
    category: {
        // 订单总金额
        totalAmountValue: true,
        // 毛利润
        profitAmountValue: true,
        // 所售商品个数
        spuNumber: true,
        // 订单个数
        orderNumber: false,
        // 购买人数
        userNumber: false,
    },
    shop: {
        // 订单总金额
        totalAmountValue: true,
        // 毛利润
        profitAmountValue: true,
        // 所售商品个数
        spuNumber: true,
        // 订单个数
        orderNumber: false,
        // 购买人数
        userNumber: false,
    },
};

// 每种类型的 apiKey
export const allApiKey = {
    organs: {
        listApiKey: 'analyDealOrgan',
        totalApiKey: 'analyDealOrganTotal',
        excelApiKey: 'analyDealOrganExcel',
    },
    user: {
        listApiKey: 'analyDealUser',
        totalApiKey: 'analyDealUserTotal',
        excelApiKey: 'analyDealUserExcel',
    },
    category: {
        listApiKey: 'analyDealCategory',
        totalApiKey: 'analyDealCategoryTotal',
        excelApiKey: 'analyDealCategoryExcel',
    },
    shop: {
        listApiKey: 'analyDealShop',
        totalApiKey: 'analyDealShopTotal',
        excelApiKey: 'analyDealShopExcel',
    },
};
