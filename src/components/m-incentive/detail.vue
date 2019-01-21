<template>
    <div class="incentive-detail">
        <el-breadcrumb separator=">" style="padding: 14px 0;">
            <el-breadcrumb-item>激励方案</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="handleGotoList">方案列表</el-breadcrumb-item>
            <el-breadcrumb-item>方案详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="title-wrapper" style="position: relative;">
            <h1 class="title-name" v-text="labels.title"></h1>
            <span class="title-state" v-text="labels.stateName"></span>
        </div>

        <div class="btn-wrapper">
            <el-button type="primary" @click="handleExportExcel">导出明细</el-button>
            <el-button type="success" @click="$router.push({ name: 'signReceive', query: { sid: $route.query.incentiveSid } })" :disabled="labels.state === 'Disabled'">生成/下载签收表</el-button>
        </div>

        <el-tabs style="margin-top: 10px;" v-model="activePane" type="card">
            <el-tab-pane label="基本信息" name="0">
                <jk-labels :model="labels" label-width="80px" label-right="20px">
                    <jk-labels-item label="物品名称" prop="goodsTitle"></jk-labels-item>
                    <jk-labels-item label="方案类型" prop="typeName"></jk-labels-item>
                    <jk-labels-item label="折合现金" prop="unitCash"></jk-labels-item>
                    <jk-labels-item label="DU号" prop="duStr"></jk-labels-item>
                    <jk-labels-item label="创建时间" prop="createdTime"></jk-labels-item>
                    <jk-labels-item label="有效期" prop="availableTime"></jk-labels-item>
                    <jk-labels-item label="发布机构" prop="publishMaerchantName"></jk-labels-item>
                    <jk-labels-item label="发布人" prop="publishName"></jk-labels-item>
                    <jk-labels-item label="领用说明" prop="instructions"></jk-labels-item>
                    <jk-labels-item label="物品描述">
                        <div class="html-wrapper" v-html="labels.goodsInfo"></div>
                    </jk-labels-item>
                    <jk-labels-item
                        v-if="labels.remark"
                        label="备注"
                        prop="remark">
                    </jk-labels-item>

                    <div class="img-placeholder">
                        <span>封面</span>
                        <img :src="labels.logoPath" />
                    </div>
                </jk-labels>
            </el-tab-pane>

            <el-tab-pane label="领取情况" name="1">
                <el-table :data="tableData" v-loading.body="loading" style="margin-top: 20px;" stripe>
                    <el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                        <template slot-scope="scope">
                            {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="工号" prop="jobNum"></el-table-column>
                    <el-table-column label="姓名" prop="name"></el-table-column>
                    <el-table-column label="手机号" prop="contactPhone"></el-table-column>
                    <el-table-column label="类型" prop="getTypeName"></el-table-column>
                    <el-table-column label="数量" prop="amount"></el-table-column>
                    <el-table-column label="确认时间" prop="getTime"></el-table-column>
                    <el-table-column label="领用码" prop="ticketCode"></el-table-column>
                    <el-table-column label="核销人" prop="checkName"></el-table-column>
                    <el-table-column label="核销时间" prop="checkTime"></el-table-column>
                    <el-table-column label="领取状态" prop="stateName"></el-table-column>
                </el-table>
                <pagination event-name="detail-pagination" :total="mxTableList.pagiTotal"></pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    // child
    import JkLabels from './labels/jk-labels.vue'
    import JkLabelsItem from './labels/jk-labels-item.vue'
    import Pagination from '../common/pagination.vue'
    // mixin
    import TableList from '../mixin/table-list.vue'

    import { pubObj, bus } from '../../assets/unit/public.js'
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        components: { JkLabels, JkLabelsItem, Pagination },

        mixins: [TableList],

        data() {
            return {
                loading: true,
                activePane: '0',
                labels: {},
                mxTableList: {
                    url: ['incentive', 'inspireuser/', this.$route.query.incentiveSid],
                    pagiTotal: 0,
                },
                form: {},
            }
        },

        methods: {
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
                this.$router.push({
                    path: '/m_incentive/incentive',
                    query: listQuery
                })
            },
            handleExportExcel() {
                const sid = this.$route.query.incentiveSid;
                this.$http({
                    url: this.$api.incentive.url + 'excel/' + sid,
                    method: 'GET',
                    responseType: 'blob'
                }).then((res) => {
                    if(res.status === 200) {
                        if(IEDownload(this,res.data,'领取状况明细表.xls'))return;
                        const alink = document.createElement('a');
                        alink.download = '领取状况明细表.xls';
                        alink.style.display = 'none';
                        console.log(res.data);
                        const blob = new Blob([res.data], {
                            type: 'application/x-msdownload;charset=UTF-8'
                        });
                        alink.href = URL.createObjectURL(blob);
                        document.body.appendChild(alink);
                        alink.click();
                        document.body.removeChild(alink);
                    } else {
                        this.$message.warning('获取Excel文件失败');
                    }
                }).catch((err) => {
                    this.$message.error(err);
                })
            }
        },

        created() {
            this.$nextTick(() => {
                bus.$on('detail-pagination', (obj) => {
                    this.form = Object.assign(this.form, obj);
                    this.getTableList(this.form);
                })
            })
        },

        mounted() {
            pubObj.httpRequest(this, {
                url: ['incentive', this.$route.query.incentiveSid],
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
                        this.labels = result.data;
                    } catch(e){
                        console.log(e)
                    }
                }
            })
        }
    }
</script>

<style>
    .incentive-detail .btn-wrapper {
        position: absolute;
        top: 110px;
        right: 0;
        z-index: 999;
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
        width: 800px;
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
</style>
