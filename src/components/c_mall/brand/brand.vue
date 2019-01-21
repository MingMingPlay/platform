<template>
	<div class="brand">
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :inline="true" :model="form">
				<el-form-item label="品牌名称">
					<el-input v-model="form.q"></el-input>
				</el-form-item>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
			</el-form>
		</div>

		<div class="assist-btn-wrap">
			<el-button type="primary" @click="handleAdd">新增品牌</el-button>
			<el-button type="success" @click="handleRefreshCache">刷新缓存</el-button>
		</div>

		<el-table :data="tableData" v-loading="loading" stripe>
			<el-table-column type="index" label="序号" class-name="first-col-no-padding" width="60" align="center"></el-table-column>
			<el-table-column label="品牌名称" prop="nameFull" class-name="one-line" width="240"></el-table-column>
			<el-table-column label="LOGO图片" width="180">
				<template slot-scope="scope">
					<img :src="scope.row.logoPath | imageSize(100)" class="logoImage" />
				</template>
			</el-table-column>
			<el-table-column label="排序值" prop="rank" width="180"></el-table-column>
			<el-table-column label="状态" prop="stateName" width="180"></el-table-column>
			<el-table-column label="描述" prop="description" class-name="one-line"></el-table-column>
			<el-table-column label="操作" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="handleEdit(scope.row.sid)">修改</el-button>
				</template>
			</el-table-column>
		</el-table>

		<brand-form @refresh="handleRefresh"></brand-form>

	</div>
</template>
<script>
    // child
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
	import BrandForm from './form.vue'
	// mixin
    import TableList from '../../mixin/table-list.vue'
	// js
	import api from '../../../assets/config/c-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
	    components: { JkcBreadcrumb, BrandForm },
		mixins: [TableList],
		data() {
			return {
			    loading: true,
			    crumbs: [],
				form: {},
				mxTableList: { url: api.brand },
			}
		},
		created() {
		    this.crumbs = [{ title: '品牌管理' }, { title: '品牌列表' }];
		},
		beforeDestroy() { bus.$off() },
		methods: {
		    handleSearch() { this.getTableList(this.form) },
		    handleRefresh() { this.getTableList() },
		    handleRefreshCache() {
		        pubObj.httpRequest(this, {
		            url: this.$api.brand + 'refresh',
		            success(result) {
		                this.$message.success(result.message);
		            }
		        })
		    },
			handleAdd() {
			    bus.$emit('brand-dialog', {
                    type: 1,
                    title: '新增品牌',
                    saveText: '确 定'
                })
			},
			handleEdit(sid) {
			    bus.$emit('brand-dialog', {
			        type: 2,
			        sid: sid,
                    title: '编辑品牌',
                    saveText: '保 存'
                })
			},
		}
	}
</script>
<style>
	.brand .el-table .cell {
		padding: 0 6px;
	}
</style>
