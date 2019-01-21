<template>
    <div class="incentive">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        
        <div class="search-fil-wrap one-line">
            <el-form :inline="true" :model="form">
                <el-form-item label="方案名称">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker 
                        v-model="form.createTime" 
                        type="daterange" 
                        placeholder="请选择日期范围" 
                        :picker-options="{ disabledDate: setAvailableDate }"
                        @change="handleCreateTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="组织机构">
                    <organ-select v-model="organCodes" :organ-data="organData"></organ-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFormSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="assist-btn-wrap">
            <el-button type="primary" @click="handleAddIncentive">发布方案</el-button>
        </div>
        
        <el-table :data="tableData" v-loading.body="loading" stripe>
            <el-table-column type="index" label="序号" width="64" align="center"></el-table-column>
            <el-table-column label="方案名称" prop="title" align="center"></el-table-column>
            <el-table-column label="所属机构" prop="publishMaerchantName" align="center"></el-table-column>
            <el-table-column label="发布人" prop="publishName" align="center"></el-table-column>
            <el-table-column label="创建时间" prop="createdTime" align="center"></el-table-column>
            <el-table-column label="有效时间" prop="availableTime" width="280" align="center"></el-table-column>
            <el-table-column label="已确认数/总人数" prop="getInfo" align="center"></el-table-column>
            <el-table-column label="状态" prop="stateName" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleLookDetail(scope.row.sid)">查看</el-button>
                    <el-button type="text" @click="handlePublishIncentive(scope.row.sid)" v-if="scope.row.state==='Permit'">发布</el-button>
                    <el-button v-if="scope.row.isNullify" type="text" @click="handleNullify(scope.row.sid)">作废</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <!--分页-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mxTableList.pagiTotal"
            style="margin: 30px 0; text-align: center;">
        </el-pagination>
    </div>
</template>

<script>
    // child
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    import OrganSelect from '../common/organ-select.vue'
    import Pagination from '../common/pagination.vue'
    // mixin
    import TableList from '../mixin/table-list.vue'
    // js
    import { pubObj, bus } from '../../assets/unit/public.js'
    
    export default {
        components: { JkcBreadcrumb, OrganSelect, Pagination },
        
        mixins: [TableList],
        
        data() {
            return {
                loading: true,
                crumbs: [],
                mxTableList: {
                    url: ['incentive'],
                    mountQuery: {},
                    pagiTotal: 0
                },
                form: {
                    pageIndex: 1,
                    pageSize: 10
                },
                organData: [],
                organCodes: [],
                currentPage: 1,
                pageSize: 10
            }
        },
        
        watch: {
            organCodes(val) {
                this.form.organCode = val[val.length - 1];
            }
        },
        
        methods: {
            // 重写混合表格中的对外接口
            canBeOverrideFun(obj) {
                // 增加有效期字段
                if(obj.startTime) {
                    obj.availableTime = `${obj.startTime} - ${obj.endTime}`;
                } else {
                    obj.availableTime = '永久';
                }
                // 增加是否显示作废按钮
                if(obj.state == 'Active' || obj.state == 'Underway') {
                    obj.isNullify = true;
                } else {
                    obj.isNullify = false;
                }
                return obj;
            },
            // 设置可选日期-不能大于当前月
            setAvailableDate(date) {
                return (new Date()).getTime() < (new Date(date)).getTime();
            },
            // 创建时间
            handleCreateTime(date) {
                if(date) {
                    const index = date.indexOf(' - ');
                    this.form.start = date.slice(0, index);
                    this.form.end = date.slice(index + 3);
                } else {
                    this.form.createTime = [];
                    this.form.start = null;
                    this.form.end = null;
                }
            },
            // 组织机构
            handleGetOrganCode(code) {
                this.form.organCode = code;
            },
            // 搜索
            handleFormSearch() {
                this.form.pageIndex = this.currentPage = 1;
                this.getTableList(this.form);
                this.$router.push({
                    query: {
                        title: this.form.title,
                        start: this.form.start,
                        end: this.form.end,
                        organCode: this.form.organCode,
                        pageIndex: this.form.pageIndex,
                        pageSize: this.form.pageSize,
                        organCodes: this.organCodes
                    }
                });
            },
            // 发布方案
            handleAddIncentive() {
                this.$router.push({
                    path: '/m_incentive/incentive/add',
                    query: this.$route.query
                })
            },
            // 查看详情
            handleLookDetail(sid) {
                this.$router.push({
                    path: '/m_incentive/incentive/detail',
                    query: Object.assign(this.$route.query, { incentiveSid: sid })
                })
            },
            // 作废
            handleNullify(sid) {
                pubObj.showMessage(this, {
                    title: '方案作废',
                    content: '确定要作废该方案，作废之后不可恢复？',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: ['incentive', 'cancel/', sid],
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList();
                            }
                        })
                    }
                })
            },
            handlePublishIncentive(sid) {
                pubObj.showMessage(this, {
                    title: '发布方案',
                    content: '您确定要发布该方案？',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: ['incentive', 'publish/', sid],
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList();
                            }
                        })
                    }
                })
            },
            // 分页显示个数
            handleSizeChange(size) {
                this.form.pageSize = this.pageSize = size;
                this.getTableList(this.form);
            },
            // 分页当前页
            handleCurrentChange(currentPage) {
                this.form.pageIndex = this.currentPage = currentPage;
                this.getTableList(this.form);
            }
        },
        
        created() {
            // 初始化 数据
            this.crumbs = [{ title: '激励方案' }, { title: '方案列表' }];
            // 页面刷新
            if(this.$route.query.pageIndex) {
                this.mxTableList.mountQuery = this.form = JSON.parse(JSON.stringify(this.$route.query));
                this.currentPage = parseInt(this.form.pageIndex);
                this.pageSize = parseInt(this.form.pageSize);
                if(this.form.start && this.form.end) {
                    this.$set(this.form, 'createTime', [new Date(this.form.start), new Date(this.form.end)])
                }
                if(this.form.organCodes) {
                    let organCodes = this.form.organCodes.replace(/[\[\]]/g, '');
                    organCodes = organCodes.split(',');
                    organCodes = organCodes.map((organCode) => {
                        return parseInt(organCode);
                    });
                    this.organCodes = organCodes;
                    delete this.form.organCodes;
                }
            }
            // 获取组织机构
            this.$nextTick(() => {
                pubObj.httpRequest(this, {
                    url: ['organChildren', 'myself/', this.$root.userInfo.merchantSid, '/', this.$root.userInfo.organCode],
                    success(result) {
                        this.organData = result.data;
                    }
                })
            })
        },
        
        destroyed() { bus.$off() }
    }
</script>