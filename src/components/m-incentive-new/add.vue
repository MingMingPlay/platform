<template>
    <div class="incentive-add">
        <el-breadcrumb separator=">" style="padding: 14px 0;">
            <el-breadcrumb-item>激励方案</el-breadcrumb-item>
            <el-breadcrumb-item>创建方案</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="detail-title">创建方案</div>

        <el-steps :active="activeStep" space="10%" style="margin-bottom: 20px;" align-center center>
            <el-step title="方案类型"></el-step>
            <el-step title="方案信息"></el-step>
            <el-step title="物品信息"></el-step>
            <el-step title="下载模板"></el-step>
            <el-step title="导入用户"></el-step>
            <el-step title="发布"></el-step>
        </el-steps>

        <div class="detail-wrap" v-loading.body="loading" element-loading-text="正在上传...">
            <!--方案类型 -->
            <el-table :data="types" style="width: 800px; margin: 0 auto;" border v-if="activeStep === 1">
                <el-table-column label="方案类型" align="center" width="200">
                    <template slot-scope="scope">{{scope.row.title}}</template>
                </el-table-column>
                <el-table-column label="说明" align="center" width="398">
                    <template slot-scope="scope">{{scope.row.description}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="selectType(scope.row)">创建</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--方案信息-->
            <el-form :model="pageForm" :rules="rules" ref="pageForm" label-width="110px" v-if="activeStep === 2">
                <el-form-item label="方案类型" prop="type">
                    <el-input :value="pageForm.typeName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="方案名称" prop="title">
                    <el-input v-model="pageForm.title"  placeholder="请输入名称" :maxlength="30" width="300px"></el-input>
                    <span>{{calculateLength(pageForm.title)}}/30</span>
                </el-form-item>
                <el-form-item label="DU号" prop="duStr">
                    <el-input v-model="pageForm.duStr" placeholder="请输入DU号"></el-input>
                </el-form-item>
                <div class="form-item-wrapper">
                    <el-form-item label="认领有效期" prop="rangeTime" class="inline">
                        <el-date-picker
                            v-model="pageForm.rangeTime"
                            type="datetimerange"
                            placeholder="请选择时间段"
                            :picker-options="{ disabledDate: setDisabledDate }"
                            @change="handleRangeTime">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <el-form-item label="放弃方案" prop="abandon">
                    <el-checkbox v-model="pageForm.abandon">
                        <span style="color: #aaa;">勾选此项表示允许用户放弃方案</span>
                    </el-checkbox>
                </el-form-item>
            </el-form>

            <!--物品信息-->
            <div class="goods" v-if="labels && activeStep === 3" style="overflow: hidden">
                <el-form :inline="true">
                    <el-form-item label="方案类型:">
                        <el-input v-text="labels.typeName"></el-input>
                    </el-form-item>
                    <el-form-item label="方案id:">
                        <el-input v-text="labels.sid"></el-input>
                    </el-form-item>
                    <el-form-item label="方案名称:">
                        <el-input v-text="labels.title"></el-input>
                    </el-form-item>
                </el-form>
                <el-table :data="goodsList" style="margin: 0 auto" border tooltip-effect="light">
                    <el-table-column label="序号" align="center" type="index"></el-table-column>
                    <el-table-column label="物品类型"  align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.goodsType== 'Entity'">实物</span>
                            <span v-if="scope.row.goodsType== 'Travel'">旅游</span>
                            <span v-if="scope.row.goodsType== 'Cash'">现金</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="物品名称" align="center">
                        <template slot-scope="scope">{{scope.row.goodsTitle}}</template>
                    </el-table-column>
                    <el-table-column label="物品简介" align="center" class-name="description" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.goodsInfo}}
                        </template>

                    </el-table-column>
                    <el-table-column label="物品属性" align="center">
                        <template slot-scope="scope">
                            <span v-show="scope.row.abandon">可放弃</span>
                            <span v-show="scope.row.cashable">可折现</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleDeleteGoodsItem(scope.row.sid)">删除</el-button>
                            <el-button type="text" @click="openDialog(scope.row.sid)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="openDialog(null)" style="float: right;margin-top: 10px" v-if="isShowAddBtn">新增物品</el-button>

                <!--新增物品/编辑物品-->
                <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="800px" @close="cancelSaveGoodsItem">
                    <div class="dialog-left">
                        <el-form :model="goodsItem" :rules="rules" ref="goodsItem" label-width="80px" label-position="left">
                            <el-form-item label="物品类型" v-if="this.labels.type == 'SingleEntity' || this.labels.type=='MultiEntity'">
                                <el-input :value="'实物'" auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物品类型" v-else-if="this.labels.type == 'SingleTravel' || this.labels.type == 'MultiTravel'">
                                <el-input :value="'旅游'" auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物品类型" v-else-if="this.labels.type == 'Cash' || this.labels.type == 'Commission'">
                                <el-input :value="'现金'" auto-complete="off" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物品类型" v-else>
                                <el-select v-model="goodsItem.goodsType" placeholder="请选择">
                                    <el-option v-for="(item,index) in goodsTypes" :key="index" :label="item.title" :value="item.type" :disabled="item.disabled"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="物品名称" prop="goodsTitle">
                                <el-input v-model="goodsItem.goodsTitle" auto-complete="off" :maxlength="20" placeholder="请输入名称"></el-input>
                                <span>{{calculateLength(goodsItem.goodsTitle)}}/20</span>
                            </el-form-item>
                            <el-form-item label="封面图片">
                                <image-upload v-model="goodsItem.logoSid" :action-path="goodsItem.logoPath" action-type="Other" @get-path="handleGetImgPath"></image-upload>
                                <div style="font-size: 12px;color: #FF4949;margin-top: 4px;">建议图片尺寸500*500</div>
                            </el-form-item>
                            <el-form-item label="物品简介">
                                <el-input type="textarea" :maxlength="500" v-model="goodsItem.goodsInfo" auto-complete="off" placeholder="请输入简介"></el-input>
                                <span>{{calculateLength(goodsItem.goodsInfo)}}/500</span>
                            </el-form-item>
                            <el-form-item label="物品属性">
                                <el-checkbox v-model="goodsItem.abandon">
                                    <span style="color: #aaa;">代理人可放弃</span>
                                </el-checkbox>
                                <el-checkbox v-if="goodsItem.goodsType !== 'Cash'" v-model="goodsItem.cashable">
                                    <span style="color: #aaa;">物品可折现</span>
                                </el-checkbox>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="dialog-right">
                        <el-card class="box-card" style="padding: 0">
                            <div class="title divider" style="text-align: center">{{labels.title}}</div>
                            <div class="item">
                                <div class="left">
                                    <img class="logo" :src="goodsItem.logoPath" v-if="goodsItem.logoPath" alt="logo">
                                    <span class="logo" v-if="!goodsItem.logoPath">暂无图片</span>
                                </div>
                                <div class="right">
                                    <p class="goods-title strong">{{goodsItem.goodsTitle}}</p>
                                    <p class="goods-info small">{{goodsItem.goodsInfo}}</p>
                                    <div class="get">
                                        <span class="left">直接领取</span>
                                        <span class="right">+</span>
                                    </div>
                                    <div class="cash" v-if="goodsItem.goodsType !== 'Cash' && goodsItem.cashable">
                                        <span class="left">折成现金</span>
                                        <span class="right">+</span>
                                    </div>
                                    <div class="abandon" v-if="goodsItem.abandon">
                                        <span class="left">放弃</span>
                                        <span class="right">+</span>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelSaveGoodsItem">取 消</el-button>
                        <el-button type="primary" @click="saveGoodsItem">保 存</el-button>
                    </div>
                </el-dialog>
            </div>

            <!--下载模板-->
            <div class="download" v-if="activeStep===4">
                <el-form>
                    <el-form-item style="margin-left: 10%" label="下载导入模板">
                        <el-button type="primary" @click="handleDownload(false)">下载</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!--导入用户-->
            <div class="import-users" id="user" v-if="activeStep === 5">
                <div class="upload-box">
                    <!--<template v-if="!firstExcelSuccess">-->
                    <template>
                        <!--<div class="block-inline">-->
                            <!--<span>最多上传5个表格，每个表格最多一次支持2000位用户。</span>-->
                        <!--</div>-->
                        <div class="block-inline" style="margin-top: 30px;" v-if="excelFiles.length>0">
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
                        <div class="block-inline">
                            <el-upload
                                name="userexcel"
                                :action="excelApi + incentiveSid"
                                :headers="excelHeaders"
                                :before-upload="handleBefore"
                                :on-success="handleSuccess"
                                :on-error="handleError">
                                <el-button type="default">上传文件</el-button>
                            </el-upload>
                        </div>
                        <div class="block-inline" style="margin-top: 20px;">
                            <!--<el-upload-->
                            <!--style="display: inline-block;"-->
                            <!--name="userexcel"-->
                            <!--:action="excelApi"-->
                            <!--:headers="excelHeaders"-->
                            <!--:before-upload="handleBefore"-->
                            <!--:on-success="handleSuccess"-->
                            <!--:on-error="handleError">-->
                            <!--<el-button size="small" :disabled="isDisabled">继续上传</el-button>-->
                            <!--</el-upload>-->
                            <!--<template>-->
                            <!--<el-button type="danger" size="small" @click="handleReUpload">重新上传</el-button>-->
                            <!--<el-upload-->
                            <!--style="display: inline-block; display: none;"-->
                            <!--name="userexcel"-->
                            <!--:action="reExcelApi"-->
                            <!--:headers="excelHeaders"-->
                            <!--:before-upload="handleBefore"-->
                            <!--:on-success="handleSuccess"-->
                            <!--:on-error="handleError">-->
                            <!--<el-button type="danger" size="small" ref="reUploadExcel">重新上传</el-button>-->
                            <!--</el-upload>-->
                            <!--</template>-->
                        </div>
                    </template>
                </div>
                <div class="import-user" v-if="importInfo.pagination">
                    <div style="margin-bottom: 10px;" v-if="importInfo.userInfo">
                        <span class="danger small" v-if="importInfo.userInfo.errorCount > 0"><i class="el-icon-circle-cross" style="margin-right: 5px"></i>校验失败，请修改表格后重新上传</span>
                        <span class="success small" v-if="importInfo.userInfo.successCount === importInfo.userInfo.totalCount"><i class="el-icon-circle-check" style="margin-right: 5px"></i>校验成功</span>
                        <br>
                        <br>
                        <span style="display: inline-block; margin-right: 10px;">
                            <span>总人数：</span>
                            <span v-text="importInfo.userInfo.totalCount"></span>
                        </span>
                        <span style="display: inline-block; margin-right: 10px;" class="danger">
                            <span>失败人数：</span>
                            <span v-text="importInfo.userInfo.errorCount"></span>
                        </span>
                        <span style="display: inline-block;" class="success">
                            <span>成功人数：</span>
                            <span v-text="importInfo.userInfo.successCount"></span>
                        </span>
                        <span class="download-icon"
                            @click="handleDownload(true)"
                            style="float: right;">
                        </span>
                    </div>

                    <el-table :data="importInfo.userInfo.userInfoDTOList" v-if="importInfo.userInfo" stripe :cell-class-name="cell">
                        <el-table-column label="校验结果" align="center">
                            <template slot-scope="scope">
                                <span :class="[scope.row.isValid ? 'success' : 'danger']">{{ scope.row.isValid ? '成功' : '失败' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.validMemo? scope.row.validMemo : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.indexNumber }}
                            </template>
                        </el-table-column>
                        <el-table-column label="工号" align="center">
                            <template slot-scope="scope">
                               {{ scope.row.jobNum }}
                            </template>
                        </el-table-column>
                        <el-table-column label="姓名" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.name }}
                            </template>
                        </el-table-column>
                        <template v-for="(item, index) in goodsList">
                            <template v-if="item.goodsType === 'Cash'">
                                <el-table-column :label="item.goodsTitle + '-领取数量上限'" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.goodsInfo[item.goodsTitle +'-领取数量上限']}}
                                    </template>
                                </el-table-column>
                                <el-table-column :label="item.goodsTitle + '-单个价值'" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.goodsInfo[item.goodsTitle +'-单个价值']}}
                                    </template>
                                </el-table-column>
                            </template>
                            <template v-else>
                                <el-table-column :label="item.goodsTitle + '-领取数量上限'" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.goodsInfo[item.goodsTitle +'-领取数量上限']}}
                                    </template>
                                </el-table-column>
                            </template>
                        </template>

                        <el-table-column label="所有物品领取上限" v-if="goodsList.length>1" align="center">
                            <template slot-scope="scope">
                                {{scope.row.goodsInfo['所有物品领取上限']}}
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="importInfo.pagination.totalRow"
                        style="margin: 20px 0; text-align: right;">
                    </el-pagination>
                </div>
            </div>

            <!--发布-->
            <div class="incentive-info" v-if="activeStep === 6">
                <div class="left" style="max-width: 950px;">
                    <jk-labels :model="labels" v-if="labels" label-width="80px" label-right="20px">
                        <jk-labels-item label="方案ID" prop="sid"></jk-labels-item>
                        <jk-labels-item label="方案类型" prop="typeName"></jk-labels-item>
                        <jk-labels-item label="方案属性" v-if="labels.abandon">代理人可放弃</jk-labels-item>
                        <jk-labels-item label="方案属性" v-else>代理人不允许放弃</jk-labels-item>
                        <!--<jk-labels-item label="折合现金" prop="unitCash"></jk-labels-item>-->
                        <jk-labels-item label="DU号" prop="duStr"></jk-labels-item>
                        <jk-labels-item label="创建时间" prop="createdTime"></jk-labels-item>
                        <jk-labels-item label="有效期" prop="availableTime"></jk-labels-item>
                        <jk-labels-item label="发布机构" prop="publishMerchantName"></jk-labels-item>
                        <jk-labels-item label="发布人" prop="publishName"></jk-labels-item>
                        <!--<jk-labels-item label="领用说明" prop="instructions"></jk-labels-item>-->
                        <!--<jk-labels-item label="物品描述">-->
                        <!--<div class="html-wrapper" v-html="labels.goodsInfo"></div>-->
                        <!--</jk-labels-item>-->
                        <!--<jk-labels-item-->
                        <!--v-if="labels.remark"-->
                        <!--label="备注"-->
                        <!--prop="remark">-->
                        <!--</jk-labels-item>-->

                        <!--<div class="img-placeholder">-->
                        <!--<span>封面</span>-->
                        <!--<img :src="labels.logoPath" />-->
                        <!--</div>-->
                    </jk-labels>
                    <el-table border style="width: 100%" :data="goodsList" tooltip-effect="light">
                        <el-table-column label="序号" align="center" type="index"></el-table-column>
                        <el-table-column label="物品类型" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.goodsType == 'Entity'">实物</span>
                                <span v-if="scope.row.goodsType == 'Cash'">现金</span>
                                <span v-if="scope.row.goodsType == 'Travel'">旅游</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="物品名称" align="center">
                            <template slot-scope="scope">{{scope.row.goodsTitle}}</template>
                        </el-table-column>
                        <el-table-column label="物品简介" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">{{scope.row.goodsInfo}}</template>
                        </el-table-column>
                        <el-table-column label="物品属性" width="180" align="center">
                            <template slot-scope="scope">
                                <span v-show="scope.row.abandon">可放弃</span>
                                <span v-show="scope.row.cashable">可折现</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="right">
                    <yu-lan :goodsList="goodsList"></yu-lan>
                </div>
            </div>
        </div>

        <!--btn group-->
        <div class="btn-group" style="text-align: center; margin: 20px 0;">
            <template>
                <el-button type="primary" size="large" @click="handlePrevStep" v-if="activeStep >= 3 && activeStep <= 6">上一步</el-button>
                <el-button type="primary" size="large" @click="handleNextStep()" v-if="activeStep >= 2 && activeStep <= 5">下一步</el-button>
                <!--<el-button type="default" size="large" @click="$router.go(-1)">取消</el-button>-->
                <el-button type="success" size="large" @click="handlePublic" v-if="activeStep === 6">发布</el-button>
                <!--<el-button type="default" size="large" @click="$router.go(-1)">取消</el-button>-->
            </template>
        </div>

    </div>
