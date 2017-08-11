'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DateField = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toLocaleStringSupportsLocales = function () {
    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    try {
        new Date().toLocaleString("i");
    } catch (error) {
        return error instanceof RangeError;
    }
    return false;
}();

/**
 * Display a date value as a locale string.
 *
 * Uses Intl.DateTimeFormat() if available, passing the locales and options props as arguments.
 * If Intl is not available, it outputs date as is (and ignores the locales and options props).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
 * @example
 * <DateField source="published_at" />
 * // renders the record { id: 1234, published_at: new Date('2012-11-07') } as
 * <span>07/11/2012</span>
 *
 * <DateField source="published_at" elStyle={{ color: 'red' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span style="color:red;">07/11/2012</span>
 *
 * <DateField source="share" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>Wednesday, November 7, 2012</span>
 *
 * <DateField source="price" locales="fr-FR" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
 * // renders the record { id: 1234, new Date('2012-11-07') } as
 * <span>mercredi 7 novembre 2012</span>
 */

var DateField = exports.DateField = function DateField(_ref) {
    var elStyle = _ref.elStyle,
        locales = _ref.locales,
        options = _ref.options,
        record = _ref.record,
        _ref$showTime = _ref.showTime,
        showTime = _ref$showTime === undefined ? false : _ref$showTime,
        source = _ref.source;

    if (!record) return null;
    var value = (0, _lodash2.default)(record, source);
    if (value == null) return null;
    var date = value instanceof Date ? value : new Date(value);
    var dateString = showTime ? toLocaleStringSupportsLocales ? date.toLocaleString(locales, options) : date.toLocaleString() : toLocaleStringSupportsLocales ? date.toLocaleDateString(locales, options) : date.toLocaleDateString();

    return _react2.default.createElement(
        'span',
        { style: elStyle },
        dateString
    );
};

DateField.propTypes = {
    addLabel: _propTypes2.default.bool,
    elStyle: _propTypes2.default.object,
    label: _propTypes2.default.string,
    locales: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
    options: _propTypes2.default.object,
    record: _propTypes2.default.object,
    showTime: _propTypes2.default.bool,
    source: _propTypes2.default.string.isRequired
};

var PureDateField = (0, _pure2.default)(DateField);

PureDateField.defaultProps = {
    addLabel: true
};

exports.default = PureDateField;