import Login from '../components/m-login/login.vue'
import Index from '../components/m-index/index.vue'
import NotFound from '../components/m-404.vue'

// 钱包
//// 账户余额
//const AccountBalance = () => Promise.resolve(
//  import( /* webpackChunkName: 'account-balance' */ '@/components/m-wallet/account-balance/balance.vue'))
//// 其他
const WalletTransfer = () => Promise.resolve(
    import( /* webpackChunkName: 'wallet-transfer' */ '@/components/m-wallet/other/transfer.vue'))
const TransferRecord = () => Promise.resolve(
    import( /* webpackChunkName: 'transfer-record' */ '@/components/m-wallet/other/transfer-record.vue'))
//const WalletBankpay = () => Promise.resolve(
//  import( /* webpackChunkName: 'wallet-bankpay' */ '@/components/m-wallet/other/bankpay.vue'))


// 阅商机路由对象
export default [
    {
        path: '/login',
        component: Login

    },
    {
        path:'*',
        name: 'not-found',
        component:NotFound
    },
    {
        path: '/',
        component: Index,
        children: [
            // 钱包
//          {
//              path: '/m-wallet/wallet-bankpay',
//              name: 'WalletBankpay',
//              component: WalletBankpay
//          },
            {
                path: '/m_finance/transfer-record',
                name: 'TransferRecord',
                component: TransferRecord
            },
            {
                path: '/m-wallet/wallet-transfer',
                name: 'WalletTransfer',
                component: WalletTransfer
            },
            /*{
             path: '/m-wallet/account-balance',
             name: 'AccountBalance',
             component: AccountBalance
             },*/
            // 阅商机首页
            {
                path: '',
                component: f => require.ensure([], () => f(require('../components/m_merchant/home.vue')), 'm-home')
            },
            // 404页面
            {
                path: '/errorPage',
                component: f => require.ensure([], () => f(require('../components/404.vue')), 'error-page')
            },
            {
                path: '/m_shop/category',
                component: f => require.ensure([], () => f(require('../components/m_shop/category/category.vue')), 'm-shop-category')
            },
            {
                path: '/m_shop/merchant_relationship',
                component: f => require.ensure([], () => f(require('../components/m_shop/merchant_relationship/merchant_relationship.vue')), 'm-shop-merchant-relationship')
            },
            {
                path: '/m_product/self',
                component: f => require.ensure([], () => f(require('../components/m_product/self/list.vue')), 'm-product-self-list')
            },
            {
                path: '/m_product/self/add',
                component: f => require.ensure([], () => f(require('../components/m_product/self/addnew.vue')), 'm-product-self-add')
            },
            {
                path: '/m_product/self/info',
                component: f => require.ensure([], () => f(require('../components/m_product/self/info.vue')), 'm-product-self-info')
            },
            {
                path: '/m_product/special',
                component: f => require.ensure([], () => f(require('../components/m_product/special/list.vue')), 'm-product-special-list')
            },
            {
                path: '/m_product/special/add',
                component: f => require.ensure([], () => f(require('../components/m_product/special/addnew.vue')), 'm-product-special-add')
            },
            {
                path: '/m_product/special/info',
                component: f => require.ensure([], () => f(require('../components/m_product/special/info.vue')), 'm-product-special-info')
            },
            {
                path: '/m_product/subscribe',
                component: f => require.ensure([], () => f(require('../components/m_product/subscribe/list.vue')), 'm-product-subscribe-list')
            },
            {
                path: '/m_product/subscribe/add',
                component: f => require.ensure([], () => f(require('../components/m_product/subscribe/addnew.vue')), 'm-product-subscribe-add')
            },
            {
                path: '/m_product/subscribe/info',
                component: f => require.ensure([], () => f(require('../components/m_product/subscribe/info.vue')), 'm-product-subscribe-info')
            },
            {
                path: '/m_product/ticket',
                component: f => require.ensure([], () => f(require('../components/m_product/ticket/list.vue')), 'm-product-ticket-list')
            },
            {
                path: '/m_product/ticket/info',
                component: f => require.ensure([], () => f(require('../components/m_product/ticket/info.vue')), 'm-product-ticket-info')
            },
            {
                path: '/m_product/ticket/check-table',
                component: f => require.ensure([], () => f(require('../components/m_product/ticket/check-table.vue')), 'm-product-ticket-check-table')
            },
            {
                path: '/m_user/employee',
                component: f => require.ensure([], () => f(require('../components/m_user/employee/list.vue')), 'm-user-employee')
            },
            {
                path: '/m_user/employee/detail',
                component: f => require.ensure([], () => f(require('../components/m_user/employee/detail.vue')), 'm-user-employee-detail')
            },
            {
                path: '/m_user/member',
                component: f => require.ensure([], () => f(require('../components/m_user/member/list.vue')), 'm-user-member')
            },
            {
                path: '/m_user/member/detail',
                component: f => require.ensure([], () => f(require('../components/m_user/member/detail.vue')), 'm-user-member-detail')
            },
            {
                path: '/m_sys_config/account',
                component: f => require.ensure([], () => f(require('../components/m_sys_config/account/account.vue')), 'm-sys-config-account')
            },
            {
                path: '/m_sys_config/role',
                component: f => require.ensure([], () => f(require('../components/m_sys_config/role/role.vue')), 'm-sys-config-role')
            },
            {
                path: '/m_sys_config/global',
                component: f => require.ensure([], () => f(require('../components/m_sys_config/global/global.vue')), 'm-sys-config-global')
            },
            {
                path: '/m_shop/info',
                component: f => require.ensure([], () => f(require('../components/m_shop/shop/info.vue')), 'm-shop-info')
            },
            {
                path: '/m_shop/createShop',
                component: f => require.ensure([], () => f(require('../components/m_shop/shop/add.vue')), 'm-shop-create')
            },
            {
                path: '/m_order/self',
                component: f => require.ensure([], () => f(require('../components/m_order/self/self.2.0.vue')), 'm-order-self')
            },
            {
                path: '/m_order/self/detail',
                component: f => require.ensure([], () => f(require('../components/m_order/self/detail.2.0.vue')), 'm-order-self-detail')
            },
            {
                path: '/m_order/special',
                component: f => require.ensure([], () => f(require('../components/m_order/special/special.2.0.vue')), 'm-order-special')
            },
            {
                path: '/m_order/special/detail',
                component: f => require.ensure([], () => f(require('../components/m_order/special/detail.2.0.vue')), 'm-order-special-detail')
            },
            {
                path: '/m_order/refund',
                component: f => require.ensure([], () => f(require('../components/m_order/refund/refund.2.0.vue')), 'm-order-refund')
            },
            {
                path: '/m_order/refund/detail',
                component: f => require.ensure([], () => f(require('../components/m_order/refund/detail.2.0.vue')), 'm-order-refund-detail')
            },
            {
                path: '/m_order/refund/vdetail',
                component: f => require.ensure([], () => f(require('../components/m_order/refund/virtual-detail.vue')), 'm-order-refund-vdetail')
            },
            // 虚拟商品订单
            {
                path: '/m_order/virtual',
                component: f => require.ensure([], () => f(require('../components/m_order/virtual/virtual.vue')), 'm-order-virtual')
            },
            {
                path: '/m_order/virtual/detail',
                component: f => require.ensure([], () => f(require('../components/m_order/virtual/detail.vue')), 'm-order-virtual-detail')
            },
            {
                path: '/m_order/subscribe',
                component: f => require.ensure([], () => f(require('../components/m_order/subscribe/subscribe.vue')), 'm-order-subscribe')
            },
            {
                path: '/m_order/subscribe/detail',
                component: f => require.ensure([], () => f(require('../components/m_order/subscribe/detail.vue')), 'm-order-subscribe-detail')
            },
            {
                path: '/m_order/payment',
                component: f => require.ensure([], () => f(require('../components/m_order/pay/pay.vue')), 'm-order-payment')
            },
            // 名片
            {
                path: '/m_card/card',
                component: f => require.ensure([], () => f(require('../components/m_card/card.vue')), 'm-card-card')
            },
            {
                path: '/m_card/fans',
                component: f => require.ensure([], () => f(require('../components/m_card/fans.vue')), 'm-card-fans')
            },
            {
                path: '/m_card/bind',
                component: f => require.ensure([], () => f(require('../components/m_fansbinding/fansbinding.vue')), 'm-card-bind')
            },
            // 运费模板
            {
                path: '/m_shipping/template',
                component: f => require.ensure([], () => f(require('../components/m_shipping/shipping-list.vue')), 'm-shipping-list')
            },
            {
                path: '/m_shipping/add',
                component: f => require.ensure([], () => f(require('../components/m_shipping/shipping-add.vue')), 'm-shipping-add')
            },
            {
                path: '/m_shipping/edit',
                component: f => require.ensure([], () => f(require('../components/m_shipping/shipping-edit.vue')), 'm-shipping-edit')
            },
            // 地址库
            {
                path: '/m_shipping/address',
                component: f => require.ensure([], () => f(require('../components/m_address/list.vue')), 'm-address-list')
            },
            // 组织机构
            {
                path: '/m_sys_config/organ',
                component: f => require.ensure([], () => f(require('../components/m-organ/organ.vue')), 'm-organ')
            },
            // 财务管理
            {
                path: '/m_finance/account',
                component: f => require.ensure([], () => f(require('../components/m-finance/balance/balance.vue')), 'm-finance-balance')
            },
            {
                // 产品暂时取消该功能
                path: '/m_finance/transaction',
                component: f => require.ensure([], () => f(require('../components/m-finance/transaction/detail.vue')), 'm-finance-transaction-detail')
            },
            {
                path: '/m_finance/refund',
                component: f => require.ensure([], () => f(require('../components/m-finance/refund/refund.vue')), 'm-finance-refund')
            },
            {
                path: '/m_finance/bankpay',
                component: f => require.ensure([], () => f(require('../components/m-finance/balance/bankpay.vue')), 'm-finance-bankpay')
            },
            {
                path: '/m_finance/receipt',
                component: f => require.ensure([], () => f(require('../components/m-finance/receipt/receipt.vue')), 'm-finance-receipt')
            },
            {
                path: '/m_finance/receipt/detail',
                component: f => require.ensure([], () => f(require('../components/m-finance/receipt/detail.vue')), 'm-finance-receipt-detail')
            },
            {
                path: '/m_finance/bill',
                component: f => require.ensure([], () => f(require('../components/m-finance/payment/payment.vue')), 'm-finance-bill')
            },
            {
                path: '/m_finance/bill/detail',
                component: f => require.ensure([], () => f(require('../components/m-finance/payment/detail.vue')), 'm-finance-bill-detail')
            },
            {
                path: '/m_finance/account_info',
                component: f => require.ensure([], () => f(require('../components/m-finance/account-info/info.vue')), 'm-finance-account-info')
            },
            // 激励方案
            // {
            //     path: '/m_incentive/incentive',
            //     component: f => require.ensure([], () => f(require('../components/m-incentive/incentive.vue')), 'm-incentive')
            // },
            // {
            //     path: '/m_incentive/incentive/add',
            //     component: f => require.ensure([], () => f(require('../components/m-incentive/add.vue')), 'm-incentive-add')
            // },
            // {
            //     path: '/m_incentive/incentive/detail',
            //     component: f => require.ensure([], () => f(require('../components/m-incentive/detail.vue')), 'm-incentive-detail')
            // },
            // {
            //     path: '/m_incentive/sign-receive',
            //     name: 'signReceive',
            //     component: f => require.ensure([], () => f(require('../components/m-incentive/sign-receive.vue')), 'm-incentive-sign')
            // },
            // 激励方案新
            {
                path: '/m_incentive/list',
                component: f => require.ensure([], () => f(require('../components/m-incentive-new/list.vue')), 'm-incentive-new')
            },
            {
                path: '/m_incentive/add',
                component: f => require.ensure([], () => f(require('../components/m-incentive-new/add.vue')), 'm-incentive-new')
            },{
                path: '/m_incentive/list/detail',
                component: f => require.ensure([], () => f(require('../components/m-incentive-new/detail.vue')), 'm-incentive-new')
            },
            // 促销管理
            {
                path: '/m_promotional/list',
                component: f => require.ensure([], () => f(require('../components/m-promotional/list.vue')), 'm-promotional-list')
            },
            {
                path: '/m_promotional/add-promotion',
                component: f => require.ensure([], () => f(require('../components/m-promotional/child/pageform.vue')), 'm-promotional-add_promotion')
            },
            {
                path: '/m_promotional/detail',
                component: f => require.ensure([], () => f(require('../components/m-promotional/detail.vue')), 'm-promotional-detail')
            },
            {
                path: '/m_promotional/edit',
                component: f => require.ensure([], () => f(require('../components/m-promotional/edit.vue')), 'm-promotional-edit')
            },
            {
                path: '/m_promotional/log',
                component: f => require.ensure([], () => f(require('../components/m-promotional/log.vue')), 'm-promotional-log')
            },
            //评价管理
            {
                path: '/m_comment/buyer',
                component: f => require.ensure([], () => f(require('../components/m-comment/buyer/list.vue')), 'm-comment-buyer')
            },
            {
                path: '/m_comment/shop',
                component: f => require.ensure([], () => f(require('../components/m-comment/shop/list.vue')), 'm-comment-shop')
            },
            // 数据统计
            {
                path: '/m_data_total/ticket',
                component: f => require.ensure([], () => f(require('../components/m-data-total/ticket/list.vue')), 'm-total-ticket')
            },
            {
                path: '/m_data_total/incentive',
                component: f => require.ensure([], () => f(require('../components/m-data-total/incentive/list.vue')), 'm-total-incentive')
            },
            {
                path: '/m_data_total/subscribe',
                component: f => require.ensure([], () => f(require('../components/m-data-total/subscribe/list.vue')), 'm-total-subscribe')
            },
        ]
    }
]
