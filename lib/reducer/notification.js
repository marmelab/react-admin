'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _notificationActions = require('../actions/notificationActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = {
    text: '',
    type: 'info' // one of 'info', 'confirm', 'warning'
};

exports.default = function () {
    var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var _ref = arguments[1];
    var type = _ref.type,
        payload = _ref.payload;

    switch (type) {
        case _notificationActions.SHOW_NOTIFICATION:
            return { text: payload.text, type: payload.type };
        case _notificationActions.HIDE_NOTIFICATION:
            return (0, _extends3.default)({}, previousState, { text: '' });
        default:
            return previousState;
    }
};

module.exports = exports['default'];