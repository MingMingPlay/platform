<template>
    <div class="incentive-detail">
        <el-breadcrumb separator=">" style="padding: 14px 0;">
            <el-breadcrumb-item>激励方案</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="handleGotoList">方案管理</el-breadcrumb-item>
            <el-breadcrumb-item>方案详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="title-wrapper" style="position: relative;">
            <h1 class="title-name" v-text="detailData.title"></h1>
            <span class="title-state" v-text="detailData.stateName"></span>
        </div>


        <el-tabs style="margin-top: 10px;" v-model="activePane" type="card">
            <el-tab-pane label="基本信息" name="0">
                <div class="left" style="width: 60%;">
                    <jk-labels :model="detailData" label-width="100px" label-right="20px">
                        <jk-labels-item label="方案ID" prop="sid"></jk-labels-item>
                        <jk-labels-item label="方案类型" prop="typeName"></jk-labels-item>
                        <jk-labels-item label="方案属性" v-if="detailData.abandon">代理人可放弃</jk-labels-item>
                        <jk-labels-item label="方案属性" v-else>代理人不允许放弃</jk-labels-item>
                        <!--<jk-labels-item label="折合现金" prop="unitCash"></jk-labels-item>-->
                        <jk-labels-item label="DU号" prop="duStr"></jk-labels-item>
                        <jk-labels-item label="创建时间" prop="createdTime"></jk-labels-item>
                        <jk-labels-item label="有效期" prop="availableTime"></jk-labels-item>
                        <jk-labels-item label="发布机构" prop="publishMerchantName"></jk-labels-item>
                        <jk-labels-item label="发布人" prop="publishName"></jk-labels-item>
                        <jk-labels-item label="可核销内勤">
                            <CheckMeeting :type="'j'" :title="detailData.title"></CheckMeeting>
                        </jk-labels-item>
                    </jk-labels>
                    <el-table border style="width: 100%" :data="goodsList" tooltip-effect="light">
                        <el-table-column label="序号">
                            <template slot-scope="scope">{{scope.$index}}</template>
                        </el-table-column>
                        <el-table-column label="物品类型">
                            <template slot-scope="scope">
                                <span v-show="scope.row.goodsType === 'Cash'">现金</span>
                                <span v-show="scope.row.goodsType === 'Entity'">实物</span>
                                <span v-show="scope.row.goodsType === 'Travel'">旅游</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="物品名称">
                            <template slot-scope="scope">{{scope.row.goodsTitle}}</template>
                        </el-table-column>
                        <el-table-column label="物品简介" show-overflow-tooltip>
                            <template slot-scope="scope">{{scope.row.goodsInfo}}</template>
                        </el-table-column>
                        <el-table-column label="物品属性">
                            <template slot-scope="scope">
                                <span v-show="scope.row.abandon">可放弃</span>
                                <span v-show="scope.row.cashable">可折现</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="right">
                    <yu-lan :goodsList="goodsList" :title="detailData.title"></yu-lan>
                </div>
            </el-tab-pane>

            <el-tab-pane label="领取情况" name="1" style="min-height: 100px">
                <div class="btn-wrapper">
                    <el-button type="primary" @click="handleExportExcel">导出明细</el-button>
                </div>
                <el-table :data="tableData" v-loading.body="loading" style="margin-top: 40px;" stripe>
                    <el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                        <template slot-scope="scope">
                            {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="工号" prop="jobNum"></el-table-column>
                    <el-table-column label="姓名" prop="name"></el-table-column>
                    <el-table-column label="手机号" prop="contactPhone"></el-table-column>
                    <el-table-column label="物品名称" prop="goodsTitle"></el-table-column>
                    <el-table-column label="物品类型" prop="goodsTypeName"></el-table-column>
                    <el-table-column label="领取类型" prop="getType"></el-table-column>
                    <el-table-column label="数量" prop="amount"></el-table-column>
                    <el-table-column label="确认时间" prop="confirmTime"></el-table-column>
                    <el-table-column label="领用码" prop="ticketCode"></el-table-column>
                    <el-table-column label="核销人" prop="checkName"></el-table-column>
                    <el-table-column label="核销时间" prop="checkTime"></el-table-column>
                    <el-table-column label="领取状态" prop="stateName"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!--<span class="canDoGoBack" v-if="scope.row.canDoGoBack" @click="goStatusBack(scope.row.inspireUserSid)">回退</span>-->
                            <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                content="回退该代理人领取状态到未领取">
                                <span slot="reference" class="canDoGoBack" v-if="scope.row.canDoGoBack" @click="goStatusBack(scope.row.inspireUserSid)">回退</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination event-name="detail-pagination" :total="mxTableList.pagiTotal"></pagination>
            </el-tab-pane>

            <el-tab-pane label="生成财务PDF" name="2">
                <div style="width: 90%;">
                    <!--标题-->
                    <h3>{{ detailData.title }}</h3>
                    <!--表单-->
                    <div v-for="(item,index) in form1.valueInfo" v-if="!isDownload && form1.valueInfo.length>0" class="forms">
                        <el-form :ref="'signForm' + index" :rules="rules" :inline="true" :model="form1" class="sign-form" label-width="80px" label-position="left">
                            <el-form-item v-bind:label="'物品' + (index+1) + ':'" class="is-required"></el-form-item>
                            <el-form-item v-bind:label="item.goodsTitle">
                                <el-select v-model="item.type" placeholder="请选择" :disabled="isDownload">
                                    <el-option label="总计" value="Total"></el-option>
                                    <el-option label="单价" value="Unit"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="valueAmount" label="物品价值（元）" label-width="120px">
                                <el-input v-model="item.valueAmount" :disabled="isDownload"></el-input>
                            </el-form-item>
                            <el-form-item prop="cashAmount" label="折现价值（元）" label-width="120px">
                                <el-input v-model="item.cashAmount" :disabled="isDownload"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-for="(item,index) in form1.valueInfo" v-if="isDownload && form1.valueInfo.length>0" class="forms">
                        <el-form :inline="true" :model="form1" class="sign-form" label-width="80px" label-position="left">
                            <el-form-item v-bind:label="'物品' + (index+1) + ':'" class="is-required"></el-form-item>
                            <el-form-item v-bind:label="item.goodsTitle">
                                <el-select v-model="item.type" placeholder="请选择" :disabled="isDownload">
                                    <el-option label="总计" value="Total"></el-option>
                                    <el-option label="单价" value="Unit"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="valueAmount" label="物品价值（元）" label-width="120px">
                                <el-input v-model="item.valueAmount" :disabled="isDownload"></el-input>
                            </el-form-item>
                            <el-form-item prop="cashAmount" label="折现价值（元）" label-width="120px">
                                <el-input v-model="item.cashAmount" :disabled="isDownload"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>

                    <span class="small gray" v-if="form1.valueInfo.length>0">“总计”模式下，对于金额除不尽的情况系统自动对部分代理人微调±0.1元</span>
                    <!--操作-->
                    <div style="margin-top: 10px;">
                        <el-button
                            type="primary"
                            :disabled="isDownload"
                            @click="handleComputeSign" v-if="!isDownload && form1.valueInfo.length>0">确认并填入下表
                        </el-button>
                        <el-button
                            type="primary"
                            :disabled="isDownload || !showCreatePdf"
                            @click="handleCreateSign"
                            style="float: right;" v-if="!isDownload">确认生成财务PDF
                        </el-button>
                        <el-button
                            type="success"
                            @click="handleDownloadSign"
                            :disabled="!isDownload"
                            style="float: right;" v-if="isDownload">下载
                        </el-button>
                    </div>
                    <!--签收表-->
                    <div class="sign-wrapper" v-loading.body="loading" element-loading-text="正在生成中">
                        <div class="sign-header">
                            <span>实物小计：{{ totalData.totalEntityAmount || 0 }}（元）</span>
                            <span>现金小计：{{ totalData.totalCashAmount || 0 }}（元）</span>
                            <span>实物折现小计：{{ totalData.totalEntityCashAmount || 0 }}（元）</span>
                            <span>合计：{{ totalData.totalValueAndCashAmount || 0 }}（元）</span>
                        </div>
                        <el-table ref="scrollTable" :data="tableData1" max-height="640" stripe>
                            <el-table-column label="发布组织机构" prop="publishMerchantName" align="center"></el-table-column>
                            <el-table-column label="姓名" prop="name" align="center"></el-table-column>
                            <el-table-column label="工号" prop="jobNum" align="center"></el-table-column>
                            <el-table-column label="物品名称" prop="goodsTitle" align="center"></el-table-column>
                            <el-table-column label="DU号" prop="duStr" width="280" align="center"></el-table-column>
                            <el-table-column label="领取类型" prop="getType" align="center"></el-table-column>
                            <el-table-column label="价值" prop="money" align="center"></el-table-column>
                            <el-table-column label="核销/签收时间" align="center">
                                <template slot-scope="scope">{{scope.row.checkTime || scope.row.getTime}}</template>
                            </el-table-column>
                            <el-table-column label="状态" prop="stateName" align="center"></el-table-column>
                        </el-table>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalRow"
                            style="margin: 30px 0; text-align: center;">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    // child
    import JkLabels from './labels/jk-labels.vue'
    import JkLabelsItem from './labels/jk-labels-item.vue'
    import Pagination from '../common/pagination.vue'
    import YuLan from './yulan.vue'
    // mixin
    import TableList from '../mixin/table-list.vue'

    import { pubObj, bus } from '../../assets/unit/public.js'
    import validator from '@/assets/unit/validator.js'
    import { scrollHandler } from './scroll.js'
    import CheckMeeting from '../common/check-meeting.vue'
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        components: { JkLabels, JkLabelsItem, Pagination,YuLan, CheckMeeting },

        mixins: [TableList],

        data() {
            const rules = {
                cashAmount: [{
                    required: true,
                    message: '请输入折现价值',
                    trigger: 'change'
                },{
                    type: 'number',
                    message: '价值必须为数字值',
                    trigger: 'change'
                }, {
                    validator: validator.validMoney,
                    message: '8位英文字母或数字组成',
                    trigger: 'change'
                }],
                valueAmount: [{
                    required: true,
                    message: '请输入物品价值',
                    trigger: 'change'
                },{
                    type: 'number',
                    message: '价值必须为数字值',
                    trigger: 'change'
                }, {
                    validator: validator.validMoney,
                    message: '8位英文字母或数字组成',
                    trigger: 'change'
                }]
            };
            return {
                loading: true,
                activePane: '0',
                form1: {
                    pageIndex: 1,
                    pageSize: 10,
                    valueInfo: [],
                },
                currentPage: 1,
                pageSize: 10,
                form: {},
                mxTableList: {
                    url: ['incentive', 'inspireUserGet/', this.$route.query.incentiveSid],
                    pagiTotal: 0,
                },
                rules: rules,
                detailData: {},
                totalData: {},
                tableData: [],
                tableData1: [],
                goodsList: [],
                totalRow: null,
                timer: null,
                incentiveSid: null,
                showCreatePdf: false,
            }
        },

        methods: {
            goStatusBack (sid) {
                pubObj.httpRequest(this, {
                    method: 'POST',
                    url: ['incentive','goBack/', sid],
                    success(result) {
                        this.getTableList(this.form);
                        //console.log(result);
                    }
                });
            },
            canBeOverrideFun(row) {
                if(row.state === 'Abandon') {
                    row.getTypeName = '放弃';
                }
                return row;
            },
            // 返回列表
            handleGotoList() {
                const listQuery = this.$route.query;
                delete listQuery.incentiveSid;
                console.log(listQuery);
                this.$router.push({
                    path: '/m_incentive/list',
                    query: listQuery
                })
            },

            // 获取方案详情
            handleGetDetail() {
                pubObj.httpRequest(this, {
                    url: ['incentive', this.incentiveSid],
                    success(result) {
                        try {
                            // 兑换现金
                            if(!result.data.cashNumStr) {
                                result.data.cashNumStr = '不支持兑换现金';
                            }
                            // 增加有效期
                            if(result.data.startTime) {
                                result.data.availableTime = `${result.data.startTime} - ${result.data.endTime}`;
                            } else {
                                result.data.availableTime = '';
                            }
                            this.detailData = result.data;

                            console.log(this.detailData);
                        } catch(e){
                            console.log(e)
                        }
                    }
                });
            },
            //获取物品列表
            handleGetGoodsList(){
                pubObj.httpRequest(this, {
                    url: ['incentive','goods/list/', this.$route.query.incentiveSid],
                    success(result) {

                        this.goodsList = result.data;
                        this.form1.valueInfo = [];
                        for(let i=0;i<this.goodsList.length;i++){
                            if(this.goodsList[i].goodsType !== 'Cash'){
                                let item = {
                                    inspireGoodSid: this.goodsList[i].sid,
                                    goodsTitle: this.goodsList[i].goodsTitle,
                                    type: 'Unit',
                                    valueAmount: null,
                                    cashAmount: null,
                                };
                                this.form1.valueInfo = this.form1.valueInfo.concat(item);
                            }

                        }

                        console.log(this.form1);

                        // if(this.form1.valueInfo.length == 0 || this.detailData.pdfUrl){
                        //     this.handleGetSignGood();
                        // }
                        this.handleGetSignGood();

                    }
                });
            },

            //导出领取情况明细
            handleExportExcel() {
                const sid = this.$route.query.incentiveSid;
                this.$http({
                    url: this.$api.incentive.url + 'inspireUserGet/export/' + sid,
                    method: 'GET',
                    responseType: 'blob'
                }).then((res) => {
                    if(res.status === 200) {
                        if(IEDownload(this,res.data,'领取状况明细表.xls'))return;
                        const alink = document.createElement('a');
                        alink.download = '领取状况明细表.xls';
                        alink.style.display = 'none';
                        alink.href = URL.createObjectURL(res.data);
                        document.body.appendChild(alink);
                        alink.click();
                        document.body.removeChild(alink);
                    } else {
                        this.$message.warning('获取Excel文件失败');
                    }
                }).catch((err) => {
                    this.$message.error(err);
                })
            },

            //方案详情状态为Termination（7.已完结）表示PDF已生成,查询已生成PDF实物物品金额信息
            handleGetSignGood(){
                pubObj.httpRequest(this, {
                    url: ['incentive','sign/good/', this.incentiveSid],
                    success(result) {
                        console.log('22222',result.data);
                        this.form1.valueInfo = result.data;
                        console.log(this.form1.valueInfo);
                        this.handleGetSignTable();
                    }
                });
            },
            // 获取签收表
            handleGetSignTable() {
                this.loading = true;
                console.log(this.form1);

                //请求数据
                let reqData = [];
                if(this.form1.valueInfo.length>0){
                    if(!this.form1.valueInfo[0].type){
                        reqData = [];
                    }else{
                        reqData = this.form1.valueInfo;
                    }
                }

                pubObj.httpRequest(this, {
                    url: ['signTable', this.incentiveSid],
                    method: 'POST',
                    params: {
                        pageIndex: this.form1.pageIndex,
                        pageSize: this.form1.pageSize,
                    },
                    body: reqData,
                    success(result) {
                        const data = result.data;
                        this.tableData1 = data.signTable;
                        this.totalData['totalEntityAmount'] = data.totalEntityAmount;
                        this.totalData['totalEntityCashAmount'] = data.totalEntityCashAmount;
                        this.totalData['totalCashAmount'] = data.totalCashAmount;
                        this.totalData['totalValueAndCashAmount'] = data.totalValueAndCashAmount;
                        this.totalData['canGenerateTable'] = data.canGenerateTable;
                        console.log(this.tableData1);
                        if(!this.totalRow) {
                            this.totalRow = result.pagination ? result.pagination.totalRow : 0;
                        }

                        //有非现金物品且未输入价值时，初始化valueInfo，判断【确认生成PDF按钮】是否禁用
                        if(reqData.length == 0 && this.form1.valueInfo.length >0 ){
                            this.showCreatePdf = false;
                            this.form1.valueInfo = this.form1.valueInfo.map(function (item, index) {
                                item.type = 'Unit';
                                return item;
                            });
                        }else{
                            this.showCreatePdf = true;
                        }

                        console.log(this.form1.valueInfo);
                        console.log(reqData);

                    }
                })
            },
            // 分页显示个数
            handleSizeChange(size) {
                this.form1.pageSize = this.pageSize = size;
                this.handleGetSignTable();
            },
            // 分页当前页
            handleCurrentChange(currentPage) {
                this.form1.pageIndex = this.currentPage = currentPage;
                this.handleGetSignTable();
            },

            //未生成pdf走以下步骤
            // 1.确认填入下表
            handleComputeSign() {
                let count = 0;
                let valueInfo = this.form1.valueInfo;
                for(let i=0; i <= valueInfo.length-1; i++){
                    if(valueInfo[i].cashAmount && valueInfo[i].valueAmount ){
                        count++;
                    }
                    if(count == this.form1.valueInfo.length){
                        this.tableData1 = [];
                        this.totalRow = null;
                        this.timer = null;
                        this.totalData = {};
                        this.handleGetSignTable();
                    }

                }
            },

            // 2.调用接口确认生成PDF
            handleConfirmSign() {
                this.loading = true;
                console.log(this.form1);

                pubObj.httpRequest(this, {
                    url: ['confirmSign', this.incentiveSid],
                    method: 'POST',
                    body: this.form1.valueInfo,
                    success(result) {
                        this.handleGetDetail();
                    }
                })

            },
            // 确认生成签收表按钮操作
            handleCreateSign() {
                // this.$refs.signForm.validate((valid) => {
                //     if(valid) {
                        const isOk = this.totalData.canGenerateTable;
                        if(isOk) {
                            pubObj.showMessage(this, {
                                title: '注意',
                                content: '财务PDF仅可生成一次，不可修改。同时惠汇APP中将停止本激励方案的认领和核销功能。',
                                confirmText: '确认生成',
                                confirm() {
                                    this.handleConfirmSign();
                                }
                            });
                        } else {
                            pubObj.showMessage(this, {
                                title: '提示',
                                content: '该方案尚未到达截止日期，请于截止日期之后生成该报销签收表，（若需要在方案截止日期前生成签收表，需要该方案下全部代理人确认、核销完毕）。',
                                showConfirmButton: false,
                                cancelText: '我知道了'
                            });
                        }
                //     } else {
                //         return false;
                //     }
                // });
            },
            // 下载签收表
            handleDownloadSign() {
                // '方案签收表'+pubObj.getDateStr('-')+'.pdf'
                const alink = document.createElement('a');
                alink.href = this.detailData.pdfUrl;
                alink.download = true;
                alink.style.display = 'none';
                document.body.appendChild(alink);
                alink.click();
                document.body.removeChild(alink);
            }
        },

        created() {
            this.incentiveSid = this.$route.query.incentiveSid;
            this.handleGetDetail();
            this.$nextTick(() => {
                bus.$on('detail-pagination', (obj) => {
                    this.form = Object.assign(this.form, obj);
                    this.getTableList(this.form);
                })
            })
        },

        mounted() {
            this.handleGetGoodsList();
            this.$nextTick(() => {
                const sTable = this.$refs.scrollTable.$el;
                const bodyWrapper = sTable.querySelector('.el-table__body-wrapper');
                scrollHandler(this, bodyWrapper, 'scroll');
            });
        },
        computed: {
            isDownload() {
                let bool = false;
                const isPdf = this.detailData.pdfUrl;
                if(isPdf) {
                    bool = true;
                };
                console.log(bool);
                return bool;
            }
        },
    }
