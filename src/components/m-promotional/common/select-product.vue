<template>
    <div class="select-product">
        <!--是否全店铺-->
        <el-radio-group v-model="allMerchandise" style="margin: 10px 0px 10px 100px;" v-if="proType != 1">
            <el-radio :label="true">全店铺</el-radio>
            <el-radio :label="false">部分商品</el-radio>
        </el-radio-group>
        
        <div v-show="!allMerchandise">
            <!--查询-->
            <el-form :model="form" :inline="true" label-width="80px" style="margin: 10px 0 10px 100px;">
                <el-form-item label="商品名称">
                    <el-input v-model="form.title" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品类别">
                    <el-select v-model="form.categorySid" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in categories"
                            :key="item.sid"
                            :label="item.name"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <!--<el-button type="primary" disabled>导入</el-button>-->
                </el-form-item>
            </el-form>
            
            <!--选择商品-->
            <div class="top">
                <div class="top-title"><span>选择商品</span></div>
                <el-table :data="tableData" v-loading.body="loading" stripe>
                    <el-table-column width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio 
                                class="radio-label__hidden"
                                v-model="scope.row.isChecked" 
                                :label="true"
                                :data-index="scope.$index"
                                @change.native="handleRadioChange"
                                v-if="proType == 1">
                            </el-radio>
                            <el-checkbox 
                                v-model="scope.row.isChecked" 
                                :disabled="scope.row.isSelected"
                                :data-index="scope.$index"
                                @change.native="handleCheckboxChange"
                                v-else>
                            </el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" width="320">
                        <template slot-scope="scope">
                            <div class="image-text-wrap">
                                <img class="image" :src="scope.row.mainImagePath" />
                                <div class="text" v-text="scope.row.title"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品编码" prop="code"></el-table-column>
                    <el-table-column label="所属品类" prop="categoryName"></el-table-column>
                    <el-table-column label="售价" prop="sellingPrice"></el-table-column>
                </el-table>
                <pagination 
                    event-name="table-pagination" 
                    :total="mxTableList.pagiTotal"
                    style="max-width: 1100px; margin: 30px 0 30px 100px;">
                </pagination>
            </div>
            
            <!--穿梭按钮-->
            <div style="text-align: center; margin: 0 0 30px 100px; max-width: 1100px;" v-if="proType != 1">
                <el-button type="primary" icon="arrow-down" @click="handleUnshift">到下边</el-button>
                <!--<el-button type="primary" icon="arrow-up" @click="handleSplice">到上边</el-button>-->
            </div>
            
            <!--活动商品-->
            <div class="bottom">
                <div class="bottom-title"><span>活动商品</span></div>
                <el-table :data="selectedData" stripe>
                    <!--<el-table-column type="selection" width="50" align="center"></el-table-column>-->
                    <el-table-column label="商品名称" width="320">
                        <template slot-scope="scope">
                            <div class="image-text-wrap">
                                <img class="image" :src="scope.row.mainImagePath" />
                                <div class="text" v-text="scope.row.title"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品编码" prop="code"></el-table-column>
                    <el-table-column label="所属品类" prop="categoryName"></el-table-column>
                    <el-table-column label="售价" prop="sellingPrice"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleDelete(scope.$index, scope.row)" class="text-btn-delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
        <!--操作按钮-->
        <div style="text-align: center; margin: 20px 0 10px 100px;">
            <el-button 
                type="primary" 
                @click="pageform.activeStep--; pageform.activeView = 'PromotionalRule'">上一步
            </el-button>
            <el-button type="success" @click="handleSubmit(1)" :loading="btnLoading1">立即发布</el-button>
            <el-button type="primary" @click="handleSubmit(0)" :loading="btnLoading0">保存草稿</el-button>
            <el-button type="default" @click="$router.go(-1)">取消</el-button>
        </div>
        
    </div>
</template>

