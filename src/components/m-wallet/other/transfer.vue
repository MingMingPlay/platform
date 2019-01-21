<template>
    <div class="wallet-transfer">
        <!--面包屑导航-->
        <div class="breadcrumb-wrapper">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/m_finance/account' }">账户总览</el-breadcrumb-item>
                <el-breadcrumb-item>{{ activeBreadcrumb }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--标题-->
        <div class="detail-title">转账</div>
        <!--标签-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="单笔转账" name="single">
                <el-form key="single" ref="singleForm" :model="singleForm" :rules="singleRules" label-width="108px">
                    <el-form-item label="收款人姓名" prop="userName">
                        <el-input v-model="singleForm.userName"></el-input>
                        <span style="color: #f56c6c;">（温馨提示：只能对平台小c账户进行转账）</span>
                    </el-form-item>
                    <el-form-item label="收款人手机号" prop="userPhone">
                        <el-input type="number" v-model="singleForm.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="付款金额" prop="amt">
                        <el-input type="number" v-model="singleForm.amt"></el-input> 元
                    </el-form-item>
                    <!--<el-form-item label="选择银行" prop="bankCode" style="margin-top: 50px;">
                        <div class="bankImg" v-for="item in banksEnter" v-loading.body="loadingBank">
                            <el-radio
                                class="radio"
                                v-model="singleForm.bankCode"
                                :label="item.shortName">
                                <img :src="'../../../../static/bank/'+item.shortName+'.png'" :alt="item.name">
                            </el-radio>
                        </div>
                    </el-form-item>-->
                    <el-form-item label="选择银行" prop="bankCode" style="margin-top: 50px;">
                        <div class="bank-wrapper">
                            <div class="bank-wrapper__header">
                                <el-radio-group v-model="singleForm.payType">
                                    <el-radio-button :label="1">个人网银</el-radio-button>
                                    <el-radio-button :label="4">企业网银</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="bank-wrapper__body">
                            	<div class="bankImg" v-for="item in banksEnter" v-loading.body="loadingBank">
                                    <el-radio
                                        class="radio"
                                        v-model="singleForm.bankCode"
                                        :label="item.shortName">
                                        <img :src="'../../../../static/bank/'+item.shortName+'.png'" :alt="item.name">
                                    </el-radio>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            type="primary" 
                            :loading="btnLoading"
                            @click="handleSubmitForm('single')" 
                            class="center">确定
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="批量转账" name="batch">
                <el-form enctype="multipart/form-data" class="batch-form" key="batch" ref="batchForm" :model="batchForm" :rules="batchRules" label-width="108px">
                    <el-form-item label="总金额" prop="totalAmt">
                        <el-input name="totalAmt" type="number" v-model="batchForm.totalAmt"></el-input>
                        <span style="color: #f56c6c;">（温馨提示：只能对平台小c账户进行转账）</span>
                    </el-form-item>
                    <el-form-item label="总笔数" prop="totalTramsferNum">
                        <el-input name="totalTramsferNum" type="number" v-model="batchForm.totalTramsferNum"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="平均单笔金额">
                        <span style="color: #f56c6c;">{{ averageSingleAmount }}</span>元
                    </el-form-item>-->
                    <el-form-item label="导入文件">
                        <!--自定义上传按钮-->
                        <div class="upload-wrapper">
                            <label for="userexcel" class="upload-btn">导入Excel</label>
                            <span>{{ excelFileName }}</span>
                            <input 
                                name="userexcel" 
                                id="userexcel" 
                                type="file" 
                                accept=".xls, .xlsx" 
                                @change="handleBefore"
                                class="upload-file" />
                        </div>
                        <el-button type="text" class="download-template" @click="handleDownLoadTemplate">下载批量转账模版</el-button>
                    </el-form-item>
                    <!--<el-form-item label="选择银行" prop="bankCode" style="margin-top: 50px;">
                        <div class="bankImg" v-for="item in banksEnter" v-loading.body="loadingBank">
                            <el-radio
                                class="radio"
                                v-model="batchForm.bankCode"
                                :label="item.shortName">
                                <img :src="'../../../../static/bank/'+item.shortName+'.png'" :alt="item.name">
                            </el-radio>
                        </div>
                    </el-form-item>-->
                    <el-form-item label="选择银行" prop="bankCode" style="margin-top: 50px;">
                        <div class="bank-wrapper">
                            <div class="bank-wrapper__header">
                                <el-radio-group v-model="batchForm.payType">
                                    <el-radio-button :label="1">个人网银</el-radio-button>
                                    <el-radio-button :label="4">企业网银</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="bank-wrapper__body">
                                <div class="bankImg" v-for="item in banksEnter" v-loading.body="loadingBank">
                                    <el-radio
                                        name="bankCode"
                                        class="radio"
                                        v-model="batchForm.bankCode"
                                        :label="item.shortName">
                                        <img :src="'../../../../static/bank/'+item.shortName+'.png'" :alt="item.name">
                                    </el-radio>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            type="primary" 
                            :loading="btnLoading"
                            @click="handleSubmitForm('batch')" 
                            class="center">确定
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { pubObj } from '@/assets/unit/public.js'
    import validator from '@/assets/unit/validator.js'
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        name: 'WalletTransfer',
        
        data() {
            // 单笔
            const singleRules = {
                userName: [{
                    required: true, message: '请输入收款人姓名', tigger: 'blur'
                }, {
                    validator: validator.validName, message: '请输入汉字或者英文', tigger: 'blur'
                }],
                userPhone: [{
                    required: true, message: '请输入收款人手机号', tigger: 'blur'
                }, {
                    validator: validator.validCellphone, message: '请输入格式正确的手机号', tigger: 'blur'
                }],
                amt: [{
                    required: true, message: '请输入付款金额', tigger: 'blur'
                }],
                bankCode: [{
                    required: true, message: '请选择银行', tigger: 'blur'
                }]
            }
            // 批量
            const batchRules = {
                totalAmt: [{
                    required: true, message: '请输入总金额', tigger: 'blur'
                }],
                totalTramsferNum: [{
                    required: true, message: '请输入总笔数', tigger: 'blur'
                }, {
                    validator: validator.validNumber, message: '请输入正整数的数字', tigger: 'blur'
                }],
                bankCode: [{
                    required: true, message: '请选择银行', tigger: 'blur'
                }]
            }
            return {
                activeName: 'single',
                // 单笔
                singleForm: {
                    payType: 1
                },
                singleRules: singleRules,
                // 批量
                batchForm: {
                    payType: 1
                },
                batchFormData: null,
                batchRules: batchRules,
                //企业银行列表
                banksEnter: [],
                loadingBank: false,
                // 批量导入Excel
                excelHeaders: {
                    'api-ver': '1.0.0',
                    'token': sessionStorage.token,
                    'Content-Type': 'multipart/form-data'
                },
                excelFileName: null,
                btnLoading: false,
            }
        },
        
        computed: {
            // 活动面包屑
            activeBreadcrumb() {
                let breadcrumbName = '单笔转账';
                const tabName = this.activeName;
                if(tabName) {
                    breadcrumbName = tabName === 'single' ? '单笔转账' : '批量转账';
                }
                return breadcrumbName;
            },
            // 平均单笔金额
            averageSingleAmount() {
                let average = '0.00';
                const aaa = Number(this.batchForm.totalAmt);
                const bbb = Number(this.batchForm.totalTramsferNum);
                if(aaa && bbb) {
                    average = (aaa / bbb).toFixed(2);
                }
                return average;
            }
        },
        
        methods: {
            // 检查上传文件格式
            handleBefore(e) {
                const files = e.target.files;
                if(!files.length) return false;
                const file = files[0];
                // 图片格式是否正确
                let bool = false;
                // 获取图片的后缀名
                const dotIndex = file.name.lastIndexOf('.');
                const suffixOfFile = file.name.slice(dotIndex+1).toLowerCase();
                switch(suffixOfFile) {
                    case 'xls':;
                    case 'xlsx': 
                        bool = true; 
                        break;
                    default: 
                        bool = false;
                        break;
                }
                if(bool) {
                    this.excelFileName = file.name;
                    return true;
                } else {
                    this.$message.error('文件格式不正确，请上传Excel文件');
                    return false;
                }
            },
            //银行列表
            handleGetBanks() {
                pubObj.httpRequest(this, {
                    url: ['financialBanks'],
                    success(result) {
                        let enter = result.data.b2bEnterprise;
                        if(enter) {
                            this.banksEnter = enter;
                        }
                        this.loadingBank = false;
                    }
                })
            },
            // 提交充值
            confirmSubmitForm(formName) {
                /*if(formName === 'batch') this.$refs.excelUpload.submit();*/
                /*if(formName === 'batch') this.batchFormData.append();*/
                const batchForm = document.querySelector('.batch-form');
                this.batchFormData = new FormData(batchForm);
                this.batchFormData.append('payType', this.batchForm.payType);
                pubObj.httpRequest(this, {
                    url: [`${formName}Transfer`],
                    headers: formName === 'batch' ? this.excelHeaders : null,
                    method: 'POST',
                    body: formName === 'batch' ? this.batchFormData : this.singleForm,
                    success(result) {
                        this.btnLoading = false;
                        // 通过链接访问，防止浏览器拦截
                        const alink = document.createElement('a');
                        alink.style.display = 'none';
                        alink.href = result.data;
                        alink.target = '_blank';
                        document.body.appendChild(alink);
                        alink.click();
                        document.body.removeChild(alink);
                        // 等待用户操作
                        pubObj.showMessage(this, {
                            title: '转账提示',
                            content: '是否转账成功？成功之后可查看转账记录',
                            confirmText: '成功',
                            cancelText: '关闭',
                            confirm() {
                                this.$router.push({
                                    name: 'TransferRecord'
                                })
                            }
                        })
                        //window.open('http://'+location.host+'#/m-wallet/wallet-bankpay?bankurl='+encodeURI(result.data));
                        //this.$router.push({
                            //name: 'WalletBankpay',
                            //query: { bankurl: result.data },
                        //})
                    },
                    complete(result) {
                        this.btnLoading = false;
                        this.$message.warning(result.message);
                    }
                })
            },
            // 标签切换
            handleTabClick(tab) {},
            // 导入文件
            handleImportExcel() {},
            // 下载模板
            handleDownLoadTemplate() {
                const alink = document.createElement('a');
                alink.download = '批量转账模板.xlsx';
                alink.style.display = 'none';
                alink.href = '../../../static/doc/批量转账模板.xlsx';
                document.body.appendChild(alink);
                alink.click();
                document.body.removeChild(alink);
                //window.open('/static/doc/redirect.html?file=批量转账模板.xlsx');
            },
            // 提交
            handleSubmitForm(formName) {
                this.$refs[`${formName}Form`].validate((valid) => {
                    if(valid) {
                        this.btnLoading = true;
                        this.confirmSubmitForm(formName);
                    } else {
                        return false;
                    }
                });
            }
        },
        
        mounted() {
            this.handleGetBanks();
        }
    }
