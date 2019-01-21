const IEVersion=function() {
    const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    const isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        const fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6; //IE版本<=7
        }
    } else if (isEdge) {
        return 'edge'; //edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1; //不是ie浏览器
    }
}

//解决ie10+下载不正常的问题
const IEDownload=function(that,blob,fileName){
    if(IEVersion()===-1){
        return false;
    }else if(IEVersion()>=10){
        navigator.msSaveOrOpenBlob(blob, fileName);
        return true;
    }else{
        that.$message({
            showClose: true,
            message: '您的IE浏览器不兼容，请升级版本到10+！',
            type: 'warning'
        })
    }
}


export {IEVersion,IEDownload}