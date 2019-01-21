<template>
    <div class="collapse-table-head">
        <div 
            class="cell" 
            v-for="column in columns" 
            :style="column.defaultStyle"
            v-text="column.label">
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            columns() {
                return this.table.columns;
            },
            table() {
                const parent = this.$parent;
                return parent;
            }
        }
    }
</script>

<style scoped>
    .collapse-table-head { 
        width: 100%;
        background-color: #eef1f6;
        border-bottom: 1px solid #dfe6ec;
        display: flex;
    }
    .cell {
        font-weight: bold;
        padding: 6px 14px;
        line-height: 28px;
        box-sizing: border-box;
    }
    .collapse-table-head .cell:nth-last-of-type(1) { flex-grow: 1; }
</style>