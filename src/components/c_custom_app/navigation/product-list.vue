<template>
    <div class="set-product clear">
        <jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>
        <div class="search-fil-wrap one-line" ref="search">
            <el-form class="search-form" label-width="80px" :model="searchForm" :inline="true">
                <el-form-item label="商品信息">
                    <el-input v-model="searchForm.title" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item label="所属商家">
                    <el-select
                        v-model="searchForm.merchantSid"
                        clearable
                        filterable
                        remote
                        placeholder="请输入商家名称"
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
                <el-form-item label="商品类型">
                    <el-select v-model="searchForm.type" placeholder="选择商品类型">
                        <el-option label="自营商品" value="General"></el-option>
                        <el-option label="行销品" value="Assist"></el-option>
                    </el-select>
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
                                    v-for="(item1,index) in item.children"
                                    :key="index"
                                    :label="item1.name"
                                    :value="item1.sid">
                                </el-option>
                            </el-option-group>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select v-model="searchForm.brandSid" clearable placeholder="选择品牌" no-data-text="暂无品牌">
                        <el-option
                            v-for="(item,index) in brandData"
                            :key="index"
                            :value="item.sid"
                            :label="item.nameFull">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="resetSearch" class="button-margin-button-22">重置条件</el-button>
                <el-button type="primary" @click="searchGoods" class="button-margin-button-22">搜索</el-button>
            </el-form>
        </div>

        <div class="con-wrap" ref="conWrap">
            <div class="left">
                <el-table :data="goodsList" :stripe="true" v-loading="goodsListLoading" ref="goodsList" @select="select" @select-all="selectAll">
                    <el-table-column type="selection" width="36" align="center" class-name="no-padding"></el-table-column>
                    <el-table-column type="index" label="序号" width="50" align="center" label-class-name="table-index-title" class-name="no-padding"></el-table-column>
                    <el-table-column label="商品名称" width="250" label-class-name="first-col-no-padding" class-name="first-col-no-padding">
                        <template slot-scope="scope">
                            <div class="goods-title">
                                <img :src="scope.row.mainImagePath" alt="">
                                <p class="title">{{scope.row.title}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inventory" label="库存" width="90">
                        <template slot-scope="scope">
                            <p :class="{'red':scope.row.inventory < 50}">{{scope.row.inventory}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="售价" width="120" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sellingPrice">{{scope.row.sellingPrice | currency}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="categoryName" label="品类"></el-table-column>
                    <el-table-column prop="merchantName" label="所属商家"></el-table-column>
                    <el-table-column prop="brandName" label="品牌"></el-table-column>
                </el-table>

                <div class="pagination-wrap" v-if="goodsList.length > 0">
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
            <div class="center">
                <p><el-button @click="joinSelected">添加&gt;&gt;</el-button></p>
                <p><el-button @click="removeSelected">&lt;&lt;删除</el-button></p>
            </div>
            <div class="right">
                <el-table :data="selectedList" :stripe="true" v-loading="selectedLoading" ref="selectedList" @select="selected" @select-all="selectedAll">
                    <el-table-column type="selection" width="36" align="center" class-name="no-padding"></el-table-column>
                    <el-table-column type="index" label="序号" width="50" align="center" label-class-name="table-index-title" class-name="no-padding"></el-table-column>
                    <el-table-column label="商品名称" width="250" label-class-name="first-col-no-padding" class-name="first-col-no-padding">
                        <template slot-scope="scope">
                            <div class="goods-title">
                                <img :src="scope.row.mainImagePath" alt="">
                                <p class="title">{{scope.row.title}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" width="90" align="center">
                        <template slot-scope="scope">
                            <div class="el-input">
                                <input type="text" class="el-input__inner"
                                       v-model="scope.row.customRank"
                                       @blur="selectedSort(scope.row)"
                                       @keyup="scope.row.customRank = pubObj.formatInt($event)">
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="button-group">
                    <el-button type="primary" @click="saveData">保存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../../assets/config/c-api.js'
    import { pubObj } from '../../../assets/unit/public.js'
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    export default {
        data() {
            return {
                pubObj: pubObj,
                crumbs: [{
                    title:'多版本管理',
                },{
                    title:'导航管理',
                },{
                    title:'导航添加商品',
                }],
                searchForm: {
                    title: '',
                    type: '',
                    categorySid: '',
                    brandSid: '',
                    merchantSid: '',
                    agentSid: '',
                },
                cateData: [],
                brandData: [],
                getMerchantLoading: false,
                merchantData: [],
                goodsList: [],
                pagination: {},
                goodsListLoading: false,
                selectLeft: [],
                selectRight: [],
                selectedList: [],   // 已配置的商品
                selectedLoading: false,
            }
        },
        components: {
            jkcBreadcrumb,
        },
        created(){
            this.getGoodsList(this.$route.query);
            this.getSelectedGoods();
            this.getBrand();
            this.getCate();
        },
        mounted(){
            this.$refs.conWrap.style.top = `${this.$refs.search.offsetHeight + 59}px`;
        },
        methods: {
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
            remoteMethod(query) {		// 动态搜索商家信息
                if(query === ''){
                    this.searchForm.merchantSid = '';
                }
                if (query !== '' && query.length > 1) {
                    this.getMerchantLoading = true;
                    this.$http.get(api.merchant + 'list', {params: {q: query}})
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
            getGoodsList (params){		// 获取商品列表
                this.goodsList = [];
                this.goodsListLoading = true;
                this.$http.get(api.spu + 'cloud/navigation', {params : params})
                    .then((result) => {
                        this.goodsListLoading = false;
                        if(result.body.code === 200){
                            this.goodsList = result.body.data;
                            this.pagination = result.body.pagination;
                            if(this.pagination.pageIndex == 0){
                                this.pagination.pageIndex = 1;
                            }
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            getSelectedGoods(){     // 获取已配置的商品
                // 此处由于后台做了分页，但这里不需要分页，所以把分页条数设置到了1000，如果不够再加 /尴尬
                this.selectedLoading = true;
                this.$http.get(`${api.spu}cloud/navigation/${this.$route.query.channelSid}/${this.$route.query.navigationSid}?pageSize=1000`)
                    .then((result) => {
                    this.selectedLoading = false;
                        if(result.body.code === 200){
                            this.selectedList = result.body.data;
                            this.selectedList.forEach((value, index) => {
                                value.customRank = this.selectedList.length - index;
                            });
                        }else{
                            this.$message({type:'warning',message:result.body.message});
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            resetSearch (){
                this.searchForm = {title: '', type: '', categorySid: '', brandSid: '', merchantSid: '', agentSid: ''};
                this.getGoodsList(this.$route.query);
            },
            searchGoods (){			// 搜索商品
                this.searchForm.agentSid = this.searchForm.merchantSid;
                var data = this.searchForm;
                for(let key in this.$route.query){
                    data[key] = this.$route.query[key];
                }
                this.getGoodsList(data);
            },
            /*initSelect (row,index){
                this.$refs.goodsList.toggleRowSelection(row,row.checked);
            },*/
            select (selection, row, bool){		// 单个选中的所有逻辑
                this.selectLeft = selection;
            },
            selectAll (selection){		// 全选逻辑
                this.selectLeft = selection;
            },
            selected(selection, row, bool){     // 在已选择的列表里单选
                this.selectRight = selection;
            },
            selectedAll(selection){     // 在已选择的列表全选
                this.selectRight = selection;
            },
            joinSelected(){     // 把左边选择的加入右边
                this.selectLeft.forEach(value => {
                    let boole = this.selectedList.some(item => {
                        return item.sid === value.sid;
                    });
                    if (!boole){
                        value.customRank = 1;
                        this.selectedList.push(value);
                    }
                });
            },
            removeSelected(){   // 移除右边选择的
                this.selectedList = this.selectedList.filter(value => {
                    if(this.selectRight.indexOf(value) === -1){
                        return true;
                    }
                });
                this.selectRight = [];
            },
            selectedSort(row){
                if(!row.customRank) row.customRank = 1;
                this.selectedList.sort((a, b) => {
                    return b.customRank - a.customRank;
                });
            },
            saveData(){
                let data = this.selectedList.map(value => {
                    return value.sid;
                });
                this.$http.put(api.navigation + this.$route.query.navigationSid+ '/'+ this.$route.query.channelSid + '/product', data)
                    .then(result => {
                        if(result.body.code === 200){
                            this.$message({
                                type: 'success',
                                message: result.body.message
                            })
                        }else{
                            this.$message({
                                type: 'warning',
                                message: result.body.message
                            })
                        }
                    })
                    .catch(error => {
                        this.$message({
                            type: 'warning',
                            message: result.body.message
                        })
                    });
            },
            handleSizeChange(size){
                let query = this.$route.query;
                query.pageSize = size;
                this.getGoodsList(query);
            },
            handleCurrentChange(index){
                let query = this.$route.query;
                query.pageIndex = index;
                this.getGoodsList(query);
            },
        }
    }
</script>
<style>
    .set-product{
        position: absolute;
        height: 100%;
        width: 100%;
        min-width: 1100px;
    }
    .set-product .search-fil-wrap .el-input,.set-product .search-fil-wrap .el-select{
        width: 210px;
    }
    .set-product .con-wrap{
        position: absolute;
        top: 130px;
        bottom: 60px;
        left: 0;
        right: 0;
    }
    .set-product .left{
        width: calc(100% - 540px);
        left: 0;
        top: 0;
        position: absolute;
        height: 100%;
        overflow-y: scroll;
    }
    .set-product .center{
        width: 100px;
        position: absolute;
        right: 454px;
        top: 30%;
    }
    .set-product .center p{
        margin-top: 20px;
    }
    .set-product .right{
        position: absolute;
        right: 0;
        top: 0;
        width: 454px;
        height: 100%;
        overflow-y: scroll;
    }
    .set-product .table-select-all{
        margin-bottom: 15px;
    }
    .set-product .table-select-all .el-checkbox{
        margin-right: 10px;
    }
    .set-product .goods-title{
        display: flex;
        padding: 5px 0;
    }
    .set-product .goods-title img{
        width:50px;
        height:50px;
        margin-right: 10px;
        border: 1px solid #e4eaee;
    }
    .set-product .goods-title .title{
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .set-product .pagination-wrap{
        position: absolute;
        width: 100%;
        bottom: 0;
        text-align: center;
    }
    .set-product .el-table{
        position: absolute;
        overflow: auto;
        top: 0;
        bottom: 40px;
        width: 100%;
    }
    .set-product .el-table .el-table__header-wrapper,
    .set-product .el-table .el-table__body-wrapper{
        overflow: initial;
    }
    .set-product .el-table .no-padding .cell{
        padding-left: 5px;
        padding-right: 5px;
    }
    .set-product .el-table .el-table__body .red{
        color: #f00;
    }
    .set-product .button-group{
        position: absolute;
        width: 100%;
        bottom: 0;
        text-align: center;
    }
</style>
