/**
 * 云平台--财务管理
 * 01 商户账户单列表
 * 02 结算对象管理
 * 03 收款单列表
 * 04 付款单列表
 * 05 退款记录
 * 06 银行账户管理
 *
 * 云平台--支付管理
 * a 渠道费率管理
 * b 计费明细
 * c 账户信息
 *
 * 阅商机--财务管理
 * d 收款单列表
 * e 付款单列表
 * f 退款记录
 */
import validator from '../unit/validator.js'
//01商户账户单列表
export const merchantList = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '商户账户单列表 ',
    }],
    tableColumns: [{
        text: '序号',
        dataIndex: 'number',
        width:'80',
        align:'center'
    },{
        text: '商户名称',
        dataIndex: 'name',
        width:'180',
        align:'center'
    },{
        text: '金额（元）',
        dataIndex: 'allAmountShow',
        width:'180',
        align:'right'
    },{
        text: '冻结金额（元）',
        dataIndex: 'frozenAmountShow',
        width:'220',
        align:'right'
    },{
        text: '结算周期',
        dataIndex: 'periodShow',
        align:'center'
    }],
}

//01商户账户明细
export const merchantDetail = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '账户收支明细 ',
    }, {
        title: '资金明细 ',
    }],
    tableColumnsFund:[{
        text: '交易时间',
        dataIndex: 'createdTime',
        align:'center'
    },{
        text: '订单号',
        dataIndex: 'orderId',

        align:'center'
    },{
        text: '流水号',
        dataIndex: 'thirdOrderId',

        align:'center'
    },{
        text: '交易类型',
        dataIndex: 'tradeTypeName',

        align:'center'
    },{
        text: '收入（元）',
        dataIndex: 'enterAmountValue',
        // width:180,
        align:'right'
    },{
        text: '冻结金额（元）',
        dataIndex: 'frozenAmountValue',
        // width:160,
        align:'right'
    },{
        text: '支出（元）',
        dataIndex: 'exitAmountValue',
        // width:160,
        align:'right'
    },{
        text: '账户余额（元）',
        dataIndex: 'balanceValue',
        align:'right'
    }],
    tableColumnsRecharge:[{
        text: '充值时间',
        dataIndex: 'createdTime',
        align:'center'
    },{
        text: '订单号',
        dataIndex: 'orderId',
        align:'center'
    },{
        text: '流水号',
        dataIndex: 'thirdOrderId',
        align:'center'
    },{
        text: '交易类型',
        dataIndex: 'tradeTypeName',
        align:'center'
    },{
        text: '充值金额（元）',
        dataIndex: 'amountValue',
        align:'right'
    },{
        text: '到账金额（元）',
        dataIndex: 'actualAmountValue',
        align:'right'
    },{
        text: '状态',
        dataIndex: 'stateName',
        align:'center'
    },{
        text: '充值银行',
        dataIndex: 'parentBankName',
        align:'center'
    }],
    tableColumnsWithdraw:[{
        text: '提现时间',
        dataIndex: 'createdTime',
        align:'center'
    },{
        text: '订单号',
        dataIndex: 'orderId',
        align:'center'
    },{
        text: '流水号',
        dataIndex: 'thirdOrderId',
        align:'center'
    },{
        text: '交易类型',
        dataIndex: 'tradeTypeName',
        align:'center'
    },
    /*{
        text: '科目',
        dataIndex: 'fundTypeName',
        align:'center'
    },*/
    {
        text: '提现金额（元）',
        dataIndex: 'amountValue',
        align:'right'
    },{
        text: '到账金额（元）',
        dataIndex: 'actualAmountValue',
        align:'right'
    },{
        text: '状态',
        dataIndex: 'stateName',
        align:'center'
    },{
        text: '提现银行',
        dataIndex: 'bank',
        align:'center'
    },{
        text:'银行账号',
        dataIndex: 'bankAccountNo',
        align:'center'
    }],
    tableColumnsFeeIncome:[{
        text: '时间',
        dataIndex: 'applyTime',
        align:'center'
    },{
        text: '订单号',
        dataIndex: 'settOrderNo',
        align:'center'
    },{
        text: '流水号',
        dataIndex: 'tradeNo',
        align:'center'
    },{
        text: '交易类型',
        dataIndex: 'settTypeName',
        align:'center'
    },{
        text: '提现金额（元）',
        dataIndex: 'amt',
        align:'center'
    },{
        text: '收入（元）',
        dataIndex: 'settFee',
        align:'center'
    }],
    valueTypeList: [{
        value: 'PayEnter',
        label: '订单支付'
    }, {
        value: 'Recharge',
        label: '充值'
    }, {
        value: 'Extract',
        label: '提现'
    }, {
        value: 'Refund',
        label: '退款成功'
    }, {
        value: 'RefundFailedConsume',
        label: '退款失败'
    }],
}
//02结算对象管理
export const settlementList = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '结算对象管理 ',
    }],
    crumbsAdd: [{
        title: '财务管理',
    }, {
        title: '结算对象管理',
    },{
        title: '编辑',
    }],
    crumbsDetail: [{
        title: '财务管理',
    }, {
        title: '结算对象管理',
    },{
        title: '详情',
    }],
    tableColumns: [{
        text: '序号',
        dataIndex: 'number',
        width:60
    },{
        text: '结算对象名称',
        dataIndex: 'name'
    },{
        text: '结算对象类型',
        dataIndex: 'typeShow'
    },{
        text: '是否有效',
        dataIndex: 'validShow'
    },{
        text: '最近修改时间',
        dataIndex: 'updatedTimeShow'
    },{
        text: '生效时间',
        dataIndex: 'validTimeShow'
    },{
        text: '结算周期',
        dataIndex: 'periodShow'
    }],
    rules: {
        name: [
            { required: true, message: '请填写结算对象名称', trigger: 'blur, change' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur, change' }
        ],
        type:[
            { required: true, message: '请选择结算对象类型', trigger: 'blur, change' }
        ],
        rule:[
            { required: true, message: '请选择结算规则组', trigger: 'blur, change' }
        ],
        validShow:[
            { required: true, message: '请选择是否有效', trigger: 'blur, change' }
        ],
        valid:[
            { required: true, message: '请选择是否有效', trigger: 'blur, change' }
        ],
        period:[
            { required: true, message: '请选择结算周期', trigger: 'blur, change' }
        ],
    }
}


