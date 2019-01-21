<template>
    <el-dialog class="banner-form" :title="parentObj.title" v-model="dialogVisible" :close-on-click-modal="false" @close="dialogClose('dialogForm')">
        <keep-alive include="DialogForm">
            <component :is="activeView"></component>
        </keep-alive>
        <div slot="footer" style="text-align: center;">
            <template v-if="activeView == 'DialogForm'">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button 
                    type="primary" 
                    @click="dialogSubmit('dialogForm')" 
                    v-text="parentObj.saveText">
                </el-button>
            </template>
            <el-button v-else @click="activeView = 'DialogForm'">返 回</el-button>
        </div>
    </el-dialog>
</template>

<script>
    // 组件
    import DialogForm from './form.vue'
    import GoodsTable from './goods-table.vue'
    import ShopTable from './shop-table.vue'
    // mixin
    import MaxinDialogForm from '../../mixin/dialog-form.vue'
    import Emitter from './mixin/emitter.js'
    // js
    import { pubObj, bus } from '../../../assets/unit/public.js'

    export default {
        componentName: 'dialog',
        
        components: { DialogForm, GoodsTable, ShopTable },
        
        mixins: [MaxinDialogForm, Emitter],
        
        provide() {
            return {
                dialog: this
            }
        },
                
        data() {
            return {
                initData: {},
                activeView: 'DialogForm',
                mxDialogForm: {
                    name: 'banner-dialog',
                    url: ['newBanner', 'normal/'],
                },
                dialogForm: {
                    rank: 0,
                    url: null,
                    title: null,
                    endTime: null,
                    goodsName: null,
                    imageSid: null,
                    startTime: null,
                    imagePath: null,
                    type: 'OutLine', // 默认是外部链接
                    channelSid: null,
                    businessSid: null,
                    businessName: null,
                    /*navigationSid: null,
                    navigationName: null,*/
                    datetimerange: null
                }
            }
        },
        
        methods: {
            // 重载
            interceptors(data, callback) {
                try {
                    // 详情拼接时间
                    if(data.startTime && data.endTime) {
                        data.datetimerange = [new Date(data.startTime), new Date(data.endTime)];
                    }
                    // 获取店铺详情或者商品详情
                    if(data.type === 'Prodcut') {
                        pubObj.httpRequest(this, {
                            url: this.$api.spu + (data.businessSid || ''),
                            success(result) {
                                data.goodsName = result.data.title;
                                callback(data);
                            }
                        })
                    } else if(data.type === 'Shop') {
                        pubObj.httpRequest(this, {
                            url: ['moreShop', data.businessSid || ''],
                            success(result) {
                                data.businessName = result.data.nameFull;
                                callback(data);
                            }
                        })
                    } else {
                        callback(data);
                    }
                } catch(e) {
                	console.log(e)
                }
            },
            // 覆盖混合表单的方法
            dialogSubmit(formName) {
                try {
                    this.broadcast('bannerForm', 'handleValidate');
                } catch(e) {
                    console.log(e)
                }
            },
            // 关闭窗口
            dialogClose() {
                try {
                    this.broadcast('bannerForm', 'handleResetForm');
                    for(let key in this.initData) {
                        if(typeof(this.initData[key]) === 'string') {
                            this.$data[key] = this.initData[key];
                        } else {
                            this.$data[key] = JSON.parse(JSON.stringify(this.initData[key]));
                        }
                    }
                } catch(error) {
                    console.log(error);
                }
            }
        },
        
        created() {
            
            this.initData.activeView = this.activeView;
            this.initData.mxDialogForm = JSON.parse(JSON.stringify(this.mxDialogForm));
            
            this.$nextTick(() => {
                this.$watch('dialogForm.navigationSid', (val) => {
                    this.mxDialogForm.postUrl = this.$api.banner + val + '/' + this.dialogForm.channelSid;
                    this.mxDialogForm.putUrl = this.$api.banner + val + '/' + this.dialogForm.channelSid + '/';
                });
                this.$watch('dialogForm.channelSid', (val) => {
                    this.mxDialogForm.postUrl = this.$api.banner + this.dialogForm.navigationSid + '/' + val;
                    this.mxDialogForm.putUrl = this.$api.banner + this.dialogForm.navigationSid + '/' + val  + '/';
                });
            })
        }
    }
</script>
