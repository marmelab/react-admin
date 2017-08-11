'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../i18n/index');

var _localeActions = require('../actions/localeActions');

exports.default = function () {
    var initialLocale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _index.DEFAULT_LOCALE;
    return function () {
        var previousLocale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialLocale;
        var _ref = arguments[1];
        var type = _ref.type,
            payload = _ref.payload;

        switch (type) {
            case _localeActions.CHANGE_LOCALE:
                return payload;
            default:
                return previousLocale;
        }
    };
};

module.exports = exports['default'];