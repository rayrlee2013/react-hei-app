/**
 * Created by Rayr Lee on 2017/2/6.
 */

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const {assign} = Object;

const os = require('os'), happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

const HAPPY_CONF = {
    threadPool: happyThreadPool,
    debug: true
};

const webpackConfig = {
    mode: 'development',
    entry: ['webpack-hot-middleware/client?reload=true', './src/app.js'],
    output: {
        path: path.resolve(__dirname, '../dev'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: '/'
    },
    resolve: {
        modules: [path.resolve(__dirname, '../src'), 'node_modules'],
        alias: require('./alias')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['react-hot-loader/babel']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['happypack/loader?id=css']
            },
            {
                test: /\.scss$/,
                use: ['happypack/loader?id=scss']
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'html-loader'

            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|svg|eot|ttf|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'fonts/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                base: {
                    chunks: 'initial',
                    name: 'base',
                    minChunks: 1,
                    minSize: 30000,
                    maxAsyncRequests: 5,
                    maxInitialRequests: Infinity
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: path.resolve(__dirname, '../dev/index.html'),
            inject: 'body'
        }),
        new HappyPack(assign(HAPPY_CONF, {
            id: 'css',
            loaders: ['style-loader', 'css-loader']
        })),
        new HappyPack(assign(HAPPY_CONF, {
            id: 'scss',
            loaders: ['style-loader', 'css-loader', 'sass-loader']
        })),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

export default webpackConfig;