<template>
	<div class="card">

		<jkc-breadcrumb :crumbs="staticData.crumbs"></jkc-breadcrumb>

		<div class="search-fil-wrap one-line">
			<el-form :model="form" :inline="true" class="search-form" label-width="80px">
				<el-form-item label="状态">
			   	<el-radio-group v-model="form.state">
					   <el-radio-button label="">全部</el-radio-button>
					   <el-radio-button label="Unused">待启用</el-radio-button>
					   <el-radio-button label="Used">启用</el-radio-button>
					   <el-radio-button label="Disabled">禁用</el-radio-button>
				  	</el-radio-group>
			   </el-form-item>
			   <el-form-item label="关键字">
			   	<el-input
					   placeholder="手机号、称谓"
					   icon="search"
					   v-model="form.keyword"
					   :on-icon-click="handleSearch">
					</el-input>
			   </el-form-item>
			</el-form>
		</div>

		<wrapper>
			<div slot="header" style="overflow: hidden;">
				<!--<el-checkbox v-model="checkedAll" class="checked-all">全选</el-checkbox>-->
				<el-button type="primary" class="mar-left-80" @click="handleEnabled" v-show="isActive">启用</el-button>
				<el-button type="primary" @click="handleDisabled" v-show="isDisabled">禁用</el-button>
				<el-button type="primary" @click="handleEdit" v-show="isEditable">编辑名片</el-button>
				<el-button type="primary" @click="handleMove" v-show="isMove">移动粉丝</el-button>
				<el-button type="primary" class="right" @click="handleBatchOpen" v-show="isOpen">批量开通营销名片</el-button>
			</div>
			<div slot="body">
				<el-table stripe :data="tableData" ref="selectTable" v-loading="loading" @select="handleSelect" @select-all="handleSelect">
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="用户身份" prop="typeName" width="100"></el-table-column>
					<el-table-column label="称谓" width="150">
						<template slot-scope="scope">
							<el-button type="text" @click="handleLookCard(scope.row.sid, scope.row.state)">{{scope.row.title}}</el-button>
						</template>
					</el-table-column>
					<el-table-column label="关联商户" prop="relevanceName" width="200"></el-table-column>
					<el-table-column label="联系电话" prop="phone" width="150"></el-table-column>
					<el-table-column label="总粉丝量" width="150">
						<template slot-scope="scope">
							<el-button type="text" @click="handleLookFans(scope.row.sid, form.state)">{{scope.row.totalFans}}</el-button>
						</template>
					</el-table-column>
					<el-table-column label="总曝光量" prop="totalExposure" width="150"></el-table-column>
					<el-table-column label="状态" prop="stateName" width="150"></el-table-column>
					<el-table-column label="开通时间" prop="runTime"></el-table-column>
				</el-table>
			</div>
		</wrapper>

		<jkc-pagination :total="pagiTotal" v-show="pagiTotal !== 0"></jkc-pagination>

		<transfer-fans :visible.sync="showTransferFans" :sids="sids" v-if="isTransferFans"></transfer-fans>

		<edit-card :visible.sync="showEditCard" :sid="sids" v-if="isEditCard" @success="handleSuccess"></edit-card>

		<open-card :visible.sync="showOpenCard" v-if="isOpenCard"></open-card>

		<div class="template" v-if="templateVisible" @click="templateVisible = false">
            <iframe :src="templatePath" frameborder="0" class="iframe" width="300px" height="450px"></iframe>
        </div>

	</div>
</template>

