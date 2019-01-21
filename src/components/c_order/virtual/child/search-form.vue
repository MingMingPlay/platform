<template>
    <div class="search-form">
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" ref="searchForm">
                <el-form-item label="关键字" prop="keyword">
                    <el-input v-model="form.keyword" placeholder="订单号、买家电话"></el-input>
                </el-form-item>
                <el-form-item label="会议名称" prop="meetingName">
                    <el-input v-model="form.meetingName" placeholder="会议名称"></el-input>
                </el-form-item>
                <el-form-item label="下单时间" prop="orderTime">
                    <el-date-picker
                        v-model="form.orderTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="handleOrderTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="支付方式" prop="payChannel">
                    <el-select v-model="form.payChannel" placeholder="请选择支付方式" clearable>
                        <el-option label="支付宝" value="Alipay"></el-option>
                        <el-option label="微信" value="Weixinpay"></el-option>
                        <el-option label="实名付" value="RealNamePay"></el-option>
                        <el-option label="钱包支付" value="WalletPay"></el-option>
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
                <el-form-item>
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
        //   handleDaterange
        //      触发时间: 日期范围改变时
        //      作用: 将时间范围字符串拆分成: 开始时间 和 结束时间, 提交给后台
        //   handleFormSearch
        //      触发时间: 点击搜索按钮时
        //      作用: 条件查询

    import OrganSelect from '../../../common/organ-select.vue'

//  import api from '../../../../assets/config/c-api.js'
    import { bus, pubObj } from '../../../../assets/unit/public.js'

    export default {
        components: { OrganSelect },

        props: {
            initForm: {
                type: Object,
                default() { return {} }
            }
        },

        data() {
            return {
                initSearchForm: this.initForm,
                form: {
                    keyword: null,
                    meetingName: null,
                    orderTime: [],
                    payChannel: null,
                    merchantSid: null,
                    merchantName: null,
                    organCode: null,
                    organCodes: [],
                    isAllOrgan: 0,
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
            }
        },

        methods: {
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
            // 获取组织机构
            handleGetOrganCode(code) {
                this.form.organCode = code;
            },
            handleOrderTime(date) {
                const index = date.indexOf(' - ');
                this.form.createdTimeBegin = date.slice(0, index);
                this.form.createdTimeEnd = date.slice(index + 3);
            },
            handleResetForm() {
                // 只有表单字段设置了prop, 重置才有效果
                this.$refs.searchForm.resetFields();
            },
            handleFormSearch() {
                this.$emit('search-order', this.form)
            }
        },

        mounted() {
            this.form = Object.assign(this.form, this.initSearchForm);
        }
    }
</script>

<style>

</style>
