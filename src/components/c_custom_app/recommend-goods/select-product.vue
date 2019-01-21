<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="select-product">
            <!--查询-->
            <el-form :model="form" :inline="true" label-width="80px" style="margin: 10px 0 10px 100px;">
                <el-form-item label="商品名称">
                    <el-input v-model="form.title" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品品类">
                    <el-select v-model="form.categorySid" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in categories"
                            :key="item.sid"
                            :label="item.name"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属品牌">
                    <el-select v-model="form.brandSid" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in brands"
                            :key="item.sid"
                            :label="item.nameFull"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
            </el-form>
            
            <!--选择商品-->
            <div class="top">
                <div class="top-title"><span>商品列表</span></div>
                <el-table :data="tableData" v-loading="loading" stripe>
                    <el-table-column width="50" align="center">
                        <template slot-scope="scope">
                            <el-checkbox 
                                v-model="scope.row.isChecked" 
                                :disabled="scope.row.isSelected"
                                :data-index="scope.$index"
                                @change.native="handleCheckboxChange">
                            </el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" width="240">
                        <template slot-scope="scope">
                            <div class="image-text-wrap">
                                <img class="image" :src="scope.row.mainImagePath" />
                                <div class="text" v-text="scope.row.title"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品编码" prop="code" width="180"></el-table-column>
                    <el-table-column label="所属品类" prop="categoryName" align="center"></el-table-column>
                    <el-table-column label="所属品牌" prop="brandName" align="center"></el-table-column>
                    <el-table-column label="售价" prop="sellingPrice" align="center"></el-table-column>
                    <el-table-column label="状态" prop="stateName" align="center"></el-table-column>
                </el-table>
                <pagination 
                    event-name="table-pagination" 
                    :total="mxTableList.pagiTotal"
                    style="max-width: 1100px; margin-top: 20px; margin-left: 100px;">
                </pagination>
            </div>
            
            <!--穿梭按钮-->
            <div style="text-align: center; margin: 30px 0 30px 100px; max-width: 1100px;">
                <el-button type="primary" icon="arrow-down" @click="handleUnshift">到下边</el-button>
                <!--<el-button type="primary" icon="arrow-up" @click="handleSplice">到上边</el-button>-->
            </div>
            
            <!--活动商品-->
            <div class="bottom">
                <div class="bottom-title"><span>已选商品</span></div>
                <el-table :data="selectedData" stripe>
                    <!--<el-table-column type="selection" width="50" align="center"></el-table-column>-->
                    <el-table-column label="商品名称" width="240">
                        <template slot-scope="scope">
                            <div class="image-text-wrap">
                                <img class="image" :src="scope.row.mainImagePath" />
                                <div class="text" v-text="scope.row.title"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品编码" prop="code" width="180"></el-table-column>
                    <el-table-column label="售价" prop="sellingPrice" width="100" align="center"></el-table-column>
                    <el-table-column label="渠道" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.channelSid" placeholder="请选择">
                                <el-option
                                    v-for="item in channels"
                                    :key="item.sid"
                                    :label="item.name"
                                    :value="item.sid">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.rank" placeholder="排序"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" class="text-btn-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <!--操作按钮-->
            <div style="text-align: center; margin: 20px 0 10px 100px;">
                <el-button type="primary" @click="handleSubmit">保 存</el-button>
                <el-button type="default" @click="$router.go(-1)">取 消</el-button>
            </div>
            
        </div>
    </div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'
    // js
    import { pubObj, bus } from '../../../assets/unit/public.js'
    
    export default {
        componentName: 'table',
        
        components: { JkcBreadcrumb, Pagination },
        
        mixins: [TableList],
        
        data() {
            return {
                crumbs: [],
                categories: [],
                brands: [],
                channels: [],
                form: {
                    states: 'Selling',
                    isRecommend: true,
                    isBenefit: true
                },
                mxTableList: {
                    url: this.$api.spu + 'cloud',
                    mountQuery: {
                        states: 'Selling',
                        isRecommend: true,
                        isBenefit: true
                    },
                    pagiTotal: 0
                },
                // 临时选中(从上到下)
                tempSelected: [],
                // 临时选中(从下到上)
                tempSelection: [],
                // 已选商品
                selectedData: [],
                // 最终提交的list
                submitData: [],
            }
        },
        
        methods: {
            // 重载
            canBeOverrideFun(obj, index) {
                obj.isChecked = false;
                obj.isSelected = false;
                obj.channelSid = 'ooo_PJ'; // 默认太平惠汇
                obj.rank = 0;
                return obj;
            },
            handleCheckboxSearch() {
                this.getTableList(this.form, (data) => {
                    data.forEach((item) => {
                        this.selectedData.some((row) => {
                            if(item.sid === row.sid) {
                                item.isChecked = true;
                                item.isSelected = true;
                                return true;
                            } else {
                                return false;
                            }
                        })
                    });
                    data.forEach((item) => {
                        this.tempSelected.some((row) => {
                            if(item.sid === row.sid) {
                                item.isChecked = true;
                                return true;
                            } else {
                                return false;
                            }
                        })
                    });
                });
            },
            // 搜索
            handleSearch() {
                this.loading = true;
                this.handleCheckboxSearch();
            },
            // 勾选中当前行
            handleCheckboxChange(e) {
                const isChecked = e.target.checked;
                const path = e.target.parentElement.parentElement;
                const rowIndex = path.dataset.index;
                const row = this.tableData[rowIndex];
                if(isChecked) {
                    this.tempSelected.push(row);
                } else {
                    this.tempSelected = this.tempSelected.filter(item => {
                        return item.sid !== row.sid;
                    });
                }
            },
            // 到下边
            handleUnshift() {
                if(!this.tempSelected.length) { this.$message.info('请选择商品'); return false; };
                // 添加商品
                this.selectedData.unshift(...this.tempSelected);
                // 将已添加的商品设为不可选
                this.tempSelected.forEach(item => {
                    item.isSelected = true;
                });
                // 清空缓存
                this.tempSelected = [];
            },
            handleDelete(index, row) {
                this.selectedData.splice(index, 1);
                this.tableData.some((item) => {
                    if(item.sid === row.sid) {
                        item.isSelected = false;
                        return true;
                    } else {
                        return false;
                    }
                });
            },
            // 活动商品checkbox
            /*handleselected(selection) {
                this.tempSelection = selection;
            },*/
            // 到上边
            /*handleSplice() {
                if(!this.tempSelection.length) return;
                // 商品删除
                this.tempSelection.forEach(item => {
                    this.selectedData = this.selectedData.filter(row => {
                        return row.sid !== item.sid;
                    })
                });
                // 将商品设为可选
                this.tempSelection.forEach(item => {
                    item.isChecked = false;
                    item.isSelected = false;
                });
                // 清空缓存
                this.tempSelection = [];
            },*/
            // 发布
            handleSubmit(state) {
                if(!this.selectedData.length) { this.$message.info('请选择商品'); return false; };
                // 收集数据
                this.submitData = this.selectedData.reduce((arr, item, index) => {
                    arr[index] = {
                        channelSid: item.channelSid,
                        productSid: item.sid,
                        rank: item.rank
                    };
                    return arr;
                }, []);
                pubObj.httpRequest(this, {
                    url: ['recommendGoods'],
                    method: 'POST',
                    body: this.submitData,
                    success(result) {
                        this.$message.success(result.message);
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 1000)
                    }
                })
            }
        },
        
        created() {
            this.crumbs = [{ title: '多版本管理' }, { title: '商品展示' }, { title: '选择商品' }];
        },
        
        beforeMount() {
            // 获取品类
            pubObj.httpRequest(this, {
                url: this.$api.category,
                success(result) {
                    this.categories = result.data;
                    // 获取品牌
                    pubObj.httpRequest(this, {
                        url: this.$api.brand,
                        success(result) {
                            this.brands = result.data;
                        }
                    });
                    // 获取渠道
                    pubObj.httpRequest(this, {
                        url: this.$api.channel,
                        success(result) {
                            this.channels = result.data;
                        }
                    })
                }
            })
        },
        
        mounted() {
            bus.$on('table-pagination', (obj) => {
                this.loading = true;
                this.form = Object.assign(this.form, obj);
                this.handleCheckboxSearch();
            })
        }
        
        
    }
</script>

<style>
    .select-product { max-width: 1200px; margin: auto; }
    .select-product .el-table { max-width: 1100px; margin-left: 100px; }
    .select-product .el-table .cell { padding: 8px 16px; }
    .select-product .top, .select-product .bottom { overflow: hidden; position: relative; }
    .select-product .top .top-title, .select-product .bottom .bottom-title {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100px;
    }
    .select-product .top .top-title span, .select-product .bottom .bottom-title span {
        width: 100px;
        height: 30px;
        line-height: 30px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        text-align: center;
    }
    .select-product .image-text-wrap { position: relative; }
    .select-product .image-text-wrap .image { height: 50px; width: 50px; vertical-align: middle; }
    .select-product .image-text-wrap .text {
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