<template>
	<div class="banner">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true">
				<el-form-item label="输入关键字">
					<el-input v-model="form.q" placeholder="图片名称，网址"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select @change="changeActive" v-model="form.state" placeholder="有效" clearable>
						<el-option :class="{ 'hide' : isActive}" label="有效" value="Active"></el-option>
						<el-option :class="{ 'hide' : !isActive}" label="无效" value="Inactive"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
                    <el-button type="primary" @click="handleSearch">搜 索</el-button>
                </el-form-item>
			</el-form>
		</div>

		<div class="assist-btn-wrap">
			<el-button type="primary" @click="handleAdd">新增横幅</el-button>
			<el-button v-if="false" type="success" @click="handleRefreshCache">刷新缓存</el-button>
		</div>

		<el-table :data="tableData" v-loading="loading" stripe>
			<el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                </template>
            </el-table-column>
			<el-table-column label="渠道名称" prop="channelName" width="120"></el-table-column>
			<el-table-column label="横幅图片" width="140">
				<template slot-scope="scope">
					<img :src="scope.row.imagePath | imageSize(100)" class="bannerImage" />
				</template>
			</el-table-column>
			<el-table-column label="图片名称" prop="title" width="120"></el-table-column>
			<el-table-column label="链接类型" prop="typeName" width="120" align="center"></el-table-column>
			<el-table-column label="横幅排序" prop="rank" width="120" align="center"></el-table-column>
			<el-table-column label="状态" prop="stateName" width="120" align="center"></el-table-column>
			<el-table-column label="链接地址" prop="url" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="轮播时间" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="handleConfig(scope.row)">配置</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="handleEdit(scope.row.sid)">修改</el-button>
					<el-button type="text" v-if="scope.row.state === 'Inactive'" class="text-btn-delete" @click="handleDel(scope.row.sid)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination event-name="banner-pagination" :total="mxTableList.pagiTotal"></pagination>

		<el-dialog title="配置轮播时间" v-model="intervalVisible" :close-on-click-modal="false">
			<el-form label-width="80px">
				<el-form-item label="轮播时间">
					<el-slider v-model.number="intervalTime" show-input :max="10" :show-tooltip="false"></el-slider>
					<div style="font-size: 12px;">控制轮播图的滚动时间（单位：秒）</div>
				</el-form-item>
			</el-form>
			<template slot="footer">
			    <div style="text-align: center;">
			        <el-button @click="intervalVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">保存</el-button>
			    </div>
			</template>
		</el-dialog>

		<banner-form @refresh="handleRefresh"></banner-form>


	</div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
	import BannerForm from './dialog.vue'
	// mixin
    import TableList from '../../mixin/table-list.vue'
    // js
	import { pubObj, bus } from '../../../assets/unit/public.js'

//	import { banner } from '../../../assets/staticData/banner.js'
//	import api from '../../../assets/config/c-api.js'

	export default {
	    components: { JkcBreadcrumb, Pagination, BannerForm },

		mixins: [TableList],

		data() {
			return {
				crumbs: [],
				form: { state: 'Active' },
				mxTableList: {
                    url: ['newBanner', 'normal'],
                    pagiTotal: 0
                },
                // 配置轮播
				intervalTime: 3,
				intervalVisible: false,
				navigationSid: null,
				channelSid: null,
                isActive: true
			}
		},

		methods: {
            changeActive(){
                this.isActive = !this.isActive
            },
		    // 搜索
            handleSearch() {
                this.getTableList(this.form);
            },
            // 刷新缓存
            handleRefreshCache() {
                pubObj.httpRequest(this, {
                    url: ['newBanner', 'refresh'],
                    success(result) {
                        this.$message.success(result.message);
                    }
                })
            },
            // 刷新数据
            handleRefresh() {
                this.getTableList(this.form);
            },
            // 新增横幅
            handleAdd() {
                bus.$emit('banner-dialog', {
                    type: 1,
                    title: '新增横幅',
                    saveText: '确 定'
                })
            },
            // 编辑横幅
            handleEdit(sid) {
                bus.$emit('banner-dialog', {
                    type: 2,
                    sid: sid,
                    title: '编辑横幅',
                    saveText: '保 存'
                })
            },
            // 删除横幅
            handleDel(sid) {
                pubObj.showMessage(this, {
                    title: '删除横幅',
                    content: '确定删除该横幅，删除之后不可恢复?',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: ['newBanner', sid],
                            method: 'DELETE',
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList(this.form);
                            }
                        })
                    }
                })
            },
            // 打开配置轮播
            handleConfig(row) {
                this.intervalTime = row.intervalTime;
                this.intervalVisible = true;
                this.navigationSid = row.navigationSid;
                this.channelSid = row.channelSid;
            },
            // 保存配置轮播
            handleSubmit() {
                pubObj.httpRequest(this, {
                    url: ['newBanner', 'time/', this.navigationSid, '/', this.channelSid],
                    method: 'PUT',
                    params: { intervalTime: this.intervalTime },
                    success(result) {
                        this.$message.success(result.message);
                        this.intervalVisible = false;
                        this.getTableList(this.form);
                    }
                })
            }
        },

		created() {
			this.crumbs = [{ title: '横幅管理' }, { title: '横幅列表' }];
		},

		mounted() {
            bus.$on('banner-pagination', (obj) => {
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        }

	}
</script>

<style>
    .hide{
        display: none;
    }
	.banner .el-table .cell { padding: 6px; }
	.banner .bannerImage {
        width: 90px;
        height: 45px;
        vertical-align: middle;
    }
</style>
