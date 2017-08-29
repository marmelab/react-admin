'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var USER_LOGIN = exports.USER_LOGIN = 'AOR/USER_LOGIN';
var USER_LOGIN_LOADING = exports.USER_LOGIN_LOADING = 'AOR/USER_LOGIN_LOADING';
var USER_LOGIN_FAILURE = exports.USER_LOGIN_FAILURE = 'AOR/USER_LOGIN_FAILURE';
var USER_LOGIN_SUCCESS = exports.USER_LOGIN_SUCCESS = 'AOR/USER_LOGIN_SUCCESS';

var userLogin = exports.userLogin = function userLogin(payload, pathName) {
    return {
        type: USER_LOGIN,
        payload: payload,
        meta: { auth: true, pathName: pathName }
    };
};

var USER_CHECK = exports.USER_CHECK = 'AOR/USER_CHECK';

var userCheck = exports.userCheck = function userCheck(payload, pathName) {
    return {
        type: USER_CHECK,
        payload: payload,
        meta: { auth: true, pathName: pathName }
    };
};

var USER_LOGOUT = exports.USER_LOGOUT = 'AOR/USER_LOGOUT';

var userLogout = exports.userLogout = function userLogout() {
    return {
        type: USER_LOGOUT,
        meta: { auth: true }
    };
};