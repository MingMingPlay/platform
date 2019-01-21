var merge = require('webpack-merge');
var webpack = require('webpack');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');

process.env.NODE_ENV = 'dev';


if(process.argv.indexOf('--define') !== -1){
    var target = process.argv[process.argv.indexOf('--define') + 1];
}


var projectConfig = require('./webpack.project.config');
var devConfig = require('./dev.config');

// 根据定义的参数来对应导出配置（数组）所在的位置
var index = null;
if(target === 'platform'){
    index = 0;
}else if(target === 'merchant'){
    index = 1;
}


var devServer = {
    devServer: {
        host: '0.0.0.0',
        port: '818' + index,
        disableHostCheck: true,
    }
};

var openBrowser = {
    plugins: [
        new openBrowserWebpackPlugin({
            url: 'http://localhost:'+ devServer.devServer.port +'/'
        }),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        // new webpack.NoEmitOnErrorsPlugin(),
    ]
};

projectConfig = merge(projectConfig[index], devConfig, devServer, openBrowser);


module.exports = projectConfig;

