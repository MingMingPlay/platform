<template>
    <div>
        <div class="home-wrap">
            <div class="home-content">
                <div class="content-nav" :class="{'content-active':hasNotice}">
                    <span v-if="!hasNotice">暂无公告</span>
                    <a style="cursor: pointer;color:#20a0ff" 
                        v-if="visibleBack" @click="backHome" ><<返回</a>
                    <el-button type="primary" :loading="butLoading" 
                        @click="lookHistory" >查看历史公告</el-button>
                </div>
                <div v-if="hasNotice">
                    <div v-for="item in noticeList" class="content-con">
                        <p>
                            <img v-if="item.haveRead!==undefined&&!item.haveRead" 
                                src="../../assets/img/new.png" height="18" />
                            <span>发布时间：{{item.createdTime}}</span>
                            <span>公告名称：{{item.name}}</span>
                            <span>发布人：{{item.publisher}}</span>
                            <a v-if="item.existFile" 
                                :href="item.attachmentPath" download="" target="_blank">
                                <el-button type="primary">下载附件</el-button>
                            </a>
                        </p>
                        <div>
                            {{item.content}}
                        </div>
                    </div>
                </div>
                <list-pagination
                    :pagination="pagination"
                    @paginationChange="paginationChange">
                </list-pagination>
            </div>
            <!-- <img src="../../assets/img/merchant_home.png" alt="阅商机"> -->
        </div>
        <change-password
                :isVisible="isVisible"
                title="您是首次登录系统，建议您修改密码！"
                v-if="isFirstLogin === 'true' && isVisible"
                @cancel="changeValue">
        </change-password>
    </div>
</template>

<script>
    import ChangePassword from '../common/change-password.vue'
    import listPagination from '../common/list-pagination.vue'
    import api from '../../assets/config/m-api.js';
    export default {
        components: {
            ChangePassword,
            listPagination
        },
        data() {
            return {
                isFirstLogin: null,
                isVisible: true,
                hasNotice:false,
                visibleBack:false,
                noticeList:[],
                pagination:{
                    pageIndex: 1,
                    pageSize: 10,
                    totalRow:0
                },
                butLoading:false,
            }
        },
        created() {
            this.isFirstLogin = sessionStorage.firstLogin;
            this.getValidNotice();
        },
        methods: {
            //获取最新有效公告
            getValidNotice(){
                this.$http.get(['validNotice']).then(res=>{
                    console.log(res);
                    let noticies=res.data.data;
                    if(res.status===200){
                        this.noticeList=noticies;
                        this.hasNotice=noticies.length>0?true:false;
                    }
                },err=>{
                    console.log(err);
                })
            },
            changeValue(val) {
                this.isVisible = val;
            },
            handlePage(val){
                console.log(val)
            },
            //查看历史公告
            lookHistory(){
                this.hasNotice=true;
                this.visibleBack=true;
                this.butLoading=true;
                this.getHistoryNoticeList(this.pagination);
            },
            //返回
            backHome(){
                this.visibleBack=false;
                this.getValidNotice();
                let pagination=this.pagination;
                pagination.totalRow=0;
                this.pagination=pagination;
            },
            //分页数据改变
            paginationChange(pagination){
                this.getHistoryNoticeList(pagination);
            },
            //获取历史公告
            getHistoryNoticeList(pagination){
                this.$http.get(['historyNotice'],{params:pagination}).then(res=>{
                    console.log(res);
                    if(res.status===200){
                        this.noticeList=res.data.data;
                        this.butLoading=false;
                        this.pagination=res.data.pagination||this.pagination;
                    }
                },err=>{
                    console.log(err);
                })
            },
        }
    }
</script>
<style>
    @media screen and (min-width: 1450px) {
        .home-content{
            width: 80% !important;
        }
    }
    .home-wrap{
        width: 900px;
        margin: 0 auto;
        padding-top: 100px;
        min-height: 520px;
        background: url('../../assets/img/merchant_home.png');
    }
    .home-wrap img{
        max-width: 100%;
    }
    .home-content{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 38px;
        margin-top: 15px;
        padding-bottom: 25px;
        z-index: 100;
    }
    .home-content .content-nav{
        height: 38px;
        line-height: 38px;
        padding: 0px 15px;
        border: 1px solid #f2a4a4;
        background: #f4dcdc;
    }
    .content-nav button{
        float: right;
        margin-top: 5px;
    }
    .content-active{
        border: none !important;
        background:white !important;
    }
    .content-con{
        background: #f4dcdc;
        margin-top: 10px;
    }
    .content-con>p{
        padding: 5px 15px;
        border: 1px solid #f2a4a4;
        height: 35px;
    }
    .content-con>p>span{
        margin-right: 55px;
        vertical-align: baseline;
    }
    .content-con button{
        float: right;
        margin-top: -2.5px;
    }
    .content-con>div{
        border: 1px solid #f2a4a4;
        border-top: none;
        padding: 10px 15px;
    }

</style>