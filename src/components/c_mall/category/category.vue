<template>
	<div class="category">
	    
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :inline="true" :model="form" class="cate-form-inline">
				<el-form-item label="品类名称">
					<el-input v-model="form.q"></el-input>
				</el-form-item>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
			</el-form>
		</div>

		<div class="assist-btn-wrap">
			<el-button type="primary" @click="handleAdd">新增品类</el-button>
			<el-button type="success" @click="handleRefreshCache">刷新缓存</el-button>
		</div>
		
		<collapse-table :data="tableData" v-loading="loading" stripe>
            <collapse-table-column 
                label="品类名称" 
                prop="name" 
                width="200px">
            </collapse-table-column>
            <collapse-table-column 
                label="LOGO图片" 
                width="160px"
                align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.logoPath" />
                </template>
            </collapse-table-column>
            <collapse-table-column 
                label="排序值" 
                prop="rank" 
                width="160px"
                align="center">
            </collapse-table-column>
            <collapse-table-column 
                label="状态" 
                prop="stateName" 
                width="160px"
                align="center">
            </collapse-table-column>
            <collapse-table-column 
                label="描述" 
                prop="description" 
                width="400px">
            </collapse-table-column>
            <collapse-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click.stop="handleEdit(scope.row.sid)">修改</el-button>
                </template>
            </collapse-table-column>
        </collapse-table>
		
		<category-form @refresh="handleRefresh"></category-form>
		
	</div>
</template>
<script>
    // child
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import CollapseTable from './table/collapse-table.vue'
    import CollapseTableColumn from './table/collapse-table-column.vue'
    import CategoryForm from './form.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'    
	// js
	import api from '../../../assets/config/c-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
		components: { JkcBreadcrumb, CollapseTable, CollapseTableColumn, CategoryForm },
		mixins: [TableList],
		data() {
			return {
			    loading: true,
				crumbs: [],
				form: {},
				mxTableList: { url: api.category },
			}
		},
		created() {
			this.crumbs = [{ title: '品类管理' }, { title: '品类列表' }];
		},
		methods: {
		    handleSearch() { this.getTableList(this.form) },
		    handleRefreshCache() {
                pubObj.httpRequest(this, {
                    url: this.$api.category + 'refresh',
                    success(result) {
                        this.$message.success(result.message);
                    }
                })
            },
		    handleAdd() {
		        bus.$emit('category-dialog', {
                    type: 1,
                    title: '新增品类',
                    saveText: '确 定'
                })
		    },
		    handleEdit(sid) {
                bus.$emit('category-dialog', {
                    type: 2,
                    sid: sid,
                    title: '编辑品类',
                    saveText: '保 存'
                })
            },
            handleRefresh() { this.getTableList() }
		},
		beforeDestroy() { bus.$off() }
	}
</script>
<style scoped>
	
</style>
