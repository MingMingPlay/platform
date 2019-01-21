<template>
    <div class="recommend-goods">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="渠道">
                    <el-select v-model="form.channelSid" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in channels"
                            :key="item.sid"
                            :label="item.name"
                            :value="item.sid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜 索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="assist-btn-wrap">
            <el-button type="primary" @click="handleAdd">添加商品</el-button>
        </div>
        
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="商品编码" prop="code"></el-table-column>
            <el-table-column label="商品名称" prop="title"></el-table-column>
            <el-table-column label="商品图片" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.mainImagePath | imageSize(100)" class="logoImage" />
                </template>
            </el-table-column>
            <el-table-column label="商品售价" prop="sellingPrice" align="center"></el-table-column>
            <el-table-column label="渠道" prop="channelName" align="center"></el-table-column>
            <el-table-column label="排序" prop="rank" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="text" class="text-btn-delete" @click="handleDel(scope.row.sid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <pagination event-name="recommend-pagination" :total="mxTableList.pagiTotal"></pagination>
        
        <recommend-form @refresh="handleRefresh"></recommend-form>
        
    </div>
</template>

<script>
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
    import RecommendForm from './form.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'
    // js
    import { pubObj, bus } from '../../../assets/unit/public.js'
    
    export default {
        components: { JkcBreadcrumb, Pagination, RecommendForm },
        
        mixins: [TableList],
        
        data() {
            return {
                crumbs: [],
                channels: [],
                form: {},
                mxTableList: {
                    url: ['recommendGoodsList'],
                    pagiTotal: 0
                },
            }
        },
        
        methods: {
            handleRefresh() { this.getTableList() },
            handleSearch() { this.getTableList(this.form) },
            handleAdd() {
                this.$router.push({
                    path: '/c_custom_app/recommend_select_goods',
                    query: {}
                })
            },
            handleEdit(row) {
                bus.$emit('recommend-dialog', {
                    type: 2,
                    sid: row.sid,
                    row: row,
                    title: '修改单个推荐商品',
                    saveText: '保 存'
                })
            },
            handleDel(sid) {
                pubObj.showMessage(this, {
                    title: '删除推荐商品',
                    content: '确定删除该推荐商品，删除之后不可恢复?',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: ['recommendGoods', sid],
                            method: 'DELETE',
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList();
                            }
                        })
                    }
                })
            },
        },
        
        created() {
            this.crumbs = [{ title: '多版本管理' }, { title: '商品展示' }];
        },
        
        beforeMount() {
            // 获取品类
            pubObj.httpRequest(this, {
                url: this.$api.channel,
                success(result) {
                    this.channels = result.data;
                }
            })
        },
        
        mounted() {
            bus.$on('recommend-pagination', (obj) => {
                this.loading = true;
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
        
        destroyed() { bus.$off() }
    }
</script>

<style scoped>
    
</style>