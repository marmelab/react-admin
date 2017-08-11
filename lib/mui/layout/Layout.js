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

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _autoprefixer = require('material-ui/utils/autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _withWidth = require('material-ui/utils/withWidth');

var _withWidth2 = _interopRequireDefault(_withWidth);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _AdminRoutes = require('../../AdminRoutes');

var _AdminRoutes2 = _interopRequireDefault(_AdminRoutes);

var _AppBar = require('./AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _Sidebar = require('./Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _Notification = require('./Notification');

var _Notification2 = _interopRequireDefault(_Notification);

var _defaultTheme = require('../defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactTapEventPlugin2.default)();

var styles = {
    wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflowY: 'hidden',
        overflowX: 'scroll'
    },
    bodySmall: {
        backgroundColor: '#fff'
    },
    content: {
        flex: 1,
        padding: '2em'
    },
    contentSmall: {
        flex: 1,
        paddingTop: '3em'
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200
    }
};

var prefixedStyles = {};

var Layout = function (_Component) {
    (0, _inherits3.default)(Layout, _Component);

    function Layout() {
        (0, _classCallCheck3.default)(this, Layout);
        return (0, _possibleConstructorReturn3.default)(this, (Layout.__proto__ || Object.getPrototypeOf(Layout)).apply(this, arguments));
    }

    (0, _createClass3.default)(Layout, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            if (this.props.width !== 1) {
                this.props.setSidebarVisibility(true);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                authClient = _props.authClient,
                customRoutes = _props.customRoutes,
                dashboard = _props.dashboard,
                isLoading = _props.isLoading,
                menu = _props.menu,
                resources = _props.resources,
                theme = _props.theme,
                title = _props.title,
                width = _props.width;

            var muiTheme = (0, _getMuiTheme2.default)(theme);
            if (!prefixedStyles.main) {
                // do this once because user agent never changes
                var prefix = (0, _autoprefixer2.default)(muiTheme);
                prefixedStyles.wrapper = prefix(styles.wrapper);
                prefixedStyles.main = prefix(styles.main);
                prefixedStyles.body = prefix(styles.body);
                prefixedStyles.bodySmall = prefix(styles.bodySmall);
                prefixedStyles.content = prefix(styles.content);
                prefixedStyles.contentSmall = prefix(styles.contentSmall);
            }
            return _react2.default.createElement(
                _MuiThemeProvider2.default,
                { muiTheme: muiTheme },
                _react2.default.createElement(
                    'div',
                    { style: prefixedStyles.wrapper },
                    _react2.default.createElement(
                        'div',
                        { style: prefixedStyles.main },
                        width !== 1 && _react2.default.createElement(_AppBar2.default, { title: title }),
                        _react2.default.createElement(
                            'div',
                            { className: 'body', style: width === 1 ? prefixedStyles.bodySmall : prefixedStyles.body },
                            _react2.default.createElement(
                                'div',
                                { style: width === 1 ? prefixedStyles.contentSmall : prefixedStyles.content },
                                _react2.default.createElement(_AdminRoutes2.default, {
                                    customRoutes: customRoutes,
                                    resources: resources,
                                    authClient: authClient,
                                    dashboard: dashboard
                                })
                            ),
                            _react2.default.createElement(
                                _Sidebar2.default,
                                { theme: theme },
                                menu
                            )
                        ),
                        _react2.default.createElement(_Notification2.default, null),
                        isLoading && _react2.default.createElement(_CircularProgress2.default, {
                            className: 'app-loader',
                            color: '#fff',
                            size: width === 1 ? 20 : 30,
                            thickness: 2,
                            style: styles.loader
                        })
                    )
                )
            );
        }
    }]);
    return Layout;
}(_react.Component);

Layout.propTypes = {
    authClient: _propTypes2.default.func,
    customRoutes: _propTypes2.default.array,
    dashboard: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
    isLoading: _propTypes2.default.bool.isRequired,
    menu: _propTypes2.default.element,
    resources: _propTypes2.default.array,
    setSidebarVisibility: _propTypes2.default.func.isRequired,
    title: _propTypes2.default.node.isRequired,
    theme: _propTypes2.default.object.isRequired,
    width: _propTypes2.default.number
};

Layout.defaultProps = {
    theme: _defaultTheme2.default
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0
    };
}

var enhance = (0, _compose2.default)((0, _reactRedux.connect)(mapStateToProps, {
    setSidebarVisibility: _actions.setSidebarVisibility
}), (0, _withWidth2.default)());

exports.default = enhance(Layout);
module.exports = exports['default'];