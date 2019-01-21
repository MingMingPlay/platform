<template>
    <div class="sign-receive">
        
        <el-breadcrumb separator=">" style="padding: 14px 0;">
            <el-breadcrumb-item :to="{ path: '/m_incentive/incentive' }">激励方案</el-breadcrumb-item>
            <el-breadcrumb-item>生成方案签收表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <div style="width: 80%;">
            <!--标题-->
            <h3>方案名称：{{ detailData.title }}</h3>
            <!--表单-->
            <el-form ref="signForm" :model="form" :rules="rules" label-width="110px" class="sign-form">
                <el-form-item label="DU号" prop="duStr">
                    <el-input v-model="form.duStr" :disabled="isDownload" :maxlength="8"></el-input>
                </el-form-item>
                <el-form-item label="方案实际价格" prop="unitValue">
                    <el-input v-model="form.unitValue" type="number" :disabled="isDownload">
                        <template slot="append">元</template>
                    </el-input>
                    <span style="color: #909399;">如果代理人兑换方案，则折现列=方案实际价格（单位元）*用户领取数量</span>
                </el-form-item>
                <el-form-item label="折合现金" prop="unitCash" v-if="detailData.unitCash">
                    <el-input v-model="form.unitCash" type="number" :disabled="isDownload">
                        <template slot="append">元</template>
                    </el-input>
                    <span style="color: #909399;">如果代理人选择折合现金，则折现列=方案可折合现金（单位元）*用户领取数量</span>
                </el-form-item>
            </el-form>
            <!--操作-->
            <div>
                <span style="display: inline-block; width: 110px;"></span>
                <el-button 
                    type="primary" 
                    :disabled="isDownload"
                    @click="handleComputeSign">确认并填入下表
                </el-button>
                <el-button 
                    type="danger" 
                    :disabled="isDownload"
                    @click="handleCreateSign">确认生成签收表
                </el-button>
                <el-button 
                    type="success" 
                    @click="handleDownloadSign" 
                    :disabled="!isDownload"
                    style="float: right;">下载签收表
                </el-button>
            </div>
            <!--签收表-->
            <div class="sign-wrapper" v-loading.body="loading" element-loading-text="正在生成中">
                <div class="sign-header">
                    <span>实物小计：{{ totalData.totalValue || 0 }}（元）</span>
                    <span v-if="detailData.unitCash">折现小计：{{ totalData.totalCash || 0 }}（元）</span>
                    <span>合计：{{ totalData.totalValueAndCash || 0 }}（元）</span>
                </div>
                <el-table ref="scrollTable" :data="tableData" max-height="640" stripe>
                    <el-table-column label="发布组织机构" prop="publishMaerchantName" align="center"></el-table-column>
                    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
                    <el-table-column label="工号" prop="jobNum" align="center"></el-table-column>
                    <el-table-column label="标题" prop="title" align="center"></el-table-column>
                    <el-table-column label="DU号" prop="duStr" width="280" align="center"></el-table-column>
                    <el-table-column label="领取类型" prop="getTypeName" align="center"></el-table-column>
                    <el-table-column label="折现" prop="discountingValue" align="center"></el-table-column>
                    <el-table-column label="核销/签收时间" prop="checkTime" align="center"></el-table-column>
                    <el-table-column label="状态" prop="stateName" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
        
    </div>
</template>

