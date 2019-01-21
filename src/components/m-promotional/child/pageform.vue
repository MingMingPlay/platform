<template>
    <div class="pageform">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="detail-title">{{ activeBreadcrumb }}</div>
        
        <template v-if="$route.query.type != 0">
            <el-steps :active="activeStep" space="30%" style="margin-bottom: 20px;" align-center center>
                <el-step title="促销规则"></el-step>
                <el-step title="选择商品"></el-step>
            </el-steps>
            
            <div class="detail-wrap">
                <keep-alive>
                    <component :is="activeView"></component>
                </keep-alive>
            </div>
        </template>
        
        <template v-else>
            <div class="detail-wrap">
                <shop-coupons></shop-coupons>
            </div>
        </template>
    </div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import PromotionalRule from '../common/promotional-rule.vue'        // 促销规则
    import SelectProduct from '../common/select-product.vue'            // 选择商品 活动商品在一起
    import ShopCoupons from './shop-coupons.vue'            // 选择商品 活动商品在一起
    
    export default {
        componentName: 'pageform',
        
        components: { JkcBreadcrumb, PromotionalRule, SelectProduct, ShopCoupons },
        
        data() {
            return {
                crumbs: [],
                activeStep: 1,
                activeView: 'PromotionalRule',  // 默认显示促销规则
                pageForm: {},
            }
        },
        
        computed: {
            activeBreadcrumb() {
                let breadcrumbName = null;
                const type = this.$route.query.type;
                if(type == 0) {
                    breadcrumbName = '优惠券';
                } else if(type == 1) {
                    breadcrumbName = '满X件Y元';
                } else {
                    breadcrumbName = '满X元减Y元';
                }
                
                return breadcrumbName;
            }
        },
        
        created() {
            this.crumbs = [
                { title: '促销管理' }, 
                { title: '促销列表', to: '/m_promotional/list' }, 
                { title: '发布促销' }
            ];
        }
    }
    
</script>