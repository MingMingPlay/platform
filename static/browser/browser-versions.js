/**
 * 浏览器低版本提示
 */

window.onload = function () {
    var style = 'body,p{margin:0;padding:0}body{font-family:Microsoft YaHei,"微软雅黑"}a{text-decoration:none}.notice-wrap{position:absolute;left:0;top:0;width:100%;height:100%;background:#fff;min-width:900px}.browser-notice{width:800px;position:absolute;left:50%;top:50%;margin-left:-400px;margin-top:-215px}.browser-notice .top{width:100%;height:167px}.browser-notice .top img{width:188px;height:auto;float:left}.browser-notice .top .text{vertical-align:top;margin-top:46px;margin-left:60px;color:#4d4d4d;float:left}.browser-notice .top .text .title{font-size:20px;line-height:30px;font-weight:700}.browser-notice .top .text .desc{font-size:16px;line-height:24px;margin-top:15px}.browser-notice .bottom{width:100%;border:1px solid #83b0d9;border-radius:6px;overflow:hidden;margin-top:30px}.browser-notice .bottom .title{background:#e4f8ff;color:#15355c;font-size:15px;line-height:40px;border-bottom:1px solid #83b0d9;padding-left:10px}.browser-notice .bottom .browser-recommend{padding:30px 100px;text-align:center;height:89px}.browser-notice .bottom .item{float:left;width:195px}.browser-notice .bottom .item .icon{width:58px;height:59px;margin:0 auto;background:url(static/browser/browser-icon.png) no-repeat}.browser-notice .bottom .item .icon.chrome{background-position:right 0}.browser-notice .bottom .item .icon.b360{background-position:-100px 0}.browser-notice .bottom .item .icon.qq{background-position:left 0}.browser-notice .bottom .item .browser-name{font-size:15px;line-height:20px;margin-top:10px;color:#15355c}.browser-notice .bottom .tips{text-align:center;color:#15355c;font-size:15px;line-height:20px;margin-bottom:20px;width:100%}';

    var styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    if(styleNode.styleSheet){
        styleNode.styleSheet.cssText = style;
    }else {
        styleNode.innerHTML = style;
    }
    document.getElementsByTagName('head')[0].appendChild(styleNode);

    var docNode = '<div class="notice-wrap"><div class="browser-notice"><div class="top"><img src="static/browser/browser-error.png"><div class="text"><p class="title">啊噢，您的浏览器版本较低</p><p class="desc">为了保证良好的使用效果，建议您升级浏览器或下载以下浏览器访问系统</p></div></div><div class="bottom"><div class="title">建议使用的浏览器</div><div class="browser-recommend"><a class="item" href="http://www.google.cn/chrome/browser/desktop/index.html" target="_blank"><p class="icon chrome"></p><p class="browser-name">Chrome（谷歌浏览器）</p></a><a class="item" href="http://chrome.360.cn/" target="_blank"><p class="icon b360"></p><p class="browser-name">360浏览器</p></a><a class="item" href="http://browser.qq.com/" target="_blank"><p class="icon qq"></p><p class="browser-name">QQ浏览器</p></a></div><div class="tips">IE浏览器用户请升级至9.0及以上版本</div></div></div></div>';

    document.body.innerHTML = docNode;
};

