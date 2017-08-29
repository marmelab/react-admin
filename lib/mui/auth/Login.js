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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _Card = require('material-ui/Card');

var _Avatar = require('material-ui/Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _lockOutline = require('material-ui/svg-icons/action/lock-outline');

var _lockOutline2 = _interopRequireDefault(_lockOutline);

var _colors = require('material-ui/styles/colors');

var _defaultTheme = require('../defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

var _authActions = require('../../actions/authActions');

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

var _Notification = require('../layout/Notification');

var _Notification2 = _interopRequireDefault(_Notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        minWidth: 300
    },
    avatar: {
        margin: '1em',
        textAlign: 'center '
    },
    form: {
        padding: '0 1em 1em 1em'
    },
    input: {
        display: 'flex'
    }
};

function getColorsFromTheme(theme) {
    if (!theme) return { primary1Color: _colors.cyan500, accent1Color: _colors.pinkA200 };
    var _theme$palette = theme.palette,
        primary1Color = _theme$palette.primary1Color,
        accent1Color = _theme$palette.accent1Color;

    return { primary1Color: primary1Color, accent1Color: accent1Color };
}

// see http://redux-form.com/6.4.3/examples/material-ui/
var renderInput = function renderInput(_ref) {
    var _ref$meta = _ref.meta;
    _ref$meta = _ref$meta === undefined ? {} : _ref$meta;
    var touched = _ref$meta.touched,
        error = _ref$meta.error,
        inputProps = (0, _objectWithoutProperties3.default)(_ref.input, []),
        props = (0, _objectWithoutProperties3.default)(_ref, ['meta', 'input']);
    return _react2.default.createElement(_TextField2.default, (0, _extends3.default)({
        errorText: touched && error
    }, inputProps, props, {
        fullWidth: true
    }));
};

var Login = function (_Component) {
    (0, _inherits3.default)(Login, _Component);

    function Login() {
        var _ref2;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Login);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref2 = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref2, [this].concat(args))), _this), _this.login = function (auth) {
            return _this.props.userLogin(auth, _this.props.location.state ? _this.props.location.state.nextPathname : '/');
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Login, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                handleSubmit = _props.handleSubmit,
                isLoading = _props.isLoading,
                theme = _props.theme,
                translate = _props.translate;

            var muiTheme = (0, _getMuiTheme2.default)(theme);

            var _getColorsFromTheme = getColorsFromTheme(muiTheme),
                primary1Color = _getColorsFromTheme.primary1Color,
                accent1Color = _getColorsFromTheme.accent1Color;

            return _react2.default.createElement(
                _MuiThemeProvider2.default,
                { muiTheme: muiTheme },
                _react2.default.createElement(
                    'div',
                    { style: (0, _extends3.default)({}, styles.main, { backgroundColor: primary1Color }) },
                    _react2.default.createElement(
                        _Card.Card,
                        { style: styles.card },
                        _react2.default.createElement(
                            'div',
                            { style: styles.avatar },
                            _react2.default.createElement(_Avatar2.default, { backgroundColor: accent1Color, icon: _react2.default.createElement(_lockOutline2.default, null), size: 60 })
                        ),
                        _react2.default.createElement(
                            'form',
                            { onSubmit: handleSubmit(this.login) },
                            _react2.default.createElement(
                                'div',
                                { style: styles.form },
                                _react2.default.createElement(
                                    'div',
                                    { style: styles.input },
                                    _react2.default.createElement(_reduxForm.Field, {
                                        name: 'username',
                                        component: renderInput,
                                        floatingLabelText: translate('aor.auth.username'),
                                        disabled: isLoading
                                    })
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { style: styles.input },
                                    _react2.default.createElement(_reduxForm.Field, {
                                        name: 'password',
                                        component: renderInput,
                                        floatingLabelText: translate('aor.auth.password'),
                                        type: 'password',
                                        disabled: isLoading
                                    })
                                )
                            ),
                            _react2.default.createElement(
                                _Card.CardActions,
                                null,
                                _react2.default.createElement(_RaisedButton2.default, {
                                    type: 'submit',
                                    primary: true,
                                    disabled: isLoading,
                                    icon: isLoading && _react2.default.createElement(_CircularProgress2.default, { size: 25, thickness: 2 }),
                                    label: translate('aor.auth.sign_in'),
                                    fullWidth: true
                                })
                            )
                        )
                    ),
                    _react2.default.createElement(_Notification2.default, null)
                )
            );
        }
    }]);
    return Login;
}(_react.Component);

Login.propTypes = (0, _extends3.default)({}, _reduxForm.propTypes, {
    authClient: _propTypes2.default.func,
    previousRoute: _propTypes2.default.string,
    theme: _propTypes2.default.object.isRequired,
    translate: _propTypes2.default.func.isRequired,
    userLogin: _propTypes2.default.func.isRequired
});

Login.defaultProps = {
    theme: _defaultTheme2.default
};

var mapStateToProps = function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
};

var enhance = (0, _compose2.default)(_translate2.default, (0, _reduxForm.reduxForm)({
    form: 'signIn',
    validate: function validate(values, props) {
        var errors = {};
        var translate = props.translate;

        if (!values.username) errors.username = translate('aor.validation.required');
        if (!values.password) errors.password = translate('aor.validation.required');
        return errors;
    }
}), (0, _reactRedux.connect)(mapStateToProps, { userLogin: _authActions.userLogin }));

exports.default = enhance(Login);
module.exports = exports['default'];