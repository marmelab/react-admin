'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fetchActions = require('../actions/fetchActions');

var _authActions = require('../actions/authActions');

exports.default = function () {
    var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var _ref = arguments[1];
    var type = _ref.type;

    switch (type) {
        case _fetchActions.FETCH_START:
        case _authActions.USER_LOGIN_LOADING:
            return previousState + 1;
        case _fetchActions.FETCH_END:
        case _fetchActions.FETCH_ERROR:
        case _fetchActions.FETCH_CANCEL:
        case _authActions.USER_LOGIN_SUCCESS:
        case _authActions.USER_LOGIN_FAILURE:
            return Math.max(previousState - 1, 0);
        default:
            return previousState;
    }
};

module.exports = exports['default'];