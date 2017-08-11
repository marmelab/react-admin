'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

var _Chip = require('material-ui/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChipField = function ChipField(_ref) {
    var source = _ref.source,
        _ref$record = _ref.record,
        record = _ref$record === undefined ? {} : _ref$record,
        _ref$elStyle = _ref.elStyle,
        elStyle = _ref$elStyle === undefined ? { margin: 4 } : _ref$elStyle;
    return _react2.default.createElement(
        _Chip2.default,
        { style: elStyle },
        (0, _lodash2.default)(record, source)
    );
};

ChipField.propTypes = {
    addLabel: _propTypes2.default.bool,
    elStyle: _propTypes2.default.object,
    label: _propTypes2.default.string,
    source: _propTypes2.default.string.isRequired,
    record: _propTypes2.default.object
};

var PureChipField = (0, _pure2.default)(ChipField);

PureChipField.defaultProps = {
    addLabel: true
};

exports.default = PureChipField;
module.exports = exports['default'];