<template>
    <div class="search-form">
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" ref="searchForm" label-width="80px">
                <el-form-item :label="goodsNameLabel" prop="title">
                    <el-select
                        :clearable="true"
                        v-model="goodsNameSearch"
                        filterable
                        remote
                        @change="goodsNameChange"
                        :placeholder="goodsNameLabel"
                        :remote-method="goodsNameRemoteSearch"
                        size="small"
                        :loading="goodsNameLoading">
                        <el-option
                            v-if="!isMeeting"
                            v-for="item in goodsNameSearchArr"
                            :key="item.sid"
                            :label="item.title + ' ' + item.code"
                            :value="item.sid">
                        </el-option>
                        <el-option
                            v-if="isMeeting"
                            v-for="item in goodsNameSearchArr"
                            :key="item.sid"
                            :label="item.name + ' ' + item.meetingCode"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="form.title"></el-input>-->
                </el-form-item>
                <el-form-item label="订单编号" prop="orderId">
                    <el-input type="number" v-model="form.orderId"></el-input>
                </el-form-item>
                <el-form-item label="买家信息" prop="userKeyword">
                    <el-input v-model="form.userKeyword" placeholder="手机或姓名"></el-input>
                </el-form-item>
                <el-form-item label="下单时间" prop="orderTime">
                    <el-date-picker
                        v-model="form.orderTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="handleOrderTime">
                    </el-date-picker>
                </el-form-item>
                <template v-if="orderType !== 'vi'">
                    <el-form-item label="操作时间" prop="operateTime">
                        <el-date-picker
                            v-model="form.operateTime"
                            type="daterange"
                            placeholder="选择日期范围"
                            @change="handleOperateTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="收货人" prop="receiverPhone">
                        <el-input v-model="form.receiverPhone" placeholder="手机号码"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="支付方式" prop="payChannel">
                    <el-select v-model="form.payChannel" placeholder="请选择支付方式" clearable>
                        <template v-if="orderType !== 'vi'">
                            <el-option label="支付宝" :value="1"></el-option>
                            <el-option label="微信" :value="2"></el-option>
                        </template>
                        <template v-else>
                            <el-option label="支付宝" :value="2"></el-option>
                            <el-option label="微信" :value="1"></el-option>
                        </template>
                        <el-option label="实名付" :value="4"></el-option>
                        <el-option label="钱包支付" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属商家" prop="merchantSid">
                    <el-select
                        v-model="form.merchantSid"
                        placeholder="输入商家名称"
                        clearable
                        filterable
                        remote
                        :remote-method="handleSearchMerchants">
                        <el-option
                            v-for="(item,index) in merchants"
                            :key="index"
                            :label="item.nameFull"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织机构" prop="organCodes">
                    <organ-select :organ-data="organData" v-model="form.organCodes"></organ-select>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="form.isAllOrgan" :true-label="1" :false-label="0" :disabled="form.organCodes.length == 0">包含下级</el-checkbox>
                </el-form-item>
                <el-form-item class="block-inline">
                    <el-button type="primary" @click="handleResetForm">重 置</el-button>
                    <el-button type="primary" @click="handleFormSearch">搜 索</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    // 组件说明
        //   入口值: 无
        //   返回值: form[Object]
        //   form: 查询参数集合
        //   handleOrderTime | handleOperateTime
        //      触发时间: 日期范围改变时
        //      作用: 将时间范围字符串拆分成: 开始时间 和 结束时间, 提交给后台
        //   handleFormSearch
        //      触发时间: 点击搜索按钮时
        //      作用: 条件查询
    import OrganSelect from '../../../common/organ-select.vue'
    import api from '../../../../assets/config/m-api.js'
    import { pubObj, bus } from '../../../../assets/unit/public.js'

    export default {
        components: { OrganSelect },

        props: {
            goodsType: String,
            orderType: {
                type: String
            },
            initForm: {
                type: Object,
                default() { return {} }
            }
        },

        data() {
            return {
                isMeeting: false,
                initSearchForm: this.initForm,
                goodsNameSearchArr: '',
                goodsNameSearch: '',
                goodsNameLoading: false,
                goodsNameLabel: '商品名称',
                form: {
                    orderId: null,
                    userKeyword: null,
                    orderTime: [],
                    operateTime: [],
                    payChannel: null,
                    receiverPhone: null,
                    merchantSid: null,
                    merchantName: null,
                    organCode: null,
                    organCodes: [],
                    isAllOrgan: 0,
//                  agentSid: null,
                },
                merchants: [],
                organData: [],
            }
        },

        watch: {
            'form.organCodes': function(val) {
                this.form.organCode = val[val.length - 1];
            },
            'form.merchantSid': function(val) {
                if(val) this.handleSearchOrgans(val);
                else return;
            },
            'form.merchantName': function(val) {
                if(val) this.handleSearchMerchants(val);
                else return;
            },
            goodsType () {
                this.goodsNameSearch = '';
                this.spuSid = '';
                if (this.goodsType === 'special' || this.goodsType === 'Subscribe' || this.goodsType === 'generally')
                    this.goodsNameLabel = '商品名称';
                else
                    this.goodsNameLabel = '会议名称';
            }
        },

        mounted() {
            this.form = Object.assign(this.form, this.initSearchForm);
        },

        methods: {
            goodsNameChange () {
                if (this.goodsType === 'special' || this.goodsType === 'Subscribe' || this.goodsType === 'generally')
                    this.form.spuSid = this.goodsNameSearch;
                else
                    this.form.meetingSid = this.goodsNameSearch;

            },
            goodsNameRemoteSearch (query) {
                let type = '';
                if (this.goodsType === 'special') {
                    type = 'Assist';
                    this.isMeeting = false;
                } else if (this.goodsType === 'Subscribe') {
                    type = 'Subscribe';
                    this.isMeeting = false;
                } else if (this.goodsType === 'generally'){
                    type = 'General';
                    this.isMeeting = false;
                } else {
                    type = 'meeting';
                    this.isMeeting = true;
                }
                this.goodsNameLoading = true;
                if (type === 'meeting') {
                    pubObj.httpRequest(this, {
                        url: ['ticketMeeting'],
                        params: { q: query },
                        success(result) {
                            this.goodsNameLoading = false;
                            this.goodsNameSearchArr = result.data;
                        }
                    })
                } else {
                    this.$http.get(this.$api.spu + 'cloud', {
                        params: {
                            title: query,
                            btn: 'ooxshg',
                            pageIndex: 1,
                            states: 'All',
                            type,
                            pageSize: 20
                        },
                    }).then((result) => {
                        this.goodsNameLoading = false;
                        if (result.body.code === 200) {
                            this.goodsNameSearchArr = result.body.data;
                        } else {
                            this.$message({type: 'warning', message: result.body.message});
                        }
                    }).catch((err) => {
                        this.goodsNameLoading = false;
                        console.log(err)
                    })
                }
            },
            // 根据用户输入搜搜商家
            handleSearchMerchants(val) {
                this.form.merchantName = val;
                pubObj.httpRequest(this, {
                    url: ['newMerchant'],
                    params: { q: val },
                    success(result) {
                        this.merchants = result.data;
                    }
                })
            },
            // 获取组织机构
            handleSearchOrgans(merchantSid) {
                pubObj.httpRequest(this, {
                    url: ['organ', merchantSid],
                    success(result) {
                        this.organData = result.data;
                    }
                })
            },
            // 获取组织机构code
            handleGetOrganCode(code) {
                this.form.organCode = code;
            },
            // 下单时间
            handleOrderTime(date) {
                const index = date.indexOf(' - ');
                this.form.createdTimeBegin = date.slice(0, index);
                this.form.createdTimeEnd = date.slice(index + 3);
            },
            // 操作时间
            handleOperateTime(date) {
                const index = date.indexOf(' - ');
                this.form.updatedTimeBegin = date.slice(0, index);
                this.form.updatedTimeEnd = date.slice(index + 3);
            },
            handleResetForm() {
                // 只有表单字段设置了prop, 重置才有效果
                this.$refs.searchForm.resetFields();
                this.organCodes = [];
                this.goodsNameSearch = '';
                this.spuSid = '';
            },
            handleFormSearch() {
                this.$emit('search-order', this.form)
            }
        }
    }
</script>

<style>
    .search-form .block-inline { display: block; text-align: center; }
</style>
