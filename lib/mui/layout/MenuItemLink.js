'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MenuItemLinkComponent = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuItemLinkComponent = exports.MenuItemLinkComponent = function (_Component) {
    (0, _inherits3.default)(MenuItemLinkComponent, _Component);

    function MenuItemLinkComponent() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, MenuItemLinkComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = MenuItemLinkComponent.__proto__ || Object.getPrototypeOf(MenuItemLinkComponent)).call.apply(_ref, [this].concat(args))), _this), _this.handleMenuTap = function () {
            _this.props.history.push(_this.props.to);
            _this.props.onTouchTap();
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(MenuItemLinkComponent, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                history = _props.history,
                match = _props.match,
                location = _props.location,
                staticContext = _props.staticContext,
                props = (0, _objectWithoutProperties3.default)(_props, ['history', 'match', 'location', 'staticContext']); // eslint-disable-line

            return _react2.default.createElement(_MenuItem2.default, (0, _extends3.default)({}, props, {
                onTouchTap: this.handleMenuTap
            }));
        }
    }]);
    return MenuItemLinkComponent;
}(_react.Component);

MenuItemLinkComponent.propTypes = {
    history: _propTypes2.default.object.isRequired,
    onTouchTap: _propTypes2.default.func.isRequired,
    to: _propTypes2.default.string.isRequired
};
exports.default = (0, _reactRouter.withRouter)(MenuItemLinkComponent);