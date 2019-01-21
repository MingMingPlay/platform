<template>
    <div class="single-goods-wrap">
        <el-table :data="tableData" ref="table" v-loading="loading" highlight-current-row stripe>
            <el-table-column label="序号" width="40" class-name="first-col-no-padding" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(mxTableList.mountQuery.pageIndex, mxTableList.mountQuery.pageSize) }}
                </template>
            </el-table-column>
            <el-table-column label="商品名称">
                <template slot-scope="scope">
                    <div class="image-text-wrap">
                        <img :src="scope.row.mainImagePath | imageSize(100)" />
                        <div class="text" v-text="scope.row.title"></div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="merchantName" label="商家" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="sellingPrice" label="售价" width="60"></el-table-column>
            <el-table-column prop="inventory" label="库存" width="60"></el-table-column>
            <el-table-column label="状态" width="60">
                <template slot-scope="scope">
                    <el-button 
                            type="text" 
                            @click="handleSelect(scope.$index, scope.row)" 
                            :key="scope.row.sid">
                        {{scope.row.isClick ? '已选择' : '选择'}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination event-name="goods-pagination" :total="mxTableList.pagiTotal"></pagination>

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
        components: { Pagination },
        
        mixins: [TableList],
        
        inject: ['dialog'],
        
        data() {
            return {
                // 被选中行的位置信息
                selectRow: {},
                mxTableList: {
                    url: this.$api.spu + 'cloud/',
                    pagiTotal: 0,
                    mountQuery: {
                        navigationSid: null,
                        channelSid: null,
                        isBenefit: true
                    },
                    initTableFun: this.initTableFun,
                },
            }
        },
        
        /*computed: {
            dialog() {
                let parent = this.$parent;
                let parentName = parent.$options.componentName;
                while(parentName !== 'dialog') {
                    parent = parent.$parent;
                    parentName = parent.$options.componentName;
                }
                return parent;
            }
        },*/
        
        methods: {
            // 初始化执行函数
            initTableFun(data) {
                const row = this.selectRow;
                const query = this.mxTableList.mountQuery;
                if(row.pageIndex) {
                    if(row.pageIndex == query.pageIndex && row.pageSize == query.pageSize) {
                        data[row.rowIndex].isClick = true;
                    }
                }
                
                return data;
            },
            // 表示当前是否被选中
            canBeOverrideFun(obj) {
                obj.isClick = false; return obj;
            },
            // 单选商品
            handleSelect(rowIndex, row) {
                if(row.isClick) {
                    this.$message.info('当前商品已经被选中！');
                } else {
                    // 清掉上一次选择
                    if('rowIndex' in this.selectRow) {
                        this.tableData[this.selectRow.rowIndex].isClick = false;
                    }
                    // 记录当前选择项
                    row.isClick = true;
                    const _this = this.dialog;
                    _this.$set(_this.dialogForm, 'businessSid', row.sid);
                    _this.$set(_this.dialogForm, 'goodsName', row.title);
                    // 位置信息
                    this.selectRow.pageIndex = this.mxTableList.mountQuery.pageIndex || 1;
                    this.selectRow.pageSize = this.mxTableList.mountQuery.pageSize || 10;
                    this.selectRow.rowIndex = rowIndex;
                }
            }
        },
        
        /*created() {
            this.dialog.$goods = this;
            this.initData = JSON.parse(JSON.stringify(this.$data));
        },*/
        
        beforeMount() {
            this.mxTableList.mountQuery.navigationSid = this.dialog.dialogForm.navigationSid;
            this.mxTableList.mountQuery.channelSid = this.dialog.dialogForm.channelSid;
        },
        
        mounted() {
            bus.$on('goods-pagination', (obj) => {
                this.mxTableList.mountQuery = Object.assign(this.mxTableList.mountQuery, obj);
                this.getTableList(this.mxTableList.mountQuery);
            })
        }
    }
</script>

<style>
    .single-goods-wrap .image-text-wrap {
        position: relative;
        padding: 5px 0;
        height: 55px;
    }
    .single-goods-wrap .image-text-wrap img {
        width: 45px;
        height: 45px;
        vertical-align: top;
    }
    .single-goods-wrap .image-text-wrap .text {
        position: absolute;
        top: 5px;
        right: 0;
        left: 0;
        max-height: 45px;
        margin-left: 50px;
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
    .single-goods-wrap .el-table .cell {
        padding-left: 5px;
        padding-right: 5px;
    }
</style>
