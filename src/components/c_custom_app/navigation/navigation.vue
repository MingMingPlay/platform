<template>
	<div class="navigation">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
            <el-form :model="form" :inline="true">
                <el-form-item label="导航名称">
                    <el-input v-model="form.title" placeholder="导航名称"></el-input>
                </el-form-item>
                <el-form-item label="导航类别">
                    <el-select v-model="form.attribute" placeholder="全部" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="导航菜单" value="Menu"></el-option>
                        <el-option label="专题" value="Topic"></el-option>
                        <el-option label="橱窗" value="ShopWindow"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道">
                    <el-select v-model="form.channelSid" placeholder="请选择" clearable>
                        <el-option :label="item.name" :value="item.sid" 
                        v-for="(item,index) in channels" 
                        :key="index" >                            
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-select v-model="form.displayable" placeholder="全部" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜 索</el-button>
                </el-form-item>
            </el-form>
        </div>

		<div class="assist-btn-wrap">
			<el-button type="primary" @click="handleAdd">新增导航</el-button>
            <el-button type="success" @click="handleRefreshCache">刷新缓存</el-button>
		</div>

		<collapse-table :data="tableData" v-loading.body="loading" stripe>
            <collapse-table-column label="导航名称" prop="title"></collapse-table-column>
            <collapse-table-column label="导航类型" prop="typeName" align="center"></collapse-table-column>
            <collapse-table-column label="导航类别" prop="attributeName" align="center"></collapse-table-column>
            <collapse-table-column label="是否显示" align="center">
                <template slot-scope="scope">
                    <span :class="[scope.row.displayable ? '' : 'red']">{{ scope.row.displayName }}</span>
                </template>
            </collapse-table-column>
            <collapse-table-column label="可否编辑" align="center">
                <template slot-scope="scope">
                    <span :class="[scope.row.editable ? '' : 'red']">{{ scope.row.editName }}</span>
                </template>
            </collapse-table-column>
            <collapse-table-column label="设置渠道" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click.stop="handleSetChannel(scope.row.sid)">查看/修改</el-button>
                </template>
            </collapse-table-column>
            <collapse-table-column label="添加分类" align="center">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click.stop="handleSetCategory(scope.row.sid)"
                        :disabled="scope.row.isDisabled">查看/修改</el-button>
                </template>
            </collapse-table-column>
            <collapse-table-column label="添加商品" align="center">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click.stop="handleSetProduction(scope.row.sid)"
                        :disabled="scope.row.isDisabled">查看/修改</el-button>
                </template>
            </collapse-table-column>
            <!--chuchuang-->
            <collapse-table-column label="排序" align="center">
                <template slot-scope="scope">{{scope.row.rank}}</template>
            </collapse-table-column>
            <collapse-table-column label="导航操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click.stop="handleEdit(scope.row.sid)">修改</el-button>
                </template>
            </collapse-table-column>
        </collapse-table>

        <set-channel></set-channel>

        <set-category></set-category>

		<set-production></set-production>

		<navigation-form @refresh="handleRefresh"></navigation-form>


	</div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import CollapseTable from '../../common/table/collapse-table.vue'
    import CollapseTableColumn from '../../common/table/collapse-table-column.vue'
    import SetChannel from './set-channel.vue'
    import SetCategory from './set-category.vue'
    import SetProduction from './set-production.vue'
	import NavigationForm from './form.vue'
	// mixin
    import TableList from '../../mixin/table-list.vue'
    // js
	import { pubObj, bus } from '../../../assets/unit/public.js'

//	import Collapse from './collapse.vue'
//	import api from '../../../assets/config/c-api.js'
//	import { navigation } from '../../../assets/staticData/navigation.js'

	export default {
	    components: {
	        JkcBreadcrumb,
	        CollapseTable,
	        CollapseTableColumn,
	        SetChannel,
	        SetCategory,
	        SetProduction,
	        NavigationForm,
	    },

		mixins: [TableList],

		data() {
			return {
				crumbs: [],
				form: {},
				mxTableList: {
				    url: this.$api.navigation
				},
				channels: [],
//				channelVisible: false,
//				categoryVisible: false,
//				productVisible: false,
//				firstNavigation: true,
			}
		},

        methods: {
            handleSearch() {
                this.loading = true;
                this.getTableList(this.form);
            },
            // 重写混合表格接口方法
            canBeOverrideFun(obj) {
                obj.displayName = obj.displayable ? '是' : '否';
                obj.editName = obj.editable ? '是' : '否';
                obj.isDisabled = obj.guidingType === 'Link' || obj.guidingType === 'DiscountsGoldMall';
                if(obj.children) {
                    obj.children.forEach(item => this.canBeOverrideFun(item));
                }
                return obj;
            },
            // 添加导航
            handleAdd() {
                bus.$emit('navigation-dialog', {
                    type: 1,
                    title: '新增导航',
                    saveText: '确 定'
                })
            },
            // 设置渠道
            handleSetChannel(sid) {
                // 触发打开dialog事件
                bus.$emit('set-channel',{ sid: sid });
            },
            // 设置分类
            handleSetCategory(sid) {
                // 触发打开dialog事件
                bus.$emit('set-category',{ sid: sid });
            },
            // 配置商品
            handleSetProduction(sid) {
                // 触发打开dialog事件
                bus.$emit('set-production',{ sid: sid });
            },
            // 编辑
            handleEdit(sid) {
                bus.$emit('navigation-dialog', {
                    type: 2,
                    sid: sid,
                    title: '编辑导航',
                    saveText: '保 存'
                })
            },
            // 刷新
            handleRefresh() {
                this.getTableList(this.form);
            },
            // 刷新缓存
            handleRefreshCache() {
                pubObj.httpRequest(this, {
                    url: this.$api.navigation + 'refresh',
                    success(result) {
                        this.$message.success(result.message);
                    }
                })
            },
//          refresh(){
//              this.$http.get(['newResource', this.$route.query.platform, '/refresh'])
//                  .then(result => {
//                      if(result.body.code === 200){
//                          this.$message(result.body.message)
//                      }
//                  })
//          },
        },

		created() {
		    this.crumbs = [{ title: '导航管理', }, { title: '导航列表', }];
		},

		beforeMount() {
		    pubObj.httpRequest(this, {
		        url: this.$api.channel,
		        success(result) {
		            this.channels = result.data;
		        }
		    })
		}

	}
</script>

<style>
	.navigation .red { color: #FA5555; }
</style>
