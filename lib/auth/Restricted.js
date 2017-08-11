'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Restricted = undefined;

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

var _reactRedux = require('react-redux');

var _authActions = require('../actions/authActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Restrict access to children
 *
 * Expects an authClient prop, which will be called with AUTH_CHECK upon mount and update
 *
 * Useful for Route components - used in CrudRoute
 *
 * @example
 * <Route path="/foo" render={routeParams =>
 *   <Restricted authClient={authClient} location={routeParams.location}>
 *     <Foo />
 *   </Restricted>
 * } />
 */
var Restricted = exports.Restricted = function (_Component) {
    (0, _inherits3.default)(Restricted, _Component);

    function Restricted() {
        (0, _classCallCheck3.default)(this, Restricted);
        return (0, _possibleConstructorReturn3.default)(this, (Restricted.__proto__ || Object.getPrototypeOf(Restricted)).apply(this, arguments));
    }

    (0, _createClass3.default)(Restricted, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.checkAuthentication(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.location !== this.props.location) {
                this.checkAuthentication(nextProps);
            }
        }
    }, {
        key: 'checkAuthentication',
        value: function checkAuthentication(params) {
            var userCheck = params.userCheck,
                authParams = params.authParams,
                location = params.location;

            userCheck(authParams, location && location.pathname);
        }

        // render the child even though the AUTH_CHECK isn't finished (optimistic rendering)

    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                rest = (0, _objectWithoutProperties3.default)(_props, ['children']);

            return _react2.default.cloneElement(children, rest);
        }
    }]);
    return Restricted;
}(_react.Component);

Restricted.propTypes = {
    authParams: _propTypes2.default.object,
    location: _propTypes2.default.object,
    userCheck: _propTypes2.default.func
};
exports.default = (0, _reactRedux.connect)(null, {
    userCheck: _authActions.userCheck
})(Restricted);