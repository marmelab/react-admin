const cypress = require('cypress');
const server = require('./server');

server.start().then(listeningServer => {
    // kick off a cypress run
    return cypress
        .run({
            browser: process.env.BROWSER || 'chrome',
            config: {
                baseUrl: 'http://localhost:8080',
                video: false,
            },
        })
        .then(results => {
            // stop your server when it's complete
            listeningServer.close();
            if (results.totalFailed > 0) {
                process.exit(1);
            }
        })
        .catch(() => {
            process.exit(1);
        });
});
