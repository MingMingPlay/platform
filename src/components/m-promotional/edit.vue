<template>
    <div class="promotion-edit">
        
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="detail-title">编辑活动</div>
        
        <div class="detail-wrap">
            
            <el-form :model="editForm" ref="editForm" :inline="true" :rules="rules" label-width="80px">
                <el-form-item label="活动名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="活动时间" prop="beginTime" class="is-required">
                    <el-date-picker 
                        v-model="editForm.activityTime" 
                        type="datetimerange" 
                        placeholder="请选择活动时间" 
                        :picker-options="pickerOptions"
                        @change="handleActivityTime">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            
            <jk-labels :model="labels" label-width="80px" label-right="20px">
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
            <el-button type="primary" @click="handleSave(query.state)">保存</el-button>
            <el-button type="success" @click="handleEditState(1)" v-if="query.state == 0">发布</el-button>
            <el-button type="danger" @click="handleEditState(9)" v-if="query.state != 9">终止</el-button>
        </div>
        
        <template v-if="query.type != 0">
            <el-table :data="tableData" v-loading="loading" stripe>
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
            
            <pagination event-name="edit-pagination" :total="pagiTotal"></pagination>
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
            const rules = {
                name: [{
                    required: true,
                    message: '请输入活动名称',
                    trigger: 'blur'
                }],
                beginTime: [{
                    required: true,
                    message: '请选择活动时间',
                    trigger: 'blur'
                }]
            };
            return {
                crumbs: [],
                editForm: {
                    name: null,
                    state: null,
                    beginTime: null,
                    endTime: null,
                    activityTime: [],
                },
                rules: rules,
                pickerOptions: {                  // 控制禁止选择的时间
                    disabledDate: this.setDisabledDate,
                },
                labels: {},
                tableData: [],
                loading: true,
                pagiTotal: 0,
                query: this.$route.query,
            }
        },
        
        methods: {
            // 只能选择今天之后的时间
            setDisabledDate(date) {
                return ((new Date()).getTime() - 24*60*60*1000) > (new Date(date)).getTime();
            },
            // 转换时间
            handleActivityTime(datetime) {
                if(!datetime) {
                    this.editForm.activityTime = [];
                    this.handleActivityTime([]);
                } else {
                    const index = datetime.indexOf(' - ');
                    this.editForm.beginTime = datetime.slice(0, index);
                    this.editForm.endTime = datetime.slice(index + 3);
                }
            },
            getGoodsList(params = {}) {
                pubObj.httpRequest(this, {
                    url: ['merchantPromo', 'info/spu/', this.query.promoSid],
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
            handleSave(state) {
                this.$refs.editForm.validate((valid) => {
                    if(valid) {
                        this.editForm.state = state;
                        pubObj.httpRequest(this, {
                            url: ['merchantPromo', this.query.promoSid],
                            method: 'PUT',
                            body: this.editForm,
                            success(result) {
                                this.$message.success(result.message);
                                setTimeout(() => {
                                    this.$router.go(-1);
                                }, 1000)
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 修改活动状态
            handleEditState(state) {
                let stateName = null;
                stateName = state === 1 ? '发布' : '终止';
                pubObj.showMessage(this, {
                    title: '修改状态',
                    content: `确定要${stateName}该促销活动？`,
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: ['merchantPromo', this.query.promoSid, '/', state],
                            method: 'PUT',
                            success(result) {
                                this.$message.success(result.message);
                                setTimeout(() => {
                                    this.$router.go(-1);
                                }, 1000)
                            }
                        })
                    }
                })
            }
        },
        
        created() {
            this.crumbs = [
                { title: '促销管理' }, 
                { title: '促销列表', to: '/m_promotional/list' },
                { title: '编辑活动' },
            ];
            /*this.promoSid = this.query.promoSid;*/
        },
        
        mounted() {
            // step1 取数据
            pubObj.httpRequest(this, {
                url: ['merchantPromo', 'info/', this.query.promoSid],
                success(result) {
                    try {
                        // step1
                        if(this.query.type != 0) this.getGoodsList();  // 获取活动商品裂变
                        
                        let data = result.data;
                        // step2
                        Object.keys(this.editForm).forEach(key => {
                            if(key === 'activityTime') {
                                this.editForm[key] = [new Date(data.beginTime), new Date(data.endTime)];
                            } else {
                                this.editForm[key] = data[key];
                            }
                        });
                        // step3
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
            bus.$on('edit-pagination', (obj) => {
                this.getGoodsList(obj);
            })
        },
        
        destroyed() {
            bus.$off();
        }
    }
</script>

<style>
    .promotion-edit .el-table .cell { padding: 6px 18px; }
    .promotion-edit .image-text-wrap { position: relative; }
    .promotion-edit .image-text-wrap .image { height: 50px; width: 50px; vertical-align: middle; }
    .promotion-edit .image-text-wrap .text {
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