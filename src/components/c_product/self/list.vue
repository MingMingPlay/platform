<template>
    <div class="goods-self">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <div class="search-fil-wrap">
            <el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
                <el-form-item label="商品信息">
                    <el-input v-model="searchForm.title" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品品类">
                    <el-select v-model="searchForm.categorySid" clearable placeholder="选择品类">
                        <template v-for="item in cateData">
                            <el-option
                                    v-if="!item.children"
                                    :value="item.sid"
                                    :label="item.name">
                            </el-option>
                            <el-option-group
                                    v-if="item.children"
                                    :label="item.name">
                                <el-option
                                        v-for="(item1, index1) in item.children"
                                        :key="index1"
                                        :label="item1.name"
                                        :value="item1.sid">
                                </el-option>
                            </el-option-group>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <time-period :show-quick="false" :change-value="searchForm.start" v-on:emit-time="getTime"></time-period>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select v-model="searchForm.brandSid" clearable placeholder="选择品牌" no-data-text="暂无品牌">
                        <el-option
                                v-for="(item, index) in brandData"
                                :key="index"
                                :value="item.sid"
                                :label="item.nameFull">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属店铺">
                    <el-select
                            v-model="searchForm.shopSid"
                            clearable
                            filterable
                            remote
                            placeholder="请输入店铺名称"
                            :remote-method="remoteMethod"
                            :loading="getMerchantLoading">
                        <el-option
                                v-for="item in merchantData"
                                :key="item.sid"
                                :label="item.nameFull"
                                :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="search-button-group">
                    <el-button type="primary" @click="resetSearch">重置条件</el-button>
                    <el-button type="primary" @click="searchGoods">搜索</el-button>
                </div>
            </el-form>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="goodsStates" @tab-click="tabClick">
                <el-tab-pane label="全部" name="All"></el-tab-pane>
                <el-tab-pane label="销售中" name="Selling"></el-tab-pane>
                <el-tab-pane label="待审核" name="CloudCheck"></el-tab-pane>
            </el-tabs>
            <div class="sort-wrap">
                <el-button type="primary" @click="exportExcel('General')">导出商品Excel</el-button>
            </div>
        </div>

        <goods-table :tableData="goodsList[goodsStates]"
                     :tableHeader="headerData[goodsStates]"
                     :index="true"
                     :tableLoading="tLoading[goodsStates]"
                     v-if="tableShow">

            <!--全部-->
            <el-table-column label="操作" width="180" align="right" slot="handle" v-if="goodsStates === 'All'">
                <template slot-scope="scope">
                    <el-button type="text"
                               v-if="scope.row.state == 'CloudCheck'"
                               @click="router.push({path: $route.path + '/info',query:{btn: $route.query.btn,spuSid: scope.row.sid}})">审核</el-button>
                    <el-button type="text"
                               v-if="scope.row.state == 'Online' && !scope.row.ifPromotion"
                               @click="offlineGoods(scope.row.sid)">下架</el-button>
                    <el-button type="text"
                               @click="router.push({path: $route.path + '/info',query:{btn: $route.query.btn,spuSid: scope.row.sid}})">详情</el-button>
                </template>
            </el-table-column>

            <!-- 销售中 -->
            <el-table-column label="操作" width="180" align="right" slot="handle" v-else-if="goodsStates === 'Selling'">
                <template slot-scope="scope">
                    <el-button type="text"
                               v-if="!scope.row.ifPromotion"
                               @click="offlineGoods(scope.row.sid)">下架</el-button>
                    <el-button type="text"
                               @click="router.push({path: $route.path + '/info',query:{btn: $route.query.btn,spuSid: scope.row.sid}})">详情</el-button>
                </template>
            </el-table-column>

            <!-- 待审核 -->
            <el-table-column label="操作" width="180" align="right" slot="handle" v-else-if="goodsStates === 'CloudCheck'">
                <template slot-scope="scope">
                    <el-button type="text" @click="router.push({path: $route.path + '/info',query:{btn: $route.query.btn,spuSid: scope.row.sid}})">审核</el-button>
                </template>
            </el-table-column>
        </goods-table>

        <!-- dialog -->
        <el-dialog title="下架提示" v-model="offlineDialog" @close="dialogClose" size="tiny">
            <el-form ref="offlineForm" :model="offlineForm" :rules="rules">
                <el-form-item>
                    确定将该商品下架吗？<span style="color: #f00">（该商品将停止销售）</span>
                </el-form-item>
                <el-form-item label="下架说明" label-width="84px" prop="opinion">
                    <el-input type="textarea" v-model="offlineForm.opinion"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="offlineDialog = false">取 消</el-button>
                <el-button type="primary" @click="offlineGoodsConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <div class="pagination-wrap" v-if="goodsList[$route.query.states].length > 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.totalRow">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import api from '../../../assets/config/c-api.js'
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import TimePeriod from '../../common/time-period.vue'
    import { router } from '../../../pages/platform.js'
    import { mixin_getButton } from '../../common/jkc-mixin.vue'
    import goodsTable from '../../common/goods-table.vue'
    import headerData from './tableData.js'
    import { mixin_exportExcel } from '../mixins/mixins.vue'
    export default {
        mixins: [mixin_getButton, mixin_exportExcel],
        data (){
            return {
                router,
                headerData,
                crumbs: [{
                    title:'商品管理',
                },{
                    title:'自营商品',
                }],
                searchForm: {
                    title: '',
                    brandSid: '',
                    start: '',
                    end: '',
                    categorySid: '',
                    shopSid: '',
                },
                getMerchantLoading: false,
                brandData: [],
                cateData: [],
                merchantData: [],
                MerchantBrandData: [],
                goodsStates: this.$route.query.states,      // 切换商品状态
                goodsList: {
                    All: [],
                    Selling: [],
                    CloudCheck: [],
                },
                tLoading: {
                    Selling: false,
                    Storage: false,
                    CloudCheck: false,
                    Refuse: false,
                },
                pagination: {},
                offlineForm: {
                    spuSid: '',
                    opinion: ''
                },
                offlineDialog: false,
                rules: {
                    opinion: [{
                        required: true,
                        message: '请说明下架理由',
                        trigger: 'blur'
                    }]
                },
                tableShow: true,    // 该变量用于通过 v-if 让组件重构渲染
            }
        },
        components: {
            jkcBreadcrumb,
            TimePeriod,
            goodsTable
        },
        created (){		// 页面初始化可能会遇到的情况
            let query = JSON.parse(JSON.stringify(this.$route.query));
            query.pageIndex = 1;
            if(!this.$route.query.states){
                query.states = 'All';
                this.goodsStates = 'All';
            }
            if(!this.$route.query.type){
                query.type  = 'General';	// Assist行销品
            }
            router.replace({path: this.$route.path, query: query})
            this.getBrand();
            this.getCate();
            this.getGoodsList(this.$route.query);
        },
        watch: {
            "$route" (to, from){		// 监听URL变化来获取相应数据
                let query = JSON.parse(JSON.stringify(to.query));
                let a = false;
                if(!to.query.pageIndex){
                    query.pageIndex = 1;
                    a = true;
                }
                if(!this.$route.query.states){
                    query.states = 'All';
                    this.goodsStates = 'All';
                    a = true;
                }
                if(!this.$route.query.type){
                    query.type  = 'General';
                    a = true;
                }
                if(a) {
                    router.replace({path: this.$route.path, query: query});
                    return false;
                }
                let data = JSON.parse(JSON.stringify(to.query));
                for(let key in this.searchForm){   // 看查询条件有没有数据
                    if(this.searchForm[key]){
                        data[key] = this.searchForm[key];
                    }
                }
                this.getGoodsList(data);
            }
        },
        methods: {
            tabClick (tab, event){		// 切换状态商品列表
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.states = tab.name;
                query.pageIndex = 1;
                router.push({path: this.$route.path, query: query});

                this.tableShow = false;
                setTimeout(() => {
                    this.tableShow = true;
                })
            },
            getBrand (){		// 获取品牌
                this.$http.get(api.brand)
                    .then((result) => {
                        this.brandData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getCate (){		// 获取类目
                this.$http.get(api.category)
                    .then((result) => {
                        this.cateData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getGoodsList (params){		// 获取商品列表
                this.goodsList[params.states] = [];
                this.tLoading[params.states] = true;
                this.$http.get(api.spu + 'cloud', {params : params})
                    .then((result) => {
                        this.tLoading[params.states] = false;
                        if(result.body.code == 200){
                            this.goodsList[params.states] = result.body.data;
                            this.pagination = result.body.pagination;
                            if(this.pagination && this.pagination.pageIndex == 0){
                                this.pagination.pageIndex = 1;
                            }
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            resetSearch (){
                for(let key in this.searchForm){
                    this.searchForm[key] = '';
                }
            },
            remoteMethod(query) {		// 动态搜索商家信息
                if(query === ''){
                    this.searchForm.shopSid = '';
                }
                if (query !== '' && query.length > 1) {
                    this.getMerchantLoading = true;
                    this.$http.get(['merchantShop'], {params: {q: query}})
                        .then((result) => {
                            this.getMerchantLoading = false;
                            this.merchantData = result.body.data.filter(item => {
                                return item.nameFull.toLowerCase().indexOf(query.toLowerCase()) > -1;
                            });
                        }).catch((err) => {
                        console.log(err)
                    });
                } else {
                    this.merchantData = [];
                }
            },
            getTime(start, end){
                this.searchForm.start = start || '';
                this.searchForm.end = end || '';
            },
            searchGoods (){			// 搜索商品
                this.$route.query.pageIndex = 1;
                var data = {};
                for(let key in this.searchForm){
                    if(this.searchForm[key]){
                        data[key] = this.searchForm[key];
                    }
                }
                if(JSON.stringify(data) == '{}'){
                    this.getGoodsList(this.$route.query);
                    return false;
                }
                for(let key in this.$route.query){
                    data[key] = this.$route.query[key];
                }
                this.getGoodsList(data);
            },
            editGoods (sid){		// 编辑商品
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.step = 0;
                query.spuSid = sid;
                router.push({path: '/goodsSelf/goodsSelfAdd',query:query})
            },
            delGoods (sid){			// 删除商品
                this.$confirm('删除后不可恢复，确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(api.spu + sid)
                        .then((result) => {
                            if(result.body.code == 200){
                                this.getGoodsList(this.$route.query);
                                this.$message({type:'success',message:result.body.message});
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                });
            },
            offlineGoods (sid){		// 商品下架，打开提示和form弹窗
                this.offlineDialog = true;
                this.offlineForm.spuSid = sid;
            },
            offlineGoodsConfirm (){		// 确认提交下架
                this.$refs.offlineForm.validate((valid) => {
                    if(valid){
                        this.$http.post(api.spu + 'audit/offline', this.offlineForm)
                            .then((result) => {
                                if(result.body.code == 200){
                                    this.offlineDialog = false;
                                    this.getGoodsList(this.$route.query);
                                }
                            }).catch((err) => {
                            console.log(err)
                        })
                    }
                })
            },
            onlineGoods (sid){		// 商品上架
                this.$confirm('确定上架?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$http.post(api.spu + 'audit/online/' + sid)
                        .then((result) => {
                            if(result.body.code == 200){
                                this.getGoodsList(this.$route.query);
                            }
                        }).catch((err) => {
                        console.log(err)
                    })
                });
            },
            dialogClose (){		// 下架弹窗关闭重置下架表单
                this.$refs.offlineForm.resetFields();
//                this.offlineForm = {spuSid: '', opinion: ''};
            },
            handleSizeChange(val) {		// 切换每页多少条数据
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.pageIndex = 1;
                query.pageSize = val;
                router.push({path: this.$route.path, query: query})
            },
            handleCurrentChange(val) {		// 当前在哪一页
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.pageIndex = val;
                router.push({path: this.$route.path, query: query})
            },
        }
    }
</script>

<style>
    .goods-self .search-fil-wrap .el-form--inline .el-form-item__content,.goods-self .search-fil-wrap .el-select,.goods-self .search-fil-wrap .el-date-editor--daterange.el-input{
        width: 210px;
        height: 28px;
    }
    .goods-self .tab-wrap{
        position: relative;
    }
    .goods-self .tab-wrap .sort-wrap{
        position: absolute;
        right: 0;
        top: 6px;
    }
    .goods-self .tab-wrap .sort-wrap .el-button{
        margin-left: 10px;
    }
    .goods-self .table-select-all{
        margin-bottom: 15px;
    }
    .goods-self .table-select-all .el-checkbox{
        margin-right: 10px;
    }
    .goods-self .goods-title{
        display: flex;
        padding: 5px 0;
    }
    .goods-self .goods-title img{
        width:50px;
        height:50px;
        margin-right: 10px;
        border: 1px solid #e4eaee;
    }
    .goods-self .goods-title .title{
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .goods-self .pagination-wrap{
        margin-top: 20px;
        text-align: center;
    }
    .goods-self .el-table .el-table__body .red{
        color: #f00;
    }
    /*.goods-self .el-table table,.goods-self .el-table .el-table__empty-block{*/
    /*width: 100% !important;*/
    /*}*/
</style>