//03 收款单列表进度状态
var state = [
    {
        value:'AgentCheck',
        label:'待商户审核',
    },
    {
        value:'AgentPass',
        label:'商户审核通过',
    },
    {
        value:'CloudCheck',
        label:'待平台审核',
    },
    {
        value:'CloudPass',
        label:'平台审核通过',
    },
    {
        value:'Completed',
        label:'已完成',
    },
];
//03 收款单列表
export const receiptList = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '收款单列表 ',
    }],
    tableColumns:[{
        text: '收款单编号',
        dataIndex: 'settlementId',
        width:165
    },{
        text: '结算对象名称',
        dataIndex: 'accountName'
    },{
        text: '结算单生成时间',
        dataIndex: 'createdTime'
    },{
        text: '款项类别',
        dataIndex: 'fundsTypeName'
    },{
        text: '结算周期',
        dataIndex: 'payModeName'
    },{
        text: '结算周期开始时间',
        dataIndex: 'startTime'
    },{
        text: '结算周期结束时间',
        dataIndex: 'endTime'
    },{
        text: '本期应收（元）',
        dataIndex: 'totalAmountValue'
    }
    // ,{
    //     text: '进度状态',
    //     dataIndex: 'stateName'
    // }
    ],

    // AgentCheck(11, "待审核[代理商]"), // 行销商品 云平台审核通过之后 进入代理商待审核
    // AgentRefuse(12, "未通过[代理商]"), // 审核不同意[代理商]
    // CloudCheck(13, "待审核[云平台]"), // [云平台]
    // CloudRefuse(14, "未通过[云平台]"), // 审核不同意[云平台]
    // CloudPass(18, "审核通过[云平台]"),
    // AgentPass(19, "审核通过[代理商]"),
    // Completed(36, "已完成")
    // 状态对应的索引
    stateIndex: {
        AgentCheck: 0,
        AgentPass: 1,
        AgentRefuse: 1,
        CloudCheck: 2,
        CloudPass: 3,
        CloudRefuse: 3,
        Completed: 4,
    },
    stateList: {
        AgentCheck: state,
        AgentPass: state,
        CloudCheck: state,
        CloudPass: state,
        Completed: state,
        AgentRefuse: [
            {
                value:'AgentCheck',
                label:'待商户审核',
            },
            {
                value:'AgentRefuse',
                label:'商户审核拒绝',
            },
            {
                value:'CloudCheck',
                label:'待平台审核',
            },
            {
                value:'CloudPass',
                label:'平台审核通过',
            },
            {
                value:'Completed',
                label:'已完成',
            },
        ],
        CloudRefuse: [
            {
                value:'AgentCheck',
                label:'待商户审核',
            },
            {
                value:'AgentPass',
                label:'商户审核通过',
            },
            {
                value:'CloudCheck',
                label:'待平台审核',
            },
            {
                value:'CloudRefuse',
                label:'平台审核拒绝',
            },
            {
                value:'Completed',
                label:'已完成',
            },
        ],
    }
}
//03 收款单列表--详情
export const receiptDetail = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '收款单列表 ',
    }, {
        title: '收款单详情 ',
    }],
    tableColumns:[{
        text: '订单号',
        dataIndex: 'orderId'
    },{
        text: '下单时间',
        dataIndex: 'orderTime'
    },{
        text: '店铺名',
        dataIndex: 'shopName'
    },{
        text: '分支机构',
        dataIndex: 'organName'
    },{
        text: '买家',
        dataIndex: 'payerName'
    },{
        text: '订单实付金额（元）',
        dataIndex: 'actualAmountValue'
    }]
}
//04 付款单列表
export const paymentList = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '付款单列表 ',
    }],
    tableColumns:[{
        text: '付款单编号',
        dataIndex: 'settlementId',
        width:165
    },{
        text: '结算对象名称',
        dataIndex: 'accountName'
    },{
        text: '结算单生成时间',
        dataIndex: 'createdTime'
    },{
        text: '款项类别',
        dataIndex: 'fundsTypeName'
    },{
        text: '结算周期',
        dataIndex: 'payModeName'
    },{
        text: '结算周期开始时间',
        dataIndex: 'startTime'
    },{
        text: '结算周期结束时间',
        dataIndex: 'endTime'
    },{
        text: '本期应付（元）',
        dataIndex: 'totalAmountValue'
    },{
        text: '进度状态',
        dataIndex: 'stateName'
    }]
}
//03 付款单列表--详情
export const paymentDetail = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '付款单列表 ',
    }, {
        title: '付款单详情 ',
    }],
    tableColumns:[{
        text: '订单号',
        dataIndex: 'orderId'
    },{
        text: '退款申请时间',
        dataIndex: 'applicationTime'
    },{
        text: '店铺名',
        dataIndex: 'shopName'
    },{
        text: '分支机构',
        dataIndex: 'organName'
    },{
        text: '买家',
        dataIndex: 'payerName'
    },{
        text: '退款总金额（元）',
        dataIndex: 'refundAmountValue'
    }]
}
//05 退款记录
export const refundList = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '退款记录 ',
    }],
    tableColumns:[{
        text: '退款申请时间',
        dataIndex: 'applicationTime',
        align:'center'
    },{
        text: '退款成功时间',
        dataIndex: 'refundTime',
        align:'center'
    },{
        text: '商家同意退款时间',
        dataIndex: 'createdTime',
        align:'center'
    },{
        text: '订单号',
        dataIndex: 'orderId',
        align:'center'
    },{
        text: '流水号',
        dataIndex: 'thirdOrderId',
        align:'center'
    },{
        text: '退款金额（元）',
        dataIndex: 'refundAmountValue',
        width:130,
        align:'right'
    },{
        text: '退款路径',
        dataIndex: 'payTypeName',
        align:'center'
    },{
        text: '状态',
        dataIndex: 'stateName',
        align:'center'
    },{
        text: '商户名称',
        dataIndex: 'merchantName',
        align:'center'
    }],

}
// 06 银行账户管理
export const bankList = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '商户信息管理 ',
    }],
    crumbsInfo: [{
        title: '财务管理',
    }, {
        title: '商户信息管理 ',
    },{
        title: '编辑',
    }],
    tableColumns:[{
        text: '序号',
        dataIndex: 'number',
        width:60
    },{
        text: '开户行',
        dataIndex: 'parentBankName'
    },{
        text: '银行账号',
        dataIndex: 'accountNo'
    },{
        text: '收款人名称',
        dataIndex: 'accountName'
    },{
        text: '账号类型',
        dataIndex: 'typeShow'
    },{
        text: '结算对象',
        dataIndex: 'name'
    }],
    rules: {
        name:[
            { required: true, message: '请填写企业名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur, change' }
        ],
        license:[
            { required: true, message: '请填写营业执照', trigger: 'blur, change' },
        ],
        organizationCode:[
            { required: true, message: '请填写组织机构代码', trigger: 'blur, change' },
        ],
        legalName:[
            { required: true, message: '请填写法人姓名', trigger: 'blur, change' },
            { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur, change' }
        ],
        identityType:[
            { required: true, message: '请填写法人证件类型', trigger: 'blur, change' },
        ],
        identityCode:[
            { required: true, message: '请填写法人证件号码', trigger: 'blur, change' },
            {validator: validator.valid_IDcard, trigger: 'blur'}
        ],
        Passport:[
            { required: true, message: '请填写法人护照号码', trigger: 'blur, change' }
        ],
        legalPhone:[
            { required: true, message: '请填写法人手机号码', trigger: 'blur, change' },
            { validator: validator.validMobile, trigger: 'blur, change'}
        ],
        parentBankName: [
            { required: true, message: '请填写开户行', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur, change' }
        ],
        bankName: [
            { required: true, message: '请填写开户支行', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur, change' }
        ],
        accountName:[
            { required: true, message: '请填写收款人名称', trigger: 'blur, change' }
        ],
        accountNo:[
            { required: true, message: '请填写银行账户', trigger: 'blur, change' }
        ],
        merchantSid:[
            { required: true, message: '请选择对象编号', trigger: 'blur, change' }
        ],
        settlementObjectSid:[
            { required: true, message: '请选择结算对象', trigger: 'blur, change' }
        ],
        settlementObjectName:[
            { required: true, message: '请选择结算对象', trigger: 'blur, change' }
        ]

    }
}
// a 渠道费率管理
export const rateList = {
    crumbs: [{
        title: '支付管理',
    }, {
        title: '渠道费率管理 ',
    }],
    crumbsInfo: [{
        title: '支付管理',
    }, {
        title: '渠道费率管理 ',
    },{
        title: '编辑',
    }],
    tableColumns:[{
        text: '费率编号',
        dataIndex: 'number'
    },{
        text: '费率名称',
        dataIndex: 'name'
    },{
        text: '付费方',
        dataIndex: 'payObjectName'
    },{
        text: '收费方',
        dataIndex: 'chargeTypeName'
    },{
        text: '固定费率',
        dataIndex: 'rateValue'
    },{
        text: '支付渠道',
        dataIndex: 'payChannelName'
    },{
        text: '订单类型',
        dataIndex: 'orderGenreName'
    },{
        text: '开始日期',
        dataIndex: 'startTime'
    },{
        text: '结束日期',
        dataIndex: 'endTime'
    },{
        text: '创建人',
        dataIndex: 'operatorName'
    },{
        text: '创建日期',
        dataIndex: 'createdTime'
    }],
    rules: {
        number:[
            { required: true, message: '请填写费率编号', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur, change' }
        ],
        name:[
            { required: true, message: '请填写费率名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur, change' }
        ],
        payObjectSid:[
            { required: true, message: '请选择付费方', trigger: 'blur, change' },
        ],
        payObjectName:[
            { required: true, message: '请选择付费方', trigger: 'blur, change' },
        ],
        chargeType:[
            { required: true, message: '请选择收费方', trigger: 'blur, change' },
        ],
        rate:[
            { required: true, message: '请填写费率或金额', trigger: 'blur, change' },
            { validator: validator.rate_number(0.01,100),trigger: 'blur, change'},
            { validator: validator.validMoney,message: '请输入0.01到100的数字(保留两位小数)', trigger: 'blur, change'},
        ],
        money:[
            { required: true, message: '请填写费率或金额', trigger: 'blur, change' },
            { validator: validator.validMoney, trigger: 'blur, change'},
        ],
        payChannel:[
            { required: true, message: '请选择支付渠道', trigger: 'blur, change' },
        ],
        orderGenre:[
            { required: true, message: '请选择订单类型', trigger: 'blur, change' },
        ],
        createTime:[
            { required: true, type: 'array', message: '请选择收费日期', trigger: 'blur' },
            { validator: validator.chooseDate,trigger: 'blur, change'},
        ],

    }
}
//b 计费明细
export const billingList = {
    crumbs: [{
        title: '支付管理',
    }, {
        title: '计费明细 ',
    }],
    tableColumns:[{
        text: '序号',
        dataIndex: 'number',
        width:80,
        align:'center'
    },{
        text: '支付订单号',
        dataIndex: 'sysOrderId',
        width:120,
        align:'center'
    },{
        text: '订单金额',
        dataIndex: 'amountValue',
        width:120,
        align:'right'
    },{
        text: '交易金额',
        dataIndex: 'actualAmountValue',
        width:120,
        align:'right'
    },{
        text: '商户费率',
        dataIndex: 'rateValue',
        align:'center'
    },{
        text: '支付方式',
        dataIndex: 'payTypeName',
        align:'center'
    },{
        text: '交易类型',
        dataIndex: 'dealTypeName',
        align:'center'
    },{
        text: '手续费（元）',
        dataIndex: 'serviceAmountValue',
        align:'center'
    },{
        text: '商户订单号',
        dataIndex: 'orderId',
        align:'center'
    },{
        text: '商户订单金额',
        dataIndex: 'orderAmountValue',
        width:120,
        align:'right'
    },{
        text: '支付时间',
        dataIndex: 'payTime',
        align:'center'
    },{
        text: '计费时间',
        dataIndex: 'billingTime',
        align:'center'
    },{
        text: '付费方',
        dataIndex: 'accountName',
        align:'center'
    },{
        text: '订单类型',
        dataIndex: 'orderGenreName',
        align:'center'
    }],
}
/**
 *
 * 阅商机
 * */
//阅商机--账户总览
export const balanceList = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '账户总览 ',
    }],
    rules:{
        amount: [
            { required: true, message: '请填写充值金额', trigger: 'blur, change' },
            { validator: validator.validMoney, trigger: 'blur, change'},
        ],
        bank: [
            { required: true, message: '请选择充值银行', trigger: 'blur, change' },
        ],
        money:[
            { required: true, message: '请填写金额', trigger: 'blur, change' },
            { validator: validator.validMoney, trigger: 'blur, change'}
        ],
        password:[
            { required: true, message: '请填写密码', trigger: 'blur, change' },
        ],
        verificationCode:[
            { required: true, message: '请填写验证码', trigger: 'blur, change' },
        ]
    }
}
//c 账户信息--交易密码
// 定义一个接收this的变量
let _this = null;
// 获取页面回调this
export const getThis = (th) => {
    _this = th;
}
// 验证密码是否相等
const isPasswordEqual = (rule, value, callback) => {
    if(value !== _this.formTrade.password) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback();
    }
}
export const passwordSet = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '账户信息',
    }],
    rules:{
        oldPassword:[
            {min: 6, max: 20, message: '交易密码长度6~20位'},
            {required: true, message: '请输入原交易密码，若首次设置可随便输入', trigger: 'blur, change' }

        ],
        password: [
            {required: true, message: '请输入新密码'},
            {min: 6, max: 20, message: '密码长度6~20位'}
        ],
        repassword: [
            {required: true, message: '请再次输入新密码'},
            {validator: isPasswordEqual, trigger: 'blur'}
        ],
    }
}
// 阅商机--收款单列表
export const receiptListM = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '收款单列表 ',
    }],
    tableColumns:[{
        text: '收款单编号',
        dataIndex: 'settlementId',
        width:165
    },{
        text: '结算单生成时间',
        dataIndex: 'createdTime'
    },{
        text: '款项类别',
        dataIndex: 'fundsTypeName'
    },{
        text: '结算周期',
        dataIndex: 'payModeName'
    },{
        text: '结算周期开始时间',
        dataIndex: 'startTime'
    },{
        text: '结算周期结束时间',
        dataIndex: 'endTime'
    },{
        text: '本期应收（元）',
        dataIndex: 'totalAmountValue'
    }
    // ,{
    //     text: '进度状态',
    //     dataIndex: 'stateName'
    // }
    ]
}
//阅商机--付款单列表
export const paymentListM = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '付款单列表 ',
    }],
    tableColumns:[{
        text: '付款单编号',
        dataIndex: 'settlementId',
        width:165
    },{
        text: '结算单生成时间',
        dataIndex: 'createdTime'
    },{
        text: '款项类别',
        dataIndex: 'fundsTypeName'
    },{
        text: '结算周期',
        dataIndex: 'payModeName'
    },{
        text: '结算周期开始时间',
        dataIndex: 'startTime'
    },{
        text: '结算周期结束时间',
        dataIndex: 'endTime'
    },{
        text: '本期应付（元）',
        dataIndex: 'totalAmountValue'
    },{
        text: '进度状态',
        dataIndex: 'stateName'
    }]
}
//阅商机--退款记录
export const refundListM = {
    crumbs: [{
        title: '财务管理',
    }, {
        title: '退款记录 ',
    }],
    tableColumns:[{
        text: '退款申请时间',
        dataIndex: 'applicationTime',
        align:'center'
    },{
        text: '退款成功时间',
        dataIndex: 'refundTime',
        align:'center'
    },{
        text: '商家同意退款时间',
        dataIndex: 'createdTime',
        align:'center'
    },{
        text: '订单号',
        dataIndex: 'orderId',
        align:'center'
    },{
        text: '流水号',
        dataIndex: 'thirdOrderId',
        align:'center'
    },{
        text: '退款金额（元）',
        dataIndex: 'refundAmountValue',
        width:130,
        align:'right'
    },{
        text: '退款路径',
        dataIndex: 'payTypeName',
        align:'center'
    },{
        text: '状态',
        dataIndex: 'stateName',
        align:'center'
    }],

}
