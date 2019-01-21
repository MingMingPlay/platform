<template>
	<div class="feedback">

		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true">
				<el-form-item label="渠道">
					<el-select v-model="form.channelSid" placeholder="选择渠道" clearable>
						<el-option v-for="(item,index) in channel" :key="index" :label="item.name" :value="item.sid"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="关键字">
					<el-input v-model="form.q" placeholder="请输入关键字"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="form.state" placeholder="不限" clearable>
						<el-option label="不限" value=""></el-option>
						<el-option label="未处理" value="Active"></el-option>
						<el-option label="已处理" value="Read"></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
			</el-form>
		</div>

		<el-table :data="tableData" v-loading="loading" stripe>
			<el-table-column label="序号" width="60" class-name="first-col-no-padding" align="center">
                <template slot-scope="scope">
                    {{ scope.$index | newIndex(form.pageIndex, form.pageSize) }}
                </template>
            </el-table-column>
			<el-table-column label="用户姓名" prop="userName"></el-table-column>
			<el-table-column label="用户昵称" prop="nickName"></el-table-column>
			<el-table-column label="渠道来源" prop="channelName"></el-table-column>
			<el-table-column label="联系方式" prop="mobile"></el-table-column>
			<el-table-column label="登录手机" prop="loginMobile"></el-table-column>
			<el-table-column label="创建时间" prop="createdTime"></el-table-column>
			<el-table-column label="状态" prop="stateName"></el-table-column>
			<el-table-column label="操作人" prop="processor"></el-table-column>
			<el-table-column label="用户反馈" prop="description" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="操作" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button type="text" @click="handleEdit(scope.row.sid)" v-if="scope.row.state !== 'Read'">处理</el-button>
					<el-button type="text" @click="handleLook(scope.row.sid)">详情</el-button>
					<!--<el-button type="text" class="text-btn-delete" @click="handleDel(scope.row.sid)" v-if="button.delete">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<pagination event-name="feedback-pagination" :total="mxTableList.pagiTotal"></pagination>

		<el-dialog title="操作处理" v-model="commentVisible" :close-on-click-modal="false">

            <el-form :model="submitForm" ref="submitForm" :rules="rules">
                <el-form-item label="处理结果" prop="comment">
                    <el-input type="textarea" v-model="submitForm.comment"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer">
                <el-button @click="handleCommentSave('submitForm')">保 存</el-button>
                <el-button @click="commentVisible = false">取 消</el-button>
            </div>
        </el-dialog>

		<el-dialog title="反馈详情" v-model="dialogFormVisible" :close-on-click-modal="false">

			<div class="detail-wrap">
			    <jk-labels :model="detailData" label-width="100px" label-right="1px">
                    <jk-labels-item 
                        v-for="(item,index) in labelTitles"
                        :key="index" 
                        :label="item.label" 
                        :prop="item.prop">
                    </jk-labels-item>
                </jk-labels>
				<!--<detail-item v-for="item in labelTitles" :label="item.label" :value="detailData[item.prop]" label-width="78px"></detail-item>-->
			</div>

			<div slot="footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
    // 组件
    import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import Pagination from '../../common/pagination.vue'
    import JkLabels from '../../common/labels/jk-labels.vue'
    import JkLabelsItem from '../../common/labels/jk-labels-item.vue'
//	import DetailItem from '../../common/detail-item.vue'
	// mixin
    import TableList from '../../mixin/table-list.vue'
	// js
//	import api from '../../../assets/config/c-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'
	import { feedback } from '../../../assets/staticData/feedback.js'

	export default {
	    components: { JkcBreadcrumb, JkLabels, JkLabelsItem, Pagination },
	    
		mixins: [TableList],
		
		data() {
		    const rules = {
		        comment: [{
                    required: true,
                    message: '请输入处理结果'
                }, {
                    max: 500,
                    message: '字数不能超过500'
                }]
		    }
			return {
				crumbs: [],
				channel: [],
				dialogFormVisible: false,
				commentVisible: false,
				detailData: {},
				labelTitles: [],
				form: {
					channelSid: null,
					state: null,
				},
				mxTableList: {
                    url: ['newFeedback'],
                    pagiTotal: 0
                },
				submitForm: {},
				rules: rules,
				rowSid: null
			}
		},
		created() {
			this.crumbs = feedback.crumbs;
			this.labelTitles = feedback.labelTitles;
		},
		beforeMount() {
			// 获取渠道
			pubObj.httpRequest(this, {
			    url: this.$api.channel,
			    success(result) {
			        this.channel = result.data;
			    }
			})
		},
		mounted() {
            bus.$on('feedback-pagination', (obj) => {
                this.form = Object.assign(this.form, obj);
                this.getTableList(this.form);
            })
        },
		methods: {
		    // 查询
		    handleSearch() { this.getTableList(this.form); },
//			// 删除用户
//			handleDel(sid) {
//				pubObj.del(this, {
//					title: '删除用户反馈数据',
//					content: '确定删除该用户反馈数据，删除之后不可恢复?',
//					api: api.feedback,
//					sid: sid
//				})
//			},
			handleLook(sid) {
				pubObj.httpRequest(this, {
					url: ['newFeedback', sid],
					success(result) {
						this.detailData = result.data;
						this.dialogFormVisible = true;
					}
				})
			},
			handleEdit(sid) {
			    this.rowSid = sid;
			    this.commentVisible = true;
			},
			handleCommentSave(formName) {
			    this.$refs[formName].validate((valid) => {
                    if(valid) {
                       pubObj.httpRequest(this, {
                            url: ['newFeedback', this.rowSid],
                            method: 'PUT',
                            body: this[formName],
                            success(result) {
                                this.$message.success(result.message);
                                this.commentVisible = false;
                                this.getTableList();
                            }
                        })
                    } else {
                        return false;
                    }
                })
			}
		}
	}
</script>

<style>
	.feedback .two-line {
	    display: -webkit-box;
        display: box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        white-space: normal;
        word-break: break-all;
	}
</style>
