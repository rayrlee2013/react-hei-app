import url from 'url';
import express from 'express';
import webpack from 'webpack';
import path from 'path';
import http from 'http';
import compression from 'compression';
import chalk from 'chalk';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../conf/webpack.dev';

const devURL = 'http://127.0.0.1:8082';

const urlParts = url.parse(devURL);

const compiler = webpack(webpackConfig);

const app = express();

app.use(compression());
app.use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        version: false,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
    }
}));
app.use(webpackHotMiddleware(compiler));

app.get('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (error, result) => {
        if (error) {
            next(error);
        } else {
            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        }
    });
});

const server = http.createServer(app);
//server
server.listen(urlParts.port, () => {
    console.log(chalk.cyan(`Server and Webpack starting working：${devURL}`));
});
