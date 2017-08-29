'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _dashboard = require('material-ui/svg-icons/action/dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _reactRouterDom = require('react-router-dom');

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DashboardMenuItem = function DashboardMenuItem(_ref) {
    var onTouchTap = _ref.onTouchTap,
        translate = _ref.translate;
    return _react2.default.createElement(_MenuItem2.default, {
        containerElement: _react2.default.createElement(_reactRouterDom.Link, { to: '/' }),
        primaryText: translate('aor.page.dashboard'),
        leftIcon: _react2.default.createElement(_dashboard2.default, null),
        onTouchTap: onTouchTap
    });
};

DashboardMenuItem.propTypes = {
    onTouchTap: _propTypes2.default.func,
    translate: _propTypes2.default.func.isRequired
};

exports.default = (0, _translate2.default)(DashboardMenuItem);
module.exports = exports['default'];