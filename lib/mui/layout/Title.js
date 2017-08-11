'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _onlyUpdateForKeys = require('recompose/onlyUpdateForKeys');

var _onlyUpdateForKeys2 = _interopRequireDefault(_onlyUpdateForKeys);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Title = function Title(_ref) {
    var defaultTitle = _ref.defaultTitle,
        record = _ref.record,
        title = _ref.title,
        translate = _ref.translate;

    if (!title) {
        return _react2.default.createElement(
            'span',
            null,
            defaultTitle
        );
    }
    if (typeof title === 'string') {
        return _react2.default.createElement(
            'span',
            null,
            translate(title, { _: title })
        );
    }
    return _react2.default.cloneElement(title, { record: record });
};

Title.propTypes = {
    defaultTitle: _propTypes2.default.string.isRequired,
    record: _propTypes2.default.object,
    translate: _propTypes2.default.func.isRequired,
    title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element])
};

var enhance = (0, _compose2.default)(_translate2.default, (0, _onlyUpdateForKeys2.default)('defaultTitle', 'record', 'title'));

exports.default = enhance(Title);
module.exports = exports['default'];