</template>

<script>
    // child
    import VueUeditor from 'vue-ueditor'
    import ImageUpload from '../common/image-upload.vue'
    import JkLabels from './labels/jk-labels.vue'
    import JkLabelsItem from './labels/jk-labels-item.vue'
    import YuLan from './yulan.vue'
    import { ElTable } from 'element-table'

    // mixin
    import { mixin_UEditor } from '../mixin/add_mixins.vue'
    // js
    import { pubObj, bus } from '../../assets/unit/public.js'
    import validator from '../../assets/unit/validator.js'
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        components: { ImageUpload, VueUeditor,JkLabels,JkLabelsItem,YuLan,ElTable },

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
                    max: 20,
                    message: '物品名称在20字符以内',
                    trigger: 'blur'
                }, {
                    validator: validator.validChar,
                    message: '只能输入数字、中文或英文字符',
                    trigger: 'blur'
                }, {
                    validator: this.handleCheckName,
                    message: '物品名称不能重复',
                    trigger: 'change'
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
                rangeTime: [{
                    type: 'array',
                    required: true,
                    message: '请选择有效期',
                    trigger: 'blur'
                }],
            };
            return {
                //激励方案类型
                types: [
                    {
                    type: 'SingleEntity',
                    title: '单实物激励',
                    description: '仅能包含1个奖励物品，需核销，需代理人在惠汇中确认领取'
                },{
                    type: 'MultiEntity',
                    title: '多实物激励',
                    description: '能包含多个奖励物品，需核销，需代理人在惠汇中确认领取'
                },{
                    type: 'SingleTravel',
                    title: '单旅游激励',
                    description: '仅能包含1个奖励物品，无需核销，需代理人在惠汇中确认领取'
                },{
                    type: 'MultiTravel',
                    title: '多旅游激励',
                    description: '能包含多个奖励物品，无需核销，需代理人在惠汇中确认领取'
                },{
                    type: 'Cash',
                    title: '现金激励',
                    description: '仅能包含现金，无需核销，需代理人在惠汇中确认领取'
                },{
                    type: 'Commission',
                    title: '加佣',
                    description: '仅能包含现金，无需核销，无需代理人在惠汇中确认领取'
                },{
                    type: 'Other',
                    title: '其他激励',
                    description: '支持各种方案类型组合'
                }],
                goodsTypes:[
                    {
                        type: '',
                        title: '请选择类型',
                        disabled: true,
                    },{
                        type: 'Entity',
                        title: '实物',
                        disabled: false,
                    },{
                        type: 'Cash',
                        title: '现金',
                        disabled: false,
                    },{
                        type: 'Travel',
                        title: '旅游',
                        disabled: false,
                    },

                ],
                goodsItem: {
                    goodsType: '',
                    goodsTitle: '',
                    goodsInfo: '',
                    logoSid: null,
                    logoPath: null,
                    abandon: true,
                    cashable: true,
                    sid: null,
                },
                goodsTypeName: '',
                // 激励方案sid
                incentiveSid: null,
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
                    abandon: true,
                },

                //新增物品
                goodsList: [],
                dialogFormVisible: false,
                dialogTitle: '新增物品',

                rules: rules,
                // 文件上传api
                excelApi: `${this.$api.incentive.url}import/`,
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
                labels: null,
                showAddBtn: false,
                importForm: {
                    pageIndex: 1,
                    pageSize: 10
                },
                currentPage: 1,
                pageSize: 10,
                importInfo: {
                    pagination: null,
                    userInfo: null,
                },

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
            },

            //是否显示新增物品按钮
            isShowAddBtn(){
                let bool = true;
                console.log(this.goodsList.length);
                if(this.labels.type == 'SingleEntity' && this.goodsList.length >0 ||
                    this.labels.type == 'SingleTravel'&& this.goodsList.length >0){
                    bool = false;
                }
                return bool;
            }
        },

        mounted(){

            if(this.$route.query.incentiveSid){
                this.incentiveSid = this.$route.query.incentiveSid;
                this.handleGetDetail();
                this.handleGetGoodsList();
                this.activeStep = 3;
            }
        },

        methods: {
            //实时计算名称长度
            calculateLength(str){
                let length = 0;
                if(str){
                    length = str.length;
                }

                return length;
            },
            //设置单元格类名
            cell({row, column, rowIndex, columnIndex}) {
                console.log(row);

                //某一行其中的一个变量applies值如果大于0，并且在第六列，即确定一个具体的单元格需要确定行和列
                if(row.validColumn && row.validColumn.indexOf(columnIndex) >=0){
                    return 'danger'
                }
            },

            // 获取图片路径
            handleGetImgPath(imgPath) {
                this.goodsItem.logoPath = imgPath;
            },
            //activeStep===1
            selectType(row){
                this.pageForm.type = row.type;
                this.pageForm.typeName = row.title;
                this.activeStep++;
                console.log(this.pageForm.type);
                console.log(this.activeStep);
                if(this.pageForm.type === 'SingleEntity' || 'MultiEntity'){
                    this.goodsItem.goodsType = 'Entity';
                    this.goodsItem.goodsTypeName = '实物';
                }else if(this.pageForm.type === 'SingleTravel' || 'MultiTravel'){
                    this.goodsItem.goodsType = 'Travel';
                    this.goodsItem.goodsTypeName = '旅游';
                }else if(this.pageForm.type === 'Cash' || 'Commission'){
                    this.goodsItem.goodsType = 'Cash';
                    this.goodsItem.goodsTypeName = '现金';
                }else{
                    this.goodsItem.goodsType = null;
                    this.goodsItem.goodsTypeName = '';
                }
            },

            //activeStep===2
            setDisabledDate(date) {
                // 只能选择今天之后的时间
                return ((new Date()).getTime() - 24*60*60*1000) > (new Date(date)).getTime();
            },
            // 有效期改变
            handleRangeTime(date) {
                console.log(date,'----'+this.pageForm.rangeTime);

                const index = date.indexOf(' - ');
                this.pageForm.startTime = date.slice(0, index);
                this.pageForm.endTime = date.slice(index + 3);
            },
            //保存激励方案为草稿
            handleCreateInsentive(){
                this.$refs.pageForm.validate((valid) => {
                    if(valid) {
                        delete this.pageForm.rangeTime;
                        console.log(this.pageForm);

                        pubObj.httpRequest(this, {
                            url: ['incentive'],
                            method: 'POST',
                            body: this.pageForm,
                            success(result) {
                                // 下一步
                                this.activeStep++;
                                this.incentiveSid = result.data.sid;
                                this.handleGetDetail();
                                this.handleGetGoodsList();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },

            //activeStep===3
            //url has incentiveSid
            // 获取方案详情
            handleGetDetail() {
                pubObj.httpRequest(this, {
                    url: ['incentive', this.incentiveSid],
                    success(result) {
                        try {

                            this.pageForm = this.labels = result.data;
                            this.incentiveSid = result.data.sid;
                            // 增加有效期
                            if(result.data.startTime) {
                                result.data.availableTime = `${result.data.startTime} - ${result.data.endTime}`;
                                this.$set(this.pageForm, 'rangeTime', [new Date(result.data.startTime), new Date(result.data.endTime)]);
                                // result.data.rangeTime = [new Date(result.data.startTime), new Date(result.data.endTime)];
                            } else {
                                result.data.availableTime = '';
                                this.$set(this.pageForm, 'rangeTime', []);
                            }
                            console.log(this.labels);

                            this.setGoodsType();
                        } catch(e){
                            console.log(e)
                        }
                    }
                });
            },
            handleGetGoodsList(){
                pubObj.httpRequest(this, {
                    url: ['incentive','goods/list/', this.incentiveSid],
                    success(result) {
                        try {
                            this.goodsList = result.data;
                            console.log(result.data);
                        } catch(e){
                            console.log(e)
                        }
                    }
                });
            },
            //设置物品类型
            setGoodsType(){
                if(this.labels.type == 'SingleEntity' || this.labels.type=='MultiEntity'){

                    this.goodsItem.goodsType = 'Entity';

                }else if(this.labels.type == 'SingleTravel' || this.labels.type=='MultiTravel'){

                    this.goodsItem.goodsType = 'Travel';

                } else if(this.labels.type == 'Cash' || this.labels.type == 'Commission'){
                    this.goodsItem.goodsType = 'Cash';
                }else{
                    this.goodsItem.goodsType = '';
                }
            },
            //新增物品、编辑物品
            openDialog(sid){
                console.log(sid);
                this.dialogFormVisible = true;
                this.dialogTitle = '新增物品';
                if(sid){
                    this.dialogTitle = '编辑物品';
                    this.handleGetGoodsItem(sid);
                }
                console.log(this.goodsItem);
            },
            //删除方案物品
            handleDeleteGoodsItem(sid){
                pubObj.httpRequest(this, {
                    url: ['incentive','goods/del/',sid],
                    method: 'POST',
                    success(result) {
                        console.log(result.data);
                        this.handleGetGoodsList();
                    }
                });
            },
            //查询激励方案物品详情
            handleGetGoodsItem(sid){
                pubObj.httpRequest(this, {
                    url: ['incentive','goods/detail/', sid],
                    success(result) {
                        this.goodsItem.goodsType = result.data.goodsType;
                        this.goodsItem.goodsTitle = result.data.goodsTitle;
                        this.goodsItem.goodsInfo = result.data.goodsInfo;
                        this.goodsItem.logoSid = result.data.logoSid;
                        this.goodsItem.logoPath = result.data.logoPath;
                        this.goodsItem.abandon = result.data.abandon;
                        this.goodsItem.cashable = result.data.cashable;
                        this.goodsItem.sid = result.data.sid;
                        this.activeStep = 3;
                        console.log(result.data);
                    }
                });
            },
            //查询物品名称是否重复
            handleCheckName(rule, value, callback) {
                let url = this.$api.incentive.url + 'goods/checkName/' + this.incentiveSid;
                if(this.goodsItem.sid){
                    url += '/' + this.goodsItem.sid;
                }
                pubObj.httpRequest(this, {
                    url: url,
                    params: {goodsTitle: value},
                    success(result) {
                        if(result.data) {
                            callback(new Error(rule.message));
                        } else {
                            callback();
                        }
                    }
                });
            },
            //取消
            cancelSaveGoodsItem(){
                this.dialogFormVisible = false;
                this.goodsItem.goodsTitle = '';
                this.goodsItem.goodsInfo = '';
                this.goodsItem.logoSid = null;
                this.goodsItem.sid = null;
                this.goodsItem.logoPath = null;
                this.goodsItem.abandon = true;
                this.goodsItem.cashable = true;
            },
            // 保存
            saveGoodsItem(){
                this.$refs.goodsItem.validate((valid) => {
                    if(valid) {
                        console.log(this.goodsItem);

                        pubObj.httpRequest(this, {
                            url: ['incentive','goods/add/',this.incentiveSid],
                            method: 'POST',
                            body: this.goodsItem,
                            success(result) {
                                console.log(result.data);
                                this.handleGetGoodsList();
                                this.cancelSaveGoodsItem();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },

            //activityStep===4
            // 下载模板
            formatDate(){
                var time = new Date();
                var year = time.getFullYear();
                var month = time.getMonth()+1;
                var date = time.getDate();
                var hour = time.getHours();
                var minutes = time.getMinutes();
                var seconds = time.getSeconds();

                hour = hour<10? '0'+hour: hour;
                minutes = minutes<10? '0'+minutes: minutes;
                seconds = seconds<10? '0'+seconds: seconds;
                console.log(year,month,date);
                return '' + year + month + date + hour + minutes + seconds;
            },
            handleDownload(check) {
                this.$http({
                    url: this.$api.incentive.url + 'excel/'+ this.incentiveSid,
                    method: 'GET',
                    params: {check: check},
                    responseType: 'blob',
                }).then((res) => {
                    if(res.status === 200) {
                        const excelName=this.labels.title + this.currentTime + '.xls';
                        if(IEDownload(this,res.data,excelName))return;
                        const alink = document.createElement('a');
                        this.currentTime = this.formatDate();
                        alink.download = excelName;
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

            //activeStep===5
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
            // 检查上传文件格式
            handleBefore(file) {
                // 文件格式是否正确
                let bool = false;
                // 获取文件的后缀名
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
                    this.excelFiles = [].concat(excelFile);
                    // 更新当前文件，把之前的文件删除
                    fileList.length > 1 ? fileList.shift() : null;

                    //查询导入员工结果列表
                    this.handleGetImport();
                } else {
                    this.$message.warning(response.message);
                    this.loading = false;
                };
            },
            // 上传失败
            handleError(err) { this.$message.error(err); },
            // 查看导入结果列表
            handleGetImport(){
                pubObj.httpRequest(this, {
                    url: ['incentive','import/', this.incentiveSid],
                    params: this.importForm,
                    success(result) {
                        console.log(result.data);
                        this.importInfo.pagination = result.pagination;
                        this.importInfo.userInfo = result.data;

                    }
                });
            },
            // 分页显示个数
            handleSizeChange() {
                this.importForm.pageSize = this.pageSize = size;
                this.handleGetImport();
            },
            // 分页当前页
            handleCurrentChange(currentPage) {
                this.importForm.pageIndex = this.currentPage = currentPage;
                this.handleGetImport();
            },

            //activityStep===6
            // 发布按钮
            handlePublic() {
                // 文件不为空
                if(this.excelFiles.length) {
                    pubObj.httpRequest(this, {
                        url: ['incentive', 'publish/', this.incentiveSid],
                        method: 'POST',
                        success(result) {
                            this.$message.success(result.message);
                            setTimeout(() => {
                                this.$router.push({
                                    path: '/m_incentive/list',
                                })
                            }, 1000)
                        }
                    });
                } else {
                    this.$message.info('请先上传文件，才能发布方案');
                }
            },


            // 下一步
            handleNextStep() {

                if(this.activeStep === 2){
                    this.handleCreateInsentive();
                }else if(this.activeStep === 3 && this.goodsList.length>0){
                    this.activeStep = 4;
                }else if(this.activeStep === 3 && this.goodsList.length==0){
                    this.$message({
                        message: '请添加物品',
                        center: true,
                        type: 'warning'
                    });
                }else if(this.activeStep === 4){
                    // Excel列表
                    this.excelFiles = [];
                    // 第一个文件上传成功
                    this.firstExcelSuccess = false;
                    this.importInfo = {
                        pagination: null,
                        userInfo: null,
                    };
                    this.activeStep = 5;
                }else {
                    if(this.activeStep === 5){
                        if(this.importInfo.userInfo && this.importInfo.userInfo.totalCount &&
                            this.importInfo.userInfo.successCount &&
                            (this.importInfo.userInfo.totalCount === this.importInfo.userInfo.successCount)){
                            this.handleGetDetail();
                            this.handleGetGoodsList();
                            this.activeStep = 6;
                        }else{
                            this.$message({
                                message: '请确保上传数据全部校验成功',
                                center: true,
                                type: 'warning'
                            });
                        }
                    }

                }


            },
            handlePrevStep(){
                if(this.incentiveSid && this.activeStep === 3){
                    this.handleGetDetail();
                }
                this.activeStep--;
            },



        },

        destroyed() { bus.$off(); }
    }
</script>

<style>
    .small{
        font-size: 14px;
    }
    .el-table--border td, .el-table--border th{
        border-top: 0.5px solid #dfe6ec;
        border-left: 0.5px solid #dfe6ec;
        border-right: none;
        border-bottom: none;
    }
    .description .cell{
        max-width: 700px;
        height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }
    .incentive-add .el-form>.el-form-item { width: 800px; margin: auto; }
    .goods .el-form>.el-form-item { width: auto; margin: 0 15px auto 0; }
    .goods .el-form>.el-form-item>.el-form-item__label { padding: 7px 2px 7px 0; }
    .goods .el-dialog--small, .el-dialog--tiny{
        width: 770px;
        max-height: 700px;
    }
    .goods .el-dialog .el-dialog__title{
        border: none;
    }
    .goods .el-dialog .el-dialog__body{
        width: 770px;
        max-height: 520px;
    }
    .dialog-left{
        float: left;
        width: 300px;
    }
    .dialog-left .el-form>.el-form-item{
        width: 300px;
        margin: 0;
    }
    .dialog-right{
        float: right;
        overflow: hidden;
    }
    .box-card {
        width: 320px;
        min-height: 450px;
        color: #333333;
    }
    .title{
        line-height: 20px;
        font-size: 14px;
    }
    .item{
        border-top: 1px solid #dfe6ec;
        padding-top: 10px;
        overflow: hidden;
        margin-top: 10px;
    }
    .item>.left{
        float: left;
        width: 100px;
    }
    .item>.right{
        float: right;
        padding-left: 10px;
        width: 165px;
    }
    .left .logo{
        display: block;
        width: 100px;
        height: 100px;
        background-color: #c0c4cc;
        color: white;
        text-align: center;
        line-height: 100px;
        font-size: 14px;
        letter-spacing: 1px;
    }
    .strong{
        font-weight: 600;
    }
    .small{
        font-size: 12px;
    }
    .goods-title{
        font-size: 16px;
        color: #333333;
    }
    .box-card .goods-info{
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 10px;
        color: #333333;
    }
    .get,.cash,.abandon{
        margin-top: 10px;
        overflow: hidden;
    }
    .get .left,.cash .left,.abandon .left{
        display: block;
        float: left;
        font-size: 14px;
    }
    .get .right,.cash .right,.abandon .right{
        display: block;
        width: 20px;
        height: 20px;
        float: right;
        font-size: 14px;
        border: 1px solid #dfe6ec;
        border-radius: 100%;
        text-align: center;
    }
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
    .success { color: #67C23A; }
    .danger { color: #F56C6C; }
    .download-icon{
        width: 30px;
        height: 30px;
        background: url("../../assets/img/download.png") no-repeat;
        background-size: contain;
    }

    /*发布*/
    .incentive-info{
        overflow: hidden;
    }
    .incentive-info>.left{
        float: left;
    }
    .incentive-info>.right{
        float: right;
    }
</style>
