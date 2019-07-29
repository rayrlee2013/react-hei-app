/**
 * Created by Rayr Lee on 2018/4/17.
 */

import url from 'url';
import express from 'express';
import http from 'http';
import fs from 'fs';
import compression from 'compression';

const devURL = 'http://127.0.0.1:8081';

const urlParts = url.parse(devURL);

const app = express();
//gzip
app.use(compression());

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

let server = http.createServer(app);

server.listen(urlParts.port, () => {
    console.log(`Listening at ${devURL}`);
});
