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

var _Labeled = require('../input/Labeled');

var _Labeled2 = _interopRequireDefault(_Labeled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tab = function Tab(_ref) {
    var label = _ref.label,
        icon = _ref.icon,
        children = _ref.children,
        rest = (0, _objectWithoutProperties3.default)(_ref, ['label', 'icon', 'children']);
    return _react2.default.createElement(
        'span',
        null,
        _react2.default.Children.map(children, function (field) {
            return field && _react2.default.createElement(
                'div',
                { key: field.props.source, style: field.props.style, className: 'aor-field-' + field.props.source },
                field.props.addLabel ? _react2.default.createElement(
                    _Labeled2.default,
                    (0, _extends3.default)({}, rest, {
                        label: field.props.label,
                        source: field.props.source
                    }),
                    field
                ) : typeof field.type === 'string' ? field : _react2.default.cloneElement(field, rest)
            );
        })
    );
};

exports.default = Tab;
module.exports = exports['default'];