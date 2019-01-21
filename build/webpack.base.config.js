var path = require('path');
var webpack = require('webpack');

// 参数说明：
// commons 布尔值，是否抽离公共JS；默认要抽离，需要入口配置vendor；传false不抽取
function WebpackConfig(commons) {
    var config = {
        entry: {},
        output: {
            filename: 'js/[name].js?[hash:7]',
            chunkFilename: 'chunk/[name].js?[chunkhash:7]'
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.join(__dirname, '../src')
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ['babel-loader'],
                    include: /src/,
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[ext]?[hash:7]'
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'media/[name].[ext]?[hash:7]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]?[hash:7]'
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                PRODCUTION: JSON.stringify(process.env.NODE_ENV),
                LOCAL_PORT: JSON.stringify(process.env.LOCAL_PORT)
            }),
        ]
    };
    var commonChunk = new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
        minChunks: Infinity
    });

    if(commons !== false){
        config.plugins.push(commonChunk);
    }

    return config;
}

module.exports = WebpackConfig;
