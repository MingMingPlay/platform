<template>
    <el-table class="buyer-table"
        v-loading.body="tableLoading"
        :data="tableData"
        stripe
        @select="selectRow"
        @select-all="selectAll">
        <el-table-column type="selection" v-if="select"></el-table-column>
        <template v-for="(value, key) in tableHeader">
            <el-table-column v-if="key === 'content'"
                :key="key"
                :label="value.label"
                width="360"
                :align="value.align"
                :label-class-name="value.labelClassName"
                :class-name="value.className">
                <template slot-scope="scope">
                    <div class="comment-wrap">
                        <p class="comment">{{scope.row.content}} <span class="essence" v-if="scope.row.isEssence === 1">精华评价</span></p>
                        <p class="comment-img" v-if="scope.row.commentPic && scope.row.commentPic.length > 0">
                            <img v-for="item in scope.row.commentPic" :src="item" @click="showBigImg(item)" />
                        </p>
                        <p class="time">{{scope.row.createDate}}</p>
                        <p class="sub-comment" v-if="scope.row.auditContent">[回复] {{scope.row.auditContent}}</p>
                        <p class="time" v-if="scope.row.auditContent">{{scope.row.auditDate}}</p>
                        <!--<p class="sub-comment">[追加评论]商品很好商品很好商品很好商品很好商品很好很好商品很好商品很好很好商品很好商品很好很好商品很好商品很好</p>-->
                        <!--<p class="comment-img">-->
                            <!--<img src="https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3761083504,3769519560&fm=5" alt="">-->
                        <!--</p>-->
                        <!--<p class="desc" v-if="scope.$index === 3">确认收货后4天追加</p>-->
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                v-else-if="!value.slot"
                :key="key"
                :prop="key"
                :label="value.label"
                :width="value.width"
                :align="value.align"
                :label-class-name="value.labelClassName"
                :class-name="value.className">
            </el-table-column>
            <slot v-else-if="value.slot" :name="value.slot"></slot>
        </template>
        <slot name="handle"></slot>
    </el-table>
</template>
<script>
    /**
     * 通用型的表格组件
     * @params: tableData, tableHeader, tableLoading, select
     * */
    export default {
        props: {
            /* 表格的数据 */
            tableData: {
                type: Array,
                required: true,
                default: []
            },
            /*
             * 表格列的数据
             * {     和 element 表格组件参数一致
             *   label   列名称 必传
             *   width   列宽度
             *   align   列的对齐方式
             *   labelClassName  参见 element
             *   className   参见 element
             * }
             * */
            tableHeader: {
                type: Object,
                required: true
            },
            /* 表格的 loading 状态 */
            tableLoading: {
                required: true
            },
            /* 是否显示选择框，默认true */
            select: {
                required: false,
                default: true
            },
        },
        data() {
            return {
            }
        },
        methods: {
            showBigImg (url) {
                this.$emit('imgModel',url);
            },
            selectRow(selection, row){
                this.$emit('select', selection, row)
            },
            selectAll(selection){
                this.$emit('select-all', selection)
            },
        }
    }
</script>
<style>
.buyer-table .comment-wrap {
    padding-bottom: 5px;
}
.buyer-table .comment-wrap .comment,.buyer-table .comment-wrap .time,.buyer-table .comment-wrap .desc {
    font-size: 14px;
    line-height: 18px;
    margin-top: 5px;
}
.buyer-table .comment-wrap .comment .essence {
    display: inline-block;
    font-size: 14px;
    line-height: 18px;
    background: red;
    padding: 0 10px;
    color: #fff;
}
.buyer-table .comment-wrap .time,.buyer-table .comment-wrap .desc {
    color: #666;
}
.buyer-table .comment-wrap .sub-comment {
    font-size: 14px;
    line-height: 18px;
    padding-top: 3px;
    margin-top: 3px;
    border-top: 1px dashed #999;
}
.buyer-table .comment-wrap .comment-img {
    margin-top: 5px;
    height: 60px;
}
.buyer-table .comment-wrap .comment-img img {
    float: left;
    width: 60px;
    height: 60px;
    margin-right: 5px;
}
.buyer-table .comment-wrap .comment-img img:nth-last-child(1) {
    margin-right: 0;
}
.comment-wrap img{
    cursor: pointer;
}
</style>