</script>

<style>
    .wallet-transfer .bank-wrapper {
        background: #fff;
        border: 1px solid #dcdfe6;
    }
    .wallet-transfer .bank-wrapper .el-radio-button__inner {
        border: none;
        border-radius: 0;
        border-right: 1px solid #bfcbd9;
    }
    .wallet-transfer .bank-wrapper .bank-wrapper__header {
        border-bottom: 1px solid #bfcbd9;
    }
    .wallet-transfer .bank-wrapper .bank-wrapper__body {
        overflow: hidden;
        padding: 20px 15px;
        padding-bottom: 0;
    }
    /*自定义上传按钮*/
    .wallet-transfer .upload-wrapper {
        display: inline-block;
        text-align: center;
        cursor: pointer;
        outline: none;
    }
    .wallet-transfer .upload-wrapper .upload-btn {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
    }
    .wallet-transfer .upload-wrapper .upload-file{
        display: none;
    }
    .wallet-transfer .el-form-item .el-input {
        width: 200px;
    }
    .wallet-transfer .el-form-item {
        width: 900px;
    }
    .wallet-transfer .bankImg {
        float: left;
        width: 170px;
        height: 50px;
        border: 1px solid #ccc;
        margin: 0 20px 20PX 0;
        padding: 10px;
    }
    .wallet-transfer .bankImg img {
        height: 24px;
        width: 118px;
        vertical-align: middle;
    }
    .wallet-transfer .center {
        display: block;
        width: 140px;
        height: 40px;
        margin: auto;
    }
    .wallet-transfer .download-template {
        margin-top: 5px;
        text-decoration: underline;
    }
    .wallet-transfer .excel-upload { display: flex; align-items: center; }
    .wallet-transfer .el-upload-list>li { margin-top: 0; }
</style>