<template>
    <div class="recharge">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-wrap">
            <el-form label-width="80px" :model="form" :rules="rules" ref="form">
                <el-form-item label="用户账号" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="输入用户的手机号" :maxlength="11"></el-input>
                    <el-upload
                        class="upload-file"
                        :disabled="upButtonState"
                        :show-file-list="false"
                        :action="uploadUrl"
                        name="rechargeFile"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        accept=".xlsx,.xls"
                        :headers="upHeader">
                        <el-button size="small" type="primary" :loading="upButtonState">Excel批量导入</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="充值金额" prop="amount">
                    <el-input v-model="form.amount" type="number" placeholder="输入充值金额"></el-input>
                </el-form-item>
                <el-form-item label="充值渠道" prop="tradeSource">
                    <el-select v-model="form.tradeSource" placeholder="请选择充值渠道">
                        <el-option v-for="(item,index) in tradeSource" :key="index" :value="item.tradeSource"
                                   :label="item.tradeSourceDesc"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="验证码" prop="captcha">
                    <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
                    <el-button type="primary" @click="sendCaptcha('s')" :disabled="sCodeButtonState">
                        {{sCodeButtonText}}
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="bottom-button">
                <div class="desc" v-if="sShowAuthor">已经向{{authorizerMobile | hideMobile}}发送验证码</div>
                <el-button type="primary" @click="submitRecharge('form', 's')" :loading="sSubBtnState">立即充值</el-button>
            </div>
        </div>

        <el-dialog
            title="批量充值确认"
            v-model="rechargeDialog"
            size="tiny">
            <el-tabs v-model="tabType" type="card" @tab-click="typeClick">
                <el-tab-pane label="充值信息" name="1"></el-tab-pane>
                <el-tab-pane label="账号列表" name="2"></el-tab-pane>
            </el-tabs>
            <div v-show="tabType == '1'">
                <el-form label-width="120px" :model="batchForm" :rules="batchRules" ref="batchForm">
                    <el-form-item label="每人充值金额" prop="amount">
                        <el-input v-model="batchForm.amount" placeholder="输入每人充值金额"></el-input>
                    </el-form-item>
                    <el-form-item label="充值渠道" prop="tradeSource">
                        <el-select v-model="batchForm.tradeSource" placeholder="请选择充值渠道">
                            <el-option v-for="(item,index) in tradeSource" :key="index" :value="item.tradeSource"
                                       :label="item.tradeSourceDesc"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="可充值人数">
                        <span>{{rechargeData.successCount}}</span>
                    </el-form-item>
                    <el-form-item label="总计金额">
                        <p><span class="color-red">￥{{(batchForm.amount * rechargeData.successCount) | twoFloat}}</span>元
                        </p>
                    </el-form-item>
                    <el-form-item label="验证码" prop="captcha">
                        <el-input v-model="batchForm.captcha" placeholder="请输入验证码"></el-input>
                        <el-button type="primary" @click="sendCaptcha('b')" :disabled="bCodeButtonState">
                            {{bCodeButtonText}}
                        </el-button>
                    </el-form-item>
                    <div class="desc" v-if="bShowAuthor">已经向{{authorizerMobile | hideMobile}}发送验证码</div>
                </el-form>
            </div>

            <div v-show="tabType == '2'">
                <div class="table-list-info">
                    <p class="left">总数量：{{rechargeData.allCount}}</p>
                    <p class="center">可充值：{{rechargeData.successCount}}</p>
                    <p class="right">账号错误：{{rechargeData.errorCount}}</p>
                </div>
                <el-table :data="rechargeTableData[pagination.pageIndex - 1]" :stripe="true">
                    <el-table-column prop="mobile" label="账号">
                        <template slot-scope="scope">
                            <span :class="{'color-red': scope.row.success == false}">{{scope.row.mobile}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="state" label="状态">
                        <template slot-scope="scope">
                            <span :class="{'color-red': scope.row.success == false}">{{scope.row.state}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrap">
                    <el-pagination
                        :current-page="pagination.pageIndex"
                        @current-change="handleCurrentChange"
                        :page-size="pagination.pageSize"
                        layout="total, prev, pager, next"
                        :total="pagination.totalRow">
                    </el-pagination>
                </div>
            </div>

            <span slot="footer" class="dialog-footer" v-show="tabType == '1'">
                <el-button @click="rechargeDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitRecharge('batchForm', 'b')"
                           :loading="bSubBtnState">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import api from '../../../assets/config/c-api.js'
    import validator from '../../../assets/unit/validator'
    import { pubObj } from '../../../assets/unit/public'
    export default {
        data() {
            return {
                crumbs: [
                    {
                        title: '资金管理',
                    },
                    {
                        title: '充值记录',
                        to: {path: '/c_fund/deposit', query: this.$route.query}
                    },
                    {
                        title: '充值',
                    }
                ],
                form: {
                    mobile: '',
                    amount: '',
                    captcha: '',
                    tradeSource: '',
                },
                rules: {
                    mobile: [
                        {
                            required: true,
                            message: '请输入账号',
                            trigger: 'blur',
                        },
                        {
                            validator: validator.validMobile,
                            trigger: 'blur'
                        },
                    ],
                    amount: [{
                        required: true,
                        message: '请输入金额',
                        trigger: 'blur'
                    }, {
                        validator: validator.validMoney,
                        trigger: 'blur,change'
                    }],
                    tradeSource: [{
                        required: true,
                        message: '请选择充值渠道',
                        trigger: 'change'
                    }],
                    captcha: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }],
                },
                authorizer: '',
                authorizerMobile: '',
                sShowAuthor: false,  // 显示向谁发送了验证码
                sCodeButtonText: '发送验证码',
                sCodeButtonState: false,
                sSubBtnState: false,
                tradeSource: [],
                uploadUrl: `${api.cWallet}recharge/upfile`,
                upButtonState: false,
                upHeader: pubObj.getHttpHeader(),
                timer: null,    // 定时器，方便其他地方清除
                tabType: '1',
                batchForm: {
                    amount: '',
                    captcha: '',
                    tradeSource: '',
                    resultList: [],
                },
                batchRules: {
                    amount: [{
                        required: true,
                        message: '请输入金额',
                        trigger: 'blur'
                    }, {
                        validator: validator.validMoney,
                        trigger: 'blur,change'
                    }],
                    tradeSource: [{
                        required: true,
                        message: '请选择充值渠道',
                        trigger: 'change'
                    }],
                    captcha: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }],
                },
                bShowAuthor: false,  // 显示向谁发送了验证码
                bCodeButtonText: '发送验证码',
                bCodeButtonState: false,
                bSubBtnState: false,
                rechargeDialog: false,
                rechargeData: {},
                rechargeTableData: [],
                pagination: {
                    pageIndex: 1,
                    pageSize: 8,
                    totalRow: null,
                },
            }
        },
        components: {
            JkcBreadcrumb
        },
        created(){
            this.getAuthor();
            this.getSource();
        },
        filters: {
            hideMobile(value){
                return `${value.substring(0, 3)}****${value.substring(7)}`
            },
            twoFloat(value){
                return value.toFixed(2);
            },
        },
        methods: {
            getAuthor(){    // 获取授权人
                this.$http.get(`${api.cWallet}to-recharge`)
                    .then(result => {
                        if (result.body.code === 200) {
                            this.authorizer = result.body.data.authorizer;
                            this.authorizerMobile = result.body.data.authorizerMobile;
                        } else {
                            this.$message.error(result.body.message)
                        }
                    })
            },
            getSource(){    // 获取充值渠道
                this.$http.get(`${api.cWallet}user/trade-source`)
                    .then(result => {
                        if (result.body.code === 200) {
                            this.tradeSource = result.body.data;
                        } else {
                            this.$message.error(result.body.message)
                        }
                    })
            },
            sendCaptcha(type){  // 发送验证码
                this.$http.get(`${api.sMobile}${this.authorizerMobile}`)
                    .then(result => {
                        if (result.body.code === 200) {
                            this[`${type}ShowAuthor`] = true;
                            this.countDown(type);
                        } else {
                            this.$message.error(result.body.message)
                        }
                    })
            },
            countDown(type){
                let time = 60;
                this[`${type}CodeButtonState`] = true;
                this[`${type}CodeButtonText`] = `${time}秒重新发送`;
                this[`${type}Timer`] = setInterval(() => {
                    time--;
                    this[`${type}CodeButtonText`] = `${time}秒重新发送`;
                    if (time < 0) {
                        time = 0;
                        clearInterval(this[`${type}Timer`]);
                        this[`${type}CodeButtonText`] = '发送验证码';
                        this[`${type}CodeButtonState`] = false;
                        this[`${type}ShowAuthor`] = false;
                    }
                }, 1000)
            },
            submitRecharge(formName, type){
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this[`${type}SubBtnState`] = true;
                        this.$http.post(`${api.cWallet}recharge/${type === 's' ? 'single' : 'batch'}`, this[formName])
                            .then(result => {
                                if (result.body.code === 200) {
                                    this.$message.success(result.body.message);
                                    setTimeout(() => {
                                        this[`${type}SubBtnState`] = false;
                                        this.resetForm(formName, type);
                                    }, 1000)
                                } else {
                                    this[`${type}SubBtnState`] = false;
                                    this.$message.error(result.body.message)
                                }
                            })
                    }
                })
            },
            resetForm(formName, type){    // 充值成功后重置一下
                this.$refs[formName].resetFields();
                if (formName === 'form') {
                    this.form = {mobile: '', amount: '', captcha: '', tradeSource: ''};
                } else if (formName === 'batchForm') {
                    this.batchForm = {amount: '', captcha: '', tradeSource: '', resultList: []};
                    this.rechargeTableData = [];
                    this.rechargeDialog = false;
                }
                clearInterval(this[`${type}Timer`]);
                this[`${type}CodeButtonText`] = '发送验证码';
                this[`${type}CodeButtonState`] = false;
                this[`${type}ShowAuthor`] = false;
            },
            beforeUpload(file){
                let pass = false;
                if (file.name.split('.')[1] == 'xls' || file.name.split('.')[1] == 'xlsx') {
                    pass = true;
                }
                if (!pass) {
                    this.$message.error('请上传正确的Excel文件');
                    return false;
                }
                this.upButtonState = true;
            },
            uploadSuccess(response, file, fileList){
                this.upButtonState = false;
                if (response.code === 200) {
                    this.rechargeDialog = true;
                    this.rechargeData = response.data;
                    this.batchForm.resultList = this.rechargeData.resultList;
                    this.pagination.totalRow = this.rechargeData.resultList.length;
                    this.rechargeTableData = this.group(this.rechargeData.resultList, this.pagination.pageSize);
                }else {
                    this.$message.error(response.message);
                }
            },
            uploadError(err, file, fileList){
                this.$message.error('上传失败');
                this.upButtonState = false;
            },
            group(array, subGroupLength) {  // 分割数组
                let index = 0;
                let newArray = [];
                while (index < array.length) {
                    newArray.push(array.slice(index, index += subGroupLength));
                }
                return newArray;
            },
            handleCurrentChange(val){
                this.pagination.pageIndex = val;
            },
            typeClick(){
            }
        }
    }
