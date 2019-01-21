<template>
    <div class="promotion-detail">
        
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="detail-title">活动详情</div>
        
        <div class="detail-wrap">
            <jk-labels :model="labels" label-width="80px" label-right="20px">
                <jk-labels-item label="活动名称" prop="name"></jk-labels-item>
                <jk-labels-item label="活动时间" prop="activityTime"></jk-labels-item>
                <jk-labels-item label="活动状态" prop="stateName"></jk-labels-item>
                <jk-labels-item label="活动类型" prop="typeName"></jk-labels-item>
                <jk-labels-item label="创建时间" prop="createdTime"></jk-labels-item>
                <!--<jk-labels-item label="是否参与" prop=""></jk-labels-item>-->
                <jk-labels-item label="优惠内容" style="margin-bottom: 0;">
                    <template v-if="labels.type == 1">
                        <p v-for="item in labels.rules">
                            <span>满</span>
                            <span v-text="item.limitCondition"></span>
                            <span>件</span>
                            <span v-text="item.discountAmount"></span>
                            <span>元</span>
                        </p>
                    </template>
                    <template v-else>
                        <p v-for="item in labels.rules">
                            <span>满</span>
                            <span v-text="item.limitCondition"></span>
                            <span>减</span>
                            <span v-text="item.discountAmount"></span>
                            <span>元</span>
                        </p>
                    </template>
                </jk-labels-item>
            </jk-labels>
        </div>
        
        <div style="margin: 22px 0; text-align: center;">
            <!--<el-button type="primary" @click="handleEditState(9)">终止</el-button>-->
            <el-button type="primary" @click="handleLog">活动操作日志</el-button>
        </div>
        
        <template v-if="$route.query.type != 0">
            <el-table :data="tableData" v-loading.body="loading" stripe>
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column label="商品名称" width="360">
                    <template slot-scope="scope">
                        <div class="image-text-wrap">
                            <img class="image" :src="scope.row.imagePath" />
                            <div class="text" v-text="scope.row.name"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品编码" prop="code"></el-table-column>
                <el-table-column label="所属品类" prop="categoryName"></el-table-column>
                <el-table-column label="售价" prop="priceShow"></el-table-column>
            </el-table>
            
            <pagination event-name="detail-pagination" :total="pagiTotal"></pagination>
        </template>
        
    </div>
</template>

<script>
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    import JkLabels from './common/labels/jk-labels.vue'
    import JkLabelsItem from './common/labels/jk-labels-item.vue'
    import Pagination from '../common/pagination.vue'
    
    import { pubObj, bus } from '../../assets/unit/public.js'
    
    export default {
        components: { JkcBreadcrumb, JkLabels, JkLabelsItem, Pagination },
        
        data() {
            return {
                crumbs: [],
                labels: {},
                tableData: [],
                loading: true,
                pagiTotal: 0,
            }
        },
        
        methods: {
            getGoodsList(params = {}) {
                pubObj.httpRequest(this, {
                    url: ['merchantPromo', 'info/spu/', this.promoSid],
                    params: params,
                    success(result) {
                        try {
                            this.tableData = result.data;
                            if(result.pagination) this.pagiTotal = result.pagination.totalRow;
                            else this.pagiTotal = 0;
                        } catch(e){
                            console.log(e)
                        }
                    }
                })
            },
            // 操作日志
            handleLog() {
                this.$router.push({
                    path: '/m_promotional/log',
                    query: {
                        promoSid: this.promoSid,
                        promoName: this.labels.name
                    }
                })
            }
        },
        
        created() {
            this.crumbs = [
                { title: '促销管理' }, 
                { title: '促销列表', to: '/m_promotional/list' },
                { title: '活动详情' },
            ];
            this.promoSid = this.$route.query.promoSid;
        },
        
        mounted() {
            // step1 取数据
            pubObj.httpRequest(this, {
                url: ['merchantPromo', 'info/', this.promoSid],
                success(result) {
                    try {
                        // step1
                        if(this.$route.query.type != 0) this.getGoodsList();  // 获取活动商品裂变
                        // step2
                        let data = result.data;
                        // 活动时间
                        if(data.beginTime) {
                            data.activityTime = `${data.beginTime} 至 ${data.endTime}`;
                        } else {
                            data.activityTime = '暂无数据';
                        }
                        this.labels = data;
                    } catch(e){
                        console.log(e)
                    }
                }
            });
            // step2 分页
            bus.$on('detail-pagination', (obj) => {
                this.getGoodsList(obj);
            })
        },
        
        destroyed() {
            bus.$off();
        }
    }
</script>

<style>
    .promotion-detail .el-table .cell { padding: 6px 18px; }
    .promotion-detail .image-text-wrap { position: relative; }
    .promotion-detail .image-text-wrap .image { height: 50px; width: 50px; vertical-align: middle; }
    .promotion-detail .image-text-wrap .text {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin-left: 60px;
        line-height: 20px;
        display: -webkit-box;
        display: box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: normal;
        word-break: break-all;
    }
</style>