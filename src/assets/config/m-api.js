import apiUrl from './api-url.js'
let [url, web, oldUrl] = apiUrl;

// const url = 'http://api.yanwei365.net:9001';				// api域名，或直接ip：http://192.168.0.201;
const url1 = 'http://192.168.0.234:6702';
// const url1 = 'http://192.168.0.201:80';
const zheng = 'http://192.168.0.199:8080';
const kuige = 'http://192.168.0.161:8081';
const litao = 'http://192.168.0.137:8080';
const guoge = 'http://192.168.0.109:8080';
const chuange = 'http://192.168.0.123:6702';
const huang = 'http://192.168.0.128:8080';
const fang = 'http://192.168.0.149:8081';
const postman = 'http://192.168.0.127:8080';
//const caiyi = 'http://192.168.0.181:8080';
const hong = 'http://123.56.14.7';
const zy = 'http://192.168.0.165:6501';
const yaozou = 'http://192.168.0.197:7501';

export default {
    oldUrl:			oldUrl,
    web:			web,
    url:			url,

    //-------- 老接口 --------
    login: 			url + '/security/login/business/',		// 登录
    logout:			url + '/security/logout',				// 登出
    password:		url + '/security/password/business/',	// 修改密码
    resource: 		url + '/resource/',						// 资源管理
    channel: 		url + '/channel/',						// 渠道管理
    role: 			url + '/role/',							// 角色管理
    brand: 			url + '/brand/mall/',					// 品牌管理
    category: 		url + '/category/mall/',				// 品类管理
    area: 			url + '/area/',							// 地区
    attachment: 	url + '/attachment/',					// 附件,'/attachment/cm/'接口可以带自定义参数上传
    user: 			url + '/user/',				         	// 用户
    check: 			url + '/user/business/check/',		    // 手机号是否重复
    merchant: 		url + '/merchant/',						// 商户管理
    attribute: 		url + '/attribute/',					// 规格管理
    supplier: 		url + '/merchant/channel/',				// 供应商
    chain:			url + '/area/chain/',					// 向上查找区域连
    navigation:		url + '/navigation/',					// 导航管理
    userLimit:		url + '/role/merchant/user/',			// 用户授权
    spu:			url + '/spu/',							// 发布自营商品基础信息
    sku:			url + '/sku/',							// 发布自营商品规格信息
    userAddress:	url + '/crm/address/all/',				// 用户地址查看
    banner:			url + '/banner/',						// 横幅管理
    merCate: 		url + '/merchant/category/',			// 自定义分组管理  （老）
    // merchantBrand:	url + '/merchant/brand/',         		// 为商家增加品牌
    merchantBrand:	url + '/merchant/biz/brand/',         		// 为商家增加品牌
    feedback:		url + '/feedback/',                 	// 用户反馈
    shop:		    url + '/merchant/shop/',           		// 商家店铺
    config:			url + '/config/',                   	// 系统配置
    order:			url + '/product/cloud/order/',			// 云平台订单管理
    sureTransport:	url + '/product/cloud/order/sureTransport/',	// 确认发货
    transport:      url + '/product/cloud/order/transport/',    // 修改物流单号
    bind:	        url + '/card/bind/',                    // 粉丝绑定
    fans:	        url + '/card/merchant/',                // 粉丝查询
    card:	        url + '/card/merchant/',                // 营销名片
    company:        url + '/shipping/cloud/company/',       // 物流公司
    shipping:       url + '/shipping/biz/template/',  // 运费模板
    address:        url + '/shipping/biz/address/',             // 运费模板


    //-------- web 接口 --------
    // 名片详情     /card/index.html#/web-share?sid=
    cardWebShare:   web + '/card/index.html#/web-share?sid=',
    // 物流查询     /shipping/index.html?company=&transportId=
    shippingWeb:    web + '/shipping/index.html',

    //-------- 新接口 --------

    // 用户登录/退出（分别用 post 和 delete 请求） /login/biz
    bizLogin: {
        url: url + '/login/biz',
        api_ver: ['1.0.0', '2.0.0', '1.0.0', '2.0.0']
    },
    // 修改密码         /user/change/password/(可选：{sid})
    // 重置用户密码      /user/change/password/{userSid}
    changePassword: {
        url: url + '/user/change/password/',
        api_ver: ['1.0.0', '1.0.0', '2.0.0', '1.0.0']
    },
    // 商家供应商关系（阅商机）（新）  /merchant/biz/relationship/{type}/{merchantSid}
    relationship: {
        url: url + '/merchant/biz/relationship/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 添加供应商(阅商机)（新）  /merchant/biz/relationship/{merchantCode}
    relationshipAdd: {
        url: url + '/merchant/biz/relationship/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 分组列表（阅商机）（新）  /shop/biz/category/{type}
    shopBizCate: {
        url: url + '/shop/biz/category/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 组织机构列表  /organ/{merchantSid}
    organ: {
        url: url + '/organ/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 下级机构（阅商机）  /organ/children/{merchantSid}/{code}
    // 不包含自己
    organChildren: {
        url: url + '/organ/children/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 上级机构（阅商机）  /organ/parent/{merchantSid}/{code}
    // 不包含自己
    organParent: {
        url: url + '/organ/parent/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 组织结构     /organ/{merchantSid}/{code}
    // 从顶级查到底，包含自己即对应父级，不包含兄弟级及不相关的父级
    organBiz:{
        url:url+'/organ/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 查询代理商店铺列表  /merchant/biz/shop/agent
    shopAgent: {
        url: url + '/merchant/biz/shop/agent',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 查询供应商店铺列表  /merchant/biz/shop/supplier
    shopSupplier: {
        url: url + '/merchant/biz/shop/supplier',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 发布征订商品基础信息   /spu/subscribe/
    spuSubscribe: {
        url: url + '/spu/subscribe/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 发布征订保存规格组合   /spu/subscribe/sku/save
    subscribeSkuSave: {
        url: url + '/spu/subscribe/sku/save',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 发布征订只上架   /spu/subscribe/online/{sid}
    subscribeOnline: {
        url: url + '/spu/subscribe/online/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 发布征订上架带保存规格组合   /spu/subscribe/onlinesave/{sid}
    subscribeOnlinesave: {
        url: url + '/spu/subscribe/onlinesave/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 征订下架   /spu/subscribe/outsell/{sid}
    subscribeOutsell: {
        url: url + '/spu/subscribe/outsell/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 征订退款金额   /spu/subscribe/refund/{sid}
    subscribeRefund: {
        url: url + '/spu/subscribe/refund/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 虚拟订单   /ticket/biz/order
    virtualOrder: {
        url: url + '/ticket/biz/order/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 多店铺   /merchant/biz/shop/{sid}
    moreShop: {
        url: url + '/merchant/biz/shop/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 会议列表   /ticket/biz/meeting
    ticketMeeting: {
        url: url + '/ticket/biz/meeting/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 可核销内勤人员名单   /ticket/biz/meeting
    checkNameList: {
        url: url + '/ticket/biz/meeting/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 订单搜索
    goodsNameSearch: {
        url: url + '/ticket/cloud/meeting/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 会议详情   /ticket/biz/meeting/{sid}
    ticketMeetingDetail: {
        url: url + '/ticket/biz/meeting/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 会议二维码   /ticket/biz/meeting/weChat/getCode/{sid}
    ticketMeetingCode: {
        url: url + '/ticket/biz/meeting/weChat/getCode/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 会议签到/核销表   /ticket/biz/coupon/{meetSid}
    ticketMeetingCoupon: {
        url: url + '/ticket/biz/coupon/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 会议外勤签到/核销表导出PDF   /ticket/biz/coupon/pdf/{meetSid}
    ticketMeetingCouponPdf: {
        url: url + '/ticket/biz/coupon/pdf/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 会议内勤签到/核销表导出PDF   /ticket/biz/coupon/inner/pdf/{sid}
    ticketMeetingCouponInnerPdf: {
        url: url + '/ticket/biz/coupon/inner/pdf/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 店铺详情   /merchant/biz/shop/detail
    merchantShopDetail: {
        url: url + '/merchant/biz/shop/detail',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 查看太平所有店铺   merchant/biz/shop/taiping
    merchantShopTp: {
        url: url + '/merchant/biz/shop/taiping',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 查看非太平店铺   /merchant/biz/shop/non-taiping
    merchantShopNTp: {
        url: url + '/merchant/biz/shop/non-taiping',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 查询运费模板列表   /shipping/biz/template/
    shippingTemplate: {
        url: url + '/shipping/biz/template/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 查询运费模板详情   /shipping/biz/template/{sid}
    shippingTemplateDetail: {
        url: url + '/shipping/biz/template/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 账户收支明细列表
    financialPlatform:{ //financial/biz/financial?pageIndex=0&pageSize=10
        url:url+'/financial/biz/financial',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 手续费收入           /web/user/sett/record/feeIncomeList
    financialfeeIncome: {
        url: url + '/wallet/web/user/sett/record/feeIncomeList/',
//      api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0'],
        api_ver: ['1.0.1', '1.0.1', '1.0.1', '1.0.1']
    },
    //提现记录列表    /financial/biz/financial/withdraws?pageIndex=0&pageSize=10
    financialWithdraws:{
        url:url+'/financial/biz/financial/withdraws',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //充值记录列表 /financial/cloud/financial/deposits
    financialDeposits:{
        url:url+'/financial/biz/financial/deposits',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //退款记录列表 /financial/biz/financial/refunds?pageIndex=0&pageSize=10
    financialRefunds:{
        url:url+'/financial/biz/financial/refunds',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //充值  /financial/biz/financial/deposit
    financialDeposit:{
        url:url+'/financial/biz/financial/deposit',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //账户概览  /financial/biz/financial/summary
    financialSummary:{
        url:url+'/financial/biz/financial/summary',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //提现申请(获取验证码)  /financial/biz/financial/withdraw/apply
    financialWithdrawApply:{
        url:url+'/financial/biz/financial/withdraw/apply',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //提现确认  /financial/biz/financial/withdraw/pay
    financialWithdrawPay:{
        url:url+'/financial/biz/financial/withdraw/pay',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //收款，付款结算单列表    /financial/biz/financial/settlements?Gathering(1, "收款"), Payment(2, "付款")
    financialSettlements:{
        url:url+'/financial/biz/financial/settlements',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //收款，付款结算单列表详情    /financial/biz/financial/settlement/{sid}
    financialSettlementsDetail:{
        url:url+'/financial/biz/financial/settlement/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //收款单详情列表   /financial/biz/financial/gatherings?settlementId=or111111&orderId=11111112
    financialGatherings:{
        url:url+'/financial/biz/financial/gatherings',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //付款单详情列表   /financial/biz/financial/payments?settlementId=or111112&orderId=111113
    financialPayments:{
        url:url+'/financial/biz/financial/payments',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //审核 /financial/biz/financial/settlement/audit/{sid}
    financialAudit:{
        url:url+'/financial/biz/financial/settlement/audit/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //银行列表   /financial/biz/financial/deposit/banks
    financialBanks:{
        url:url+'/financial/biz/financial/deposit/banks',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //交易密码  /user/change/cash-password
    cashPassword:{
        url:url+'/user/change/cash-password',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },

    // 显示所有店铺管理员   /user/manager?pageIndex=1&pageSize=10&q=
    // 注册管理员
    userManager: {
        url: url + '/user/manager/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 显示所有员工   /user/employee
    userEmployee: {
        url: url + '/user/employee',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 所有注册用户   /user/member
    userMember: {
        url: url + '/user/member',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 开启指定用户   /user/enable/{userSid}
    userEnable: {
        url: url + '/user/enable/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 禁用指定用户   /user/disable/{userSid}
    userDisable: {
        url: url + '/user/disable/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 查看隐藏的手机号   /user/privacy/{userSid}/mobile
    userPrivacyMobile: {
        url: url + '/user/privacy/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 资源管理（新）  /resource/{appType}
    newResource: {
        url: url + '/resource/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 检查(手机号, 登录名)是否重复   /user/duplicate/{type}/(mobile | login-name)
    userCheckRepeat: {
        url: url + '/user/duplicate/business/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    userProfile: {
        url: url + '/user/profile/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 激励方案           /misc/biz/inspire/(import/{sid})
    incentive: {
        // url: 'http://api.yanwei365.net:9001' + '/misc/biz/inspire/',
        url: url + '/misc/biz/inspire/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    signTable: {
        // url: 'http://api.yanwei365.net:9001' + '/misc/biz/inspire/sign/table/',
        url: url + '/misc/biz/inspire/sign/table/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    signTotal: {
        // url: 'http://api.yanwei365.net:9001' + '/misc/biz/inspire/sign/table/',
        url: url + '/misc/biz/inspire/sign/table/total/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    confirmSign: {
        // url: 'http://api.yanwei365.net:9001' + '/misc/biz/inspire/sign/genTable/',
        url: url + '/misc/biz/inspire/sign/genTable/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 修改管理员后刷新缓存     /role/biz/refresh
    roleRefresh: {
        url: url + '/role/biz/refresh',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 角色管理（增查）      /role/biz
    // 删改，详情           /role/biz/{sid}
    // 角色的权限     /role/biz/{sid}/perm
    // 角色的用户     /role/biz/{sid}/user
    // 角色加用户     /role/biz/{sid}/user
    // 用户的角色     /role/biz/user/{sid}
    // 用户设角色     /role/biz/user/{sid}
    // 角色设权限     /role/biz/{sid}/perm
    roleBiz: {
        url: url + '/role/biz/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 商家管理   /merchant/cloud/merchant
    newMerchant: {
        url: url + '/merchant/cloud/merchant/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 虚拟商品订单退款    /ticket/(cloud, biz)/order/refund
    ticketRefund: {
        url: url + '/ticket/biz/order/refund/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 促销管理     /merchanpromo/(list)
    merchantPromo: {
        url: url + '/merchanpromo/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },

    // 买家评价列表    /member/productComment/MyMerchantlist
    memberProComment: {
        url: url + '/member/productComment/MyMerchantlist',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 买家评价列表导出    /member/productComment/MyMerchantlistExcel
    memberProCommentExcel: {
        url: url + '/member/productComment/MyMerchantlistExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 买家评价回复    /member/commentReplay/product
    memberCommentReplayPro: {
        url: url + '/member/commentReplay/product',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 买家评价申诉    /member/appeal/product
    memberAppealPro: {
        url: url + '/member/appeal/product',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺评价列表    /member/shopComment/MerchantQuery
    memberShopCommentQuery: {
        url: url + '/member/shopComment/MerchantQuery',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺评价列表导出    /member/shopComment/MerchantQueryExcel
    memberShopCommentExcel: {
        url: url + '/member/shopComment/MerchantQueryExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺评价统计    /member/shopComment/statistic
    memberShopCommentStatistic: {
        url: url + '/member/shopComment/statistic',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺评价申诉    /member/appeal/shop
    memberAppealShop: {
        url: url + '/member/appeal/shop',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 根据积分计算抵扣金额    /member/score/getCalculateScore/{benefitId}
    memberCalcScore: {
        url: url + '/member/score/getCalculateScore/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 钱包
    // 商户单笔转账    /web/merchant/tramsfer/record/signalTramsfer
    singleTransfer: {
        url: url + '/wallet/web/merchant/tramsfer/record/signalTramsfer/',
//      api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0'],
        api_ver: ['1.0.1', '1.0.1', '1.0.1', '1.0.1']
    },
    // 商户批量转账    /web/merchant/tramsfer/record/batchTramsfer
    batchTransfer: {
        url: url + '/wallet/web/merchant/tramsfer/record/batchTramsfer/',
//      api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0'],
        api_ver: ['1.0.1', '1.0.1', '1.0.1', '1.0.1']
    },
    // 转账记录           /web/merchant/tramsfer/record/list
    walletTransfer: {
        url: url + '/wallet/web/merchant/tramsfer/record/list/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 转账记录
    walletTransferExport: {
        url: url + '/wallet/web/merchant/tramsfer/record/uploadExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 太平机构统计报表 /statis/organ/report/{type}， {type:ticket-会议,inspire-激励,subscribe-征订}
    statisOrganReport: {
        url: url + '/statis/organ/report/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 报表数据统计xls文件下载 /statis/organ/report/download/{type}， {type:ticket-会议,inspire-激励,subscribe-征订}
    statisOrganReportExportTicket: {
        url: url + '/statis/organ/report/download/ticket',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 报表数据统计xls文件下载 /statis/organ/report/download/{type}， {type:ticket-会议,inspire-激励,subscribe-征订}
    statisOrganReportExportInspire: {
        url: url + '/statis/organ/report/download/inspire',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 报表数据统计xls文件下载 /statis/organ/report/download/{type}， {type:ticket-会议,inspire-激励,subscribe-征订}
    statisOrganReportExportSubscribe: {
        url: url + '/statis/organ/report/download/subscribe',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    //有效公告
    validNotice:{
        url: url + '/merchant/biz/notice/available/list',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //历史公告
    historyNotice:{
        url: url + '/merchant/biz/notice/list',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //公告下载 {sid}
    noticeDownload:{
        url: url + '/merchant/biz/notice/download/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
}

/*
*
* 新API定义方式的使用方法
*
* 该使用方式的诞生前提 => 希望定义的 api_ver 能够自动携带到请求方式里
*
* 示例：this.$http.get([apiVarName, 'param1', 'param2', ...])
*
* 这里我们把请求方式第一个参数变成了数组（原本是字符串，直接接收API），
* 数组的第一位为API对象里面新接口的变量名，如果该接口需要拼接参数，
* 往数组后面依次添加，最终的处理方式是把数组依次拼接。
*
* 处理是在拦截器里面做的，通过传入的数组第一位，在API对象里面取到实际的API和对应版本号，
* 然后替换给请求方式的url参数，处理完成。
*
* 这里需要注意的是新老接口，老接口是直接传的字符串API，所以这里的判断方式是通过参数类型为数组和字符串来判断的
*
* */

/*
*
* 上传附件接口有以下这些类型
*     UserAvatar(11, "用户头像"),
*     CompanyLogo(12, "公司Logo"),
*     CompanyLicense(13, "营业执照"),
*     IdCard(15, "个人身份证"),
*
*     CategoryLogo(21, "品类Logo"),
*     BrandLogo(22, "品牌Logo"),
*
*     Product(31, "商品"),
*     ProductDetail(32, "商品详情"),
*     ProductSpec(33, "商品规格"),
*
*     Banner(41, "导航Banner"),
*     SalesReturn(51, "退货认证"),
*
*     ArticleCover(61, "文章封面图"),
*     ArticleContent(62, "文章内容图"),
*
*     NameCard(71, "名片"),
*
*     Other(99, "其它");
*
* */

