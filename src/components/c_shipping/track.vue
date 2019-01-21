<template>
    <div class="shipping-track">

        <jkc-breadcrumb :crumbs="staticData.crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true" label-width="80px">
                <el-form-item label="物流公司">
                    <el-select v-model="form.company" placeholder="请选择或输入..." filterable clearable>
                        <el-option
                            v-for="(item,index) in companies"
                            :key="index"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流编号">
                    <el-input v-model="form.transportId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button type="success" @click="handleRefresh">刷新缓存</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table stripe :data="tableData" :empty-text="emptyText" v-loading="loading">
            <el-table-column label="物流时间" prop="time" width="240"></el-table-column>
            <el-table-column label="物流信息" prop="context"></el-table-column>
        </el-table>

    </div>
</template>

<script>
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    import { pubObj } from '../../assets/unit/public.js'
    import api from '../../assets/config/c-api.js'
    export default {
        components: { JkcBreadcrumb },
        data() {
            return {
                loading: true,
                staticData: {},
                companies: [],
                form: { company: null, transportId: null },
                tableData: [],
                emptyText: null
            }
        },
        created() {
            this.staticData.crumbs = [{ title: '物流' }, { title: '快递查询' }];
        },
        mounted() { this.getCompanyList(); },
        methods: {
            // 刷新后台缓存
            handleRefresh() {
                pubObj.httpRequest(this, {
                    url: api.shippingTrack + 'refresh',
                    success(result) {
                        this.$message.success(result.message)
                    }
                })
            },
            handleSearch() {
                const comp = this.form.company;
                const tran = this.form.transportId;
                if(!comp || !tran || comp === '' || tran === '' ) this.$message.warning('请选择物流公司或输入物流单号');
                else {
                    this.loading = true;
                    this.getTableList();
                }
            },
            getTableList() {
                pubObj.httpRequest(this, {
                    url: api.shippingTrack + this.form.company + '/' + this.form.transportId,
                    success(result) {
                        this.tableData = result.data.tracks;
                    },
                    complete(result) {
                        this.tableData = [];
                        this.emptyText = result.message;
                    }
                })
            },
            getCompanyList() {
                pubObj.httpRequest(this, {
                    url: api.shippingCompany,
                    success(result) {
                        this.companies = result.data;
                    }
                })
            }
        }
    }
</script>

<style>
</style>
