<template>
    <div class="promotional">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="search-fil-wrap one-line">
            <el-form :inline="true" :model="form">
                <el-form-item label="活动名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker 
                        v-model="form.activityTime" 
                        type="daterange" 
                        placeholder="活动时间" 
                        @change="handleActivityTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动类型">
                    <el-select v-model="form.type" placeholder="活动类型" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="优惠券" :value="0"></el-option>
                        <el-option label="满x件x元" :value="1"></el-option>
                        <el-option label="满减" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动状态">
                    <el-select v-model="form.state" placeholder="活动状态" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="草稿" :value="0"></el-option>
                        <el-option label="进行中" :value="1"></el-option>
                        <el-option label="未生效" :value="2"></el-option>
                        <el-option label="已结束" :value="8"></el-option>
                        <el-option label="已终止" :value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="detail-title">促销类型</div>
        <div style="padding: 20px; background-color: #F5F8FA; border: 1px solid #E4EAEE;">
            <el-button type="primary" @click="handleAddPromotion(0)">发布-优惠券</el-button>
            <el-button type="primary" @click="handleAddPromotion(1)">发布-满X件Y元</el-button>
            <el-button type="primary" @click="handleAddPromotion(2)">发布-满X元减Y元</el-button>
        </div>
        <div class="detail-title">促销列表</div>
        <div>
            <el-table :data="tableData" v-loading.body="loading" stripe>
                <el-table-column label="活动类型" prop="typeName" width="180"></el-table-column>
                <el-table-column label="活动名称" prop="name" width="180"></el-table-column>
                <el-table-column label="创建时间" prop="createdTime" width="180"></el-table-column>
                <el-table-column label="活动时间" width="300">
                    <template slot-scope="scope">
                        <span>{{scope.row.beginTime}} 至 {{scope.row.endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活动状态" prop="stateName" width="180"></el-table-column>
                <el-table-column label="优惠内容" width="180">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type == 1">
                            <p v-for="item in scope.row.rules">
                                <span>满</span>
                                <span v-text="item.limitCondition"></span>
                                <span>件</span>
                                <span v-text="item.discountAmount"></span>
                                <span>元</span>
                            </p>
                        </template>
                        <template v-else>
                            <p v-for="item in scope.row.rules">
                                <span>满</span>
                                <span v-text="item.limitCondition"></span>
                                <span>减</span>
                                <span v-text="item.discountAmount"></span>
                                <span>元</span>
                            </p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleLookDetail(scope.row)">查看</el-button>
                        <el-button type="text" @click="handleEditPromot(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
            
        <pagination event-name="promotion-pagination" :total="mxTableList.pagiTotal"></pagination>
        
    </div>
</template>

<script>
    // child
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    import Pagination from '../common/pagination.vue'
    import Wrapper from './common/wrapper.vue'
    // mixin
    import TableList from '../mixin/table-list.vue'
    // js
    import { pubObj, bus } from '../../assets/unit/public.js'
    
    export default {
        components: { JkcBreadcrumb, Pagination, Wrapper },
        
        mixins: [TableList],
        
        data() {
            return {
                crumbs: [],
                form: {},
                mxTableList: {
                    url: ['merchantPromo', 'list'],
                    mountQuery: {
                        shopSid: this.$root.shopInfo.sid
                    },
                    pagiTotal: 0
                },
            }
        },
        
        methods: {
            // 优惠券、满X件X元、满减
            handleAddPromotion(type) {
                this.$router.push({
                    path: '/m_promotional/add-promotion',
                    query: { type: type }
                })
            },
            // 查询
            handleSearch() {
                this.loading = true;
                this.form.shopSid = this.$root.shopInfo.sid;
                this.getTableList(this.form);
            },
            // 日期转化
            handleActivityTime(date) {
                const index = date.indexOf(' - ');
                this.form.beginTime = date.slice(0, index);
                this.form.endTime = date.slice(index + 3);
            },
            // 查看详情
            handleLookDetail(row) {
                this.$router.push({
                    path: '/m_promotional/detail',
                    query: {
                        promoSid: row.sid,
                        type: row.type
                    }
                })
            },
            // 编辑活动
            handleEditPromot(row) {
                this.$router.push({
                    path: '/m_promotional/edit',
                    query: {
                        promoSid: row.sid,
                        type: row.type,
                        state: row.state
                    }
                })
            }
        },
        
        created() {
            this.crumbs = [{ title: '促销管理' }, { title: '促销列表' }];
        },
        
        mounted() {
            bus.$on('promotion-pagination', (obj) => {
                this.form.shopSid = this.$root.shopInfo.sid;
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
        
        destroyed() {
            bus.$off();
        }
    }
    
</script>

<style>
    .promotional .el-table .cell { padding: 6px 18px; }
</style>