<template>
    <el-table-column label="状态" align="center" slot="state">
        <template slot-scope="scope">
            <span>{{stateNames[scope.row.commentStatus]}}</span>
        </template>
    </el-table-column>
</template>
<script>
    export default {
        data() {
            return {
                stateNames: {
                    '0': '待审核',
                    '1': '审核通过',
                    '2': '审核拒绝',
                    '3': '已删除',
                    '4': '申诉中',
                }
            }
        },
    }
</script>
<style>

</style>
