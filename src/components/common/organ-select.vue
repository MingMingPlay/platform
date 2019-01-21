<template>
    <div class="custom-cascader">
        <el-cascader
            :value="value"
            :options="organData"
            :props="propsObj"
            :show-all-levels="false"
            change-on-select
            clearable
            @change="handleOrganChange">
        </el-cascader>
    </div>
</template>

<script>
    export default {
        props: {
            value: Array,
            organData: {
                type: Array,
                default() { return [] }
            }
        },
        
        data() {
            return {
                propsObj: {
                    label: 'name',
                    value: 'code',
                    children: 'children'
                }
            }
        },
        
        methods: {
            handleOrganChange(val) {
                this.$emit('input', val);
                /*const organCode = val[val.length - 1];
                this.$emit('get-organ-code', organCode);*/
            },
        }
    }
</script>

<style>
    .custom-cascader .el-cascader__label { line-height: inherit; }
</style>