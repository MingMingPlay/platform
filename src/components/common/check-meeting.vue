<template>
    <div class="check-meeting">
        <div class="check-meeting-txt">共{{num}}位注册过惠汇app的内勤拥有本次{{name}}的核销权限</div>
        <!--<div class="check-meeting-btn"></div>-->
        <el-button type="text" @click="dialogTableVisible = true">查看详情</el-button>
        <el-dialog :visible.sync="dialogTableVisible" size="small" @close="closeDialogTableVisible" :close-on-click-modal="false">
            <div class="check-meeting-table">
                <div class="check-meeting-table-header container">
                    <div class="check-meeting-title">&nbsp;&nbsp;{{title}}可核销内勤名单</div>
                    <el-button class="check-meeting-excel" type="primary" @click="downExcel">导出</el-button>
                    <el-button class="check-meeting-excel" type="primary" @click="add" v-if="type !== 'j'">新增</el-button>
                </div>
                <el-table :data="gridData" height="500" v-loading="tableLoading">
                    <el-table-column type="index"          label="序号"          width="60" class-name="first-col-no-padding" align="center">
                        <template slot-scope="scope">
                            {{ scope.$index | newIndex(pageIndex, pageSize) }}
                        </template>
                    </el-table-column>
                    <el-table-column property="userName"   label="账号"          ></el-table-column>
                    <el-table-column property="realName"   label="内勤姓名"      ></el-table-column>
                    <el-table-column property="organName"  label="内勤所属机构"  ></el-table-column>
                    <el-table-column property="organId"    label="内勤机构ID"    ></el-table-column>
                    <el-table-column property="organLevel"    label="机构级别"    ></el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" v-if="!tableLoading">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="pageCount"
                    :total="totalRow">
                </el-pagination>
            </div>
        </el-dialog>

        <el-dialog class="check-meeting-new" v-if="type !== 'j'" :visible.sync="newDialogTableVisible" size="small" @close="closeNewDialogTableVisible" :close-on-click-modal="false">
            <div class="check-meeting-table">
                <div class="check-meeting-table-header container">
                    <div class="check-meeting-title">&nbsp;&nbsp;{{title}}可核销内勤名单 <span class="sub-title-inline">仅展示注册过惠汇APP的个险内勤</span></div>
                </div>
                <div class="name-list-search">
                    <el-form label-width="80px" :inline="true">
                        <el-form-item label="内勤姓名">
                            <el-input v-model="searchName"></el-input>
                        </el-form-item>
                        <el-button class="name-list-search-btn" type="primary" @click="searchNameDo">搜索</el-button>
                    </el-form>
                </div>
                <el-table :data="tableNameListData" height="500" v-loading="newTableLoading">
                    <el-table-column type="index"          label="序号"          width="60" class-name="first-col-no-padding" align="center">
                        <template slot-scope="scope">
                            {{ scope.$index | newIndex(pageIndex, pageSize) }}
                        </template>
                    </el-table-column>
                    <el-table-column property="userName"   label="账号"          ></el-table-column>
                    <el-table-column property="realName"   label="内勤姓名"      ></el-table-column>
                    <el-table-column property="organName"  label="内勤所属机构"  ></el-table-column>
                    <el-table-column property="organId"    label="内勤机构ID"    ></el-table-column>
                    <el-table-column property="organLevel" label="机构级别"    ></el-table-column>
                    <el-table-column    label="选择">

                        <template slot-scope="scope">
                            <el-checkbox name="select" :checked="scope.row.choose" :disabled="scope.row.choose" @change="selectOne($event, scope.row.userSid)"></el-checkbox>
                        </template>

                    </el-table-column>
                </el-table>
            </div>
            <div class="container">
                <el-button :disabled="selectedGroup.length === 0" class="name-list-search-do-btn" type="primary" @click="searchNameDoRequest">添加</el-button>
            </div>
            <!--<div class="pagination-wrap" v-if="!newTableLoading">
                <el-pagination
                    @size-change="newHandleSizeChange"
                    @current-change="newHandleCurrentChange"
                    :current-page="newPageIndex"
                    :page-size="newPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="newPageCount"
                    :total="newTotalRow">
                </el-pagination>
            </div>-->
        </el-dialog>
    </div>
</template>