</script>
<style>
    .recharge .detail-wrap {
        margin-top: 20px;
    }

    .recharge .detail-wrap .el-input {
        width: 250px;
    }

    .recharge .detail-wrap .el-form-item .el-button {
        width: 140px;
        text-align: center;
        margin-left: 20px;
    }

    .recharge .detail-wrap .bottom-button {
        margin-left: 80px;
    }

    .recharge .detail-wrap .bottom-button .desc {
        margin-bottom: 20px;
    }

    .recharge .detail-wrap .bottom-button .el-button {
        width: 250px;
    }

    .recharge .detail-wrap .upload-file {
        display: inline-block;
    }

    .recharge .detail-wrap .upload-file .el-button {
        height: 28px;
        font-size: 14px;
    }

    .recharge .el-dialog .color-red{
        color: #f00;
    }

    .recharge .el-dialog .el-form-item .el-input {
        width: 250px;
    }

    .recharge .el-dialog .el-form-item .el-button {
        margin-left: 10px;
    }

    .recharge .el-dialog .el-form-item .color-red {
        color: #f00;
    }
    .recharge .el-dialog .table-list-info {
        height: 30px;
        line-height: 30px;
        position: relative;
        margin-bottom: 15px;
    }
    .recharge .el-dialog .table-list-info .left {
        position: absolute;
        left: 0;
        top: 0;
        line-height: 30px;
    }
    .recharge .el-dialog .table-list-info .center {
        height: 30px;
        line-height: 30px;
        text-align: center;
    }
    .recharge .el-dialog .table-list-info .right {
        position: absolute;
        right: 0;
        top: 0;
        line-height: 30px;
    }

    .recharge .el-dialog .pagination-wrap {
        text-align: center;
        margin-top: 10px;
    }

    .recharge .el-dialog .desc {
        margin-left: 120px;
    }
</style>
