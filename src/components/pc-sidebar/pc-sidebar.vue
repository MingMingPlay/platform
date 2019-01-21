<template>
	<div class="pc-sidebar">
		<el-menu theme="light" mode="vertical" class="el-menu-vertical-demo" :router="true" :default-active="path" :unique-opened="true" :default-openeds="dOpen">
			<pc-menu :data="sidebar"></pc-menu>
		</el-menu>
	</div>
</template>

<script>
	import Vue from 'vue'
	import pcMenu from './pc-menu.vue'

	export default {
		name: 'pc-sidebar',
		data() {
			return {
				sidebar: null,
				path: null,
                dOpen: [],
                // 非太平用户不能显示的资源，暂时前端删除
                otherBiz: [
//                    '/m_order/virtual',
//                    '/m_order/subscribe',
//                    '/m_product/subscribe',
//                    '/m_product/ticket',
//                    '/m_user',
//                    '/m_sys_config/organ',
//                    '/m_card',
//                    '/m_incentive',
                ],
                // 临时还不能开放的
                delResource: [],
                // 云平台开发中的菜单
                cloudDevRe: [
                   /*{
                       name: '--开发测试页面',
                       url: '/c_distribute',
                       children: [
                           {
                               name: '发布公告',
                               url: '/c_custom_app/release-notice',
                           },                                                      
                       ]
                   },*/
                ],
                // 阅商机开发中的菜单
                bizDevRe: [
//                     {
//                         name: '数据统计--',
//                         url: '/m_data_total',
//                         children: [
//                             {
//                                 name: '会议',
//                                 url: '/m_data_total/ticket'
//                             },
//                             {
//                                 name: '激励',
//                                 url: '/m_data_total/incentive'
//                             },
//                             {
//                                 name: '征订',
//                                 url: '/m_data_total/subscribe'
//                             }
//                         ]
//                     }
                ],
			}
		},
		created() {
			this.path = this.$route.path;
            if(this.$route.path.split('/').length > 3){
                let a = this.$route.path.split('/');
                this.path = '/' + a[1] + '/' + a[2];
            }
			this.getData();
		},
		watch: {
			$route:function(){
                this.path = this.$route.path;
                if(this.$route.path.split('/').length > 3){
                    let a = this.$route.path.split('/');
                    this.path = '/' + a[1] + '/' + a[2];
				}
			}
		},
		methods: {
            filterSubmenu (data, current){		// 查找当前的展开项
                Vue.set(this.dOpen, 0, '/' + current.split('/')[1]);
            },
            // 删除没有子菜单的父级
            delNoChildren(data){
                for(let i=0;i<data.length;i++){
                    if(!data[i].children || data[i].children.length === 0){
                        data.splice(i, 1);
                    }
                }
                return data;
            },
            // 删除在非太平用户不该显示的菜单
            delMenu(data){
                for(let i=0;i<data.length;i++){
                    if(this.otherBiz.indexOf(data[i].url) !== -1){
                        data.splice(i, 1);
                        i--;
                    }
                    if(data[i].children && data[i].children.length > 0){
                        this.delMenu(data[i].children);
                    }
                }
                return data;
            },
            // 删除临时还不能开放的菜单
            delMenuTemp(data){
                for(let i=0;i<data.length;i++){
                    if(this.delResource.indexOf(data[i].url) !== -1){
                        data.splice(i, 1);
                        i--;
                    }
                    if(data[i].children && data[i].children.length > 0){
                        this.delMenu(data[i].children);
                    }
                }
                return data;
            },
			getData() { // 获取列表数据
				this.$http({
					method: 'GET',
					url: ['newResource', this.$root.platform === 'cloud'?this.$root.platform:'biz']
				}).then((response) => {
					if(response.body.code === 200) {
					    let data = response.body.data;
					    if(data.length === 0){
                            this.$router.replace('/login');
                            this.$message.warning('无法为您找到资源，请联系管理员');
                            return false;
                        }
                        if(this.$root.userInfo.merchantSid === 'ooo_PJ'){
                            this.sidebar = data;
                        }else {
                            this.sidebar = this.delMenu(data);
                        }
                        if(this.delResource.length > 0){
                            this.sidebar = this.delMenuTemp(this.sidebar);
                        }
                        this.sidebar = this.delNoChildren(this.sidebar);

                        // 把开发中需要的菜单加入菜单
                        // if(PRODCUTION === 'dev'){
                        //     if(this.$root.platform === 'cloud' && this.cloudDevRe.length > 0){
                        //         this.sidebar = this.sidebar.concat(this.cloudDevRe);
                        //     }else if(this.$root.platform === 'merchant' && this.bizDevRe.length > 0){
                        //         this.sidebar = this.sidebar.concat(this.bizDevRe);
                        //     }
                        // }
                        if(this.$root.platform === 'cloud' && this.cloudDevRe.length > 0){
                            this.sidebar =this.cloudDevRe.concat(this.sidebar);
                        }else if(this.$root.platform === 'merchant' && this.bizDevRe.length > 0){
                            this.sidebar = this.sidebar.concat(this.bizDevRe);
                        }

                        this.filterSubmenu(this.sidebar, this.$route.path);
					}else {
                        this.$router.replace('/login');
                        this.$message.warning(response.body.message);
                    }
				}).catch((error) => {
					console.log(error)
				});
			}
		},
		components: {
			pcMenu
		}
	}
</script>
<style>
	.pc-sidebar {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 176px;
		background-color: #f5f8fa;
		overflow: auto;
	}
	.pc-sidebar .el-menu {
		background-color: #f5f8fa;
        overflow: hidden;
	}
	.pc-sidebar .el-submenu .el-menu {
		background-color: #edf2f5;
	}
	.pc-sidebar .el-submenu .el-menu-item {
		font-size: 12px;
	}
	.pc-sidebar .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{
		color: #000;
		background: #e4eaee;
		position: relative;
	}
	.pc-sidebar .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active:before, .el-menu-item.is-active:before{
		content: '';
		display: block;
		position: absolute;
		width: 4px;
		height: 100%;
		left: 0;
		top: 0;
		background: #545454;
	}
	.pc-sidebar .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
		transform: scale(0.6) rotateZ(180deg);
	}
	.pc-sidebar .el-submenu__icon-arrow{
		transform: scale(0.6);
	}
	.pc-sidebar .el-icon-arrow-down:before{
		content: '\E604';
	}
</style>
