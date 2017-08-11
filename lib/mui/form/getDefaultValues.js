'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _reselect = require('reselect');

var _lodash = require('lodash.set');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDefaultValues = function getDefaultValues(children) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var globalDefaultValue = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    var defaultValueFromChildren = children.map(function (child) {
        return { source: child.props.source, defaultValue: child.props.defaultValue };
    }).reduce(function (prev, next) {
        if (next.defaultValue != null) {
            (0, _lodash2.default)(prev, next.source, typeof next.defaultValue === 'function' ? next.defaultValue() : next.defaultValue);
        }
        return prev;
    }, {});
    return (0, _extends3.default)({}, globalDefaultValue, defaultValueFromChildren, data);
};

var getChildren = function getChildren(state, props) {
    return props.children;
};
var getRecord = function getRecord(state, props) {
    return props.record;
};
var getDefaultValue = function getDefaultValue(state, props) {
    return props.defaultValue;
};

exports.default = (0, _reselect.createSelector)(getChildren, getRecord, getDefaultValue, function (children, record, defaultValue) {
    return getDefaultValues(_react.Children.toArray(children), record, defaultValue);
});
module.exports = exports['default'];