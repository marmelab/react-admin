'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _redux = require('redux');

var _resource = require('./resource');

var _resource2 = _interopRequireDefault(_resource);

var _loading = require('./loading');

var _loading2 = _interopRequireDefault(_loading);

var _notification = require('./notification');

var _notification2 = _interopRequireDefault(_notification);

var _references = require('./references');

var _references2 = _interopRequireDefault(_references);

var _saving = require('./saving');

var _saving2 = _interopRequireDefault(_saving);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (resources) {
    var resourceReducers = {};
    resources.forEach(function (resource) {
        resourceReducers[resource.name] = (0, _resource2.default)(resource.name, resource.options);
    });
    return (0, _redux.combineReducers)((0, _extends3.default)({}, resourceReducers, {
        loading: _loading2.default,
        notification: _notification2.default,
        references: _references2.default,
        saving: _saving2.default,
        ui: _ui2.default
    }));
};

module.exports = exports['default'];