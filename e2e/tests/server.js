import express from 'express';
import path from 'path';
import driver from '../chromeDriver';

let listeningServer;

before(
    () =>
        new Promise((resolve, reject) => {
            const server = express();
            server.use(
                '/',
                express.static(
                    path.join(__dirname, '../../examples/simple/dist')
                )
            );

            listeningServer = server.listen(8083, err => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        })
);

after(() => {
    listeningServer.close();
    return driver.quit();
});
