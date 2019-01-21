<template>
    <div class="pc-header">
        <div class="header-menu">
            <router-link to="/" class="logo">{{title}}</router-link>
            <div class="user-wrap">
                <p>欢迎您，
                    <el-dropdown trigger="click" @command="handleCommand">
                        <a href="javascript:void(0)" class="self">
                            {{userInfo.nickname}}
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </a>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    |
                    <a href="javascript:void(0)" @click="handleLogout">注销</a>
                </p>
            </div>
            <a class="download-doc" @click="handleDownloadDoc" v-if="merchantSid === 'ooo_PJ'"><i class="el-icon-document"></i>下载帮助手册</a>
        </div>

        <change-password :isVisible="isVisible" title="修改密码" v-if="isVisible" @cancel="changeValue"></change-password>


        <el-dialog v-if="type === 'merchant'" title="个人信息" :visible.sync="isUserInfo">
            <div class="user-info">
                <div>账号： {{newUserInfo.loginName}}</div>
                <div>姓名： {{newUserInfo.name}}</div>
                <div>机构名称： {{newUserInfo.organName}}</div>
                <div>机构ID： {{newUserInfo.organId}}</div>
                <div>机构层级： {{newUserInfo.level}}</div>
                <div>绑定手机： {{newUserInfo.mobile}}</div>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import ChangePassword from '../common/change-password.vue'
    import api from '../../assets/config/m-api.js'
    import { pubObj } from '../../assets/unit/public.js'
    import { router, vm } from '../../pages/merchant.js'
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        components: {
            ChangePassword
        },
        data() {
            //console.log(vm.platform);
            return {
                isVisible: false,
                isUserInfo: false,
                newUserInfo: {
                    loginName: '',
                    name: '',
                    organName: '',
                    organId: '',
                    level: '',
                    mobile: ''
                },
                userInfo: {
                    nickname: null,
                },
                title: '阅商机',
                merchantSid: null,
                type:vm.platform
            }
        },
        created() {
            this.merchantSid = this.$root.userInfo.merchantSid;
            if(vm.userInfo) {
                this.userInfo = vm.userInfo;
            }
        },
        methods: {
            getUserInfo () {
                pubObj.httpRequest(this, {
                    method: 'get',
                    url: ['userProfile', 'business/'],
                    success(result) {
                        this.newUserInfo = result.data;
                    }
                })
            },
            closeUserInfo () {
                this.isUserInfo = false;
            },
            // 下载帮助手册
            handleDownloadDoc() {
                const alink = document.createElement('a');
                alink.download = '阅商机帮助手册.doc';
                alink.style.display = 'none';
                alink.href = '../../../static/doc/阅商机帮助手册.doc';
                document.body.appendChild(alink);
                alink.click();
                document.body.removeChild(alink);
                //window.open('../../../static/doc/redirect.html?file=阅商机帮助手册.doc');
            },
            changeValue(val) {
                this.isVisible = val;
            },
            // 退出登录
            handleLogout() {
                var $th = this;
                this.$confirm('确定要退出登录账号吗?', '退出登录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pubObj.httpRequest($th, {
                        url: ['bizLogin'],
                        method: 'delete',
                        success(result) {
                            if(result.code === 200) {
                                sessionStorage.clear();
                                $th.$message.success({
                                    message: '退出成功',
                                    duration: 1000,
                                    onClose() {
                                        router.push('/login')
                                    }
                                })
                            }
                        }
                    })
                }).catch(() => {
                    console.log('已取消当前操作！')
                });
            },
            handleCommand(command) {
                if (command === 'password') {
                    this.isVisible = true;
                } else if(command === 'userInfo') {
                    this.isUserInfo = true;
                    this.getUserInfo();
                }
            }
        }
    }
</script>

<style scoped>
    .user-info{
        width: 250px;
        margin: 0 auto;
        line-height: 40px;
        padding-bottom: 30px;
    }
    .pc-header {
        min-width: 1200px;
        border-bottom: 1px solid #dfdfdf;
    }
    .pc-header .download-doc {
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        color: #FDA54D;
        float: right;
        margin-right: 30px;
        cursor: pointer;
    }

    .pc-header .user-wrap a {
        color: #20a0ff;
    }

    .pc-header .user-wrap a.self>i {
        transform: scale(0.6);
        -ms-transform: scale(0.6);
        -webkit-transform: scale(0.6);
        -moz-transform: scale(0.6);
        margin-left: -2px;
    }

    .pc-header .header-menu {
        min-width: 1200px;
        height: 45px;
        position: relative;
    }

    .pc-header .logo {
        float: left;
        line-height: 45px;
        color: #000;
        font-size: 20px;
        font-weight: bold;
        width: 176px;
        text-align: center;
    }

    .pc-header .user-wrap {
        float: right;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        margin-right: 40px;
    }

    .pc-header .user-wrap p {
        color: #000;
    }
</style>
