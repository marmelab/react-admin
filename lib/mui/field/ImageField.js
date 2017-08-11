'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageField = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    list: {
        display: 'flex',
        listStyleType: 'none'
    },
    image: {
        margin: '0.5rem',
        maxHeight: '10rem'
    }
};

var ImageField = exports.ImageField = function ImageField(_ref) {
    var _ref$elStyle = _ref.elStyle,
        elStyle = _ref$elStyle === undefined ? {} : _ref$elStyle,
        record = _ref.record,
        source = _ref.source,
        src = _ref.src,
        title = _ref.title;

    var sourceValue = (0, _lodash2.default)(record, source);
    if (!sourceValue) {
        return _react2.default.createElement('div', null);
    }

    if (Array.isArray(sourceValue)) {
        var style = (0, _extends3.default)({}, styles.list, elStyle);
        return _react2.default.createElement(
            'ul',
            { style: style },
            sourceValue.map(function (file, index) {
                var titleValue = (0, _lodash2.default)(file, title) || title;
                var srcValue = (0, _lodash2.default)(file, src) || title;

                return _react2.default.createElement(
                    'li',
                    { key: index },
                    _react2.default.createElement('img', {
                        alt: titleValue,
                        title: titleValue,
                        src: srcValue,
                        style: styles.image
                    })
                );
            })
        );
    }

    var titleValue = (0, _lodash2.default)(record, title) || title;

    return _react2.default.createElement(
        'div',
        { style: elStyle },
        _react2.default.createElement('img', {
            title: titleValue,
            alt: titleValue,
            src: sourceValue,
            style: styles.image
        })
    );
};

ImageField.propTypes = {
    elStyle: _propTypes2.default.object,
    record: _propTypes2.default.object,
    source: _propTypes2.default.string.isRequired,
    title: _propTypes2.default.string
};

exports.default = ImageField;