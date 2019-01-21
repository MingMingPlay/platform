import Login from '../components/c-login/login.vue'
import Index from '../components/c-index/index.vue'

// 钱包
//// 账户列表
const WalletAccountList = () => Promise.resolve(
    import( /* webpackChunkName: 'wallet-account__list' */ '@/components/c-wallet/account-list/list.vue'))
const WalletAccountDetail = () => Promise.resolve(
    import( /* webpackChunkName: 'wallet-account__detail' */ '@/components/c-wallet/account-list/detail.vue'))
//// 钱包记录（充值记录、提现记录等）
const DepositRecord = () => Promise.resolve(
    import( /* webpackChunkName: 'deposit-record' */ '@/components/c-wallet/wallet-record/deposits.vue'))
const WithdrawRecord = () => Promise.resolve(
    import( /* webpackChunkName: 'withdraw-record' */ '@/components/c-wallet/wallet-record/withdraws.vue'))
const WalletBankcard = () => Promise.resolve(
    import( /* webpackChunkName: 'wallet-bankcard' */ '@/components/c-wallet/wallet-record/bankcard.vue'))
const TransferRecord = () => Promise.resolve(
    import( /* webpackChunkName: 'transfer-record' */ '@/components/c-wallet/wallet-record/transfer.vue'))
const FundRecord = () => Promise.resolve(
    import( /* webpackChunkName: 'fund-record' */ '@/components/c-wallet/wallet-record/fund.vue'))
const WalletRefundRecord = () => Promise.resolve(
    import( /* webpackChunkName: 'wallet-refund__record' */ '@/components/c-wallet/wallet-record/refund.vue'))
const PoundageIncomeRecord = () => Promise.resolve(
    import( /* webpackChunkName: 'poundage-income__record' */ '@/components/c-wallet/wallet-record/poundage-income.vue'))
//// 支付管理
const ChannelRateList = () => Promise.resolve(
    import( /* webpackChunkName: 'channel-rate__list' */ '@/components/c-wallet/pay/channel-rate/list.vue'))
const ChannelRateInfo = () => Promise.resolve(
    import( /* webpackChunkName: 'channel-rate__info' */ '@/components/c-wallet/pay/channel-rate/info.vue'))
const ChannelRateDetail = () => Promise.resolve(
    import( /* webpackChunkName: 'channel-rate__detail' */ '@/components/c-wallet/pay/channel-rate/detail.vue'))
const PayBillDetail = () => Promise.resolve(
    import( /* webpackChunkName: 'pay-bill__detail' */ '@/components/c-wallet/pay/bill-detail.vue'))
const Poundage = () => Promise.resolve(
    import( /* webpackChunkName: 'poundage' */ '@/components/c-wallet/pay/poundage.vue'))


