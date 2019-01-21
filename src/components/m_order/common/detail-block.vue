<template>
    <ul class="detail-block">
        <li v-for="item in blockStatic">
            <label :style="activeStyle" style="text-align-last: justify;">{{ item.label }}</label
            ><el-button
                type="text"
                @click="handleSearchLogistics(blockData[item.prop])"
                v-if="item.type === 'btn'">{{ blockData[item.prop] }}
            </el-button><img
                v-for="i in item.prop"
                v-if="item.type === 'img' &&　blockData[i]"
                class="img"
                :src="blockData[i]"
                @click="handlePreview(blockData[i])"
            /><span v-if="!item.type">{{ blockData[item.prop] | itemIsNull }}</span>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            labelWidth: {
                type: [String, Number],
                default: 80
            },
            blockStatic: {
                type: Array,
                default() { return [] }
            },
            blockData: {
                type: Object,
                default() { return {} }
            }
        },
        computed: {
            activeStyle() {
                return { width: this.labelWidth + 'px' };
            }
        },
        filters: {
            itemIsNull(val) {
                if(val === undefined || val === null || val === '') return '--';
                else return val;
            }
        },
        methods: {
            // 查看物流信息
            handleSearchLogistics(val) {
                const company = this.blockData.transportCompany;
                window.open(encodeURI(this.$api.shippingWeb + '?company=' + company + '&transportId=' + val))
            },
            // 预览图片
            handlePreview(url) {
                window.open(url)
            }
        }
    }
</script>

<style scoped>
    .detail-block {
        width: 100%;
        overflow: hidden;
    }
    .detail-block li {
        float: left;
        display: inline-block;
        width: 33.3333%;
        line-height: 30px;
        margin-bottom: 10px;
    }
    .detail-block li > label {
        display: inline-block;
        text-align: right;
        margin-right: 20px;
    }
    .detail-block .img {
        width: 120px;
        height: 80px;
        vertical-align: top;
    }
    .detail-block .img+.img { margin-left: 10px; }
</style>
