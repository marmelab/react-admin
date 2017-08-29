'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileField = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FileField = exports.FileField = function FileField(_ref) {
    var elStyle = _ref.elStyle,
        record = _ref.record,
        source = _ref.source,
        title = _ref.title,
        src = _ref.src;

    var sourceValue = (0, _lodash2.default)(record, source);

    if (!sourceValue) {
        return _react2.default.createElement('div', null);
    }

    if (Array.isArray(sourceValue)) {
        return _react2.default.createElement(
            'ul',
            { style: elStyle },
            sourceValue.map(function (file, index) {
                var titleValue = (0, _lodash2.default)(file, title) || title;
                var srcValue = (0, _lodash2.default)(file, src) || title;

                return _react2.default.createElement(
                    'li',
                    { key: index },
                    _react2.default.createElement(
                        'a',
                        {
                            href: srcValue,
                            title: titleValue
                        },
                        titleValue
                    )
                );
            })
        );
    }

    var titleValue = (0, _lodash2.default)(record, title) || title;

    return _react2.default.createElement(
        'div',
        { style: elStyle },
        _react2.default.createElement(
            'a',
            {
                href: sourceValue,
                title: titleValue
            },
            titleValue
        )
    );
};

FileField.propTypes = {
    elStyle: _propTypes2.default.object,
    record: _propTypes2.default.object,
    source: _propTypes2.default.string.isRequired,
    src: _propTypes2.default.string,
    title: _propTypes2.default.string
};

FileField.defaultProps = {
    elStyle: { display: 'inline-block' }
};

exports.default = FileField;