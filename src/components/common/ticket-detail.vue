<template>
    <div class="goods-info-wrap ticket-info">
        <div class="goods-title">
            <div class="title">
                {{goodsInfo.meetingName}}
                <span class="state">{{goodsInfo.meetingStateName}}</span>
                <el-button
                    class="export-button"
                    v-if="this.$root.platform === 'merchant'"
                    type="primary"
                    @click="handleCheck"
                    :disabled="!goodsInfo.meetingName">
                    导出会议签到/核销表
                </el-button>
            </div>
        </div>
        <!--<el-tabs v-model="activePane" type="card">-->
        <!--<el-tab-pane label="基本信息" name="first"></el-tab-pane>-->
        <!--<el-tab-pane label="票务详情" name="second"></el-tab-pane>-->
        <!--</el-tabs>-->

        <el-tabs type="border-card">
            <el-tab-pane label="基础信息">
                <div class="basics-info">
                    <div class="goods-cell goods-cell-first">
                        <div class="goods-info clear" style="margin-top: 0">
                            <div class="left">
                                <p class="info-cell clear">
                                    <span class="info-title">申请人：</span>
                                    <span class="info-content">{{goodsInfo.proposer}}</span>
                                </p>
                                <!--<p class="info-cell clear">-->
                                <!--<span class="info-title">申请人部门：</span>-->
                                <!--<span class="info-content">{{goodsInfo.description}}</span>-->
                                <!--</p>-->
                                <p class="info-cell clear">
                                    <span class="info-title">所属机构：</span>
                                    <span class="info-content">{{goodsInfo.organName}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">开始日期：</span>
                                    <span class="info-content">{{goodsInfo.startTime}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">结束日期：</span>
                                    <span class="info-content">{{goodsInfo.endTime}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">组织人：</span>
                                    <span class="info-content">{{goodsInfo.organizer}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">主持人：</span>
                                    <span class="info-content">{{goodsInfo.moderator}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">会务：</span>
                                    <span class="info-content">{{goodsInfo.conferenceCoordinator}}</span>
                                </p>
                            </div>
                            <div class="ticket-main-img">
                                <img :src="goodsInfo.posterImage" alt="">
                            </div>
                            <div class="cut-line"></div>
                            <div class="left">
                                <p class="info-cell clear">
                                    <span class="info-title">会议分类：</span>
                                    <span class="info-content">{{goodsInfo.category}}</span>
                                </p>
                                <!--<p class="info-cell clear">-->
                                <!--<span class="info-title">会议类型：</span>-->
                                <!--<span class="info-content">{{goodsInfo.description}}</span>-->
                                <!--</p>-->
                                <p class="info-cell clear">
                                    <span class="info-title">举办层面：</span>
                                    <span class="info-content">{{goodsInfo.meetingLevel}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">会议属性：</span>
                                    <span class="info-content">{{goodsInfo.attribute}}</span>
                                </p>
                                <!--会议核销P3阶段-->
                                <!--<p class="info-cell clear">-->
                                <!--<span class="info-title">会议组织：</span>-->
                                <!--<span class="info-content">{{goodsInfo.attribute}}</span>-->
                                <!--</p>-->
                                <p class="info-cell clear">
                                    <span class="info-title">会议组织类型：</span>
                                    <span class="info-content">{{goodsInfo.meetingOrganizationType}}</span>
                                </p>
                            </div>
                            <div class="cut-line"></div>
                            <div class="left">
                                <p class="info-cell clear">
                                    <span class="info-title">备注说明：</span>
                                    <span class="info-content">{{goodsInfo.description}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">创建日期：</span>
                                    <span class="info-content">{{goodsInfo.submitTime}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">会议编号：</span>
                                    <span class="info-content">{{goodsInfo.meetingCode}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">会议/活动标识：</span>
                                    <span class="info-content">{{goodsInfo.type}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">门票状态：</span>
                                    <span class="info-content">{{goodsInfo.statusName}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">会议状态：</span>
                                    <span class="info-content">{{goodsInfo.meetingStateName}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">会议来源：</span>
                                    <span class="info-content">{{goodsInfo.source}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">会议地址：</span>
                                    <span class="info-content">{{goodsInfo.address}}</span>
                                </p>
                                <p class="info-cell clear">
                                    <span class="info-title">完结时间：</span>
                                    <span class="info-content">{{goodsInfo.overTime}}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="goods-cell code" v-if="type == 'm'">
                        <div class="title">可核销内勤名单</div>
                        <div class="goods-info clear">
                            <CheckMeeting :title="goodsInfo.meetingName"></CheckMeeting>
                        </div>
                    </div>
                    <div class="goods-cell code" v-if="type == 'm'">
                        <div class="title">会议二维码</div>
                        <div class="goods-info clear">
                            <div class="left">
                                <img :src="meetingWxCode">
                                <a :href="meetingWxCode" :download="goodsInfo.meetingName + goodsInfo.meetingCode +'.png'" role="button">下载</a>
                            </div>
                        </div>
                    </div>
                    <div class="goods-cell">
                        <div class="title">会议规格</div>

                        <table border="1" class="goods-sku-table">
                            <tr>
                                <th>类型</th>
                                <th>单价</th>
                                <th>库存</th>
                                <th>总销量</th>
                            </tr>
                            <tr v-for="(item, index) in goodsInfo.meetingTickets">
                                <td>{{item.type}}</td>
                                <td>{{item.price}}</td>
                                <td>{{item.restCount}}</td>
                                <td>{{item.soldCount}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="goods-cell">
                        <div class="title">相关图片</div>
                        <div class="goods-info clear" style="padding-bottom: 0;">
                            <div class="ticket-img" v-for="item in goodsInfo.imagePaths">
                                <img :src="item" alt="相关图片">
                            </div>
                        </div>
                    </div>
                    <div class="goods-cell">
                        <div class="title">会议议程</div>
                        <div class="goods-info clear">
                            <el-tabs v-model="activeName">
                                <el-tab-pane :label="key" :name="key" v-for="(value, key) in cateData" :key="key">
                                    <div v-for="(item, index) in value">
                                        <div class="left">
                                            <p class="info-cell clear">
                                                <span class="info-title">开始时间：</span>
                                                <span class="info-content">{{item.startTime}}</span>
                                            </p>
                                            <p class="info-cell clear">
                                                <span class="info-title">讲解人：</span>
                                                <span class="info-content">{{item.lecturer}}</span>
                                            </p>
                                            <p class="info-cell clear">
                                                <span class="info-title">议程内容：</span>
                                                <span class="info-content">{{item.content}}</span>
                                            </p>
                                        </div>
                                        <div class="cut-line" v-if="index < value.length - 1"></div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="票务详情" v-if="type == 'm'">
                <div class="ticket-detail-content">

                    <div class="search-fil-wrap">

                        <el-form class="search-form" label-width="90px" :model="searchForm" :inline="true">
                            <el-form-item label="组织机构" prop="organCodes">
                                <organ-select v-model="organCodeArr" :organ-data="organData"></organ-select>
                            </el-form-item>

                            <el-form-item>
                                <el-checkbox v-model="isAllOrgan">仅该机构</el-checkbox>
                            </el-form-item>

                            <el-form-item label="购券人姓名" label-width="110px">
                                <el-input v-model="searchForm.realName"></el-input>
                            </el-form-item>

                            <el-form-item label="门票状态">
                                <el-select v-model="statesArr" multiple placeholder="本项可多选" size="small">
                                    <el-option
                                        v-for="item in stateOptions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="search-button-group">
                                <el-button type="primary" @click="resetSearch">重置条件</el-button>
                                <el-button type="primary" @click="search">搜索</el-button>
                                <el-button type="primary" :loading="exportButtonLoading" @click="downExcel">{{exportButtonText}}</el-button>
                            </div>
                        </el-form>

                    </div>
                    <div>
                        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
                            <el-table-column type="index"          label="序号"         align="center" width="90" label-class-name="table-index-title"></el-table-column>
                            <el-table-column prop="workNumber"     label="购券人人工号" ></el-table-column>
                            <el-table-column prop="organName"      label="机构名称"     ></el-table-column>
                            <el-table-column prop="realName"       label="姓名"         ></el-table-column>
                            <el-table-column prop="mobile"         label="购券人手机号" ></el-table-column>
                            <el-table-column prop="createdTime"    label="购票时间"     ></el-table-column>
                            <el-table-column prop="code"           label="券码"         ></el-table-column>
                            <el-table-column prop="name"           label="客户姓名"     ></el-table-column>
                            <el-table-column prop="checkerName"     label="核销人"       ></el-table-column>
                            <el-table-column prop="checkTime"      label="核销时间"     ></el-table-column>
                            <el-table-column prop="updatedTime"    label="失效时间"     ></el-table-column>
                            <el-table-column prop="state"          label="门票状态"     ></el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination-wrap" v-if="!tableLoading">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="searchForm.pageIndex"
                            :page-size="searchForm.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-count="pageCount"
                            :total="totalRow">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    // 征订商品详情组件
    import ExportExcel from '../mixin/export-excel.vue'
    import { pubObj } from '../../assets/unit/public.js'
    import defaultImg from '../../assets/img/defaultlogo.jpg'
    import OrganSelect from '../common/organ-select.vue'
    import CheckMeeting from '../common/check-meeting.vue'

    export default {
        props: ['type'],
        mixins: [ExportExcel],
        components: {
            OrganSelect,
            CheckMeeting
        },
        data () {
            return {
                tableLoading: false,
                totalRow: 0,
                pageCount: 0,
                organData:[],
                tableData: [{
                    state: '', //门票状态，1：待激活，2：未核销，3：已核销，4：已失效
                    updatedTime: '', // 失效时间
                    checkerName: '', // 核销人
                    checkTime: '', //核销时间
                    name: '', // 客户姓名
                    code: '', // 券码
                    createdTime: '', //购票时间
                    mobile: '', //购券人手机号
                    realName: '', //姓名
                    organName: '', //机构名称
                    workNumber: '' //购券人工号
                }],
                exportButtonLoading: false,
                exportButtonText:'导出会议明细Excel',
                isAllOrgan:false,
                statesArr: [],
                organCodeArr: [],
                searchForm: {
                    isAllOrgan: 0,
                    organCode: '',
                    realName: '',
                    states: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
                queryObject: {},
                stateOptions: [
                    {id: 1, value: 1, label: '未激活'},
                    {id: 2, value: 2, label: '已激活'},
                    {id: 3, value: 3, label: '已核销'},
                    {id: 4, value: 4, label: '已失效'}
                ],
                isShowInfo: true,
                goodsInfo: {},
                activeName: null,
                cateData: {},
                meetingWxCode: null,
            }
        },
        created () {
            this.getTicketDetail();
            this.meetingWxCode = this.$api.ticketMeetingCode.url + this.$route.query.sid + '.png';
            //console.log(this.meetingWxCode);

            pubObj.httpRequest(this, {
                url: ['organChildren', 'myself/', this.$root.userInfo.merchantSid, '/', this.$root.userInfo.organCode],
                success(result) {
                    this.organData = result.data;
                }
            });
            this.queryObject = this.searchForm;
            this.getTableData();
        },
        /*computed: {
            refundExcel() {
               /!* let excelUrl = null;
                const type = this.orderType;
                if(type === 'vi') {
                    excelUrl = this.$api.virtualOrder.url + 'refund/excel';
                } else {
                    excelUrl =  this.$api.order + 'refund/excel';
                }*!/
               let excelUrl = `${this.$api.ticketMeeting.url}detail/oooSZz`; //this.$root.userInfo.merchantSid
                return excelUrl;
            }
        },*/
        methods: {
            getTableData () {
                //console.log(this.$root.userInfo.merchantSid);
                if(this.tableLoading){
                    return;
                }
                this.tableLoading =  true;
                this.searchForm.isAllOrgan = this.isAllOrgan ? 1 : 0;
                this.searchForm.states = this.statesArr.length > 0 ? this.statesArr.join('') : '';
                this.searchForm.organCode = this.organCodeArr.length > 0 ? this.organCodeArr[this.organCodeArr.length-1] : '';
                pubObj.httpRequest(this, {
                    url: ['ticketMeeting', 'detail/', /*'oooSZz'*/this.$route.query.sid],
                    params: this.searchForm,
                    success(result) {
                        this.tableLoading =  false;
                        this.tableData = result.data;
                        if(result.data.length === 0){
                            this.searchForm.pageIndex = 1;
                            this.totalRow = 0;
                            this.pageCount = 1;
                        }
                        if(result.data.length > 0){
                            this.searchForm.pageIndex = result.pagination.pageIndex;
                            this.searchForm.pageSize = result.pagination.pageSize;
                            this.totalRow = result.pagination.totalRow;
                            this.pageCount = result.pagination.pageCount;
                        }
                    }
                })
            },
            handleCurrentChange (pageIndex) {
                this.searchForm.pageIndex = pageIndex;
                this.getTableData();
            },
            handleSizeChange (pageSize) {
                this.searchForm.pageSize = pageSize;
                this.getTableData();
            },
            downExcel () {
                this.exportButtonLoading = true;
                this.exportButtonText = '生成中，请稍后...';
                //this.handleExportExcel(`${this.$api.ticketMeeting.url}detail/excel/oooSZz`/*this.$root.userInfo.merchantSid*/, '会议明细', (res) => {
                this.handleExportExcel(['ticketMeeting', 'detail/', 'excel/', /*'oooSZz'*/this.$route.query.sid], '会议明细', (res) => {
                    this.exportButtonLoading = false;
                    this.exportButtonText = '导出订单Excel';
                })
            },
            search () {
                // console.log(this.searchForm);
                this.getTableData();
            },
            resetSearch () {
                /*for(let key in this.searchForm){
                    if(key !== 'pageIndex' || key !== 'pageSize'){
                        this.searchForm[key] = '';
                    }
                }*/
                this.searchForm.isAllOrgan = 0;
                this.searchForm.organCode = '';
                this.searchForm.realName = '';
                this.searchForm.realName = '';
                this.statesArr = [];
                this.organCodeArr = [];
            },
            getTicketDetail (){		// 获取商品信息
                this.$http.get(['ticketMeetingDetail', this.$route.query.sid])
                    .then((result) => {
                        if(result.body.code === 200){
                            this.goodsInfo = result.body.data;
                            this.goodsInfo.agendas.forEach(value => {
                                let key = value.startTime.substr(5, 5);
                                if(this.activeName === '0'){
                                    this.activeName = key;
                                }
                                if(this.cateData[key]){
                                    this.cateData[key].push(value);
                                }else {
                                    this.cateData[key] = [value];
                                }
                            });
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },
            handleCheck () {
                // NotStart(1, "未开始"),Underway(2, "进行中"),Finished(3, "已结束");
                if(this.goodsInfo.meetingState !== 'Finished'){
                    this.$message.warning('会议未结束不能导出签到表');
                    return false;
                }
                this.$router.push({
                    path: '/m_product/ticket/check-table',
                    query: {
                        sid: this.$route.query.sid,
                        name: this.goodsInfo.meetingName
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .goods-cell-first{
        margin-top: 0;
    }
    .goods-title{
        padding-bottom: 10px;
    }
    .ticket-info.goods-info-wrap .export-button{
        position: absolute;
        right: 0;
    }

    .ticket-info.goods-info-wrap .goods-cell .goods-info .left{
        width: 500px;
    }

    /*会议二维码*/
    .ticket-info.goods-info-wrap .goods-cell.code .goods-info .left{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .ticket-info.goods-info-wrap .goods-cell.code .goods-info .left img{
        width: 150px;
        height: 150px;
        background: lightgray;
        display: block;
    }
    .ticket-info.goods-info-wrap .goods-cell.code .goods-info .left a{
        display: block;
        width: 80px;
        height: 32px;
        line-height: 32px;
        color: #fff;
        font-size: 16px;
        margin-left: 20px;
        text-align: center;
        background-color: #20a0ff;
        border-radius: 4px;
    }


    .ticket-info.goods-info-wrap .goods-cell .goods-info .left .info-title{
        width: 90px;
    }
    .ticket-info.goods-info-wrap .goods-cell .goods-info .left .info-content{
        width: 400px;
    }
    .ticket-info .cut-line{
        width: 100%;
        float: left;
        border-bottom: 1px dashed #e4eaee;
        margin: 15px 0;
    }
    .ticket-info .ticket-main-img{
        width: 204px;
        height: 150px;
        background: #fff;
        overflow: hidden;
        position: relative;
        float: right;
    }
    .ticket-info .ticket-main-img img{
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .ticket-info .ticket-img{
        width: 165px;
        height: 165px;
        background: #fff;
        overflow: hidden;
        position: relative;
        float: left;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    .ticket-info .ticket-img img{
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
