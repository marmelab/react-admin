'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolveBrowserLocale = undefined;

var _index = require('./index');

var resolveBrowserLocale = exports.resolveBrowserLocale = function resolveBrowserLocale() {
    var defaultLocale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _index.DEFAULT_LOCALE;

    // from http://blog.ksol.fr/user-locale-detection-browser-javascript/
    // Rely on the window.navigator object to determine user locale
    var _window$navigator = window.navigator,
        language = _window$navigator.language,
        browserLanguage = _window$navigator.browserLanguage,
        userLanguage = _window$navigator.userLanguage;

    return (language || browserLanguage || userLanguage || defaultLocale).split('-')[0];
};