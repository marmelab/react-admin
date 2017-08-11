'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleShowLayout = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Labeled = require('../input/Labeled');

var _Labeled2 = _interopRequireDefault(_Labeled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultStyle = { padding: '0 1em 1em 1em' };
var SimpleShowLayout = exports.SimpleShowLayout = function SimpleShowLayout(_ref) {
    var basePath = _ref.basePath,
        children = _ref.children,
        record = _ref.record,
        resource = _ref.resource,
        _ref$style = _ref.style,
        style = _ref$style === undefined ? defaultStyle : _ref$style;
    return _react2.default.createElement(
        'div',
        { style: style },
        _react.Children.map(children, function (field) {
            return _react2.default.createElement(
                'div',
                { key: field.props.source, style: field.props.style, className: 'aor-field-' + field.props.source },
                field.props.addLabel ? _react2.default.createElement(
                    _Labeled2.default,
                    { record: record, resource: resource, basePath: basePath, label: field.props.label, source: field.props.source, disabled: false },
                    field
                ) : typeof field.type === 'string' ? field : _react2.default.cloneElement(field, { record: record, resource: resource, basePath: basePath })
            );
        })
    );
};

SimpleShowLayout.propTypes = {
    basePath: _propTypes2.default.string,
    children: _propTypes2.default.node,
    record: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    style: _propTypes2.default.object
};

exports.default = SimpleShowLayout;