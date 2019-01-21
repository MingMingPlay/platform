<template>
	<div class="single-banner">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="assist-btn-wrap">
			<el-button type="primary" @click="handleAdd">新增单图广告</el-button>
		</div>

		<el-table :data="tableData" v-loading="loading" stripe>
			<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
			<el-table-column label="标题" prop="title" width="120"></el-table-column>
			<el-table-column label="图片" width="120" align="center">
				<template slot-scope="scope">
					<img :src="scope.row.imagePath | imageSize(100)" class="singleImage" />
				</template>
			</el-table-column>
			<el-table-column label="渠道名称" prop="channelName" width="120" align="center"></el-table-column>
			<el-table-column label="类型" prop="typeName" width="120" align="center"></el-table-column>
			<!--<el-table-column label="点击" prop="hits" align="center" width="120"></el-table-column>-->
			<el-table-column label="状态" prop="stateName" width="120"></el-table-column>
			<el-table-column label="链接" prop="url" :show-overflow-tooltip="true"></el-table-column>
            <!--chuchuang-->
			<el-table-column label="排序" prop="rank" align="center"></el-table-column>
			<el-table-column label="有效期" prop="availableTime" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="handleEdit(scope.row.sid)">修改</el-button>
					<el-button type="text" class="text-btn-delete" @click="handleDel(scope.row.sid)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination event-name="single-banner-pagination" :total="mxTableList.pagiTotal"></pagination>

		<single-banner-form @refresh="handleRefresh"></single-banner-form>


	</div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
	import SingleBannerForm from './dialog.vue'
	// mixin
    import TableList from '../../mixin/table-list.vue'
    // js
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
	    components: { JkcBreadcrumb, Pagination, SingleBannerForm },

		mixins: [TableList],

		data() {
			return {
				crumbs: [],
				mxTableList: {
                    url: ['newBanner', 'single'],
                    pagiTotal: 0
                }
			}
		},

		methods: {
		    canBeOverrideFun(obj) {
		        try {
		            if(obj.startTime && obj.endTime) {
		                obj.availableTime = `${ obj.startTime } 至 ${ obj.endTime }`;
		            } else {
		                obj.availableTime = '/';
		            }
		            return obj;
		        } catch(e) {
		            console.log(e);
		        }
		    },
            // 刷新数据
            handleRefresh() { this.getTableList(); },
            // 新增横幅
            handleAdd() {
                bus.$emit('single-banner-dialog', {
                    type: 1,
                    title: '新增单图广告',
                    saveText: '确 定'
                })
            },
            // 编辑横幅
            handleEdit(sid) {
                bus.$emit('single-banner-dialog', {
                    type: 2,
                    sid: sid,
                    title: '编辑单图广告',
                    saveText: '保 存'
                })
            },
            // 删除横幅
            handleDel(sid) {
                pubObj.showMessage(this, {
                    title: '删除单图广告',
                    content: '确定删除该单图广告，删除之后不可恢复?',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: ['newBanner', sid],
                            method: 'DELETE',
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList();
                            }
                        })
                    }
                })
            }
        },

		created() {
			this.crumbs = [{ title: '多版本管理' }, { title: '单图广告' }];
		},

		mounted() {
            bus.$on('single-banner-pagination', (obj) => {
                this.getTableList(obj);
            })
        },

        destroyed() {
            bus.$off();
        }

	}
</script>

<style>
	.single-banner .el-table .cell { padding: 6px; }
	.single-banner .singleImage {
        width: 90px;
        height: 45px;
        vertical-align: middle;
    }
</style>
