'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldTitle = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _translate = require('../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FieldTitle = exports.FieldTitle = function FieldTitle(_ref) {
    var resource = _ref.resource,
        source = _ref.source,
        label = _ref.label,
        isRequired = _ref.isRequired,
        translate = _ref.translate;
    return _react2.default.createElement(
        'span',
        null,
        typeof label !== 'undefined' ? translate(label, { _: label }) : typeof source !== 'undefined' ? translate('resources.' + resource + '.fields.' + source, { _: _inflection2.default.humanize(source) }) : '',
        isRequired && ' *'
    );
};

FieldTitle.propTypes = {
    isRequired: _propTypes2.default.bool,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string,
    label: _propTypes2.default.string,
    translate: _propTypes2.default.func.isRequired
};

FieldTitle.defaultProps = {
    translate: function translate(x) {
        return x;
    }
};

var enhance = (0, _compose2.default)(_pure2.default, _translate2.default);

exports.default = enhance(FieldTitle);