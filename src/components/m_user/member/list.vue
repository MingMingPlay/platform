<template>
	<div class="user">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="searchForm" :inline="true" ref="searchForm">
				<el-form-item>
					<el-input v-model="searchForm.q" placeholder="姓名/手机号"></el-input>
				</el-form-item>
                <el-form-item label="所属区域" class="area-width">
                    <area-select-new v-model="searchForm.areaSid"></area-select-new>
                </el-form-item>
				<el-form-item>
					<el-button type="primary" @click="resetForm">重置</el-button>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>

		<el-table :data="userList" v-loading="loading" class="table-composing" stripe>
            <el-table-column label="序号" width="90" header-align="center" align="center" label-class-name="table-index-title">
                <template slot-scope="scope">
                    {{scope.$index | newIndex(pagination.pageIndex, pagination.pageSize)}}
                </template>
            </el-table-column>
            <template v-for="(item, key) in tableHeader">
                <el-table-column :label="item.label" :width="item.width" :align="item.align" v-if="key === 'nickname'">
                    <template slot-scope="scope">
                        <el-button type="text" @click="gotoDetail(scope.row.sid)"
                        >{{scope.row.nickname}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="item.label" :width="item.width" :align="item.align" v-else-if="key === 'mobile'">
                    <template slot-scope="scope">
                        <el-button type="text" @click="gotoDetail(scope.row.sid)"
                        >{{scope.row.mobile}}</el-button>
                        <el-button type="text" @click="showMobile(scope.row)" v-if="scope.row.mobile">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="item.label" :width="item.width" v-else-if="key === 'stateName'">
                    <template slot-scope="scope">
                        <span :class="{'state-active': scope.row.state === 'Active', 'state-disabled': scope.row.state === 'Disabled'}">
                            {{scope.row.stateName}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="item.label" :prop="key" :width="item.width" v-else></el-table-column>
            </template>
            <!--<el-table-column label="操作" header-align="center" align="center">-->
                <!--<template slot-scope="scope">-->
                    <!--<enable-and-disable :row="scope.row" @success="successCallback"></enable-and-disable>-->
                    <!--&lt;!&ndash;重置密码功能，产品说暂时不需要&ndash;&gt;-->
                    <!--&lt;!&ndash;<reset-password :row="scope.row"></reset-password>&ndash;&gt;-->
                <!--</template>-->
            <!--</el-table-column>-->
		</el-table>

        <div class="pagination-wrap" v-if="userList.length > 0">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.totalRow">
            </el-pagination>
        </div>

	</div>
</template>

<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import AreaSelectNew from '../../common/area-select-new.vue'
    import EnableAndDisable from '../../common/enable-and-disable.vue'
    import resetPassword from '../../common/reset-password.vue'
	import api from '../../../assets/config/m-api.js'
	import { pubObj } from '../../../assets/unit/public.js'
    import tableHeader from './tableHeader.js'

	export default {
		data() {
			return {
				api: null,
				crumbs: [
                    {
                        title: '用户管理',
                    },
                    {
                        title: '注册用户',
                    }
                ],
                tableHeader,
                loading: false,
                userList: [],
                pagination: {},
                // 组织机构数据
                organBizData: [],
				searchForm: {
				    q: '',
                    areaSid: '',
                    organCode: null,
                },
			}
		},
		created() {
		    this.getData();
		},
        components: {
            jkcBreadcrumb,
            AreaSelectNew,
            EnableAndDisable,
            resetPassword
        },
		methods: {
            getData(param){     // 获取列表数据
                this.loading = true;
                this.$http.get(['userMember'],{params: param})
                    .then(result => {
                        this.loading = false;
                        if(result.body.code === 200){
                            this.userList = result.body.data;
                            this.pagination = result.body.pagination;
                        }else {
                            this.$message.error(result.body.message);
                        }
                    })
            },
            // 禁用启用操作成功回调
            successCallback(){
                this.getData(this.searchForm);
            },
			// 前往用户详情
			gotoDetail(sid) {
			    this.$router.push({
                    path: '/m_user/member/detail',
                    query: {
                        sid: sid,
                    }
                });
			},
            resetForm(){
                for (let key in this.searchForm){
                    if(key !== 'pageSize' || key !== 'pageIndex'){
                        this.searchForm[key] = '';
                    }
                }
            },
            handleSearch(){
                this.getData(this.searchForm);
            },
            showMobile(row){	// 查看用户手机号
                this.$http.get(['userPrivacyMobile', row.sid, '/mobile'])
                    .then(result => {
                        if(result.body.code === 200){
                            row.mobile = result.body.data;
                        }else{
                            this.$message.error(result.body.message)
                        }
                    }).catch(error => {
                    console.log(error)
                })
            },
            handleSizeChange(size){
                this.searchForm.pageSize = size;
                this.getData(this.searchForm);
            },
            handleCurrentChange(index){
                this.searchForm.pageIndex = index;
                this.getData(this.searchForm);
            },
		}
	}
</script>

<style>

</style>
