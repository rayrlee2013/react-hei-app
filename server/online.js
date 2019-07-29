import url from 'url';
import path from 'path';
import express from 'express';
import http from 'http';
import fs from 'fs';
import compression from 'compression';

const CONFIG = require('../conf/config');

const devURL = 'http://127.0.0.1:8081';

const urlParts = url.parse(devURL);

const app = express();
//gzip
app.use(compression());

CONFIG.static_dir.map((item) => {
    app.use(`/${item}`, express.static(path.join('build', item)));
});

app.use('*', (req, res, next) => {
    fs.readFile('./build/index.html', (err, data) => {
        if (err) {
            next(err);
        } else {
            res.set('content-type', 'text/html');
            res.send(data);
            res.end();
        }
    });
});

const server = http.createServer(app);

server.listen(urlParts.port, () => {
    console.log(`Listening at ${devURL}`);
});
