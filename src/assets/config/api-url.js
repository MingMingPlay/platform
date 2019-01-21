let [url, web, oldUrl] = ['', '', ''];
// 变量 LOCAL_PORT，PRODCUTION 来自 webpack

let prod = 'https://api.yuntujk.com';                   // 线网 api
let test234 = 'http://api.yuntujk.net:9000';          // 开发
let test233 = 'http://api.yuntujk.net:9001';          // 测试/预生产
let test236 = 'http://api.yuntujk.net:9002';          // 备用
let pressure = 'http://api.yuntujk.net';                // 压力测试
let webProd = 'http://m.yuntujk.com';                   // 线网 mobile 网址
let webTest234 = 'http://mobile.yuntujk.net:9000';    // 开发
let webTest233 = 'http://mobile.yuntujk.net:9001';    // 测试/预生产
let webTest236 = 'http://mobile.yuntujk.net:9002';    // 备用
let webPressure = 'http://api.yuntujk.net';             // 压力测试


let local = 'http://localhost:' + LOCAL_PORT;           // 主要提供给后台人员调试用
let old = 'http://www.yanwei365.com';                   // 老接口，主要是内容方面

if(PRODCUTION === 'prod'){
    url = prod;
    web = webProd;
    oldUrl = old;
}else if(PRODCUTION === 'test233') {
    url = test233;
    web = webTest233;
    oldUrl = old;
}else if(PRODCUTION === 'test234') {
    url = test234;
    web = webTest234;
    oldUrl = old;
}else if(PRODCUTION === 'test236') {
    url = test236;
    web = webTest236;
    oldUrl = old;
}else if(PRODCUTION === 'pressure') {
    url = pressure;
    web = webPressure;
    oldUrl = old;
}else if(PRODCUTION === 'local') {
    url = test234;
    web = webTest234;
    oldUrl = local;
}else {
    url = test234;
    web = webTest234;
    oldUrl = old;
}

// url 接口地址
// web 会用到的 web 网址
// oldUrl 老接口地址（主要是内容板块）

export default [url, web, oldUrl]
