<template>
    <div class="detail-cell-wrap" :style="{width: width}">
        <p class="cell-title">{{title}}</p>
        <div class="detail-wrap" v-if="contentWrap">
            <div class="clear">
                <slot></slot>
            </div>
        </div>
        <div class="clear" v-else>
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            // 块的标题
            title: {
                required: true
            },
            // 宽度，不传默认100%，传的话需要单位
            width: {
                required: false
            },
            // 是否需要内容的背景
            contentWrap: {
                required: false,
                default: true
            }
        },
        data() {
            return {}
        },
    }
</script>
<style scoped>
.detail-cell-wrap {
    margin-top: 30px;
    color: #000;
}
.detail-cell-wrap .cell-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    padding-left: 14px;
    position: relative;
    margin-bottom: 14px;
}
.detail-cell-wrap .cell-title:after {
    content: '';
    display: block;
    position: absolute;
    width: 4px;
    height: 14px;
    background: #3388ff;
    left: 0;
    top: 1px;
}
.detail-cell-wrap .detail-wrap {
    background: #f5f8fa;
    border: 1px solid #e4eaee;
    padding: 18px;
}
</style>