<script>
    import ExportExcel from '../mixin/export-excel.vue'
    import { pubObj } from '../../assets/unit/public.js'
    export default {
        name: "check-meeting",
        props: ['type','title'],
        mixins: [ExportExcel],
        data () {
            let mainUrl = '';
            let subUrl = '';
            let sid = '';
            let excelName = '';
            let name = '';
            if (this.type === 'j') {
                mainUrl = 'incentive';
                subUrl = 'checker/';
                sid = this.$route.query.incentiveSid;
                excelName = '可核销该激励的内勤名单';
                name = '激励';
            } else {
                mainUrl = 'ticketMeeting';
                subUrl = 'inneruser/';
                sid = this.$route.query.sid;
                excelName = '可核销该会议的内勤名单';
                name = '会议';
            }
            return {
                mainUrl,
                subUrl,
                sid,
                excelName,
                name,
                searchName: '',
                selectedGroup: [],
                newDialogTableVisible: false,
                tableLoading: false,
                newTableLoading: false,
                pageIndex: 1,
                pageSize: 10,
                pageCount: 0,
                totalRow: 0,
                num: 0,
                exportButtonLoading: true,
                gridData: [],
                dialogTableVisible: false,
                isShowNameList: false,
                tableNameListData: []
            }
        },
        created () {
            this.getTableData();
        },
        methods: {
            selectOne (e, userSid) {
                if (this.type !== 'j') {
                    console.log(e.target.checked);
                    console.log(userSid);
                    if (e.target.checked) {
                        let isIncludes = false;
                        for (let i=0; i < this.selectedGroup.length; i++) {
                            if (this.selectedGroup[i] === userSid) {
                                isIncludes = true;
                            }
                        }
                        if (!isIncludes) {
                            this.selectedGroup.push(userSid);
                        }
                    } else {
                        for (let i=0; i < this.selectedGroup.length; i++) {
                            if (this.selectedGroup[i] === userSid) {
                                this.selectedGroup.splice(i, 1);
                            }
                        }
                    }
                    console.log(this.selectedGroup);
                }
            },
            /**
             * 添加
             **/
            searchNameDoRequest () {
                if (this.type !== 'j') {
                    pubObj.httpRequest(this, {
                        url: [this.mainUrl, this.subUrl, /*'oooSZz'*/this.sid],
                        method:'POST',
                        body: this.selectedGroup,
                        success(result) {
                            this.selectedGroup = [];
                        }
                    })
                }
            },
            /**
             * 搜索
             **/
            searchNameDo () {
                if (this.type !== 'j') {
                    if(this.newTableLoading){
                        return
                    }
                    this.newTableLoading = true;

                    pubObj.httpRequest(this, {
                        url: [this.mainUrl, 'search/', this.subUrl ],
                        params: {
                            name: this.searchName,
                            meetingSid: this.sid
                        },
                        success(result) {
                            this.newTableLoading = false;
                            this.tableNameListData = result.data
                        }
                    })
                }
            },
            add () {
                if (this.type !== 'j') {
                    this.isShowNameList = true;
                    this.dialogTableVisible = false;
                }
            },
            closeDialogTableVisible () {
                if (this.type !== 'j') {
                    if (this.isShowNameList) {
                        setTimeout(() => {
                            this.newDialogTableVisible = true;
                        }, 200);
                    }
                }
            },
            closeNewDialogTableVisible () {
                if (this.type !== 'j') {
                    this.isShowNameList = false;
                    this.tableNameListData = [];
                    this.searchName = '';
                    setTimeout(() => {
                        this.dialogTableVisible = true;
                        this.getTableData();
                    }, 200);
                }
            },
            downExcel () {
                this.exportButtonLoading = true;
                this.handleExportExcel([this.mainUrl, this.subUrl, 'excel/', /*'oooSZz'*/this.sid], this.title + this.excelName, (res) => {
                    this.exportButtonLoading = false;
                })
            },
            handleSizeChange (pageSize) {
                this.pageSize = pageSize;
                this.getTableData()
            },
            handleCurrentChange (pageIndex) {
                this.pageIndex = pageIndex;
                this.getTableData()
            },
            getTableData () {
                if(this.tableLoading){
                    return;
                }
                this.tableLoading =  true;
                pubObj.httpRequest(this, {
                    url: [this.mainUrl, this.subUrl, /*'oooSZz'*/this.sid],
                    params: {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    },
                    success(result) {
                        this.tableLoading =  false;
                        this.gridData = result.data;
                        if(result.data.length === 0){
                            this.pageIndex = 1;
                            this.totalRow = 0;
                        }
                        if(result.data.length > 0){
                            this.pageIndex = result.pagination.pageIndex;
                            this.pageSize = result.pagination.pageSize;
                            this.totalRow = result.pagination.totalRow;
                            this.num = result.pagination.totalRow;
                        }
                    }
                })
            }
        }
    }
</script>

<style>
    .sub-title-inline{
        font-size: 12px;color: #999;
    }
    .check-meeting .el-pagination{
        margin-top: 0;
    }
    .check-meeting .el-dialog .el-dialog__title{
        border-left: none;
        padding-left: 0;
    }
    .check-meeting .el-dialog .el-dialog__header {
        padding: 10px;
    }
    .check-meeting .el-dialog .el-dialog__body {
        padding: 0 35px;
        width: 900px;
        height: 605px;
        max-height: 605px;
        margin-top: 0;
    }
    .check-meeting-new .el-dialog .el-dialog__body {
        height: 630px;
        max-height: 630px;
    }
    .check-meeting .el-dialog--small{
        width: 900px;
        max-height: 900px;
    }

    .container:before,
    .container:after {
        display: table;
        content: " ";
    }
    .container:after {
        clear: both;
    }
    .check-meeting{
        font-size: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .check-meeting table{
        width: 100%;
    }
    .check-meeting-txt{
        width: 400px;
    }
    .check-meeting-table{
        min-height: 440px;
    }
    .check-meeting-table-header{
        margin-bottom: 10px;
    }
    .check-meeting-title{
        float: left;
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        border-left:4px solid #3388FF;
        line-height: 20px;
        margin-top: 4px;
    }
    .check-meeting-excel{
        float: right;
        margin-left: 15px;
    }
    .name-list-search-do-btn{
        float: right;
        margin-top: 10px;
    }
</style>
