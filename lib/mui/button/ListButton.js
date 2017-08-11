'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _list = require('material-ui/svg-icons/action/list');

var _list2 = _interopRequireDefault(_list);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListButton = function ListButton(_ref) {
    var _ref$basePath = _ref.basePath,
        basePath = _ref$basePath === undefined ? '' : _ref$basePath,
        _ref$label = _ref.label,
        label = _ref$label === undefined ? 'aor.action.list' : _ref$label,
        translate = _ref.translate;
    return _react2.default.createElement(_FlatButton2.default, {
        primary: true,
        label: label && translate(label),
        icon: _react2.default.createElement(_list2.default, null),
        containerElement: _react2.default.createElement(_reactRouterDom.Link, { to: basePath }),
        style: { overflow: 'inherit' }
    });
};

ListButton.propTypes = {
    basePath: _propTypes2.default.string,
    label: _propTypes2.default.string,
    translate: _propTypes2.default.func.isRequired
};

exports.default = (0, _translate2.default)(ListButton);
module.exports = exports['default'];