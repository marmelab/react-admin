'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (resource) {
    return (0, _redux.combineReducers)({
        data: (0, _data2.default)(resource),
        list: (0, _list2.default)(resource)
    });
};

module.exports = exports['default'];