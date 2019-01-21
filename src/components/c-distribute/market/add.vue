<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <search-form-group v-model="form" @handleSearch="handleSearch"></search-form-group>

        <!--表格-->
        <el-row>
            <el-col :span="11" ref="rowHeight1">
                <common-table
                    :tableData="tableDataLeft"
                    :tableHeader="tableHeader"
                    :tableLoading="loadingLeft"
                    :select="true"
                    @select="selectRowLeft"
                    @select-all="selectRowLeft">
                    <goods-name-col slot="goods"></goods-name-col>
                </common-table>

                <!--分页-->
                <list-pagination
                    v-if="!loadingLeft && tableDataLeft.length > 0"
                    :pagination="paginationLeft"
                    :notLayout="'sizes'"
                    @handleCurrentChange="handlePageLeft">
                </list-pagination>
            </el-col>
            <el-col :span="2">
                <div style="text-align: center;margin-top: -50px" :style="{'padding-top': rowHeight/2 + 'px'}">
                    <p style="margin-bottom: 20px">
                        <el-button @click="addGoods">添加 &gt;</el-button>
                    </p>
                    <p style="margin-bottom: 30px">
                        <el-button @click="removeGoods">&lt; 移除</el-button>
                    </p>
                    <div>
                        <el-button
                            type="primary"
                            :disabled="tableDataRight.length === 0"
                            :loading="addLoading"
                            @click="save">保　存</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="11" ref="rowHeight2">
                <common-table
                    :tableData="tableDataRightShow[paginationRight.pageIndex - 1]"
                    :tableHeader="tableHeader"
                    :select="true"
                    @select="selectRowRight"
                    @select-all="selectRowRight">
                    <goods-name-col slot="goods"></goods-name-col>
                </common-table>

                <!--分页-->
                <list-pagination
                    v-if="tableDataRight.length > 0"
                    :pagination="paginationRight"
                    :notLayout="'sizes'"
                    @handleCurrentChange="handlePageRight">
                </list-pagination>

            </el-col>
        </el-row>



    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import goodsNameCol from '../common/goods-name-col.vue'
    import searchFormGroup from './search-form-group.vue'
    import { addCrumbs, addTableHeader } from './page-config.js'
    export default {
        data() {
            return {
                // 面包屑
                crumbs: addCrumbs,
                // 表单头部
                tableHeader: addTableHeader,
                // 内容的高度
                rowHeight: 0,
                form: {
                    title: '',
                    merchantSid: '',
                    categorySid: '',
                    brandSid: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
                // 表格数据
                tableDataLeft: [],
                tableDataRight: [],
                // 右边用于展示的数据，里面的数组是为了第一页时展示需要
                tableDataRightShow: [[]],
                //分页数据
                paginationLeft:{},
                paginationRight:{
                    pageIndex: 1,
                    pageSize: 10,
                    totalRow: null,
                    pageCount: 1,
                },
                // 加载
                loadingLeft: false,
                addLoading: false,
                selectLeft: [],
                selectRight: [],

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
        mounted(){
            this.resetHeight();
        },
        methods: {
            handleSearch(){
                this.form.pageIndex = 1;
                this.getData(this.form);
            },
            // 获取发放列表
            getData(params){
                this.loadingLeft = true;
                this.$http.get(['authorSpuNosalelist'], {params: params})
                    .then((result) => {
                        this.loadingLeft = false;
                        if(result.body.code === 200){
                            this.tableDataLeft = result.body.data;
                            this.paginationLeft = result.body.pagination;
                        }else{
                            this.$message.warning(result.body.message)
                        }
                        this.resetHeight();
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 重置中间两个按钮的位置
            resetHeight(){
                // 中间两个按钮的位置
                setTimeout(() => {
                    if(this.$refs.rowHeight1.$el.clientHeight > this.$refs.rowHeight2.$el.clientHeight){
                        this.rowHeight = this.$refs.rowHeight1.$el.clientHeight;
                    }else {
                        this.rowHeight = this.$refs.rowHeight2.$el.clientHeight;
                    }
                })
            },
            handlePageLeft(pageIndex, pageSize) {
                this.form.pageIndex = pageIndex;
                if(pageIndex === 1){
                    this.form.pageSize = pageSize;
                }
                this.getData(this.form);
            },
            handlePageRight(pageIndex, pageSize) {
                this.paginationRight.pageIndex = pageIndex;
                this.resetHeight();
            },
            selectRowLeft(selection){
                this.selectLeft = selection;
            },
            selectRowRight(selection){
                this.selectRight = selection;
            },
            // 添加
            addGoods(){
                if(this.selectLeft.length > 0){
                    this.selectLeft.forEach(value => {
                        let boole = this.tableDataRight.some(item => {
                            return item.sid === value.sid;
                        });
                        if (!boole){
                            this.tableDataRight.unshift(value);
                        }
                    });
                }
                this.refactorPage();
            },
            // 移除
            removeGoods(){
                this.tableDataRight = this.tableDataRight.filter(value => {
                    if(this.selectRight.indexOf(value) === -1){
                        return true;
                    }
                });
                this.selectRight = [];
                this.refactorPage();
            },
            // 把数据改造成分页的
            refactorPage(){
                this.paginationRight.totalRow = this.tableDataRight.length;
                this.paginationRight.pageCount = Math.ceil(this.tableDataRight.length/10);
                this.tableDataRightShow = [];
                let arr = [];
                this.tableDataRight.forEach(value => {
                    arr.push(value);
                    if(arr.length === 10){
                        this.tableDataRightShow.push(arr);
                        arr = [];
                    }
                });
                if(this.tableDataRightShow.length === 0 || arr.length > 0){
                    this.tableDataRightShow.push(arr);
                }
            },
            // 保存添加的商品
            save(){
                let data = [];
                data = this.tableDataRight.map(value => {
                    return value.sid;
                });
                this.addLoading = true;
                this.$http.post(['authorSpuAdd'], data)
                    .then((result) => {
                        this.addLoading = false;
                        if(result.body.code === 200){
                            this.tableDataRight = [];
                            this.tableDataRightShow = [[]];
                            this.getData(this.form);
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
