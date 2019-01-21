<template>
    <div id="m_404" class="m_404">
        <img src="../assets/img/m_404/m_404.png" alt="404" />
        <div class="m_404_message">很抱歉，您访问的页面离家出走了<br/>去别的地方看看吧～</div>
        <div class="nav container">
            <div class="refresh" @click="refresh">
                <img src="../assets/img/m_404/refresh.png" alt="" />
                <span>刷新页面</span>
            </div>
            <div class="back" @click="goBack">
                <img src="../assets/img/m_404/back.png" alt="" />
                <span>返回上页</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "m_404",
        methods: {
            goBack () {
                this.$router.go(-1)
            },
            refresh () {
                window.location.reload();
            }
        }
    }
</script>

<style scoped>
    .container:before,
    .container:after {
        display: table;
        content: " ";
    }
    .container:after {
        clear: both;
    }
    .m_404{
        width: 518px;
        margin: 0 auto;
        padding-top: 264px;
    }
    .m_404_message{
        width: 350px;
        margin: 50px auto 90px auto;
        text-align: center;
        font-size: 22px;
        color: #8c8c8c;
        line-height: 30px;
    }
    .nav{
        width: 350px;
        margin: 0 auto;
        font-size: 20px;
        color: #006cb7;
    }
    .refresh{
        float: left;
        line-height: 40px;
        height: 40px;
        cursor: pointer;
    }
    .refresh img{
        vertical-align: middle;
        margin-right: 8px;
        height: 25px;
        width: 24px;
    }
    .back{
        float: right;
        line-height: 40px;
        height: 40px;
        cursor: pointer;
    }
    .back img{
        vertical-align: middle;
        margin-right: 8px;
        height: 26px;
        width: 24px;
    }
</style>
