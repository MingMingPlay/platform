<template>
    <div class="shipping">

        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div style="margin: 18px 0;">
            <el-button type="primary" @click="handleAdd">新增运费模板</el-button>
        </div>

        <div class="template-wrapper" style="margin-bottom: 18px;" v-for="item in listData">
            <div class="header">
                <div style="overflow: hidden; line-height: 26px;">
                    <span class="template-name">{{ item.templateVO.name }}</span>
                    <span class="template-name" v-if="item.freePolicyVOList.length > 0">(已指定条件包邮)</span>
                    <div class="operation-btn-group">
                        <el-button type="text" @click="handleCopyTemplate(item.templateVO.sid)">复制模板</el-button>
                        <el-button type="text" @click="handleEditTemplate(item.templateVO.sid)">修改</el-button>
                        <!--<el-button type="text" @click="handleDelTemplate(item.templateVO.sid, item.templateVO.name)">删除</el-button>-->
                    </div>
                </div>
            </div>
            <div class="content">
                <el-table stripe :data="item.policyVOList" v-loading="loading">
                    <el-table-column label="运送方式" prop="shippingTypeName" width="140"></el-table-column>
                    <el-table-column label="运送到" prop="areaNames"></el-table-column>
                    <el-table-column label="首件" prop="minCount" width="140"></el-table-column>
                    <el-table-column label="运费" prop="minAmountValue" width="140"></el-table-column>
                    <el-table-column label="续件" prop="increaseCount" width="140"> </el-table-column>
                    <el-table-column label="运费" prop="increaseAmountValue" width="140"></el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    import { pubObj } from '../../assets/unit/public.js'
    import { router } from '../../pages/merchant.js'
    import api from '../../assets/config/m-api.js'
    export default {
        components: { JkcBreadcrumb },
        
        data() {
            return {
                shopSid: null,
                loading: false,
                crumbs: [],
                listData: [],
            }
        },
        
        created() {
            this.crumbs = [{ title: '运费模板' }, { title: '模板规则' }];
            this.shopSid = this.$root.shopInfo.sid || null;
        },
        
        mounted() {
            try {
                this.getTableList(this.shopSid);
            } catch(e) {
                console.log(e)
            }
            /*pubObj.httpRequest(this, {
                url: api.moreShop.url + 'detail',
                success(result) {
                    this.shopSid = result.data.sid;
                    this.getTableList(this.shopSid);
                }
            })*/
        },
        
        methods: {
            // 获取列表
            getTableList(shopSid) {
                pubObj.httpRequest(this, {
                    url: api.shipping,
                    params: { shopSid: shopSid, pageSize: 1000 },
                    success(result) {
                        this.listData = result.data;
                    }
                })
            },
            // 点击新增按钮
            handleAdd() {
                router.push({ path: '/m_shipping/add', query: { shopSid: this.shopSid } })
            },
            // 删除模板
            handleDelTemplate(sid, name) {
                pubObj.showMessage(this, {
                    title: '删除运费模板',
                    content: '确定要删除该运费模板：' + name + '，删除之后不可恢复？',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: api.shipping + sid,
                            params: { shopSid: this.shopSid },
                            method: 'DELETE',
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList();
                            }
                        })
                    }
                });
            },
            // 复制模板
            handleCopyTemplate(sid) {
                pubObj.httpRequest(this, {
                    url: api.shipping + sid,
                    method: 'POST',
                    success(result) {
                        this.$message.success(result.message);
                        this.getTableList(this.shopSid);
                    }
                })
            },
            // 修改模板
            handleEditTemplate(sid) {
                router.push({ path: '/m_shipping/edit', query: { tp_sid: sid, shopSid: this.shopSid } })
            }
        }
    }
</script>

<style>
    .shipping .template-wrapper .header {
        padding: 8px 10px;
        background-color: #E8F2FF;
        border: 1px solid #e4eaee;
        border-bottom: none;
    }
    .shipping .template-wrapper .template-name {
        font-size: 14px;
        font-weight: bold;
    }
    .shipping .template-wrapper .operation-btn-group {
        float: right;
        margin-right: 10px;
    }
</style>
