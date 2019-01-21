<template>
    <div class="incentive-add">
        <el-breadcrumb separator=">" style="padding: 14px 0;">
            <el-breadcrumb-item>激励方案</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:'/m_incentive/incentive', query: $route.query }">方案列表</el-breadcrumb-item>
            <el-breadcrumb-item>发布方案</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="detail-title">发布方案</div>

        <el-steps :active="activeStep" space="30%" style="margin-bottom: 20px;" align-center center>
            <el-step title="填写方案"></el-step>
            <el-step title="导入用户"></el-step>
        </el-steps>

        <div class="detail-wrap" v-loading.body="loading" element-loading-text="正在上传...">
            <!--基础信息-->
            <el-form :model="pageForm" :rules="rules" ref="pageForm" label-width="110px" v-show="activeStep === 1">
                <el-form-item label="方案类型" prop="type">
                    <el-select v-model="pageForm.type" placeholder="请选择方案">
                        <el-option :key="0" label="实物方案" value="Entity"></el-option>
                        <el-option :key="1" label="旅游方案" value="Travel"></el-option>
                        <el-option :key="2" label="其他方案" value="Other"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="方案名称" prop="title">
                    <el-input v-model="pageForm.title"></el-input>
                </el-form-item>
                <el-form-item label="物品名称" prop="goodsTitle">
                    <el-input v-model="pageForm.goodsTitle"></el-input>
                </el-form-item>
                <el-form-item label="物品封面" prop="logoSid">
                    <image-upload v-model="pageForm.logoSid" action-type="Other"></image-upload>
                    <div style="font-size: 12px;color: #FF4949;margin-top: 4px;">建议图片尺寸500*500</div>
                </el-form-item>
                <!--<div class="form-item-wrapper">
                    <el-form-item label="每人领取数量" prop="getNum" class="inline">
                        <el-input v-model="pageForm.getNum" :maxlength="10"></el-input>
                    </el-form-item>-->
                    <!--prop="revenueNum"-->
                    <!--<el-form-item label="物品税金" prop="revenueNumStr" class="inline">
                        <el-input v-model="pageForm.revenueNumStr" :maxlength="10"></el-input>
                    </el-form-item>-->
                <!--</div>-->
                <div class="form-item-wrapper">
                    <el-form-item label="方案可折合现金(单位数量/元)" prop="unitCash" class="inline">
                        <el-input v-model="pageForm.unitCash" :maxlength="7"></el-input>
                    </el-form-item>
                    <span class="inline" style="padding-left: 12px; color: #aaa;">不填则表示不支持折合现金（指该物品/旅游等折合成现金的单价金额）</span>
                </div>
                <div class="form-item-wrapper">
                    <el-form-item label="有效期" prop="rangeTime" class="inline">
                        <el-date-picker
                            v-model="pageForm.rangeTime"
                            type="datetimerange"
                            placeholder="请选择日期范围"
                            :picker-options="{ disabledDate: setDisabledDate }"
                            @change="handleRangeTime">
                        </el-date-picker>
                    </el-form-item>
                    <!--<el-checkbox v-model="forever" class="inline" style="padding-left: 12px;">永久</el-checkbox>-->
                </div>
                <el-form-item label="DU号" prop="duStr">
                    <el-input v-model="pageForm.duStr"></el-input>
                </el-form-item>
                <el-form-item label="放弃方案" prop="abandon">
                    <el-checkbox v-model="pageForm.abandon">
                        <span style="color: #aaa;">勾选此项表示允许用户放弃方案</span>
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="领用说明" prop="instructions">
                    <el-input type="textarea" v-model="pageForm.instructions"></el-input>
                </el-form-item>
                <el-form-item label="物品信息" prop="goodsInfo" class="UEditor">
                    <div class="editor-upload-img" id="editor-upload-img">
                        <label class="button-img">
                            <input style="display: none;"
                                type="file"
                                multiple
                                ref="editorImageFile"
                                @change="editorUpload">
                        </label>
                    </div>
                    <VueUeditor
                        ueditorPath="/static/ueditor1_4_3_3/"
                        @ready="editorReady"
                        :ueditorConfig="editorConfig">
                    </VueUeditor>
                </el-form-item>
                <el-form-item label="备注" prop="remark" v-show="pageForm.type === 'Other'">
                    <el-input type="textarea" v-model="pageForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <!--导入用户-->
            <div class="import-users" v-show="activeStep === 2">
                <div class="upload-box">
                    <template v-if="!firstExcelSuccess">
                        <div class="block-inline">
                            <el-upload
                                name="userexcel"
                                :action="excelApi"
                                :headers="excelHeaders"
                                :before-upload="handleBefore"
                                :on-success="handleSuccess"
                                :on-error="handleError">
                                <el-button type="default">上传文件</el-button>
                            </el-upload>
                        </div>
                        <div class="block-inline">
                            <span>最多上传5个表格，每个表格最多一次支持2000位用户。
                                <el-button type="text" @click="handleDownload">下载模板</el-button>
                            </span>
                        </div>
                    </template>
                    <template v-else>
                        <!--<div class="block-inline">
                            <h3>上传成功！总人数：{{ totalUserData.length }}</h3>
                        </div>-->
                        <div class="block-inline" style="margin-top: 30px;">
                            <p v-for="excelFile in excelFiles">
                                <span>
                                    <span>文件名：</span>
                                    <span>{{ excelFile.name }}</span>
                                </span>
                                <span>，</span>
                                <span>
                                    <span>大小：</span>
                                    <span>{{ excelFile.size }}</span>
                                </span>
                            </p>
                        </div>
                        <div class="block-inline" style="margin-top: 20px;">
                            <el-upload
                                style="display: inline-block;"
                                name="userexcel"
                                :action="excelApi"
                                :headers="excelHeaders"
                                :before-upload="handleBefore"
                                :on-success="handleSuccess"
                                :on-error="handleError">
                                <el-button size="small" :disabled="isDisabled">继续上传</el-button>
                            </el-upload>
                            <el-button type="primary" size="small" style="margin-left: 10px;" @click="handleLookList">查看明细</el-button>
                            <template>
                                <el-button type="danger" size="small" @click="handleReUpload">重新上传</el-button>
                                <el-upload
                                    style="display: inline-block; display: none;"
                                    name="userexcel"
                                    :action="reExcelApi"
                                    :headers="excelHeaders"
                                    :before-upload="handleBefore"
                                    :on-success="handleSuccess"
                                    :on-error="handleError">
                                    <el-button type="danger" size="small" ref="reUploadExcel">重新上传</el-button>
                                </el-upload>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!--btn group-->
        <div class="btn-group" style="text-align: center; margin: 20px 0;">
            <template v-if="activeStep === 1">
                <el-button type="primary" size="large" @click="handleNextStep('pageForm')">下一步</el-button>
                <el-button type="default" size="large" @click="$router.go(-1)">取消</el-button>
            </template>
            <template v-else>
                <el-button type="primary" size="large" @click="activeStep--">上一步</el-button>
                <el-button type="success" size="large" @click="handlePublic">发布</el-button>
                <el-button type="default" size="large" @click="$router.go(-1)">取消</el-button>
            </template>
        </div>

        <user-list-table :user-data="totalUserData"></user-list-table>
    </div>
