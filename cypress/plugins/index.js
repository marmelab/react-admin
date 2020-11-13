const wp = require('@cypress/webpack-preprocessor');

module.exports = on => {
    const options = {
        webpackOptions: require('../webpack.config'),
    };
    on('before:browser:launch', (browser = {}, launchOptions) => {
        // Fix for Cypress 4:
        // https://docs.cypress.io/api/plugins/browser-launch-api.html#Usage
        if (browser.name === 'chrome') {
            launchOptions.args.push(
                '--disable-blink-features=RootLayerScrolling'
            );
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--proxy-bypass-list=<-loopback>');
            return launchOptions;
        }
    });
    on('file:preprocessor', wp(options));
};
