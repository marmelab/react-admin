const cypress = require('cypress');
const server = require('./server');

return server.start().then(listeningServer => {
    // kick off a cypress run
    return cypress
        .run({
            // TODO: Revert this to "chrome" when https://github.com/cypress-io/cypress/issues/2037 is fixed
            browser: 'electron',
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
        });
});
