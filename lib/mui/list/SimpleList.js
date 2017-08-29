'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _List = require('material-ui/List');

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tertiaryStyle = { float: 'right', opacity: 0.541176 };

var SimpleList = function SimpleList(_ref) {
    var ids = _ref.ids,
        data = _ref.data,
        basePath = _ref.basePath,
        primaryText = _ref.primaryText,
        secondaryText = _ref.secondaryText,
        secondaryTextLines = _ref.secondaryTextLines,
        tertiaryText = _ref.tertiaryText,
        leftAvatar = _ref.leftAvatar,
        leftIcon = _ref.leftIcon,
        rightAvatar = _ref.rightAvatar,
        rightIcon = _ref.rightIcon;
    return _react2.default.createElement(
        _List.List,
        null,
        ids.map(function (id) {
            return _react2.default.createElement(_List.ListItem, {
                key: id,
                primaryText: _react2.default.createElement(
                    'div',
                    null,
                    primaryText(data[id], id),
                    tertiaryText && _react2.default.createElement(
                        'span',
                        { style: tertiaryStyle },
                        tertiaryText(data[id], id)
                    )
                ),
                secondaryText: secondaryText && secondaryText(data[id], id),
                secondaryTextLines: secondaryTextLines,
                leftAvatar: leftAvatar && leftAvatar(data[id], id),
                leftIcon: leftIcon && leftIcon(data[id], id),
                rightAvatar: rightAvatar && rightAvatar(data[id], id),
                rightIcon: rightIcon && rightIcon(data[id], id),
                containerElement: _react2.default.createElement(_reactRouterDom.Link, { to: basePath + '/' + id })
            });
        })
    );
};

SimpleList.propTypes = {
    ids: _propTypes2.default.array,
    data: _propTypes2.default.object,
    basePath: _propTypes2.default.string,
    primaryText: _propTypes2.default.func,
    secondaryText: _propTypes2.default.func,
    secondaryTextLines: _propTypes2.default.number,
    tertiaryText: _propTypes2.default.func,
    leftAvatar: _propTypes2.default.func,
    leftIcon: _propTypes2.default.func,
    rightAvatar: _propTypes2.default.func,
    rightIcon: _propTypes2.default.func
};

exports.default = SimpleList;
module.exports = exports['default'];