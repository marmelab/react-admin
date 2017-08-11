'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _AppBar = require('material-ui/AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _muiThemeable = require('material-ui/styles/muiThemeable');

var _muiThemeable2 = _interopRequireDefault(_muiThemeable);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppBar = function AppBar(_ref) {
    var title = _ref.title,
        toggleSidebar = _ref.toggleSidebar;
    return _react2.default.createElement(_AppBar2.default, {
        title: title,
        onLeftIconButtonTouchTap: toggleSidebar
    });
};

AppBar.propTypes = {
    title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]).isRequired,
    toggleSidebar: _propTypes2.default.func.isRequired
};

var enhance = (0, _compose2.default)((0, _muiThemeable2.default)(), // force redraw on theme change
(0, _reactRedux.connect)(null, {
    toggleSidebar: _actions.toggleSidebar
}));

exports.default = enhance(AppBar);
module.exports = exports['default'];