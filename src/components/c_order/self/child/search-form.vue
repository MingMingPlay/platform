<template>
    <div class="search-form">
        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" ref="searchForm">
                <el-form-item label="商品名称" prop="title">
                    <el-select
                        :clearable="true"
                        v-model="goodsNameSearch"
                        filterable
                        remote
                        @change="goodsNameChange"
                        placeholder="商品名称"
                        :remote-method="goodsNameRemoteSearch"
                        size="small"
                        :loading="goodsNameLoading">
                        <el-option
                            v-for="item in goodsNameSearchArr"
                            :key="item.sid"
                            :label="item.title + ' ' + item.code"
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
                <el-form-item label="商家名称" prop="merchantSid">
                    <el-select
                        v-model="form.merchantSid"
                        placeholder="输入商家名称"
                        :remote-method="handleSearchMerchants"
                        @change="handleMerchantChange"
                        filterable
                        clearable
                        remote >
                        <el-option
                            v-for="(item,index) in merchants"
                            :key="index"
                            :label="item.nameFull"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间" prop="orderTime">
                    <el-date-picker
                        v-model="form.orderTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="handleOrderTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="操作时间" prop="operateTime">
                    <el-date-picker
                        v-model="form.operateTime"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="handleOperateTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="支付方式" prop="payChannel">
                    <el-select v-model="form.payChannel" placeholder="请选择支付方式" clearable>
                        <el-option label="支付宝" :value="1"></el-option>
                        <el-option label="微信" :value="2"></el-option>
                        <el-option label="实名付" :value="4"></el-option>
                        <el-option label="钱包支付" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
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

    import { pubObj, bus } from '../../../../assets/unit/public.js'

    export default {
        props: {
            initForm: {
                type: Object,
                default() { return {} }
            }
        },
        data() {
            return {
                goodsNameSearchArr: '',
                goodsNameSearch: '',
                goodsNameLoading: false,
                initSearchForm: this.initForm,
                form: {
                    orderId: null,
                    userKeyword: null,
                    orderTime: [],
                    operateTime: [],
                    payChannel: null,
                    merchantSid: null,
                    merchantName: null,
                    title: ''
                },
                merchants: [],
                spuSid: ''
            }
        },
        mounted() {
            this.form = Object.assign(this.form, this.initSearchForm);
            this.handleSearchMerchants(this.form.merchantName || '');
        },
        methods: {
            goodsNameChange () {
                this.form.spuSid = this.goodsNameSearch
            },
            goodsNameRemoteSearch (query) {
                this.goodsNameLoading = true;
                this.$http.get(this.$api.spu + 'cloud', {
                    params : {
                        title: query,
                        btn: 'ooBxnh',
                        pageIndex: 1,
                        states: 'All',
                        type: 'General',
                        pageSize: 20
                    },
                }).then((result) => {
                    this.goodsNameLoading = false;
                    if (result.body.code === 200) {
                        this.goodsNameSearchArr = result.body.data;
                    } else {
                        this.$message({type:'warning',message:result.body.message});
                    }
                }).catch((err) => {
                    this.goodsNameLoading = false;
                    console.log(err)
                })
            },
            // 根据用户输入搜索商家
            handleSearchMerchants(val) {
                pubObj.httpRequest(this, {
                    url: ['newMerchant'],
                    params: { q: val },
                    success(result) {
                        this.merchants = result.data;
                    }
                })
            },
            // 商家改变
            handleMerchantChange(val) {
                this.merchants.some((item) => {
                    if(item.sid === val) {
                        this.form.merchantName = item.nameFull;
                        return true;
                    } else {
                        return false;
                    }
                })
            },
            handleOrderTime(date) {
                const index = date.indexOf(' - ');
                this.form.createdTimeBegin = date.slice(0, index);
                this.form.createdTimeEnd = date.slice(index + 3);
            },
            handleOperateTime(date) {
                const index = date.indexOf(' - ');
                this.form.updatedTimeBegin = date.slice(0, index);
                this.form.updatedTimeEnd = date.slice(index + 3);
            },
            handleResetForm() {
                this.goodsNameSearch = '';
                this.spuSid = '';
                // 只有表单字段设置了prop, 重置才有效果
                this.$refs.searchForm.resetFields();
                this.form.merchantName = null;
            },
            handleFormSearch() {
                this.$emit('search-order', this.form)
            }
        }
    }
</script>

<style>

</style>
