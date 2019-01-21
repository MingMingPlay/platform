 开发环境：
 cnpm run p     =>  云平台 入口 platform.js
 cnpm run m     =>  阅商机

 生产环境：
 cnpm run build

 生产环境可以接收以下参数：
 env：local,test234,prod,mirror
 port：8080
 m：模块名（文件夹名），多个用逗号隔开，如 m merchant,platform

 env 值说明：
    local    => 一般用于Java调试本地代码，可以配合 port 使用
    test233  => 部署测试环境（预生产）
    test234  => 部署开发环境
    prod     => 部署线网环境

 env 默认为 test234
 port 仅在 env 为 local 的时候有用，其他情况无效，默认为8080

 ex：
    cnpm run build env local port 8089 m merchant
    必须严格按照这种格式 key value 否则无效

测试账号：admin 123456 云平台
		 小丫 123456 阅商机