<script>
    import { pubObj } from '@/assets/unit/public.js'
    import validator from '@/assets/unit/validator.js'
    import { scrollHandler } from './scroll.js'
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        data() {
            const rules = {
                duStr: [{
                    required: true,
                    message: '请输入DU号',
                    trigger: 'blur'
                },{
                    validator: validator.validEnAndNum,
                    message: '8位英文字母或数字组成',
                    trigger: 'blur'
                },{
                    min: 8,
                    max: 8,
                    message: '8位英文字母或数字组成',
                    trigger: 'blur'
                }],
                unitValue: [{
                    required: true,
                    message: '请输入方案实际价格',
                    trigger: 'blur'
                }],
                unitCash: [{
                    required: true,
                    message: '请输入折合现金',
                    trigger: 'blur'
                }]
            };
            return {
                query: this.$route.query,
                loading: true,
                form: {
                    pageIndex: 1,
                    pageSize: 50
                },
                rules: rules,
                detailData: {},
                totalData: {},
                tableData: [],
                totalRow: null,
                timer: null,
            }
        },
        
        computed: {
            isDownload() {
                let bool = false;
                const isPdf = this.detailData.pdfUrl;
                if(isPdf) {
                    bool = true;
                };
                return bool;
            }
        },
        
        methods: {
            // 获取方案详情
            handleGetDetail() {
                pubObj.httpRequest(this, {
                    url: ['incentive', this.query.sid],
                    success(result) {
                        this.detailData = result.data;
                        this.form.duStr = result.data.duStr;
                        this.form.unitValue = result.data.unitValue;
                        this.form.unitCash = result.data.unitCash;
                        this.handleGetSignTable();
                        this.handleGetSignTotal();
                    }
                })
            },
            // 获取签收统计
            handleGetSignTotal() {
                pubObj.httpRequest(this, {
                    url: ['signTotal', this.query.sid],
                    params: {
                        unitValue: this.form.unitValue,
                        unitCash: this.form.unitCash
                    },
                    success(result) {
                        this.totalData = result.data;
                    }
                })
            },
            // 获取签收表
            handleGetSignTable() {
                this.loading = true;
                const title = this.detailData.title;
                const duStr = this.form.duStr;
                const publishMaerchantName = this.detailData.publishMaerchantName;
                pubObj.httpRequest(this, {
                    // mock
                    // url: 'https://www.easy-mock.com/mock/5911bbe4acb959185b0c46cb/demo/sign-receive/list',
                    url: ['signTable', this.query.sid],
                    params: this.form,
                    success(result) {
                        const data = result.data;
                        data.forEach((row) => {
                            row.title = title;
                            row.duStr = duStr;
                            row.publishMaerchantName = publishMaerchantName;
                        });
                        this.tableData = this.tableData.concat(data);
                        if(!this.totalRow) {
                            this.totalRow = result.pagination ? result.pagination.totalRow : 0;
                        }
                    }
                })
            },
            // 确认填入下表
            handleComputeSign() {
                this.$refs.signForm.validate((valid) => {
                    if(valid) {
                        this.tableData = [];
                        this.totalRow = null;
                        this.timer = null;
                        this.totalData = {};
                        this.handleGetSignTotal();
                        this.handleGetSignTable();
                    } else {
                        return false;
                    }
                });
            },
            // 确认签收
            handleConfirmSign() {
                this.loading = true;
                pubObj.httpRequest(this, {
                    url: ['confirmSign', this.query.sid],
                    method: 'POST',
                    params: {
                        duStr: this.form.duStr,
                        unitValue: this.form.unitValue,
                        unitCash: this.form.unitCash
                    },
                    success(result) {
                        this.$message.success(result.message);
                        this.tableData = [];
                        this.totalRow = null;
                        this.timer = null;
                        this.totalData = {};
                        this.handleGetDetail();
                    }
                })
            },
            // 生成签收表
            handleCreateSign() {
                this.$refs.signForm.validate((valid) => {
                    if(valid) {
                        const isOk = this.totalData.canGenerateTable;
                        if(isOk) {
                            pubObj.showMessage(this, {
                                title: '提示',
                                content: '本表用于财务报销一旦生成不可更改，确认生成报销签收表么？',
                                confirmText: '确认',
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
                    } else {
                        return false;
                    }
                });
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
        
        mounted() {
            this.handleGetDetail();
            this.$nextTick(() => {
                const sTable = this.$refs.scrollTable.$el;
                const bodyWrapper = sTable.querySelector('.el-table__body-wrapper');
                scrollHandler(this, bodyWrapper, 'scroll');
            });
        }
    }
</script>

<style scoped>
    .sign-form { width: 600px; margin-top: 30px; }
    .sign-wrapper {
        margin-top: 30px;
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
</style>