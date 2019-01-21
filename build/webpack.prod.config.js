var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ora = require('ora');
var chalk = require('chalk');


var argv = process.argv.splice(2);
var params = {};
argv.forEach((value, index) => {
    if (index % 2 === 0) {
        params[value] = argv[index + 1]
    }
});

process.env.NODE_ENV = params.env || 'test234';
process.env.LOCAL_PORT = params.port || 8080;
process.env.MODULE = params.m || '';

// 放在定义环境变量之后
var projectConfig = require('./webpack.project.config');
var prodConfig = require('./prod.config');

projectConfig = projectConfig.map(value => {
    return merge(value, prodConfig)
});

var spinner = ora('building for '+ process.env.NODE_ENV +'...')
spinner.start();

webpack(projectConfig, (err, stats) => {
    spinner.stop();

    if (err) throw err;
    console.log(stats.toString({
        chunks: false,  // 使构建过程更静默无输出
        colors: true,    // 在控制台展示颜色
        modules: false,
    }));

    console.log(chalk.green('\n  Build successful.'));
    console.log(chalk.yellow('\n  Build complete.\n'));
});


