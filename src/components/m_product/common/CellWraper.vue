<template>
    <div class="cate-cell clear">
        <div class="cate-subtitle">
            <p class="cell-title"><span :class="{'require': isRequired}">{{title}}</span></p>
        </div>
        <div class="cate">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    /**
    * @name     新增商品字段行的包围
    * @attribute    {String} title  标题
    * @attribute    {Boolean} isRequired    是否必填，必填项会显示小红点
    * */
    export default {
        props: {
            title: {
                required: true
            },
            isRequired: {
                default: false
            }
        },
        data() {
            return {}
        },
    }
</script>
<style>

</style>
