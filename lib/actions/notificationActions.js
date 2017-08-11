'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var SHOW_NOTIFICATION = exports.SHOW_NOTIFICATION = 'AOR/SHOW_NOTIFICATION';

var showNotification = exports.showNotification = function showNotification(text) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
    return {
        type: SHOW_NOTIFICATION,
        payload: { text: text, type: type }
    };
};

var HIDE_NOTIFICATION = exports.HIDE_NOTIFICATION = 'AOR/HIDE_NOTIFICATION';

var hideNotification = exports.hideNotification = function hideNotification() {
    return {
        type: HIDE_NOTIFICATION
    };
};