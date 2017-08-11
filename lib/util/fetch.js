'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryParameters = exports.fetchJson = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _HttpError = require('./HttpError');

var _HttpError2 = _interopRequireDefault(_HttpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchJson = exports.fetchJson = function fetchJson(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var requestHeaders = options.headers || new Headers({
        Accept: 'application/json'
    });
    if (!(options && options.body && options.body instanceof FormData)) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    if (options.user && options.user.authenticated && options.user.token) {
        requestHeaders.set('Authorization', options.user.token);
    }

    return fetch(url, (0, _extends3.default)({}, options, { headers: requestHeaders })).then(function (response) {
        return response.text().then(function (text) {
            return {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: text
            };
        });
    }).then(function (_ref) {
        var status = _ref.status,
            statusText = _ref.statusText,
            headers = _ref.headers,
            body = _ref.body;

        var json = void 0;
        try {
            json = JSON.parse(body);
        } catch (e) {
            // not json, no big deal
        }
        if (status < 200 || status >= 300) {
            return Promise.reject(new _HttpError2.default(json && json.message || statusText, status));
        }
        return { status: status, headers: headers, body: body, json: json };
    });
};

var queryParameters = exports.queryParameters = function queryParameters(data) {
    return Object.keys(data).map(function (key) {
        return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
};