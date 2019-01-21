import apiUrl from './api-url.js'
let [url, web, oldUrl] = apiUrl;
// api_ver: [get, post, put, delete]；按这个顺序区分接口method的版本

const url1 = 'http://192.168.0.234:6702';				// api域名，或直接ip：http://192.168.0.201;
// const url1 = 'http://192.168.0.201:80';
const zheng = 'http://192.168.0.199:8080';
const kuige = 'http://192.168.0.161:8081';
const litao = 'http://192.168.0.137:8090';
const litao1 = 'http://192.168.0.137:8080';
const guoge = 'http://192.168.0.109:8080';
const chuange = 'http://192.168.0.123:6701';
const fang = 'http://192.168.0.148:8082';
const huang = 'http://192.168.0.127:6701';
const fang1 = 'http://192.168.0.148:6701';
const fang2 = 'http://192.168.0.149:8085';
const postman = 'http://192.168.0.127:8080';
const zy = 'http://192.168.0.165:8080';
const yaozou = 'http://192.168.0.197:7501';
const yangyux = 'http://192.168.0.154:8081';

export default {
    oldUrl:			oldUrl,
    web:			web,
    url:			url,

    //-------- 老接口 --------
    login: 			url + '/security/login/business/',		// 登录
    logout:			url + '/security/logout',				// 登出
    password:		url + '/security/password/business/',	// 修改密码
    sMobile:		url + '/security/mobile/',              // 发送验证码
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
    supplier: 		url + '/merchant/cloud/relationship/',		// 供应商
    chain:			url + '/area/chain/',					// 向上查找区域连
    navigation:		url + '/navigation/',					// 导航管理
    userLimit:		url + '/role/cloud/user/',				// 用户授权
    spu:			url + '/spu/',							// 发布自营商品基础信息
    sku:			url + '/sku/',							// 发布自营商品规格信息
    userAddress:	url + '/crm/address/all/',				// 用户地址查看
    banner:			url + '/banner/cloud/',				    // 横幅管理
    merCate: 		url + '/merchant/category/',			// 自定义分组管理
    merchantBrand:	url + '/merchant/brand/',         		// 为商家增加品牌
    feedback:		url + '/feedback/',                 	// 用户反馈
    shop:		    url + '/merchant/shop/',           		// 商家店铺
    config:			url + '/config/',                   	// 系统配置
    order:			url + '/product/cloud/order/',			// 云平台订单管理
    sureTransport:	url + '/product/order/sureTransport/',	// 确认发货
    cWalletUser:	url + '/cloud/wallet/user/',			// 用户钱包
    cWallet:	    url + '/cloud/wallet/',			        // 充值
    fans:           url + '/card/cloud/',                   // 粉丝查询
    card:           url + '/card/cloud/',                   // 营销名片
    shippingCompany:   url + '/shipping/cloud/company/',    // 物流公司维护
    shippingTrack:     url + '/shipping/cloud/track/',      // 物流公司维护
    invite_merchant:   url + '/message/cloud/invite/merchant/',    // 推荐商家


    //-------- web 接口 --------
    // 名片详情     /card/index.html#/web-share?sid=
    cardWebShare:   web + '/card/index.html#/web-share?sid=',
    // 物流查询     /shipping/index.html?company=&transportId=
    shippingWeb:    web + '/shipping/index.html',

    //-------- 新接口 --------

    // 用户登录/退出（分别用 post 和 delete 请求） /login/cloud
    cloudLogin: {
        url: url + '/login/cloud/',
        api_ver: ['1.0.0', '2.0.0', '1.0.0', '2.0.0']
    },
    // 修改密码 /user/change/password
    // 重置用户密码   /user/change/password/{userSid}
    changePassword: {
        url: url + '/user/change/password/',
        api_ver: ['1.0.0', '1.0.0', '2.0.0', '1.0.0']
    },
    // 多店铺管理列表（云平台） /merchant/cloud/shop
    merchantShop: {
        url: url + '/merchant/cloud/shop/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 非太平的店铺列表（云平台） /merchant/cloud/shop/non-taiping
    merchantShopNonTaiping: {
        url: url + '/merchant/biz/shop/non-taiping',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 发布征订商品基础信息   /spu/subscribe/
    spuSubscribe: {
        url: url + '/spu/subscribe/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 征订下架   /spu/subscribe/outsell/{sid}
    subscribeOutsell: {
        url: url + '/spu/subscribe/outsell/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 商家管理（云平台） /merchant/cloud/merchant
    newMerchant: {
        url: url + '/merchant/cloud/merchant/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 新增商家验证登录名 /user/duplicate/business/login-name
    businessLoginName: {
        url: url + '/user/duplicate/business/login-name',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 查询运费模板详情   /shipping/biz/template/{sid}
    shippingTemplateDetail: {
        url: url + '/shipping/biz/template/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 显示所有系统管理员   /user/system?pageIndex=1&pageSize=10&q=
    // 注册系统管理员
    userSystem: {
        url: url + '/user/system/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    userProfile: {
        url: url + '/user/profile/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 显示所有店铺管理员   /user/manager?pageIndex=1&pageSize=10&q=
    // 注册管理员
    userManager: {
        url: url + '/user/manager/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 所有注册用户   /user/member
    userMember: {
        url: url + '/user/member',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 显示所有除管理员外的用户   /user/all?pageIndex=1&pageSize=10&q=
    userAll: {
        url: url + '/user/all/',
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
    // 注册/修改管理员时验证登录名是否重复   /user/duplicate/business/login-name?name=admin&sid=xxx
    userDBLN: {
        url: url + '/user/duplicate/business/login-name',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 注册/修改普通用户时验证登录名是否重复   /user/duplicate/client/login-name?name=admin&sid=xxx
    userDCLN: {
        url: url + '/user/duplicate/client/login-name',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 注册/修改管理员时验证手机号是否重复   /user/duplicate/business/mobile?mobile=13700001111&sid=xxx
    userDBM: {
        url: url + '/user/duplicate/business/mobile',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 注册/修改普通用户时验证手机号是否重复   /user/duplicate/client/mobile?mobile=13700001111&sid=xxx
    userDCM: {
        url: url + '/user/duplicate/client/mobile',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 组织机构列表  /organ/{merchantSid}
    organ: {
        url: url + '/organ/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 导出商品  /spu/excel
    spuExcel: {
        url: url + '/spu/excel/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 检查(手机号, 登录名)是否重复   /user/duplicate/{type}/(mobile | login-name)
    userCheckRepeat: {
        url: url + '/user/duplicate/business/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 多店铺   /merchant/cloud/shop
    moreShop: {
        url: url + '/merchant/cloud/shop/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 配置商家品牌   /merchant/cloud/brand
    newMerchantBrand: {
        url: url + '/merchant/cloud/brand/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    //财务管理--start
    //添加企业账户
    accountAompany:{
        url:url+'/fund/cloud/account/company/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //商户账户列表  /fund/cloud/account/company/fund
    financialAccount:{
        url:url+'/fund/cloud/account/company/fund/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //账户收支明细列表  /financial/cloud/financial?pageSize=10
    financialPlatform:{
        url:url+'/financial/cloud/financial/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //提现记录列表    /financial/cloud/financial/withdraws?pageIndex=0&pageSize=10
    financialWithdraws:{
        url:url+'/financial/cloud/financial/withdraws/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //充值记录列表    /financial/cloud/financial/deposits
    financialDposits:{
        url:url+'/financial/cloud/financial/deposits/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //退款记录列表
    financialRefunds:{
        url:url+'/financial/cloud/financial/refunds/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //收款，付款结算单列表    /financial/cloud/financial/settlements?Gathering(1, "收款"), Payment(2, "付款")
    financialSettlements:{
        url:url+'/financial/cloud/financial/settlements/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //收款，付款结算单列表详情    /financial/cloud/financial/settlement/{sid}
    financialSettlementsDetail:{
        url:url+'/financial/cloud/financial/settlement/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //收款单详情列表   /financial/cloud/financial/gatherings?settlementId=or111111&orderId=11111112
    financialGatherings:{
        url:url+'/financial/cloud/financial/gatherings/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //付款单详情列表   /financial/cloud/financial/payments?settlementId=or111112&orderId=111113
    financialPayments:{
        url:url+'/financial/cloud/financial/payments/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //审核 /financial/cloud/financial/settlement/audit/{sid}
    financialAudit:{
        url:url+'/financial/cloud/financial/settlement/audit/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //费率列表   /financial/cloud/financial/rates
    financialRates:{
        url:url+'/financial/cloud/financial/rates/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //费率新增-修改   /financial/cloud/financial/rate/{sid} /financial/cloud/financial/rate/shut/{sid}
    financialRate:{
        url:url+'/financial/cloud/financial/rate/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //通过费率id查询费率修改日志 /financial/cloud/financial/rate/logs/{sid}
    financialRateLogs:{
        url:url+'/financial/cloud/financial/rate/logs/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //费率删除  /financial/cloud/financial/rate/shut/{sid}
    financialShut:{
        url:url+'/financial/cloud/financial/rate/shut/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //结算对象列表不分页 /financial/cloud/financial/settlement/object/all
    financialObject:{
        url:url+'/financial/cloud/financial/settlement/object/all/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //结算对象列表分页 /financial/cloud/financial/settlement/object?pageIndex=1&pageSize=10
    //添加结算对象    /带有参数
    financialObjectPage:{
        url:url+'/financial/cloud/financial/settlement/object/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //结算对象修改记录 : /financial/cloud/financial/settlement/object/logs/{settlementSid}
    financialObjectLogs:{
        url:url+'/financial/cloud/financial/settlement/object/logs/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //银行账户管理-分页查询   /fund/cloud/account/company
    accountCompany:{
        url:url+'/fund/cloud/account/company/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //银行账户管理-全部   /fund/cloud/account/company/all
    accountCompanyAll:{
        url:url+'/fund/cloud/account/company/all/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //银行账户明细   /fund/cloud/account/company/{merchantSid}
    accountCompanyDetail:{
        url:url+'/fund/cloud/account/company/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //计费明细   /financial/cloud/financial/billings
    financialBillings:{
        url:url+'/financial/cloud/financial/billings/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //计费明细-总手续费 /financial/cloud/financial/billings/sum
    financialBillingsSum:{
        url:url+'/financial/cloud/financial/billings/sum/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //财务管理--end
    // 资源管理（新）  /resource/{appType}
    newResource: {
        url: url + '/resource/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 修改管理员后刷新缓存     /role/cloud/refresh
    roleRefresh: {
        url: url + '/role/cloud/refresh',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 角色管理（增查）      /role/cloud
    // 删改，详情           /role/cloud/{sid}
    // 角色的权限     /role/cloud/{sid}/perm
    // 角色的用户     /role/cloud/{sid}/user
    // 角色加用户     /role/cloud/{sid}/user
    // 用户的角色     /role/cloud/user/{sid}
    // 用户设角色     /role/cloud/user/{sid}
    // 角色设权限     /role/cloud/{sid}/perm
    roleCloud: {
        url: url + '/role/cloud/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 组织机构交易数据统计列表     /analysis/cloud/deal/organs
    analyDealOrgan: {
        url: url + '/analysis/cloud/deal/organs',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 组织机构交易数据统计汇总     /analysis/cloud/deal/organ/total
    analyDealOrganTotal: {
        url: url + '/analysis/cloud/deal/organ/total',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 组织机构交易数据统计excel导出     /analysis/cloud/deal/organs/export
    analyDealOrganExcel: {
        url: url + '/analysis/cloud/deal/organs/export',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户交易数据统计列表     /analysis/cloud/deal/users
    analyDealUser: {
        url: url + '/analysis/cloud/deal/users',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户交易数据统计汇总     /analysis/cloud/deal/user/total
    analyDealUserTotal: {
        url: url + '/analysis/cloud/deal/user/total',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户交易统计数据excel导出     /analysis/cloud/deal/users/export
    analyDealUserExcel: {
        url: url + '/analysis/cloud/deal/users/export',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },

    // 店铺交易数据统计列表     /analysis/cloud/spu/shop/statistics
    analyDealShop: {
        url: url + '/analysis/cloud/spu/shop/statistics',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺交易数据统计汇总     /analysis/cloud/spu/shop/total
    analyDealShopTotal: {
        url: url + '/analysis/cloud/spu/shop/total',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺交易统计数据excel导出     /analysis/cloud/spu/shop/export
    analyDealShopExcel: {
        url: url + '/analysis/cloud/spu/shop/export',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 品类交易数据统计列表     /analysis/cloud/spu/category/statistics
    analyDealCategory: {
        url: url + '/analysis/cloud/spu/category/statistics',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 品类交易数据统计汇总     /analysis/cloud/spu/category/total
    analyDealCategoryTotal: {
        url: url + '/analysis/cloud/spu/category/total',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 品类交易统计数据excel导出     /analysis/cloud/spu/category/export
    analyDealCategoryExcel: {
        url: url + '/analysis/cloud/spu/category/export',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },

    // 虚拟订单   /ticket/cloud/order
    virtualOrder: {
        url: url + '/ticket/cloud/order/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 会议列表   /ticket/cloud/meeting
    ticketMeeting: {
        url: url + '/ticket/cloud/meeting',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 会议详情   /ticket/cloud/meeting/{sid}
    ticketMeetingDetail: {
        url: url + '/ticket/cloud/meeting/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 虚拟商品订单退款    /ticket/(cloud, biz)/order/refund
    ticketRefund: {
        url: url + '/ticket/cloud/order/refund/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    // 用户反馈(新)    /message/cloud/feedback/
    newFeedback: {
        url: url + '/message/cloud/feedback/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // (轮播|单图)广告    /banner/cloud/{normal, single}/
    newBanner: {
        url: url + '/banner/cloud/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 商城装修操作日志   /decorate/log/cloud/
    mallDecorateLog: {
        url: url + '/decorate/log/cloud/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 商城装修-推荐商品
    // 列表  /spu/cloud/navigation/index/
    recommendGoodsList: {
        url: url + '/spu/cloud/navigation/index/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 添加   /navigation/product/
    recommendGoods: {
        url: url + '/navigation/product/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },

    // 用户扩展（加等级和成长值）    /member/extend/batch
    memberExtendBatch: {
        url: url + '/member/extend/batch',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 我的商品收藏    /member/favorite/product/mylist/{sId}
    memberFavProduct: {
        url: url + '/member/favorite/product/mylist/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 我的文章收藏    /member/favorite/article/Mylist/{sId}
    memberFavArticle: {
        url: url + '/member/favorite/article/Mylist/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 买家评价列表    /member/productComment/Mylist
    memberProComment: {
        url: url + '/member/productComment/Mylist',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 买家评价列表导出    /member/productComment/exportExcel
    memberProCommentExcel: {
        url: url + '/member/productComment/exportExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 买家评价审核/删除    /member/audit/product
    memberAuditPro: {
        url: url + '/member/audit/product',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 买家评价审核批量    /member/audit/batchProduct
    memberAuditBatchPro: {
        url: url + '/member/audit/batchProduct',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺评价列表    /member/shopComment/query
    memberShopCommentQuery: {
        url: url + '/member/shopComment/query',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺评价列表导出    /member/shopComment/queryExcel
    memberShopCommentQueryExcel: {
        url: url + '/member/shopComment/queryExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 店铺评价审核/删除    /member/audit/shop
    memberAuditShop: {
        url: url + '/member/audit/shop',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 评价刷单    /member/productComment/brush
    memberProCommentBrush: {
        url: url + '/member/productComment/brush',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 评价刷单列表查询    /member/productComment/query
    memberProCommentQuery: {
        url: url + '/member/productComment/query',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 评价刷单列表导出    /member/productComment/queryExcel
    memberProCommentQueryExcel: {
        url: url + '/member/productComment/queryExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 评价刷单单个查询    /member/productComment/getBrushDetail/{id}
    memberProCommentDetail: {
        url: url + '/member/productComment/getBrushDetail/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 评价刷单删除    /member/productComment/{id}
    memberProCommentDel: {
        url: url + '/member/productComment/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 申诉列表    /member/appeal/query
    memberAppealQuery: {
        url: url + '/member/appeal/query',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 申诉列表导出    /member/appeal/queryExcel
    memberAppealQueryExcel: {
        url: url + '/member/appeal/queryExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 申诉审核    /member/appeal
    memberAppeal: {
        url: url + '/member/appeal',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分趋势图   /member/memberScoreHistory/static
    memberScoreHistoryStatic: {
        url: url + '/member/memberScoreHistory/static',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分趋势图导出   /member/memberScoreHistory/staticExcel
    memberScoreHistoryStaticExcel: {
        url: url + '/member/memberScoreHistory/staticExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分发放列表   /member/memberScoreHistory/query
    memberScoreHistory: {
        url: url + '/member/memberScoreHistory/query',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分发放列表导出   /member/memberScoreHistory/queryExcel
    memberScoreHistoryExcel: {
        url: url + '/member/memberScoreHistory/queryExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分账户列表   /member/extend/query
    memberExtendQuery: {
        url: url + '/member/extend/query',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分账户列表导出   /member/extend/queryExcel
    memberExtendQueryExcel: {
        url: url + '/member/extend/queryExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分使用列表   /member/score/getListUserScore
    memberScoreUse: {
        url: url + '/member/score/getListUserScore',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分使用列表导出   /member/score/getListUserScoreExcel
    memberScoreUseExcel: {
        url: url + '/member/score/getListUserScoreExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 积分设置查看   /member/memberBaseSettings
    memberBaseSettings: {
        url: url + '/member/memberBaseSettings',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 商家入住申请记录   /member/memberMerchantApply/query
    memberMerchantApplyQuery: {
        url: url + '/member/memberMerchantApply/query',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 商家入住申请审核/处理   /member/audit/merchant
    memberMerchantApply: {
        url: url + '/member/audit/merchant',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺列表（导航关联作家）
    authorList: {
        url: url + '/merchant/cloud/author/shop/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 钱包模块
    // 用户列表查询           /web/user/account/list
    walletUser: {
        url: url + '/wallet/web/user/account/list/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户银行列表           /web/user/bank/list
    walletBank: {
        url: url + '/wallet/web/user/bank/list/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户资金明细           /web/user/account/accDetail
    walletUserAccDetail: {
        url: url + '/wallet/web/user/account/accDetail/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 转账记录           /web/merchant/tramsfer/record/list
    walletTransfer: {
        url: url + '/wallet/web/merchant/tramsfer/record/list/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 充值记录           /web/user/recharge/record
    walletRecharge: {
        url: url + '/wallet/web/user/recharge/record/list/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 提现记录           /web/user/sett/record
    walletWithdraw: {
        url: url + '/wallet/web/user/sett/record/list/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 退款记录           /web/user/sett/record/realpayRefundList
    WalletRefundRecord: {
        url: url + '/wallet/web/user/sett/record/realpayRefundList/',
//      api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0'],
        api_ver: ['1.0.1', '1.0.1', '1.0.1', '1.0.1']
    },
    // 手续费收入           /web/user/sett/record/feeIncomeList
    feeIncomeList: {
        url: url + '/wallet/web/user/sett/record/feeIncomeList/',
//      api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0'],
        api_ver: ['1.0.1', '1.0.1', '1.0.1', '1.0.1']
    },
    // 审核用户提现           /web/user/sett/record/approve
    withdrawAudit: {
        url: url + '/wallet/web/user/sett/record/approve/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 平台费率列表           /web/bd/platform/fee/list
    rateSettingList: {
        url: url + '/wallet/web/bd/platform/fee/list/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 编辑平台费率           /web/bd/platform/fee/edit
    rateSettingEdit: {
        url: url + '/wallet/web/bd/platform/fee/edit/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 导出
    // 用户列表
    walletUserExport: {
        url: url + '/wallet/web/user/account/uploadExcel/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户账户资金明细
    walletUserAccDetailExport: {
        url: url + '/wallet/web/user/account/uploadExcelForAccDetail/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户银行列表
    walletBankExport: {
        url: url + '/wallet/web/user/bank/uploadExcel/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户充值记录
    walletRechargeExport: {
        url: url + '/wallet/web/user/recharge/record/uploadExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户提现记录
    walletWithdrawExport: {
        url: url + '/wallet/web/user/sett/record/uploadExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 用户退款记录
    walletRefundExport: {
        url: url + '/wallet/web/user/sett/record/uploadExcelForRealpayRefund',
//      api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0'],
        api_ver: ['1.0.1', '1.0.1', '1.0.1', '1.0.1']
    },
    // 转账记录
    walletTransferExport: {
        url: url + '/wallet/web/merchant/tramsfer/record/uploadExcel',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    /**
     * 作家店铺
     */
    // 作家店铺订单列表   /author/cloud/order
    authorOrder: {
        url: url + '/author/cloud/order',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺订单详情   /author/cloud/order/{sid}
    authorOrderDetail: {
        url: url + '/author/cloud/order/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺月结账单列表   /merchant/cloud/author/bill/list
    authorBillList: {
        url: url + '/merchant/cloud/author/bill/list',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺月结账单列表导出   /merchant/cloud/author/bill/excel/list
    authorBillListExcel: {
        url: url + '/merchant/cloud/author/bill/excel/list',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺月结账单详情   /merchant/cloud/author/bill/{sid}
    authorBillDetail: {
        url: url + '/merchant/cloud/author/bill/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺月结账单详情列表   /merchant/cloud/author/bill/details
    authorBillDetailList: {
        url: url + '/merchant/cloud/author/bill/details',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺月结账单详情列表导出   /merchant/cloud/author/bill/excel/details
    authorBillDetailListExcel: {
        url: url + '/merchant/cloud/author/bill/excel/details',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺月结账单确认结算   /merchant/cloud/author/bill/{sid}
    authorBillConfirm: {
        url: url + '/merchant/cloud/author/bill/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺列表   /merchant/cloud/author/shop
    authorShop: {
        url: url + '/merchant/cloud/author/shop',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺详情   /merchant/cloud/author/shop/{sid}
    authorShopDetail: {
        url: url + '/merchant/cloud/author/shop/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺商品列表   /spu/author/cloudshoplist/{sid}
    authorShopSpuList: {
        url: url + '/spu/author/cloudshoplist/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺未添加分销商品列表   /spu/author/nosalelist
    authorSpuNosalelist: {
        url: url + '/spu/author/nosalelist',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺添加分销商品   /spu/author/addspu
    authorSpuAdd: {
        url: url + '/spu/author/addspu',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺已添加分销商品列表   /spu/author/cloudlist
    authorSpuCloudlist: {
        url: url + '/spu/author/cloudlist',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺商品详情   /spu/author/merchant/{sid}
    authorSpuDetail: {
        url: url + '/spu/author/merchant/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺移除已添加的分销商品   /spu/author/removespu
    authorSpuRemove: {
        url: url + '/spu/author/removespu',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺批量修改供应价比例   /spu/author/updatepriceratio
    authorSpuPriceratio: {
        url: url + '/spu/author/updatepriceratio',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    // 作家店铺修改分润比例   /spu/author/updateprofitratio/{sid}
    authorSpuProfitratio: {
        url: url + '/spu/author/updateprofitratio/',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    },
    //公告列表
    noticeList: {
        url: url + '/merchant/cloud/notice/list',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //预览地址
    previewNotice:{
        url: url + '/merchant/cloud/notice/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //角色列表
    roleList:{
        url: url + '/role/cloud/role/biz/all',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //创建公告
    creatNotice:{
        url:url +'/merchant/cloud/notice',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //删除公告
    removeNotice:{
        url:url +'/merchant/cloud/notice/',
        api_ver: ['2.0.0', '2.0.0', '2.0.0', '2.0.0']
    },
    //附件上传接口
    fileUp:{
        url:url +'/attachment/Other',
        api_ver: ['1.0.0', '1.0.0', '1.0.0', '1.0.0']
    }
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
