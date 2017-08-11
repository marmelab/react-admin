'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _Drawer = require('material-ui/Drawer');

var _Drawer2 = _interopRequireDefault(_Drawer);

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _muiThemeable = require('material-ui/styles/muiThemeable');

var _muiThemeable2 = _interopRequireDefault(_muiThemeable);

var _Responsive = require('./Responsive');

var _Responsive2 = _interopRequireDefault(_Responsive);

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getWidth = function getWidth(width) {
    return typeof width === 'number' ? width + 'px' : width;
};

var getStyles = function getStyles(_ref) {
    var drawer = _ref.drawer;

    var width = drawer && drawer.width ? getWidth(drawer.width) : '16em';

    return {
        sidebarOpen: {
            flex: '0 0 ' + width,
            marginLeft: 0,
            order: -1,
            transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        },
        sidebarClosed: {
            flex: '0 0 ' + width,
            marginLeft: '-' + width,
            order: -1,
            transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        }
    };
};

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object

var Sidebar = function (_PureComponent) {
    (0, _inherits3.default)(Sidebar, _PureComponent);

    function Sidebar() {
        var _ref2;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Sidebar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref2 = Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).call.apply(_ref2, [this].concat(args))), _this), _this.handleClose = function () {
            _this.props.setSidebarVisibility(false);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Sidebar, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                open = _props.open,
                setSidebarVisibility = _props.setSidebarVisibility,
                children = _props.children,
                muiTheme = _props.muiTheme;

            var styles = getStyles(muiTheme);

            return _react2.default.createElement(_Responsive2.default, {
                small: _react2.default.createElement(
                    _Drawer2.default,
                    { docked: false, open: open, onRequestChange: setSidebarVisibility },
                    _react2.default.cloneElement(children, { onMenuTap: this.handleClose })
                ),
                medium: _react2.default.createElement(
                    _Paper2.default,
                    { style: open ? styles.sidebarOpen : styles.sidebarClosed },
                    children
                )
            });
        }
    }]);
    return Sidebar;
}(_react.PureComponent);

Sidebar.propTypes = {
    children: _propTypes2.default.node.isRequired,
    muiTheme: _propTypes2.default.object.isRequired,
    open: _propTypes2.default.bool.isRequired,
    setSidebarVisibility: _propTypes2.default.func.isRequired
};

var mapStateToProps = function mapStateToProps(state, props) {
    return {
        open: state.admin.ui.sidebarOpen,
        locale: state.locale, // force redraw on locale change
        theme: props.theme // force redraw on theme changes
    };
};

exports.default = (0, _compose2.default)((0, _muiThemeable2.default)(), (0, _reactRedux.connect)(mapStateToProps, { setSidebarVisibility: _actions.setSidebarVisibility }))(Sidebar);
module.exports = exports['default'];