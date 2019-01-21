var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var baseConfig = require('./webpack.base.config');

// ------------ platform配置 -----------------
// platform公共插件
var platformVendor = [
    'vue',
    'vue-router',
    'element-ui',
    'vue-resource',
    'vue-ueditor',
    'vuex',
];

var prodPlatformConfig = {
    entry: {
        index: path.join(__dirname, '../src/pages/platform.js'),
        vendor: platformVendor
    },
    output: {
        path: path.join(__dirname, process.env.NODE_ENV === 'dev' ? '../dist/' : '../dist/platform'),
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: path.join(__dirname, '../src/index.html'),
            inject: 'body',
            title: '云平台',
            favicon: './favicon.ico',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            }
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: path.resolve(__dirname, process.env.NODE_ENV === 'dev' ? '../dist/static' : '../dist/platform/static'),
            toType: 'dir'
        }])
    ]
};

var platformConfig = merge(baseConfig(), prodPlatformConfig);
// ------------ platform配置 end -------------


// ------------ merchant配置 -----------------
// merchant公共插件
var merchantVendor = [
    'vue',
    'vue-router',
    'element-ui',
    'vue-resource',
    'vue-ueditor',
    'vuex',
];

var prodMerchantConfig = {
    entry: {
        index: path.join(__dirname, '../src/pages/merchant.js'),
        vendor: merchantVendor
    },
    output: {
        path: path.join(__dirname, process.env.NODE_ENV === 'dev' ? '../dist/' : '../dist/merchant'),
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: path.join(__dirname, '../src/index.html'),
            inject: 'body',
            title: '阅商机',
            favicon: './favicon.ico',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            }
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: path.resolve(__dirname, process.env.NODE_ENV === 'dev' ? '../dist/static' : '../dist/merchant/static'),
            toType: 'dir'
        }])
    ]
};

var merchantConfig = merge(baseConfig(), prodMerchantConfig);
// ------------ merchant配置 end -------------


var obj = {
    'platform': platformConfig,
    'merchant': merchantConfig,
};

var arr = [];

if(process.env.MODULE){
    var moduleArr = process.env.MODULE.split(',');
    for(var i=0;i<moduleArr.length;i++){
        arr.push(obj[moduleArr[i]]);
    }
}else {
    for(var key in obj){
        arr.push(obj[key]);
    }
}

module.exports = arr;
