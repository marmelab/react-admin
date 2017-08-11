'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CHANGE_LOCALE = exports.CHANGE_LOCALE = 'AOR/CHANGE_LOCALE';

var changeLocale = exports.changeLocale = function changeLocale(locale) {
    return {
        type: CHANGE_LOCALE,
        payload: locale
    };
};