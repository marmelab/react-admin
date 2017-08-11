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

var _AppBar = require('material-ui/AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _muiThemeable = require('material-ui/styles/muiThemeable');

var _muiThemeable2 = _interopRequireDefault(_muiThemeable);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = {
    bar: {
        height: '3em',
        position: 'absolute',
        top: 0
    },
    title: {
        fontSize: '1.25em',
        lineHeight: '2.5em'
    },
    icon: {
        marginTop: 0,
        marginRight: 0,
        marginLeft: '-24px'
    },
    link: {
        color: '#fff',
        textDecoration: 'none'
    }
};

var AppBarMobile = function (_Component) {
    (0, _inherits3.default)(AppBarMobile, _Component);

    function AppBarMobile() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, AppBarMobile);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = AppBarMobile.__proto__ || Object.getPrototypeOf(AppBarMobile)).call.apply(_ref, [this].concat(args))), _this), _this.handleLeftIconButtonTouchTap = function (event) {
            event.preventDefault();
            _this.props.toggleSidebar();
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(AppBarMobile, [{
        key: 'render',
        value: function render() {
            var title = this.props.title;

            return _react2.default.createElement(_AppBar2.default, {
                style: style.bar,
                titleStyle: style.title,
                iconStyleLeft: style.icon,
                title: title,
                onLeftIconButtonTouchTap: this.handleLeftIconButtonTouchTap
            });
        }
    }]);
    return AppBarMobile;
}(_react.Component);

AppBarMobile.propTypes = {
    title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]).isRequired,
    toggleSidebar: _propTypes2.default.func.isRequired
};

var enhance = (0, _compose2.default)((0, _muiThemeable2.default)(), // force redraw on theme change
(0, _reactRedux.connect)(null, {
    toggleSidebar: _actions.toggleSidebar
}));

exports.default = enhance(AppBarMobile);
module.exports = exports['default'];