</script>

<style>
    .canDoGoBack{
        color: #00a0e9;
        cursor: pointer;
    }
    .small{
        font-size: 12px;
        line-height: 20px;
    }
    .gray{
        color: gray;
    }
    .incentive-detail .btn-wrapper {
        position: absolute;
        right: 0;
        top: 0;
        margin-bottom: 15px;
    }
    .incentive-detail .title-wrapper {
        overflow: hidden;
        margin: 14px 0 28px;
    }
    .incentive-detail .title-name {
        font-size: 18px;
        float: left;
        margin-right: 20px;
    }
    .incentive-detail .title-state {
        display: inline-block;
        float: left;
        background-color: #50BFFF;
        height: 24px;
        line-height: 24px;
        border-radius: 28px;
        padding: 0 18px;
        font-size: 14px;
        color: #fff;
        box-sizing: border-box;
    }
    .incentive-detail .jk-labels-item {
        width: auto;
    }
    .incentive-detail .img-placeholder {
        position: absolute;
        top: 0;
        left: 800px;
        width: 154px;
        height: 154px;
        background-color: #ddd;
    }
    .incentive-detail .img-placeholder img {
        height: 100%;
        width: 100%;
        vertical-align: top;
    }
    .incentive-detail .img-placeholder span {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        font-size: 14px;
        width: 28px;
        height: 14px;
        margin: auto;
    }
    .incentive-detail .html-wrapper {
        overflow: hidden;
    }
    .incentive-detail .html-wrapper img {
        max-width: 100%;
        vertical-align: top;
    }

    .sign-form { width: 800px;}
    .sign-form .el-input{
        width: 100px;
    }
    .sign-wrapper {
        margin-top: 40px;
        background-color: #F5F8FA;
    }
    .sign-wrapper .sign-header {
        line-height: 20px;
        font-size: 14px;
        font-weight: 600;
        padding: 10px 18px;
    }
    .sign-wrapper .sign-header span+span {
        margin-left: 14px;
    }
    .left{
        float: left;
    }
    .right{
        float: right;
    }
</style>
