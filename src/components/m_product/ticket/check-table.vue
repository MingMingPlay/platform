<template>
    <div>
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-title">
            {{$route.query.name}}会议签到表
            <el-button
                type="primary"
                :disabled="loading"
                :loading="meetingState"
                style="position: absolute;right: 200px;"
                @click="exportPdf">{{buttonText}}</el-button>
            <el-button
                type="primary"
                :disabled="loading"
                :loading="meetingInnerState"
                style="position: absolute;right: 0"
                @click="exportInnerPdf">{{buttonInnerText}}</el-button>
        </div>

        <!--表格-->
        <common-table
            :tableData="tableData"
            :tableHeader="tableHeader"
            :tableLoading="loading">
        </common-table>

        <!--分页-->
        <list-pagination
            v-if="!loading && tableData.length > 0"
            :pagination="pagination"
            @handleSizeChange="handlePage"
            @handleCurrentChange="handlePage">
        </list-pagination>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import commonTable from '../../common/common-table.vue'
    import listPagination from '../../common/list-pagination.vue'
    import { listCrumbs, tableHeader } from './page-config.js'
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        data() {
            return {
                // 面包屑
                crumbs: listCrumbs,
                // 表单头部
                tableHeader: tableHeader,
                // 表格数据
                tableData: [],
                //分页数据
                pagination:{},
                form: {
                    pageIndex: 1,
                    pageSize: 10,
                },
                // 加载
                loading: false,
                meetingState: false,
                buttonText: '导出会议外勤签到表',
                meetingInnerState: false,
                buttonInnerText: '导出会议内勤签到表'
            };
        },
        components:{
            jkcBreadcrumb,
            commonTable,
            listPagination,
        },
        created(){
            this.getData();
        },
        methods: {
            // 获取发放列表
            getData(){
                this.loading = true;
                this.$http.get(['ticketMeetingCoupon', this.$route.query.sid], {params: this.form})
                    .then((result) => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.tableData = result.body.data;
                            this.pagination = result.body.pagination;
                        }else{
                            this.$message.warning(result.body.message)
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            handlePage(pageIndex, pageSize) {
                this.form.pageIndex = pageIndex;
                if(pageIndex === 1){
                    this.form.pageSize = pageSize;
                }
                this.getData();
            },
            // 外勤签到导出 PDF
            exportPdf(){
                this.$confirm('签到表一旦生成将不可更改', '提示', {type: 'warning'})
                    .then(() => {
                        let url = this.$api.ticketMeetingCouponPdf.url + this.$route.query.sid;
                        this.meetingState = true;
                        this.buttonText = '生成中...';
                        this.$http.get(url, {responseType: 'blob'})
                            .then(result => {
                                this.meetingState = false;
                                this.buttonText = '导出会议外勤签到表';
                                if(result.body.code){
                                    this.$message.warning(result.body.message)
                                }else {
                                    let aLink = document.createElement('a');
                                    let blob = new Blob([result.body], {
                                        type: 'application/x-msdownload;charset=UTF-8'
                                    });
                                    let downUrl = window.URL.createObjectURL(blob);
                                    const pdfName=this.$route.query.name + '会议外勤签到表.pdf';
                                    if(IEDownload(this,blob,pdfName))return;
                                    aLink.download = pdfName;
                                    aLink.href = downUrl;
                                    document.body.appendChild(aLink);
                                    aLink.click();
                                    document.body.removeChild(aLink);
                                }
                            })
                    });
            },
            // 内勤签到导出 PDF
            exportInnerPdf(){
                this.$confirm('签到表一旦生成将不可更改', '提示', {type: 'warning'})
                    .then(() => {
                        let url = this.$api.ticketMeetingCouponInnerPdf.url + this.$route.query.sid;
                        this.meetingInnerState = true;
                        this.buttonInnerText = '生成中...';
                        this.$http.get(url, {responseType: 'blob'})
                            .then(result => {
                                this.meetingInnerState = false;
                                this.buttonInnerText = '导出会议内勤签到表';
                                if(result.body.code){
                                    this.$message.warning(result.body.message)
                                }else {
                                    let aLink = document.createElement('a');
                                    let blob = new Blob([result.body], {
                                        type: 'application/x-msdownload;charset=UTF-8'
                                    });
                                    let downUrl = window.URL.createObjectURL(blob);
                                    const pdfName=this.$route.query.name + '会议内勤签到表.pdf';
                                    if(IEDownload(this,blob,pdfName))return;
                                    aLink.download = pdfName;
                                    aLink.href = downUrl;
                                    document.body.appendChild(aLink);
                                    aLink.click();
                                    document.body.removeChild(aLink);
                                }
                            })
                    });
            }
        },
    };
</script>
<style scoped>

</style>
