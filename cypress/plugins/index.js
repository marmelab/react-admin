const wp = require('@cypress/webpack-preprocessor');
const task = require('cypress-skip-and-only-ui/task');

module.exports = on => {
    const options = {
        webpackOptions: require('../webpack.config'),
    };
    on('before:browser:launch', (browser = {}, args) => {
        if (browser.name === 'chrome') {
            return [
                ...args.filter(
                    arg => arg !== '--disable-blink-features=RootLayerScrolling'
                ),
                '--disable-gpu',
                '--proxy-bypass-list=<-loopback>',
            ];
        }
    });
    on('file:preprocessor', wp(options));

    on('task', task);
};