<script>
	import { mixin_pagination } from '../common/jkc-mixin.vue'
	import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
	import Wrapper from './child/wrapper.vue'
	import TransferFans from './child/transfer-fans.vue'
	import EditCard from './child/edit-card.vue'
	import OpenCard from './child/open-card.vue'
	import { router } from '../../pages/merchant.js'
	import { pubObj } from '../../assets/unit/public.js'
	import api from '../../assets/config/m-api.js'

	export default {
		mixins: [mixin_pagination],
		components: { JkcBreadcrumb, Wrapper, TransferFans, EditCard, OpenCard },
		data() {
			return {
				loading: true,
				staticData: {},
				form: { state: '' },
				tableData: [],
				checkedAll: false,
				selection: [],
				// 转移粉丝-是否加载
				isTransferFans: false,
				// 转移粉丝-是否显示
				showTransferFans: false,
				// 编辑名片-是否加载
				isEditCard: false,
				// 编辑名片-是否显示
				showEditCard: false,
				// 编辑名片-是否加载
				isOpenCard: false,
				// 编辑名片-是否显示
				showOpenCard: false,
				// 是否显示启用
				isActive: true,
				// 是否显示禁用
				isDisabled: true,
				// 是否显示编辑
				isEditable: true,
				// 是否显示移动粉丝
				isMove: true,
				// 是否显示开通名片
				isOpen: true,
				// 已选择名片的sid集合
				sids: [],
				// 禁用功能，要判断集合是否存在被绑定的用户
				fansBindRule: [],
				// 全部时，用户判断选中的名片是否可以进行某项操作
				cardsState: [],
				templatePath: null,
                templateVisible: false
			}
		},
		created() {
			this.staticData.crumbs = [{ title: '营销名片' }, { title: '名片列表' }];
		},
		beforeMount() { this.form.state = this.$route.query.state; },
		mounted() {
			// 获取数据
			this.getTableList();
			// 监听state状态值的变化
			this.$watch('form.state', (newVal, oldVal) => {
				if(newVal === '') {
					this.isActive = true;
					this.isDisabled = true;
					this.isEditable = true;
					this.isMove = true;
					this.isOpen = true;
				} else if(newVal === 'Unused') {
					this.isActive = false;
					this.isDisabled = true;
					this.isEditable = true;
					this.isMove = false;
					this.isOpen = true;
				} else if(newVal === 'Used') {
					this.isActive = false;
					this.isDisabled = true;
					this.isEditable = true;
					this.isMove = false;
					this.isOpen = true;
				} else {
					this.isActive = true;
					this.isDisabled = false;
					this.isEditable = false;
					this.isMove = true;
					this.isOpen = true;
				}
				// 查询
				this.getTableList();
			})
		},
		methods: {
		    // 修改成功之后通知父级，刷新列表
            handleSuccess() { this.getTableList(); },
			// 搜索
			handleSearch() { this.loading = true; this.getTableList(); },
			// 获取列表
			getTableList() {
				pubObj.httpRequest(this, {
					url: api.card + 'cards/',
					params: this.form,
					success(result) {
						this.tableData = result.data;
						if(result.pagination) this.pagiTotal = result.pagination.totalRow; // 分页
						else this.pagiTotal = 0;
						// 加延时
						/*setTimeout(() => {
							this.disableCheck(result.data);
						}, 50);*/
//						this.$store.commit('refresh', 0) // 复位刷新
					}
				})
			},
			// 认证作家不可选择
//			disableCheck(data) {
//				const el = this.$refs.selectTable.$el;
//				/*const child = el.getElementsByClassName('el-table__header')[0].
//						getElementsByClassName('el-checkbox__input')[0];
//						child.className = 'el-checkbox__input is-disabled';
//						child.getElementsByClassName('el-checkbox__original')[0].setAttribute('disabled', 'disabled');*/
//				data.forEach((item, index) => {
//					// 如果等于0，表示认证作家不可选择和编辑
//					if(item.type === 0) {
//						const child = el.getElementsByClassName('el-table__row')[index].
//						getElementsByClassName('el-checkbox__input')[0];
//						child.className = 'el-checkbox__input is-disabled';
//						child.getElementsByClassName('el-checkbox__original')[0].setAttribute('disabled', 'disabled');
//					}
//				})
//			},
//			handleDoThisAction(state) {
//				// stateEnum: ['Unused', 'Used', 'Disabled']
//				let bool = null;
//				if(state === 0 || state === 3) {
//					bool = this.cardsState.some((item) => {
//						if(item === 'Unused' || item === 'Used') return true;
//						else return false;
//					})
//				} else if(state === 1 || state === 2) {
//					bool = this.cardsState.some((item) => {
//						if(item === 'Disabled') return true;
//						else return false;
//					})
//				}
//				return bool;
//			},
//			// 全部状态，不符合前置条件，给出提示
//			showMessageWarning() {
//				pubObj.showMessage(this, {
//					title: '提示信息',
//					content: '当前选中值，存在某些不符合前置条件的名片，无法执行该操作，建议在特定状态中执行相应操作！',
//					showCancelButton: false,
//					confirm(args) {
//						console.log('sure')
//					}
//				})
//			},
			// switch
			switchState(state) {
			    if(state === 0) return '已启用';
			    else return '已禁用';
			},
			// 启用提示语
			warnLanguage(status) {
			    const states = this.cardsState;
			    let state; let content; let bool; let bool2;
			    if(status === 0) {
			        state = 0;
			        content = '选中用户营销名片' + this.switchState(state);
			        // 判断勾选的是否全是启用状态
                    bool = states.every((item) => {
                        return (item === 'Used' || item === 'Unused');
                    });
                    bool2 = states.every((item) => {
                        return item === 'Disabled';
                    });
			    } else if(status === 1) {
			        state = 1;
			        content = '选中用户营销名片' + this.switchState(state);
			        // 判断勾选的是否全是启用状态
                    bool = states.every((item) => {
                        return item === 'Disabled';
                    });
                    bool2 = states.every((item) => {
                        return (item === 'Used' || item === 'Unused');
                    });
			    } else {
                    content = '只能移动已禁用名片的粉丝';
                    // 判断勾选的是否全是启用状态
                    bool = states.every((item) => {
                        return (item === 'Used' || item === 'Unused');
                    });
                    bool2 = states.every((item) => {
                        return item === 'Disabled';
                    });
			    }
			    if(bool) {
			        pubObj.showMessage(this, {
                        title: '提示信息',
                        content: content,
                        showCancelButton: false,
                        confirm(args) {
                            console.log('sure')
                        }
                    });
                    return false;
			    } else {
			        if(!bool2) {
			            pubObj.showMessage(this, {
                            title: '提示信息',
                            content: '选中用户包含已启用和已禁用的用户，请重新选择',
                            showCancelButton: false,
                            confirm(args) {
                                console.log('sure')
                            }
                        });
                        return false;
			        } else return true;

			    }
			},
			// 启用
			handleEnabled() {
                if(this.sids.length === 0) {
                    this.$message.warning('请先选择用户！');
                    return null;
                }
                const exitUnused = this.cardsState.some((item) => {
                    return item === 'Unused';
                })
                if(exitUnused) {
                    pubObj.showMessage(this, {
                        title: '提示信息',
                        content: '请编辑该名片，完善名片信息后，即可启用该名片',
                        showCancelButton: false,
                        confirm(args) {
                            console.log('sure')
                        }
                    });
                } else {
                    const bool = this.warnLanguage(0);
                    if(bool) {
                        pubObj.showMessage(this, {
                            title: '提示信息',
                            content: '您确认要执行该项操作？',
                            confirm() {
                                pubObj.httpRequest(this, {
                                    method: 'PUT',
                                    url: api.card + 'ables/',
                                    body: this.sids,
                                    success(result) {
                                        this.$message.success(result.message);
                                        this.getTableList();
                                        // 操作成功后重置数据
                                        this.sids = [];
                                        this.fansBindRule = [];
                                        this.cardsState = [];
                                    }
                                })
                            }
                        })
                    }
                }
            },
			// 禁用
			handleDisabled() {
			    if(this.sids.length === 0) {
                    this.$message.warning('请先选择用户！');
                    return null;
                }
			    const bool = this.warnLanguage(1);
				if(bool) {
					let curIndex = null;
					const bool = this.fansBindRule.some((item, index) => {
						if(item.isBind) {
							curIndex = index;
							return true;
						} else return false;
					})
					if(bool) this.showDisabledMessageFail_1(this.fansBindRule[curIndex]);
					else this.showDisabledMessageSuccess();
				}
			},
			// 用户所选数据存在不符合前置条件内容时
			showDisabledMessageFail_1(obj) {
				pubObj.showMessage(this, {
					title: '提示信息',
					content: obj.title + ' 被加入了默认粉丝规则，无法禁用！如需禁用，请前往“粉丝绑定”模块，取消当前营销名片绑定规则？',
					showCancelButton: false,
					confirm(args) {
						console.log('got it...');
					}
				})
			},
			// 用户所选数据均符合要求时
			showDisabledMessageSuccess() {
				pubObj.showMessage(this, {
					title: '提示信息',
					content: '您确认要禁用当前所选营销名片？',
					confirm() {
						pubObj.httpRequest(this, {
							method: 'PUT',
							url: api.card + 'disable/',
							body: this.sids,
							success(result) {
								this.$message.success(result.message);
								this.getTableList();
                                // 操作成功后重置数据
                                this.sids = [];
                                this.fansBindRule = [];
                                this.cardsState = [];
							}
						})
					}
				})
			},
			// 前置条件：关联用户身份=本商户认证员工  且   营销名片状态=禁用
			// 当选择对象中包括不符合要条件的对象时，弹出提示框
//			showMoveMessageFail() {
//				pubObj.showMessage(this, {
//					title: '提示信息',
//					content: '移动粉丝，只限本商户认证员工的已经禁用营销名片',
//					showCancelButton: false,
//					confirm(args) {
//						console.log('sure')
//					}
//				})
//			},
			// 编辑
			handleEdit() {
				if(this.isEditCard);
				else { this.isEditCard = true; }
				if(this.sids.length === 0) this.$message.warning('请先选择用户！');
				else if(this.sids.length > 1) this.$message.warning('只能同时编辑一张名片！');
				else {
				    if(this.cardsState[0] === 'Disabled') {
				        pubObj.showMessage(this, {
                            title: '提示信息',
                            content: '该名片已禁用，请启用后再编辑',
                            showCancelButton: false,
                            confirm(args) {
                                console.log('sure')
                            }
                        })
				    } else this.showEditCard = true;
				}
			},
			// 移动粉丝
			handleMove() {
			    const bool = this.warnLanguage(2);
                if(bool) {
                    // 当选择对象中包括不符合要条件的对象时，弹出提示框
                    /*this.showMoveMessageFail();*/
                    // 当选择对象全部符合前置条件，则弹出转移粉丝弹出框
                    if(this.isTransferFans);
                    else { this.isTransferFans = true; }
                    if(this.sids.length === 0) this.$message.warning('请先选择用户！');
                    else { this.showTransferFans = true; }
                }
			},
			// 批量开通
			handleBatchOpen() {
				if(this.isOpenCard);
				else { this.isOpenCard = true; }
				this.showOpenCard = true;
			},
			handleSelect(selection) {
				const sids = [], fansBindRule = [], cardsState = [];
				selection.forEach((item) => {
					sids.push(item.sid);
					cardsState.push(item.state);
					fansBindRule.push({ title: item.title, isBind: item.fansBindRule });
				});
				this.sids = sids;
				this.cardsState = cardsState;
				this.fansBindRule = fansBindRule;
			},
			// 点击称谓，查看名片
            handleLookCard(sid, state) {
                if(state === 'Used') {
                    this.templatePath = this.$api.cardWebShare + sid;
                    this.templateVisible = true;
                } else {
                    pubObj.showMessage(this, {
                        title: '提示信息',
                        content: '只有启用的用户才能查看个人名片',
                        showCancelButton: false,
                        confirm(args) {
                            console.log('sure')
                        }
                    })
                }
            },
			// 点击粉丝数量，进入列表
			handleLookFans(sid, state) {
				router.push({ path: '/m_card/fans', query: { sid: sid, state: state } });
			}
		}
	}
</script>

<style>
	.card .el-radio-button__inner{ padding: 6px 15px; }
	.card .checked-all{ width: 80px; text-align: right; padding-right: 12px; float: left; line-height: 28px; }
	.card .right{ float: right; }
	.el-message-box__message p { line-height: 1.5; }
	.card .template {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 999;
    }
    .card .template .iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
