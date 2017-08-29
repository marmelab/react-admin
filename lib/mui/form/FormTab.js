'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormField = require('./FormField');

var _FormField2 = _interopRequireDefault(_FormField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormTab = function FormTab(_ref) {
    var label = _ref.label,
        icon = _ref.icon,
        children = _ref.children,
        rest = (0, _objectWithoutProperties3.default)(_ref, ['label', 'icon', 'children']);
    return _react2.default.createElement(
        'span',
        null,
        _react2.default.Children.map(children, function (input) {
            return input && _react2.default.createElement(
                'div',
                { key: input.props.source, style: input.props.style, className: 'aor-input-' + input.props.source },
                _react2.default.createElement(_FormField2.default, (0, _extends3.default)({ input: input }, rest))
            );
        })
    );
};

exports.default = FormTab;
module.exports = exports['default'];