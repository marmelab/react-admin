'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BooleanField = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

var _clear = require('material-ui/svg-icons/content/clear');

var _clear2 = _interopRequireDefault(_clear);

var _done = require('material-ui/svg-icons/action/done');

var _done2 = _interopRequireDefault(_done);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BooleanField = exports.BooleanField = function BooleanField(_ref) {
    var source = _ref.source,
        _ref$record = _ref.record,
        record = _ref$record === undefined ? {} : _ref$record,
        elStyle = _ref.elStyle;

    if ((0, _lodash2.default)(record, source) === false) {
        return _react2.default.createElement(_clear2.default, { style: elStyle });
    }

    if ((0, _lodash2.default)(record, source) === true) {
        return _react2.default.createElement(_done2.default, { style: elStyle });
    }

    return _react2.default.createElement('span', { style: elStyle });
};

BooleanField.propTypes = {
    addLabel: _propTypes2.default.bool,
    elStyle: _propTypes2.default.object,
    label: _propTypes2.default.string,
    record: _propTypes2.default.object,
    source: _propTypes2.default.string.isRequired
};

var PureBooleanField = (0, _pure2.default)(BooleanField);

PureBooleanField.defaultProps = {
    addLabel: true,
    elStyle: {
        display: 'block',
        margin: 'auto'
    }
};

exports.default = PureBooleanField;