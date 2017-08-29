'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = {
    sidebarOpen: false
};

exports.default = function () {
    var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var _ref = arguments[1];
    var type = _ref.type,
        payload = _ref.payload;

    switch (type) {
        case _actions.TOGGLE_SIDEBAR:
            return (0, _extends3.default)({}, previousState, { sidebarOpen: !previousState.sidebarOpen });
        case _actions.SET_SIDEBAR_VISIBILITY:
            return (0, _extends3.default)({}, previousState, { sidebarOpen: payload });
        default:
            return previousState;
    }
};

module.exports = exports['default'];