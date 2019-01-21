<template>
    <div class="m-shop">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="detail-title" style="overflow: hidden; line-height: 28px;">店铺信息
            <!--<el-button 
                type="primary" 
                style="float: right; margin-right: 10px;" 
                @click="handleToggle"
            >{{ activeView.btnName }}
            </el-button>-->
        </div>
        <div class="detail-wrap">
            <!--只缓存shopInfo组件-->
            <keep-alive include="shopInfo">
                <component :is="activeView.name" @go-back="handleToggle"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import shopInfo from './info.vue'
    import shopAdd from './add.vue'
    export default {
        components: { JkcBreadcrumb, shopInfo, shopAdd },
        
        data() {
            return {
                crumbs: [],
                // 活动组件
                activeView: {
                    name: 'shopInfo',
                    btnName: '创建店铺',
                }
            }
        },
        
        methods: {
            handleToggle() {
                if(this.activeView.name == 'shopInfo') {
                    this.activeView.name = 'shopAdd';
                    this.activeView.btnName = '返回';
                } else {
                    this.activeView.name = 'shopInfo';
                    this.activeView.btnName = '创建店铺';
                }
            },
        },
        
        watch: {
            '$route.path': function(pathname) {
                const flag = pathname.search(/createShop/g);
                if(flag != -1) {
                   this.activeView.name = 'shopAdd';
                } else {
                   this.activeView.name = 'shopInfo';
                }
            }
        },
        
        created() {
           this.crumbs = [{ title: '店铺管理' }, { title: '店铺信息' }];
        }
    }
</script>

<style>
</style>