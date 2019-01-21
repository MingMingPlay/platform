<template>
	<div class="merchant-shop">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true">
				<el-form-item label="店铺名称">
					<el-input v-model="form.q" placeholder="请输入关键字查询"></el-input>
				</el-form-item>
				<el-form-item label="所属商家">
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
				<el-form-item label="组织机构" v-show="form.merchantSid">
                    <organ-select :organ-data="organData" v-model="organCodes"></organ-select>
                </el-form-item>
				<el-button type="primary" @click="handleSearch" icon="search">搜索</el-button>
			</el-form>
		</div>

		<el-table :data="tableData" v-loading="loading" stripe>
	        <el-table-column label="序号" class-name="first-col-no-padding" width="60" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                </template>
            </el-table-column>
			<el-table-column label="LOGO图片" width="100">
				<template slot-scope="scope">
					<img :src="scope.row.logoPath | imageSize(100)" class="logoImage" />
				</template>
			</el-table-column>
			<el-table-column label="店铺名称" prop="nameFull" class-name="one-line" width="150"></el-table-column>
			<el-table-column label="组织机构" prop="organName" class-name="one-line" width="150"></el-table-column>
			<el-table-column label="商家名称" prop="merchantName" class-name="one-line" width="150"></el-table-column>
			<el-table-column label="店铺地址" prop="areaName" class-name="one-line" width="150"></el-table-column>
			<el-table-column label="客服邮箱" prop="serviceMail" width="150" class-name="one-line"></el-table-column>
			<el-table-column label="客服电话" prop="servicePhone" width="120"></el-table-column>
			<el-table-column label="客服QQ" prop="serviceQQ" width="120"></el-table-column>
			<el-table-column label="店铺简介" prop="description" class-name="one-line" width="240"></el-table-column>
			<el-table-column label="操作" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="handleEdit(scope.row.sid)">编辑</el-button>
					<el-button type="text" @click="handleAdmin(scope.row.merchantSid, scope.row.organCode)">管理员</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<pagination event-name="shop-pagination" :total="mxTableList.pagiTotal"></pagination>

		<shop-form 
		    :showExemption="true" 
		    @refresh="handleRefresh">
		</shop-form>

	</div>
</template>

<script>
    // child
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import ShopForm from './form.vue'
    import Pagination from '../../common/pagination.vue'
    import OrganSelect from '../../common/organ-select.vue'
    // mixin
    import TableList from '../../mixin/table-list.vue'
    // js
    import api from '../../../assets/config/c-api.js'
    import { pubObj, bus } from '../../../assets/unit/public.js'
    
	export default {
		mixins: [TableList],
		components: { JkcBreadcrumb, ShopForm, Pagination, OrganSelect },
		data() {
			return {
			    loading: true,
				form: {},
				merchants: [],
				organData: [],
				organCodes: [],
				mxTableList: {
				    url: ['moreShop'],
				    pagiTotal: 0
				}
			}
		},
		created() {
		    this.crumbs = [{ title: '店铺管理' }, { title: '店铺列表' }];
		},
		mounted() {
            bus.$on('shop-pagination', (obj) => {
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
        watch: {
            'form.merchantSid': function(val) {
                if(val) this.handleSearchOrgans(val); 
                else return;
            },
            organCodes(val) {
                this.form.organCode = val[val.length - 1];
            }
        },
		methods: {
		    // 根据所选商家，查询组织机构
		    handleSearchOrgans(merchantSid) {
		        pubObj.httpRequest(this, {
                    url: ['organ', merchantSid],
                    success(result) {
                        this.organData = result.data;
                    }
                })
		    },
		    // 根据用户输入搜搜商家
            handleSearchMerchants(val) {
                pubObj.httpRequest(this, {
                    url: ['newMerchant'],
                    params: { q: val },
                    success(result) {
                        this.merchants = result.data;
                    }
                })
            },
            // 获取组织机构代码
            handleGetOrganCode(code) {
                this.form.organCode = code;
            },
		    // 搜索
		    handleSearch() { this.getTableList(this.form) },
		    // 刷新
		    handleRefresh() { this.getTableList() },
			// 编辑
			handleEdit(sid) {
				bus.$emit('shop-dialog', {
                    type: 2,
                    sid: sid,
                    title: '编辑店铺',
                    saveText: '保 存'
                })
			},
			// 查看店铺管理员
			handleAdmin(sid, code) {
				this.$router.push({
				    path: '/c_mall/shop/account',
				    query: {
				        merchantSid: sid,
                        organCode: code
				    }
				})
			}
		}
	}
</script>

<style>

</style>