<template>
	<div class="fansbinding">

		<jkc-breadcrumb :crumbs="staticData.crumbs" :goBack="-1"></jkc-breadcrumb>

		<wrapper style="margin-top: 20px;">
			<div slot="header">默认规则</div>
			<div slot="body">
				<box>
					<label slot="left">推荐用户</label>
					<p slot="middle">通过营销名片推广发展的用户，自动绑定为当前营销名片的粉丝</p>
				</box>
				<box>
					<label slot="left">自然用户</label>
					<div slot="middle">
						<p class="left">采用&nbsp;&nbsp;{{ listData.typeDesc }}&nbsp;&nbsp;自动绑定到</p>
						<div class="binding-person">
							<badge required>{{ firstPeopleTitle }}</badge>
							<badge
								v-if="restPeople.length > 0"
								v-for="(item, index) in restPeople"
								:key="index"
								:index="index"
								@delete="handleDeletePeople">
								{{ item.title }}
							</badge>
						</div>
					</div>
					<el-button type="text" slot="right" @click="handleEditBind">修 改</el-button>
				</box>
			</div>
		</wrapper>

		<edit-bind :visible.sync="showEditBind" :sid="listData.sid" :initData="listData.cardListe" v-if="isEditBind" @success="handleSuccess"></edit-bind>

	</div>
</template>

<script>
	import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
	import Wrapper from './child/wrapper.vue'
	import Box from './child/box.vue'
	import Badge from './child/badge.vue'
	import EditBind from './child/edit-bind.vue'
	import { pubObj } from '../../assets/unit/public.js'
	import api from '../../assets/config/m-api.js'
	export default {
		components: { JkcBreadcrumb, Wrapper, Box, Badge, EditBind },
		data() {
			return {
				// 静态数据
				staticData: {},
				// 粉丝绑定列表数据
				listData: {},
				firstPeopleTitle: null,
				restPeople: [],
				// 编辑名片-是否加载
				isEditBind: false,
				// 编辑名片-是否显示
				showEditBind: false,
			}
		},
		computed: {},
		created() {
			this.staticData.crumbs = [{ title: '粉丝绑定' }, { title: '粉丝绑定' }];
		},
		mounted() { this.getListData(); },
		methods: {
		    getListData() {
		        pubObj.httpRequest(this, {
                    url: api.bind,
                    success(result) {
                        this.listData = result.data;
                        this.firstPeopleTitle = result.data.cardListe[0].title;
                        this.restPeople = result.data.cardListe.slice(1);
                    }
                })
		    },
		    handleSuccess() { this.getListData(); },
			handleEditBind() {
				if(this.isEditBind);
				else {
					this.isEditBind = true;
				}
				this.showEditBind = true;
			},
			handleDeletePeople(index) {
				console.log(index);
				pubObj.showMessage(this, {
					title: '删除绑定',
					content: '确定要删除该粉丝绑定？',
					confirm() {
						this.listData.cardListe.splice(index + 1, 1);
						pubObj.httpRequest(this, {
							method: 'POST',
							url: api.bind,
							body: this.listData,
							success(result) {
								this.restPeople.splice(index, 1);
								this.$message.success(result.message);
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	.fansbinding .binding-person { display: inline-block; }
</style>
