const cypress = require('cypress');
const server = require('./server');

return server.start().then(listeningServer => {
    // kick off a cypress run
    return cypress
        .run({
            browser: 'chrome',
            config: {
                baseUrl: 'http://localhost:8080',
                video: false,
            },
        })
        .then(() => {
            // stop your server when it's complete
            return listeningServer.close();
        });
});
