import express from 'express';
import path from 'path';
import driver from '../chromeDriver';

let listeningServer;

before(() => {
    const server = express();
    server.use('/', express.static(path.join(__dirname, '../../example')));
    listeningServer = server.listen(8083);
});

after(async () => {
    listeningServer.close();
    return driver.quit();
});
