'use strict';

const express = require('express');
const path = require('path');

let listeningServer;

before(() => {
    const server = express();
    server.use('/', express.static(path.join(__dirname, '../../example')));
    listeningServer = server.listen(8083);
});

after(() => {
    listeningServer.close();
});
