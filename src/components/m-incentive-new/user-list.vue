<template>
    <el-dialog title="查看明细" v-model="dialogVisible" class="user-table-demo">
        <div style="margin-bottom: 10px;">
            <span style="display: inline-block; margin-right: 10px;">
                <span>总人数：</span>
                <span v-text="totalPeople"></span>
            </span>
            <span style="display: inline-block; margin-right: 10px;" class="danger">
                <span>失败人数：</span>
                <span v-text="errorPeople"></span>
            </span>
            <span style="display: inline-block;" class="success">
                <span>成功人数：</span>
                <span v-text="successPeople"></span>
            </span>
        </div>

        <el-table :data="tableData" stripe>
            <el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                </template>
            </el-table-column>
            <el-table-column label="工号" prop="jobNum" align="center"></el-table-column>
            <el-table-column label="姓名" prop="name" align="center"></el-table-column>
            <!--<el-table-column label="组织机构ID" prop="orgCode" align="center" width="140"></el-table-column>-->
            <el-table-column label="领取数量" prop="amount" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <span :class="[scope.row.success ? 'success' : 'danger']">{{ scope.row.success ? '成功' : '失败' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="信息" prop="msg" align="center"></el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="6"
            layout="total, prev, pager, next, jumper"
            :total="totalPeople"
            style="margin: 20px 0; text-align: right;">
        </el-pagination>

    </el-dialog>
</template>

<script>

    import { pubObj, bus } from '../../assets/unit/public.js'

    export default {

        props: {
            userData: Array,
        },

        data() {
            return {
                dialogVisible: false,
                currentPage: 1,
            }
        },

        computed: {
            // 总人数
            totalPeople() {
                let people = 0;
                const data = this.userData;
                if(data) {
                    people = data.reduce((sum, item) => {
                        return sum + item.totalCount;
                    }, 0);
                };
                return people;
            },
            errorPeople() {
                let people = 0;
                const data = this.userData;
                if(data) {
                    people = data.reduce((sum, item) => {
                        return sum + item.errorCount;
                    }, 0);
                };
                return people;
            },
            successPeople() {
                let people = 0;
                const data = this.userData;
                if(data) {
                    people = data.reduce((sum, item) => {
                        return sum + item.successCount;
                    }, 0);
                };
                return people;
            },
            allData() {
                let allData = [];
                const data = this.userData;
                if(data) {
                    allData = data.reduce((arr, item) => {
                        return arr.concat(item.userInfoDTOList);
                    }, []);
                };
                return allData;
            },
            // 数据
            tableData() {
                const userData = this.allData;
                let data = userData.slice(0, 6);
                const pageIndex = this.currentPage;
                data = userData.slice((pageIndex - 1) * 6, (pageIndex - 1) * 6 + 6);
                return data;
            }
        },

        methods: {
            // 分页显示个数
            handleSizeChange() {},
            // 分页当前页
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            }
        },

        created() {
            this.$nextTick(() => {
                bus.$on('user-list-table', (obj) => {
                    this.dialogVisible = true;
                });
            });
        }
    }
</script>

<style>
    .user-table-demo .el-dialog--small, .user-table-demo .el-dialog--small .el-dialog__body { width: 640px; }
	.user-table-demo .el-dialog--small .el-dialog__body {
        max-height: 554px;
    }
    .user-table-demo .success { color: #67C23A; }
    .user-table-demo .danger { color: #F56C6C; }
</style>
