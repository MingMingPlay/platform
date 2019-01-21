var webpack = require('webpack');
var ExtractWebpackPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                },
            },
            {
                test: /\.css$/,
                use: ExtractWebpackPlugin.extract({
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.scss$/,
                use: ExtractWebpackPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },
            {
                test: /\.sass$/,
                use: ExtractWebpackPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },
        ]
    },
    plugins: [
        new ExtractWebpackPlugin({
            filename: 'css/[name].css?[chunkhash:7]',
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        })
    ]
}
