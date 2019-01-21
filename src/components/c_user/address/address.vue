<template>
	<div class="userAddress">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true">
				<el-form-item label="请输入关键字">
					<el-input v-model="form.q" placeholder="用户、电话"></el-input>
				</el-form-item>
				<el-form-item label="地址" class="overflow" prop="areaSid">
                    <area-select @get-area="getArea"></area-select>
				</el-form-item>
				<el-button type="primary" @click="handleSearch" class="button-margin-button-22">搜索</el-button>
			</el-form>
		</div>

		<el-table :data="tableData" stripe>
		    <el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                </template>
            </el-table-column>
			<el-table-column 
			    v-for="(item,index) in tableHead" 
			    :key="index"
			    :label="item.label" 
			    :prop="item.prop" 
			    :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="是否是默认地址">
				<template slot-scope="scope">
					{{scope.row.addressDefault | addressDefault}}
				</template>
			</el-table-column>
			<el-table-column label="状态">
				<template slot-scope="scope">
					{{scope.row.state | stateName}}
				</template>
			</el-table-column>
		</el-table>

		<pagination event-name="user-address-pagination" :total="mxTableList.pagiTotal"></pagination>
	</div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
    import AreaSelect from '../../common/area-select.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'
    // js
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
	    components: { JkcBreadcrumb, AreaSelect, Pagination },
	    
		mixins: [TableList],
		
		data() {
			return {
			    form: {},
                mxTableList: {
                    url: this.$api.userAddress,
                    pagiTotal: 0
                },
				crumbs: [{
					title: '用户地址管理'
				}, {
					title: '用户地址列表'
				}],
				tableHead: [{
					label: '用户',
					prop: 'name'
				}, {
					label: '电话',
					prop: 'phone'
				}, {
					label: '详细地址',
					prop: 'address'
				}, {
					label: '区域',
					prop: 'areaName'
				}, {
					label: '所属渠道',
					prop: 'channelName'
				}]
			}
		},
		
		methods: {
            getArea(obj){
                this.form.areaSid = obj.areaSid;
            },
            handleSearch() {
                this.getTableList(this.form);
            }
        },
		
		mounted() {
            bus.$on('user-address-pagination', (obj) => {
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
		
		filters: {
			addressDefault(val) {
				switch(val) {
					case false: return '否'; break;
					case true: return '是'; break;
				}
			},
			stateName(val) {
				switch(val) {
					case 'Active': return '有效'; break;
					case 'Disabled': return '禁用'; break;
				}
			},
		}
	}
</script>

<style>
	.userAddress .search-fil-wrap .address .el-select {
		width: 110px;
	}
</style>