</template>

<script>
    // child
    import VueUeditor from 'vue-ueditor'
    import ImageUpload from '../common/image-upload.vue'
    import UserListTable from './user-list.vue'
    // mixin
    import { mixin_UEditor } from '../mixin/add_mixins.vue'
    // js
    import { pubObj, bus } from '../../assets/unit/public.js'
    import validator from '../../assets/unit/validator.js'
    export default {
        components: { ImageUpload, UserListTable, VueUeditor },

        mixins: [mixin_UEditor],

        data() {
            const rules = {
                type: [{
                    required: true,
                    message: '请选择方案类型',
                    trigger: 'blur'
                }],
                title: [{
                    required: true,
                    message: '请输入方案名称',
                    trigger: 'blur'
                }, {
                    max: 30,
                    message: '方案名称在30字符以内',
                    trigger: 'blur'
                }],
                goodsTitle: [{
                    required: true,
                    message: '请输入物品名称',
                    trigger: 'blur'
                }, {
                    max: 30,
                    message: '物品名称在30字符以内',
                    trigger: 'blur'
                }, {
                    validator: validator.validChar,
                    message: '只能输入数字、中文或英文字符',
                    trigger: 'blur'
                }],
                logoSid: [{
                    required: true,
                    message: '请上传物品封面',
                    trigger: 'blur'
                }],
                /*getNum: [{
                    required: true,
                    message: '请输入领取数量',
                    trigger: 'blur'
                }, {
                    validator: validator.validNumber,
                    message: '请输入正整数',
                    trigger: 'blur'
                }, {
                    validator: validator.validNotZero,
                    message: '数量不能为0，或者以0开头',
                    trigger: 'blur'
                }],*/
                /*revenueNumStr: [{
                    required: true,
                    message: '请输入物品税金',
                    trigger: 'blur'
                }, {
                    validator: validator.validFloating(),
                    message: '请输入有效数字',
                    trigger: 'blur'
                }],*/
                unitCash: [{
                    validator: validator.validMoney,
                    message: '折合现金请输入正数',
                    trigger: 'blur'
                }],
                rangeTime: [{
                    type: 'array',
                    required: true,
                    message: '请选择有效期',
                    trigger: 'blur'
                }],
                duStr: [{
                    required: true,
                    message: '请输入DU号',
                    trigger: 'blur'
                }, {
                    validator: validator.validEnAndNum,
                    message: '8位英文字母或数字组成',
                    trigger: 'blur'
                }, {
                    min: 8,
                    max: 8,
                    message: '8位英文字母或数字组成',
                    trigger: 'blur'
                }],
                instructions: [{
                    required: true,
                    message: '请输入领用说明',
                    trigger: 'blur'
                }, {
                    max: 300,
                    message: '领用说明在300字符以内',
                    trigger: 'blur'
                }],
                goodsInfo: [{
                    required: true,
                    message: '请添加物品信息',
                    trigger: 'blur'
                }]
            };
            return {
                // 富文本 begin
                editorConfig: {
                    initialFrameWidth: '100%',
                },
                mxUeditor: {
                    imgUploadApi: this.$api.attachment + 'Other',
                },
                // 富文本 end
                // 当前步骤
                activeStep: 1,
                pageForm: {
                    abandon: false,
                    goodsInfo: null
                },
                rules: rules,
                // 文件上传api
                excelApi: `${this.$api.incentive.url}importV2/`,
                // 重新上传
                reExcelApi: `${this.$api.incentive.url}reimport/`,
                // 上传文件的headers
                excelHeaders: {
                    'api-ver': '1.0.0',
                    'token': sessionStorage.token,
                    'charset': 'utf-8'
                },
                // Excel列表
                excelFiles: [],
                // 第一个文件上传成功
                firstExcelSuccess: false,
                loading: false,
                // 激励方案sid
                incentiveSid: null
            }
        },

        computed: {
            // 上传用户数据
            totalUserData() {
                let data = [];
                const files = this.excelFiles;
                files.forEach((file) => {
                    data = data.concat(file.userData);
                });
                return data;
            },
            // 是否可以继续上传
            isDisabled() {
                let bool = false;
                const len = this.excelFiles.length;
                if(len === 5) {
                    bool = true;
                };
                return bool;
            }
        },

        methods: {
            setDisabledDate(date) {
                // 只能选择今天之后的时间
                return ((new Date()).getTime() - 24*60*60*1000) > (new Date(date)).getTime();
            },
            // 有效期改变
            handleRangeTime(date) {
                const index = date.indexOf(' - ');
                this.pageForm.startTime = date.slice(0, index);
                this.pageForm.endTime = date.slice(index + 3);
            },
            // 重新上传
            handleReUpload() {
                pubObj.showMessage(this, {
                    title: '重新上传',
                    content: '重新上传将会覆盖已有的文件，您确定重新上传？',
                    confirm() {
                        this.excelFiles = [];
                        this.$refs.reUploadExcel.$el.click();
                    }
                })
            },
            // 下一步
            handleNextStep(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        // 税金自动补全两位
                        // this[formName].revenueNumStr = (parseFloat(this[formName].revenueNumStr)).toFixed(2);
                        pubObj.httpRequest(this, {
                            url: ['incentive'],
                            method: 'POST',
                            body: this[formName],
                            success(result) {
                                // 下一步
                                this.activeStep++;
                                this.excelApi += result.data.sid;
                                this.reExcelApi += result.data.sid;
                                this.incentiveSid = result.data.sid;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 下载模板
            handleDownload() {
                const alink = document.createElement('a');
                alink.download = '激励方案导入模板V2.xls';
                alink.style.display = 'none';
                alink.href = '../../../static/doc/激励方案导入模板V2.xlsx';
                document.body.appendChild(alink);
                alink.click();
                document.body.removeChild(alink);
                //window.open('../../../static/doc/redirect.html?file=激励方案导入模板V2.xls');
            },
            // 检查上传文件格式
            handleBefore(file) {
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
                };
                if(bool) {
                    this.loading = true;
                    return true;
                } else {
                    this.$message.error('文件格式不正确，请上传Excel文件');
                    return false;
                }
            },
            // 上传成功
            handleSuccess(response, file, fileList) {
                if(response.code === 200) {
                    this.loading = false;
                    // 第一次上传
                    if(!this.firstExcelSuccess) {
                        this.firstExcelSuccess = true;
                    }
                    let excelFile = {};
                    excelFile.name = file.name;
                    excelFile.size = file.size / 1024 + 'KB';
                    excelFile.userData = response.data;
                    this.excelFiles.push(excelFile);
                    // 更新当前文件，把之前的文件删除
                    fileList.length > 1 ? fileList.shift() : null;
                } else {
                    this.$message.warning(response.message);
                    this.loading = false;
                }
            },
            // 上传失败
            handleError(err) { this.$message.error(err); },
            // 查看明细
            handleLookList() { bus.$emit('user-list-table'); },
            editorReady(editor) {
                // 编辑器相关
                // 初始化后把自定义的上传按钮移动到编辑器的DOM内部
                let a = document.getElementById('editor-upload-img');
                a.style.display = 'block';
                let b = document.getElementsByClassName('edui-toolbar')[0];
                b.appendChild(a);
                this.editor = editor;
                // this.editor.setContent(this.pageForm.goodsInfo);
                this.editor.addListener('contentChange',() => {
                    this.pageForm.goodsInfo = this.editor.getContent();
                });
                // 监听插入图片之前，如果需要做什么事
                // this.editor.addListener('beforeinsertimage',(a, b) => {});
            },
            // 发布按钮
            handlePublic() {
                // 文件不为空
                if(this.excelFiles.length) {
                    pubObj.httpRequest(this, {
                        url: ['incentive', 'publish/', this.incentiveSid],
                        success(result) {
                            this.$message.success(result.message);
                            setTimeout(() => {
                                this.$router.go(-1);
                            }, 1000)
                        }
                    });
                } else {
                    this.$message.info('请先上传文件，才能发布方案');
                }
            }
        },

        destroyed() { bus.$off(); }
    }
</script>

<style>
    .incentive-add .el-form>.el-form-item { width: 800px; margin: auto; }
    .incentive-add .el-form .el-form-item { margin-bottom: 22px; }
    .incentive-add .form-item-wrapper { overflow: hidden; line-height: 28px; width: 800px; margin: auto; }
    .incentive-add .form-item-wrapper .inline { float: left; }
    .incentive-add .form-item-wrapper .inline+.inline { margin-left: 10px; }
    .incentive-add .form-item-wrapper .el-input:not(.el-date-editor) .el-input__inner { width: 220px; }
    .incentive-add .block-inline { margin-bottom: 10px; text-align: center; }
    .incentive-add .block-inline>p+p { margin-top: 10px; }
    .incentive-add .horizon-line { border-top: 1px solid transparent; border-bottom: 1px solid #d5d5d5; margin: 20px 0; }
    .incentive-add .success-tips { text-align: center; }
    .incentive-add .success-tips>span { width: 100%; display: inline-block; margin: 56px auto; }
    /* 富文本 */
    .incentive-add .UEditor .el-form-item__content { line-height: 20px; }
    .incentive-add .editor-upload-img {
        width: 22px;
        height: 22px;
        position: absolute;
        background: #fff;
        z-index: 1000;
        left: 355px;
        top: 2px;
        border: 1px solid #fff;
        display: none;
    }
    .incentive-add .editor-upload-img .button-img {
        width: 20px;
        height: 20px;
        position: absolute;
        background: url("/static/ueditor1_4_3_3/themes/default/images/icons.png") no-repeat;
        background-position: -381px 0px;
    }
    .incentive-add .editor-upload-img:hover {
        background: #fff5d4;
        border: 1px solid #dcac6c;
    }
    /* 文件上传 */
    .incentive-add .el-upload-list--text { display: none; }
    .incentive-add .upload-box { max-width: 1000px; margin: 60px auto; }
</style>