<script>
    // 组件
    import Pagination from '../../common/pagination.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'
    // js
    import { pubObj, bus } from '../../../assets/unit/public.js'
    
    export default {
        componentName: 'table',
        
        components: { Pagination },
        
        mixins: [TableList],
        
        data() {
            return {
                // 全店铺
                allMerchandise: false,
                form: {},
                categories: [],
                mxTableList: {
                    url: this.$api.spu + 'promotion',
                    pagiTotal: 0,
                },
                // 临时选中(从上到下)
                tempSelected: [],
                // 临时选中(从下到上)
                tempSelection: [],
                // 已选商品
                selectedData: [],
                proType: this.$route.query.type,
                prevRow: null,
                // 按钮加载中
                btnLoading0: false,
                btnLoading1: false,
            }
        },
        
        computed: {
            pageform() {
                let parent = this.$parent;
                if(parent) {
                    return parent;
                }
            }
        },
        
        watch: {
            allMerchandise(val) {
                if(val) {
                    pubObj.showMessage(this, {
                        title: '操作提示',
                        content: '选择全店铺，代表本店铺下所有商品都将参加活动！',
                        showCancelButton: false,
                        confirm() {}
                    })
                }
            }
        },
        
        methods: {
            // Radio
            radioOverride(obj) {
                obj.isChecked = false;
                return obj;
            },
            handleRadioChange(e) {
                const prevRow = this.prevRow;
                const isChecked = e.target.checked;
                const path = e.target.parentElement.parentElement;
                const rowIndex = path.dataset.index;
                const row = this.tableData[rowIndex];
                if(prevRow) {
                    this.tableData.some((row) => {
                        if(row.sid === prevRow.sid) {
                            row.isChecked = false;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    this.selectedData.splice(0, 1, row);
                    this.prevRow = row;
                } else {
                    this.selectedData.push(row);
                    this.prevRow = row;
                }
            },
            handleRadioDelete(index) {
                this.selectedData.splice(index, 1);
            },
            handleRadioSearch() {
                try {
                	const prevRow = this.prevRow;
                    this.getTableList(this.form, (data) => {
                        data.some((row) => {
                            if(row.sid === prevRow.sid) {
                                row.isChecked = true;
                                return true;
                            } else {
                                return false;
                            }
                        })
                    });
                } catch(e) {
                	console.log(e)
                }
            },
            // Checkbox
            checkboxOverride(obj) {
                obj.isChecked = false;
                obj.isSelected = false;
                return obj;
                // 匹配已选择商品
                /*this.selectedData.some(item => {
                    if(item.sid === obj.sid) {
                        obj.isChecked = true;
                        obj.isSelected = true;
                        return true;
                    } else {
                        return false;
                    }
                });*/
                
                /*if(this.$route.query.type == 1 && this.selectedData.length) {
                    obj.isSelected = true;
                };*/
            },
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
            handleCheckboxDelete(index, row) {
                this.selectedData.splice(index, 1);
                this.tableData.some((item) => {
                    if(item.sid === row.sid) {
                        item.isSelected = false;
                        return true;
                    } else {
                        return false;
                    }
                })
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
            handleDelete(index, row) {
                if(this.proType == 1) {
                    return this.handleRadioDelete(index);
                } else {
                    return this.handleCheckboxDelete(index, row);
                }
            },
            // 重载
            canBeOverrideFun(obj, index) {
                if(this.proType == 1) {
                    return this.radioOverride(obj);
                } else {
                    return this.checkboxOverride(obj);
                }
            },
//          // 禁用所有选择
//          handleLimit() {
//              if(this.selectedData.length) {
//                  this.tableData.forEach((row) => {
//                      row.isSelected = true;
//                  });
//              } else {
//                  return false;
//              }
//          },
            // 搜索
            handleSearch() {
                this.loading = true;
                if(this.proType == 1) {
                    this.handleRadioSearch();
                } else {
                    this.handleCheckboxSearch();
                }
            },
//          // 只能单选
//          handleSingleChecked() {
//              if(!this.tempSelected.length) return;
//              else {
//                  this.tempSelected[0].isChecked = false;
//                  this.tempSelected = [];
//              }
//          },
//          // 活动商品checkbox
//          handleselected(selection) {
//              this.tempSelection = selection;
//          },
//          // 到上边
//          handleSplice() {
//              if(!this.tempSelection.length) { this.$message.info('请选择商品'); return false; };
//              // 商品删除
//              this.tempSelection.forEach(item => {
//                  this.selectedData = this.selectedData.filter(row => {
//                      return row.sid !== item.sid;
//                  })
//              });
//              
//              // 只能单选
//              if(this.$route.query.type == 1) {
//                  this.tableData.forEach((row) => {
//                      row.isSelected = false;
//                  });
//              }
//              
//              // 将商品设为可选
//              this.tempSelection.forEach(item => {
//                  item.isChecked = false;
//                  item.isSelected = false;
//              });
//              // 清空缓存
//              this.tempSelection = [];
//          },
            // 发布
            handleSubmit(state) {
                if(!this.allMerchandise && !this.selectedData.length) { this.$message.info('请选择商品'); return false; };
                this['btnLoading' + state] = true;
                this.pageform.pageForm.state = state;
                this.pageform.pageForm.allMerchandise = this.allMerchandise;
                // 收集商品sid
                this.pageform.pageForm.merchandises = this.selectedData.reduce((arr, item, index) => {
                    arr[index] = item.sid;
                    return arr;
                }, []);
                pubObj.httpRequest(this, {
                    url: ['merchantPromo'],
                    method: 'POST',
                    body: this.pageform.pageForm,
                    complete(result) {
                        this.$message.warning(result.message);
                        this['btnLoading' + state] = false;
                    },
                    success(result) {
                        this.$message.success(result.message);
                        setTimeout(() => {
                            this['btnLoading' + state] = false;
                            this.$router.go(-1);
                        }, 1000)
                    }
                })
            }
        },
        
        beforeMount() {
            pubObj.httpRequest(this, {
                url: this.$api.category,
                success(result) {
                    this.categories = result.data;
                }
            })
        },
        
        mounted() {
            bus.$on('table-pagination', (obj) => {
                this.loading = true;
                this.form = Object.assign(this.form, obj);
                if(this.proType == 1) {
                    this.handleRadioSearch();
                } else {
                    this.handleCheckboxSearch();
                }
            });
        },
        
        destroyed() {
            bus.$off();
        }
    }
</script>

<style>
    .select-product .radio-label__hidden .el-radio__label { display: none; }
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