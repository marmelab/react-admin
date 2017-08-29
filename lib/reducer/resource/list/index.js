'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _ids = require('./ids');

var _ids2 = _interopRequireDefault(_ids);

var _params = require('./params');

var _params2 = _interopRequireDefault(_params);

var _total = require('./total');

var _total2 = _interopRequireDefault(_total);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (resource) {
    return (0, _redux.combineReducers)({
        ids: (0, _ids2.default)(resource),
        params: (0, _params2.default)(resource),
        total: (0, _total2.default)(resource)
    });
};

module.exports = exports['default'];