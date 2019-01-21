<template>
    <div class="user-detail">
        <el-button type="primary" @click="handleUser('Active')" v-if="userInfo.profile.state == 'Disabled'">启用</el-button>
        <el-button type="danger" @click="handleUser('Disabled')" v-if="userInfo.profile.state == 'Active'">禁用</el-button>

        <div class="user-card clear">
            <div class="avatar">
                <img :src="userInfo.profile.avatarPath" alt="头像">
            </div>
            <div class="right clear">
                <div class="col">
                    <p class="info-cell clear">
                        <span class="info-title">手机号：</span>
                        <span class="info-content">{{userInfo.profile.mobile || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">性　　别：</span>
                        <span class="info-content">{{userInfo.profile.genderName || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">所在区域：</span>
                        <span class="info-content">{{userInfo.profile.areaName || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">邀请用户：</span>
                        <span class="info-content">{{userInfo.profile.referrerName || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">注册地点：</span>
                        <span class="info-content">{{userInfo.profile.channelName || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">终端系统：</span>
                        <span class="info-content">{{userInfo.userRegister.terminalSystem || '--'}}</span>
                    </p>
                    <p class="info-cell clear" v-if="from === 'all'">
                        <span class="info-title">会员等级：</span>
                        <span class="info-content">{{userInfo.profile.gradeName || '--'}}</span>
                    </p>
                </div>
                <div class="col">
                    <p class="info-cell clear">
                        <span class="info-title">昵　　称：</span>
                        <span class="info-content">{{userInfo.profile.nickname || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">年　　龄：</span>
                        <span class="info-content">{{userInfo.profile.age || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">行业职业：</span>
                        <span class="info-content">{{userInfo.profile.industryProfessional || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">粉丝归属：</span>
                        <span class="info-content">{{userInfo.profile.cardTitle || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">设备标识：</span>
                        <span class="info-content">{{userInfo.userRegister.deviceIdentification || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">注册时间：</span>
                        <span class="info-content">{{userInfo.profile.createdTime || '--'}}</span>
                    </p>
                    <p class="info-cell clear" v-if="from === 'all'">
                        <span class="info-title">成长值：</span>
                        <span class="info-content">{{userInfo.profile.growth || '--'}}</span>
                    </p>
                </div>
                <div class="col">
                    <p class="info-cell clear">
                        <span class="info-title">真实姓名：</span>
                        <span class="info-content">{{userInfo.profile.name || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">学　　历：</span>
                        <span class="info-content">{{userInfo.profile.education || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">个人介绍：</span>
                        <span class="info-content">{{userInfo.profile.signature || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">注册渠道：</span>
                        <span class="info-content">{{userInfo.profile.channelName || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">设备品牌：</span>
                        <span class="info-content">{{userInfo.userRegister.equipmentBrand || '--'}}</span>
                    </p>
                    <p class="info-cell clear">
                        <span class="info-title">状　　态：</span>
                        <span class="info-content">{{userInfo.profile.stateName || '--'}}</span>
                    </p>
                </div>
                <div class="cards">
                    <div class="card-list" v-if="userInfo.card.title">
                        <p class="title">营销名片</p>
                        <div class="desc">
                            <img src="../../assets/img/user/card.png" alt="">
                            <p class="name active" @click="handleLookCard(userInfo.profile.sid, userInfo.card.state)">
                                {{userInfo.card.title}}
                            </p>
                        </div>
                    </div>
                    <div class="card-list" v-for="item in userInfo.labels">
                        <p class="title" v-if="item === 'Author'">认证作家</p>
                        <p class="title" v-if="item === 'Employee'">员工认证</p>
                        <div class="desc">
                            <img src="../../assets/img/user/earth.png" alt="" v-if="item === 'Author'">
                            <img src="../../assets/img/user/employee.png" alt="" v-if="item === 'Employee'">
                            <p class="name">{{userInfo.profile.name}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="template" v-if="cardVisible" @click="cardVisible = false">
            <iframe :src="cardPath" frameborder="0" class="iframe" id="parDiv" width="307px" height="475px"></iframe>
        </div>
    </div>



</template>
<script>
    import { pubObj } from '../../assets/unit/public.js'
    export default {
        props: {
            // 来着哪里
            from: {
                type: String
            }
        },
        data() {
            return {
                userInfo: {
                    card: {},
                    profile: {},
                    userRegister: {},
                },
                cardDialog: false,
                cardPath: '',
                cardVisible: false,
            }
        },
        created(){
            this.getUserInfo();
        },
        methods: {
            getUserInfo(){    // 获取用户详情
                this.$http.get(`${this.$api.user}client/${this.$route.query.sid}`)
                    .then(result => {
                        if(result.body.code === 200){
                            this.userInfo = result.body.data;
                            if(!this.userInfo.card) this.userInfo.card = {};
                            if(!this.userInfo.profile) this.userInfo.profile = {};
                            if(!this.userInfo.userRegister) this.userInfo.userRegister = {};
                            if(this.from === 'all'){
                                this.getUserExtend();
                            }
                        }else {
                            this.$message.error(result.body.message);
                        }
                    })
            },
            // 获取用户扩展信息
            getUserExtend(){
                this.$http.post(['memberExtendBatch'], {userIds: [this.$route.query.sid]})
                    .then(result => {
                        if(result.body.code === 200){
                            let data = result.body.data;
                            this.userInfo.profile.growth = data[0].growth;
                            this.$set(this.userInfo.profile, 'gradeName', data[0].gradeName);
                        }
                    })
            },
            handleLookCard(sid, state) {    // 查看名片
                if(state === 'Used') {
                    this.cardPath = this.$api.cardWebShare + sid;
                    this.cardVisible = true;
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
            // 禁用或启用用户
            handleUser(type){
                let urlKey = '',
                    notice = '';
                if(type === 'Active'){
                    urlKey = 'userEnable';
                    notice = '确定启用？'
                }else if(type === 'Disabled'){
                    urlKey = 'userDisable';
                    notice = '确定禁用？'
                }
                this.$confirm(notice, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$http.put([urlKey, this.$route.query.sid])
                        .then(result => {
                            if(result.body.code === 200){
                                this.$message.success(result.body.message);
                                this.getUserInfo();
                            }else {
                                this.$message.error(result.body.message);
                            }
                        })
                });
            },
        }
    }
</script>
<style>
    .user-detail{
        width: 964px;
    }
    .user-detail .user-card{
        margin-top: 14px;
        margin-bottom: 14px;
        background: #f5f8fa;
        border: 1px solid #e4eaee;
        padding: 18px;
    }
    .user-detail .user-card .avatar{
        width: 120px;
        height: 120px;
        float: left;
        border: 1px solid #e4eaee;
    }
    .user-detail .user-card .avatar img{
        width: 100%;
        height: 100%;
    }
    .user-detail .user-card .right{
        margin-left: 26px;
        float: left;
        width: 780px;
    }
    .user-detail .user-card .right .col {
        float: left;
        font-size: 14px;
        width: 260px;
    }

    .user-detail .user-card .right .col .info-cell {
        font-size: 12px;
        margin-bottom: 12px;
    }

    .user-detail .user-card .right .col .info-cell:nth-last-child(1) {
        margin-bottom: 0;
    }

    .user-detail .user-card .right .col .info-title {
        display: inline-block;
        width: 70px;
        text-align: justify;
        text-align-last: justify;
        line-height: 24px;
        font-weight: 600;
    }
    .user-detail .user-card .right .col .info-content {
        display: inline-block;
        width: 170px;
        float: right;
        padding: 4px 0;
        line-height: 16px;
        margin-right: 20px;
    }
    .user-detail .user-card .right .cards{
        float: left;
        width: 100%;
        margin-top: 30px;
        display: flex;
    }
    .user-detail .user-card .card-list{
        border: 1px solid #e4eaee;
        background: #fff;
        width: 250px;
        padding: 10px 12px;
        margin-right: 15px;
    }
    .user-detail .user-card .card-list:nth-last-child(1){
        margin-right: 0;
    }
    .user-detail .user-card .card-list .title{
        color: #48576a;
        font-size: 14px;
        line-height: 16px;
        margin-bottom: 10px;
    }
    .user-detail .user-card .card-list .desc{
        display: flex;
    }
    .user-detail .user-card .card-list .desc img{
        width: 30px;
        height: 30px;
    }
    .user-detail .user-card .card-list .desc .name {
        font-size: 15px;
        line-height: 30px;
        margin-left: 10px;
    }
    .user-detail .user-card .card-list .desc .name.active {
        color: #20a0ff;
        cursor: pointer;
    }
    .user-detail .template {
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
    .user-detail .template .iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
