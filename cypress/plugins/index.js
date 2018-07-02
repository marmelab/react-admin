const wp = require('@cypress/webpack-preprocessor');

module.exports = on => {
    const options = {
        webpackOptions: require('../webpack.config'),
    };
    on('before:browser:launch', (browser = {}, args) => {
        if (browser.name === 'chrome') {
            args.push('--disable-gpu');
            return args;
        }
    });
    on('file:preprocessor', wp(options));
};
