'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _FieldTitle = require('../../util/FieldTitle');

var _FieldTitle2 = _interopRequireDefault(_FieldTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LongTextInput = function LongTextInput(_ref) {
    var input = _ref.input,
        isRequired = _ref.isRequired,
        label = _ref.label,
        _ref$meta = _ref.meta,
        touched = _ref$meta.touched,
        error = _ref$meta.error,
        options = _ref.options,
        source = _ref.source,
        elStyle = _ref.elStyle,
        resource = _ref.resource;
    return _react2.default.createElement(_TextField2.default, (0, _extends3.default)({}, input, {
        multiLine: true,
        fullWidth: true,
        floatingLabelText: _react2.default.createElement(_FieldTitle2.default, { label: label, source: source, resource: resource, isRequired: isRequired }),
        errorText: touched && error,
        style: elStyle
    }, options));
};

LongTextInput.propTypes = {
    addField: _propTypes2.default.bool.isRequired,
    elStyle: _propTypes2.default.object,
    input: _propTypes2.default.object,
    isRequired: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    meta: _propTypes2.default.object,
    name: _propTypes2.default.string,
    options: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string,
    validate: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.arrayOf(_propTypes2.default.func)])
};

LongTextInput.defaultProps = {
    addField: true,
    options: {}
};

exports.default = LongTextInput;
module.exports = exports['default'];