// 云平台路由对象
export default [{
		path: '/login',
		component: Login
	},
	{
		path: '/',
		component: Index,
		children: [
            // 云平台首页
			{
				path: '',
				component: f => require.ensure([], () => f(require('../components/c_cloud/home.vue')), 'c-home')
			},
            // 404页面
            {
                path: '/errorPage',
                component: f => require.ensure([], () => f(require('../components/404.vue')), 'error-page')
            },
			{
				path: '/c_mall/merchant',
				component: f => require.ensure([], () => f(require('../components/c_mall/merchant/merchant.vue')), 'c-mall-merchant')
			},
			{
				path: '/c_mall/merchant/info',
				component: f => require.ensure([], () => f(require('../components/c_mall/merchant/info.vue')), 'c-mall-merchant-info')
			},
			{
				path: '/c_mall/merchant/detail',
				component: f => require.ensure([], () => f(require('../components/c_mall/merchant/detail.vue')), 'c-mall-merchant-detail')
			},
			{
				path: '/c_mall/attribute',
				component: f => require.ensure([], () => f(require('../components/c_mall/attribute/attribute.vue')), 'c-mall-attribute')
			},
			{
				path: '/c_mall/category',
				component: f => require.ensure([], () => f(require('../components/c_mall/category/category.vue')), 'c-mall-category')
			},
			{
				path: '/c_mall/brand',
				component: f => require.ensure([], () => f(require('../components/c_mall/brand/brand.vue')), 'c-mall-brand')
			},
			{
				path: '/c_mall/shop',
				component: f => require.ensure([], () => f(require('../components/c_mall/shop/shop.vue')), 'c-mall-shop')
			},
			{
				path: '/c_mall/shop/account',
				component: f => require.ensure([], () => f(require('../components/c_mall/shop/account.vue')), 'c-mall-shop-account')
			},
			{
				path: '/c_order/self',
				component: f => require.ensure([], () => f(require('../components/c_order/self/self.2.0.vue')), 'c-order-self')
			},
			{
				path: '/c_order/self/detail',
				component: f => require.ensure([], () => f(require('../components/c_order/self/detail.2.0.vue')), 'c-order-self-detail')
			},
			{
				path: '/c_order/special',
				component: f => require.ensure([], () => f(require('../components/c_order/special/special.2.0.vue')), 'c-order-special')
			},
			{
				path: '/c_order/special/detail',
				component: f => require.ensure([], () => f(require('../components/c_order/special/detail.2.0.vue')), 'c-order-special-detail')
			},
			{
				path: '/c_order/refund',
				component: f => require.ensure([], () => f(require('../components/c_order/refund/refund.2.0.vue')), 'c-order-refund')
			},
			{
				path: '/c_order/refund/detail',
				component: f => require.ensure([], () => f(require('../components/c_order/refund/detail.2.0.vue')), 'c-order-refund-detail')
			},
			{
                path: '/c_order/refund/vdetail',
                component: f => require.ensure([], () => f(require('../components/c_order/refund/virtual-detail.vue')), 'c-order-refund-vdetail')
            },
			{
				path: '/c_order/payment',
				component: f => require.ensure([], () => f(require('../components/c_order/pay/pay.vue')), 'c-order-payment')
			},
            {
                path: '/c_order/virtual',
                component: f => require.ensure([], () => f(require('../components/c_order/virtual/virtual.vue')), 'c-order-virtual')
            },
            {
                path: '/c_order/virtual/detail',
                component: f => require.ensure([], () => f(require('../components/c_order/virtual/detail.vue')), 'c-order-virtual-detail')
            },
            // 征订商品订单
            {
                path: '/c_order/subscribe',
                component: f => require.ensure([], () => f(require('../components/c_order/subscribe/subscribe.vue')), 'c-order-subscribe')
            },
            {
                path: '/c_order/subscribe/detail',
                component: f => require.ensure([], () => f(require('../components/c_order/subscribe/detail.vue')), 'c-order-subscribe-detail')
            },
			{
				path: 'c_product/self',
				component: f => require.ensure([], () => f(require('../components/c_product/self/list.vue')), 'c-product-self-list')
			},
			{
				path: 'c_product/self/info',
				component: f => require.ensure([], () => f(require('../components/c_product/self/info.vue')), 'c-product-self-info')
			},
			{
				path: 'c_product/special',
				component: f => require.ensure([], () => f(require('../components/c_product/special/list.vue')), 'c-product-special-list')
			},
			{
				path: 'c_product/special/info',
				component: f => require.ensure([], () => f(require('../components/c_product/special/info.vue')), 'c-product-special-info')
			},
			{
				path: 'c_product/subscribe',
				component: f => require.ensure([], () => f(require('../components/c_product/subscribe/list.vue')), 'c-product-subscribe-list')
			},
			{
				path: 'c_product/subscribe/info',
				component: f => require.ensure([], () => f(require('../components/c_product/subscribe/info.vue')), 'c-product-subscribe-info')
			},
			{
				path: 'c_product/ticket',
				component: f => require.ensure([], () => f(require('../components/c_product/ticket/list.vue')), 'c-product-ticket-list')
			},
			{
				path: 'c_product/ticket/info',
				component: f => require.ensure([], () => f(require('../components/c_product/ticket/info.vue')), 'c-product-ticket-info')
			},
			{
				path: '/c_user/all',
				component: f => require.ensure([], () => f(require('../components/c_user/all/list.vue')), 'c-user-all')
			},
			{
				path: '/c_user/all/detail',
				component: f => require.ensure([], () => f(require('../components/c_user/all/detail.vue')), 'c-user-all-detail')
			},
			{
				path: '/c_user/manager',
				component: f => require.ensure([], () => f(require('../components/c_user/manager/list.vue')), 'c-user-manager')
			},
			{
				path: '/c_user/manager/detail',
				component: f => require.ensure([], () => f(require('../components/c_user/manager/detail.vue')), 'c-user-manager-detail')
			},
			{
				path: '/c_user/feedback',
				component: f => require.ensure([], () => f(require('../components/c_user/feedback/list.vue')), 'c-user-feedback')
			},
			{
				path: '/c_user/address',
				component: f => require.ensure([], () => f(require('../components/c_user/address/address.vue')), 'c-user-address')
			},
			{
				path: '/c_fund/transaction',
				component: f => require.ensure([], () => f(require('../components/c_fund/transaction/list.vue')), 'c-fund-transaction')
			},
			{
				path: '/c_fund/deposit',
				component: f => require.ensure([], () => f(require('../components/c_fund/deposit/list.vue')), 'c-fund-deposit')
			},
			{
				path: '/c_fund/deposit/recharge',
				component: f => require.ensure([], () => f(require('../components/c_fund/deposit/recharge.vue')), 'c-fund-recharge')
			},
			{
				path: '/c_fund/refund',
				component: f => require.ensure([], () => f(require('../components/c_fund/refund/list.vue')), 'c-fund-refund')
			},
			{
				path: '/c_custom_app/channel',
				component: f => require.ensure([], () => f(require('../components/c_custom_app/channel/channel.vue')), 'c-custom-app-channel')
			},
			{
				path: '/c_custom_app/navigation',
				component: f => require.ensure([], () => f(require('../components/c_custom_app/navigation/navigation.vue')), 'c-custom-app-navigation')
			},
			{
				path: '/c_custom_app/navigation/set_product',
				component: f => require.ensure([], () => f(require('../components/c_custom_app/navigation/product-list.vue')), 'c-custom-app-navigation-product')
			},
			{
				path: '/c_custom_app/banner',
				component: f => require.ensure([], () => f(require('../components/c_custom_app/banner/banner.vue')), 'c-custom-app-banner')
			},
			{
				path: '/c_custom_app/release-notice',
				component: f => require.ensure([], () => f(require('../components/c_custom_app/notice/release-notice.vue')), 'release-notice'),
				children:[
					{path:'',component:require('../components/c_custom_app/notice/NoticeList.vue')},
					{path:'addNotice',component:require('../components/c_custom_app/notice/AddNotice.vue')},
				]
			},
			{
				path: '/c_sys_config/resource',
				component: f => require.ensure([], () => f(require('../components/c_sys_config/resource/resource.vue')), 'c-sys-config-resource')
			},
			{
				path: '/c_sys_config/role',
				component: f => require.ensure([], () => f(require('../components/c_sys_config/role/role.vue')), 'c-sys-config-role')
			},
			{
				path: '/c_sys_config/global',
				component: f => require.ensure([], () => f(require('../components/c_sys_config/global/global.vue')), 'c-sys-config-global')
			},
			{
				path: '/c_sys_config/account',
				component: f => require.ensure([], () => f(require('../components/c_sys_config/account/account.vue')), 'c-sys-config-account')
			},
			{
				path: '/cloud/account/info',
				component: f => require.ensure([], () => f(require('../components/c-pc-header/info.vue')), 'c-account-info')
			},
            // 营销名片
			{
				path: '/c_card/card',
				component: f => require.ensure([], () => f(require('../components/c_card/card.vue')), 'c-card-card')
			},
			{
				path: '/c_card/fans',
				component: f => require.ensure([], () => f(require('../components/c_card/fans.vue')), 'c-card-fans')
			},
            // 物流
			{
                path: '/c_shipping/company',
                component: f => require.ensure([], () => f(require('../components/c_shipping/company.vue')), 'c-shipping-company')
            },
            {
                path: '/c_shipping/track',
                component: f => require.ensure([], () => f(require('../components/c_shipping/track.vue')), 'c-shipping-track')
            },
            // 推荐商家
            {
                path: '/c_invite/merchant',
                component: f => require.ensure([], () => f(require('../components/c_invite/merchant/merchant.vue')), 'c-invite-merchant')
            },
            // 运营分析
            {
                path: '/c_analysis/deal',
                component: f => require.ensure([], () => f(require('../components/c-analysis/deal/list.vue')), 'c-analysis-deal-list')
            },
            // 商城装修
            {
                path: '/c_custom_app/single_advertisement',
                component: f => require.ensure([], () => f(require('../components/c_custom_app/single-advertisement/list.vue')), 'c-custom-app-advertisement')
            },
            {
                path: '/c_custom_app/recommend_goods_list',
                component: f => require.ensure([], () => f(require('../components/c_custom_app/recommend-goods/list.vue')), 'c-custom-app-recommend')
            },
            {
                path: '/c_custom_app/recommend_select_goods',
                component: f => require.ensure([], () => f(require('../components/c_custom_app/recommend-goods/select-product.vue')), 'c-custom-app-recommend-select')
            },
            {
                path: '/c_custom_app/log',
                component: f => require.ensure([], () => f(require('../components/c_custom_app/log/list.vue')), 'c-custom-app-log')
            },
            // 财务管理
            {
                path: '/c_finance/account',
                component: f => require.ensure([], () => f(require('../components/c-finance/account/table.vue')), 'c-finance-account')
            },
            {
                path: '/c_finance/account/detail',
                component: f => require.ensure([], () => f(require('../components/c-finance/account/detail.vue')), 'c-finance-account-detail')
            },
            {
                path: '/c_finance/settlement',
                component: f => require.ensure([], () => f(require('../components/c-finance/settlement/settlement.vue')), 'c-finance-settlement')
            },
            {
                path: '/c_finance/settlement/info',
                component: f => require.ensure([], () => f(require('../components/c-finance/settlement/info.vue')), 'c-finance-settlement-info')
            },
            {
                path: '/c_finance/settlement/detail',
                component: f => require.ensure([], () => f(require('../components/c-finance/settlement/detail.vue')), 'c-finance-settlement-detail')
            },
            {
                path: '/c_finance/receipt',
                component: f => require.ensure([], () => f(require('../components/c-finance/receipt/receipt.vue')), 'c-finance-receipt')
            },
            {
                path: '/c_finance/receipt/detail',
                component: f => require.ensure([], () => f(require('../components/c-finance/receipt/detail.vue')), 'c-finance-receipt-detail')
            },
            {
                path: '/c_finance/bill',
                component: f => require.ensure([], () => f(require('../components/c-finance/payment/payment.vue')), 'c-finance-payment')
            },
            {
                path: '/c_finance/bill/detail',
                component: f => require.ensure([], () => f(require('../components/c-finance/payment/detail.vue')), 'c-finance-payment-detail')
            },
            {
                path: '/c_finance/refund',
                component: f => require.ensure([], () => f(require('../components/c-finance/refund/refund.vue')), 'c-finance-refund')
            },
            {
                path: '/c_finance/biz',
                component: f => require.ensure([], () => f(require('../components/c-finance/bank/bank.vue')), 'c-finance-bank')
            },
            {
                path: '/c_finance/biz/info',
                component: f => require.ensure([], () => f(require('../components/c-finance/bank/info.vue')), 'c-finance-bank-info')
            },
            // 支付管理
            {
                path: '/c_payment/rate',
                component: f => require.ensure([], () => f(require('../components/c-ipayment/payment/rate.vue')), 'c-ipayment-rate')
            },
            {
                path: '/c_payment/rate/info',
                component: f => require.ensure([], () => f(require('../components/c-ipayment/payment/info.vue')), 'c-ipayment-pay-info')
            },
            {
                path: 'c_payment/rate/detail',
                component: f => require.ensure([], () => f(require('../components/c-ipayment/payment/detail.vue')), 'c-ipayment-pay-detail')
            },
            {
                path: '/c_payment/transaction',
                component: f => require.ensure([], () => f(require('../components/c-ipayment/transaction/list.vue')), 'c-ipayment-transaction')
            },
            // 评价管理
            {
                path: '/c_comment/buyer',
                component: f => require.ensure([], () => f(require('../components/c-comment/buyer/list.vue')), 'c-comment-buyer')
            },
            {
                path: '/c_comment/shop',
                component: f => require.ensure([], () => f(require('../components/c-comment/shop/list.vue')), 'c-comment-shop')
            },
            {
                path: '/c_comment/brush',
                component: f => require.ensure([], () => f(require('../components/c-comment/brush/list.vue')), 'c-comment-brush')
            },
            {
                path: '/c_comment/brush/detail',
                component: f => require.ensure([], () => f(require('../components/c-comment/brush/detail.vue')), 'c-comment-brush-detail')
            },
            {
                path: '/c_comment/appeal',
                component: f => require.ensure([], () => f(require('../components/c-comment/appeal/list.vue')), 'c-comment-appeal')
            },
            // 积分管理
            {
                path: '/c_score/trend',
                component: f => require.ensure([], () => f(require('../components/c-score/trend/list.vue')), 'c-score-trend')
            },
            {
                path: '/c_score/provide',
                component: f => require.ensure([], () => f(require('../components/c-score/provide/list.vue')), 'c-score-provide')
            },
            {
                path: '/c_score/account',
                component: f => require.ensure([], () => f(require('../components/c-score/account/list.vue')), 'c-score-account')
            },
            {
                path: '/c_score/use',
                component: f => require.ensure([], () => f(require('../components/c-score/use/list.vue')), 'c-score-use')
            },
            {
                path: '/c_score/set',
                component: f => require.ensure([], () => f(require('../components/c-score/set/set.vue')), 'c-score-set')
            },
            // 官网相关
            {
                path: '/c_website/biz-apply',
                component: f => require.ensure([], () => f(require('../components/c-website/biz-apply/list.vue')), 'c-website-biz-apply')
            },
            // 钱包
            {
                path: '/c-wallet/poundage',
                name: 'Poundage',
                component: Poundage
            },
            {
                path: '/c-wallet/pay-bill__detail',
                name: 'PayBillDetail',
                component: PayBillDetail
            },
            {
                path: '/c-wallet/channel-rate__detail',
                name: 'ChannelRateDetail',
                component: ChannelRateDetail
            },
            {
                path: '/c-wallet/channel-rate__info',
                name: 'ChannelRateInfo',
                component: ChannelRateInfo
            },
            {
                path: '/c-wallet/channel-rate__list',
                name: 'ChannelRateList',
                component: ChannelRateList
            },
            {
                path: '/c-wallet/fund-record',
                name: 'FundRecord',
                component: FundRecord
            },
            {
                path: '/c-wallet/wallet-refund__record',
                name: 'WalletRefundRecord',
                component: WalletRefundRecord
            },
            {
                path: '/c-wallet/poundage-income__record',
                name: 'PoundageIncomeRecord',
                component: PoundageIncomeRecord
            },
            {
                path: '/c-wallet/transfer-record',
                name: 'TransferRecord',
                component: TransferRecord
            },
            {
                path: '/c-wallet/wallet-bankcard',
                name: 'WalletBankcard',
                component: WalletBankcard
            },
            {
                path: '/c-wallet/withdraw-record',
                name: 'WithdrawRecord',
                component: WithdrawRecord
            },
            {
                path: '/c-wallet/deposit-record',
                name: 'DepositRecord',
                component: DepositRecord
            },
            {
                path: '/c-wallet/account-list',
                name: 'WalletAccountList',
                component: WalletAccountList
            },
            {
                path: '/c-wallet/account-detail',
                name: 'WalletAccountDetail',
                component: WalletAccountDetail
            },
            // 分销管理
            {
                path: '/c_distribute/order',
                component: f => require.ensure([], () => f(require('../components/c-distribute/order/list.vue')), '/c-distribute-order')
            },
            {
                path: '/c_distribute/order/detail',
                component: f => require.ensure([], () => f(require('../components/c-distribute/order/detail.vue')), '/c-distribute-order-detail')
            },
            {
                path: '/c_distribute/shop',
                component: f => require.ensure([], () => f(require('../components/c-distribute/shop/list.vue')), '/c-distribute-shop')
            },
            {
                path: '/c_distribute/shop/detail',
                component: f => require.ensure([], () => f(require('../components/c-distribute/shop/goods-list.vue')), '/c-distribute-shop-detail')
            },
            {
                path: '/c_distribute/bill',
                component: f => require.ensure([], () => f(require('../components/c-distribute/bill/list.vue')), '/c-distribute-bill')
            },
            {
                path: '/c_distribute/bill/detail',
                component: f => require.ensure([], () => f(require('../components/c-distribute/bill/detail.vue')), '/c-distribute-bill-detail')
            },
            {
                path: '/c_distribute/market',
                component: f => require.ensure([], () => f(require('../components/c-distribute/market/list.vue')), '/c-distribute-market')
            },
            {
                path: '/c_distribute/market/add',
                component: f => require.ensure([], () => f(require('../components/c-distribute/market/add.vue')), '/c-distribute-market-add')
            },
            {
                path: '/c_distribute/market/detail',
                component: f => require.ensure([], () => f(require('../components/c-distribute/market/detail.vue')), '/c-distribute-market-detail')
            },
		]
	}
]
