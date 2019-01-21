<template>
	<div class="goods-self">
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
		<div class="search-fil-wrap">
			<el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
				<el-form-item label="商品名称">
					<el-input v-model="searchForm.title" placeholder="商品名称"></el-input>
				</el-form-item>
				<el-form-item label="创建时间">
                    <time-period :show-quick="false" :change-value="searchForm.start" v-on:emit-time="getTime"></time-period>
				</el-form-item>
                <tp-organ v-model="searchForm.organCode" :goods="true"></tp-organ>
				<div class="search-button-group">
					<el-button type="primary" @click="resetSearch">重置条件</el-button>
					<el-button type="primary" @click="searchGoods">搜索</el-button>
				</div>
			</el-form>
		</div>
		<div class="tab-wrap">
			<el-tabs v-model="goodsStates" @tab-click="tabClick">
				<el-tab-pane label="全部" name="Selling"></el-tab-pane>
				<el-tab-pane label="仓库中" name="Storage"></el-tab-pane>
			</el-tabs>
			<div class="sort-wrap">
				<el-button type="primary" @click="router.push({path: '/m_product/subscribe/add',query:{btn: $route.query.btn,step: 0}})">发布征订</el-button>
			</div>
		</div>


        <goods-table :tableData="goodsList[goodsStates]"
                     :tableHeader="headerData[goodsStates]"
                     :index="true"
                     :tableLoading="tLoading[goodsStates]"
                     v-if="tableShow">

            <!-- 销售中操作 -->
            <el-table-column label="操作" width="180" align="right" slot="handle" v-if="goodsStates === 'Selling'">
                <template slot-scope="scope">
                    <!--<el-button type="text" @click="offlineGoods(scope.row.sid)">下架</el-button>-->
                    <sub-refund
                        :row="scope.row"
                        @callback="successCallback"
                        v-if="scope.row.state === 'SubscribeEnd' && scope.row.price !== '0.00'"></sub-refund>
                    <el-button type="text"
                               v-if="scope.row.state === 'Published' || scope.row.state === 'Online'"
                               @click="editGoods(scope.row.sid)">编辑</el-button>
                    <el-button type="text"
                               @click="router.push({path: $route.path + '/info',query:{btn: $route.query.btn,spuSid: scope.row.sid}})">详情</el-button>
                </template>
            </el-table-column>

            <!-- 仓库中操作 -->
            <el-table-column label="操作" width="180" align="right" slot="handle" v-else-if="goodsStates === 'Storage'">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.state === 'Active' || scope.row.state === 'Offline'"
                               @click="onlineGoods(scope.row.sid)">发布</el-button>
                    <el-button type="text" @click="editGoods(scope.row.sid)">编辑</el-button>
                    <el-button type="text"  @click="delGoods(scope.row.sid)">删除</el-button>
                </template>
            </el-table-column>
        </goods-table>

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

<script type="es6">
    import api from '../../../assets/config/m-api.js'
	import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import TimePeriod from '../../common/time-period.vue'
    import TpOrgan from '../../common/tp-organ.vue'
    import SubRefund from './sub-refund.vue'
	import { router } from '../../../pages/merchant.js'
    import { mixin_getButton } from '../../common/jkc-mixin.vue'
    import goodsTable from '../../common/goods-table.vue'
    import { headerData } from './page-config.js'
	export default {
        mixins: [mixin_getButton],
		data (){
			return {
                router,
                headerData,
                crumbs: [{
					title:'商品管理',
				},{
					title:'征订商品',
				}],
                searchForm: {
                    title: '',
                    brandSid: '',
                    start: '',
                    end: '',
                    msCategorySid: '',
                    organCode: '',
				},
                brandData: [],
                goodsGroup: [],
                goodsStates: this.$route.query.states,      // 切换商品状态
                goodsList: {
                    Selling: [],
                    Storage: [],
                    CloudCheck: [],
                    Refuse: [],
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
                offlineFormRules: {
                    opinion: [{
                        required: true,
                        message: '请说明下架理由',
                        targger: 'blur'
                    }]
                },
                offlineDialog: false,
                tableShow: true,    // 该变量用于通过 v-if 让组件重构渲染
			}
		},
		components: {
			jkcBreadcrumb,
            TimePeriod,
            goodsTable,
            TpOrgan,
            SubRefund
        },
		created (){		// 页面初始化可能会遇到的情况
            let query = JSON.parse(JSON.stringify(this.$route.query));
            query.pageIndex = 1;
            if(!this.$route.query.states){
		        query.states = 'Selling';
		        this.goodsStates = 'Selling';
			}
            if(!this.$route.query.type){
		        query.type  = 'Subscribe';	// Assist行销品
			}
            router.replace({path: this.$route.path, query: query})
            this.getBrand();
            this.getGroup();
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
                    query.states = 'Selling';
                    this.goodsStates = 'Selling';
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
                router.replace({path: this.$route.path, query: query});

                this.tableShow = false;
                setTimeout(() => {
                    this.tableShow = true;
                })
			},
            getBrand (){		// 获取商户自己的品牌
                this.$http.get(api.merchantBrand + 'mall')
                    .then((result) => {
                        this.brandData = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getGroup (){		// 获取商家店铺自定义分组
                this.$http.get(['shopBizCate', 'Mall'])
                    .then((result) => {
                        this.goodsGroup = result.body.data;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getGoodsList (params){		// 获取商品列表
                this.goodsList[params.states] = [];
                this.tLoading[params.states] = true;
                this.$http.get(['spuSubscribe', 'merchant'], {params : params})
				.then((result) => {
                    this.tLoading[params.states] = false;
                    if(result.body.code === 200){
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
            successCallback(){
                this.searchGoods();
            },
            editGoods (sid){		// 编辑商品
			    let query = JSON.parse(JSON.stringify(this.$route.query));
				query.step = 0;
				query.spuSid = sid;
                router.push({path: '/m_product/subscribe/add',query:query})
			},
        	delGoods (sid){			// 删除商品
            	this.$confirm('删除后不可恢复，确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
					this.$http.delete(['spuSubscribe', sid])
					.then((result) => {
						if(result.body.code === 200){
                            this.getGoodsList(this.$route.query);
							this.$message({type:'success',message:result.body.message});
						}
					}).catch((err) => {
						console.log(err)
					})
                });
			},
//            offlineGoods (sid){		// 商品下架，打开提示和form弹窗
//        	    this.offlineDialog = true;
//        	    this.offlineForm.spuSid = sid;
//			},
//            offlineGoodsConfirm (){		// 确认提交下架
//                this.$refs.offlineForm.validate(valid => {
//                    if(valid){
//                        this.$http.post(['subscribeOutsell', this.offlineForm.spuSid], this.offlineForm)
//                            .then((result) => {
//                                if(result.body.code === 200){
//                                    this.offlineDialog = false;
//                                    this.getGoodsList(this.$route.query);
//                                }
//                            }).catch((err) => {
//                            console.log(err)
//                        })
//                    }
//                })
//			},
			onlineGoods (sid){		// 商品上架
                this.$confirm('确定发布?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$http.post(['subscribeOnline', sid])
					.then((result) => {
						if(result.body.code === 200){
							this.getGoodsList(this.$route.query);
						}
					}).catch((err) => {
                        console.log(err)
                    })
                });
			},
            dialogClose (){		// 下架弹窗关闭重置下架表单
				this.$refs.offlineForm.resetFields();
			    this.offlineForm = {spuSid: '', opinion: ''};
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
