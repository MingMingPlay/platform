<template>
    <div class="search-fil-wrap one-line">
        <el-form :model="value" :inline="true">
            <el-form-item>
                <el-input v-model="value.title" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item>
                <select-merchant-sid v-model="value.merchantSid"></select-merchant-sid>
            </el-form-item>
            <el-form-item label="品类：">
                <select-category v-model="value.categorySid"></select-category>
            </el-form-item>
            <el-form-item label="品牌：">
                <select-brand v-model="value.brandSid"></select-brand>
            </el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form>
    </div>
</template>
<script>
    import selectCategory from '../../common/select-category.vue'
    import selectBrand from '../../common/select-brand.vue'
    import selectMerchantSid from '../../common/select-merchant-sid.vue'
    export default {
        props: {
            value: {
                type: Object,
                required: true
            }
        },
        data() {
            return {}
        },
        components: {
            selectCategory,
            selectBrand,
            selectMerchantSid,
        },
        watch: {
            value(){
                this.$emit('input', this.value)
            }
        },
        methods: {
            handleSearch(){
                this.$emit('handleSearch')
            }
        }
    }
</script>
<style>

</style>
