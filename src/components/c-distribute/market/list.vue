<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <search-form-group v-model="form" @handleSearch="handleSearch"></search-form-group>

        <div style="text-align: right;margin-bottom: 15px">
            <el-popover placement="bottom-end" ref="popover" width="220">
                <div>
                    <el-input
                        v-model="supplyPercent"
                        @keyup.native="supplyPercent = pubObj.formatInt($event)"
                        style="width: 100px;margin-bottom: 10px;"
                        :maxlength="3"></el-input>%
                    <el-button type="primary" @click="handleSupply" :loading="supplyLoading">保存</el-button>
                    <p>作者供应价=供货商供应价+（供货商供应价  x  n%），n=作者供应价百分比</p>
                </div>
            </el-popover>
            <el-button type="text" v-popover:popover>作者供应价配置</el-button>

            <el-button
                type="primary"
                @click="$router.push({path: '/c_distribute/market/add'})">添加商品</el-button>
        </div>

        <!--表格-->
        <common-table
            :tableData="tableData"
            :tableHeader="tableHeader"
            :tableLoading="loading"
            :select="true"
            :index="false"
            @select="selectRow"
            @select-all="selectRow">
            <goods-name-col slot="goods"></goods-name-col>
            <el-table-column slot="profitRatio" label="分润比例">
                <template slot-scope="scope">
                    <div style="width: 65px;">
                        <el-input
                            v-model="scope.row.profitRatio"
                            @keyup.native="scope.row.profitRatio = pubObj.formatInt($event)"
                            style="width: 50px;"
                            :maxlength="3"
                            :loading="profitLoading"
                            @blur="handleProfit(scope.row)">
                        </el-input>%
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" slot="handle" width="120">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="text"
                        @click="$router.push({path: '/c_distribute/market/detail', query: {sid: scope.row.sid}})">查看</el-button>
                    <el-button
                        size="small"
                        type="text"
                        :loading="removeLoading"
                        @click="handleRemove(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </common-table>

        <div class="marginTop">
            <el-button
                type="danger"
                :loading="removeLoading"
                :disabled="removeData.length === 0"
                @click="handleRemove">
                移除
            </el-button>
        </div>

        <!--分页-->
        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import goodsNameCol from '../common/goods-name-col.vue'
    import searchFormGroup from './search-form-group.vue'
    import { listCrumbs, tableHeader } from './page-config.js'
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        data() {
            return {
                pubObj: pubObj,
                // 面包屑
                crumbs: listCrumbs,
                // 表单头部
                tableHeader: tableHeader,
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                // 加载
                loading: false,
                form: {
                    title: '',
                    merchantSid: '',
                    categorySid: '',
                    brandSid: '',
                    pageIndex:1,
                    pageSize:10,
                },
                // 供应价配置
                supplyPercent: '',
                removeLoading: false,
                removeData: [],
                supplyLoading: false,
                profitLoading: false,
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
            goodsNameCol,
            searchFormGroup,
        },
        created(){
            this.getData(this.form);
        },
        methods: {
            // 获取发放列表
            getData(params){
                this.loading = true;
                this.$http.get(['authorSpuCloudlist'], {params: params})
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            if(this.tableData.length > 0){
                                this.supplyPercent = this.tableData[0].costPriceRatio;
                            }
                            this.pagination = result.body.pagination;
                        }else{
                            this.$message.warning(result.body.message)
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            handlePage(pageIndex, pageSize) {
                this.form.pageIndex = pageIndex;
                if(pageIndex === 1){
                    this.form.pageSize = pageSize;
                }
                this.getData(this.form);
            },
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            // 选择列表数据
            selectRow(selection){
                if(selection.length > 0){
                    this.removeData = selection.map(value => {
                        return value.sid;
                    })
                }else {
                    this.removeData = [];
                }
            },
            handleRemoveSubmit(data){
                this.$confirm('确定移除？', '提示')
                    .then(()=> {
                        this.removeLoading = true;
                        this.$http.post(['authorSpuRemove'], data)
                            .then((result) => {
                                this.removeLoading = false;
                                if(result.body.code === 200){
                                    this.getData(this.form);
                                    this.removeData = [];
                                    this.$message.success(result.body.message)
                                }else{
                                    this.$message.warning(result.body.message)
                                }
                            }).catch((err) => {
                            console.log(err)
                        })
                    });
            },
            handleRemove(data){
                if(data.sid){
                    this.handleRemoveSubmit([data.sid]);
                }else {
                    this.handleRemoveSubmit(this.removeData);
                }
            },
            // 批量设置作者供应价
            handleSupply(){
                if(this.supplyPercent > 15){
                    this.supplyPercent = 15;
                    this.$message.warning('供应价比例不能大于15%');
                }else if(this.supplyPercent < 1){
                    this.supplyPercent = 1;
                    this.$message.warning('供应价比例不能小于1%');
                }
                this.supplyLoading = true;
                this.$http.post(['authorSpuPriceratio'], this.supplyPercent)
                    .then((result) => {
                        this.supplyLoading = false;
                        if(result.body.code === 200){
//                            this.getData(this.form);
                            this.$message.success(result.body.message)
                        }else{
                            this.$message.warning(result.body.message)
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 设置分润比例
            handleProfit(row){
                if(row.profitRatio > 100){
                    row.profitRatio = 100;
                    this.$message.warning('分润比例不能大于100%');
                }else if(row.profitRatio < 1){
                    row.profitRatio = 1;
                    this.$message.warning('分润比例不能小于1%');
                }
                this.profitLoading = true;
                this.$http.post(['authorSpuProfitratio', row.sid], row.profitRatio)
                    .then((result) => {
                        this.profitLoading = false;
                        if(result.body.code === 200){
//                            this.getData(this.form);
                            this.$message.success(result.body.message)
                        }else{
                            this.$message.warning(result.body.message)
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            }
        },
    };
</script>
<style scoped>

</style>
