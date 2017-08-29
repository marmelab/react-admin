'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleForm = undefined;

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

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _getDefaultValues = require('./getDefaultValues');

var _getDefaultValues2 = _interopRequireDefault(_getDefaultValues);

var _FormField = require('./FormField');

var _FormField2 = _interopRequireDefault(_FormField);

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formStyle = { padding: '0 1em 1em 1em' };

var SimpleForm = exports.SimpleForm = function (_Component) {
    (0, _inherits3.default)(SimpleForm, _Component);

    function SimpleForm() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, SimpleForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SimpleForm.__proto__ || Object.getPrototypeOf(SimpleForm)).call.apply(_ref, [this].concat(args))), _this), _this.handleSubmitWithRedirect = function () {
            var redirect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.redirect;
            return _this.props.handleSubmit(function (values) {
                return _this.props.save(values, redirect);
            });
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(SimpleForm, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                invalid = _props.invalid,
                record = _props.record,
                resource = _props.resource,
                basePath = _props.basePath,
                submitOnEnter = _props.submitOnEnter,
                toolbar = _props.toolbar;

            return _react2.default.createElement(
                'form',
                { className: 'simple-form' },
                _react2.default.createElement(
                    'div',
                    { style: formStyle },
                    _react.Children.map(children, function (input) {
                        return input && _react2.default.createElement(
                            'div',
                            { key: input.props.source, className: 'aor-input-' + input.props.source, style: input.props.style },
                            _react2.default.createElement(_FormField2.default, { input: input, resource: resource, record: record, basePath: basePath })
                        );
                    })
                ),
                toolbar && _react2.default.cloneElement(toolbar, {
                    handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                    invalid: invalid,
                    submitOnEnter: submitOnEnter
                })
            );
        }
    }]);
    return SimpleForm;
}(_react.Component);

SimpleForm.propTypes = {
    basePath: _propTypes2.default.string,
    children: _propTypes2.default.node,
    defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func]),
    handleSubmit: _propTypes2.default.func, // passed by redux-form
    invalid: _propTypes2.default.bool,
    record: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    redirect: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
    save: _propTypes2.default.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: _propTypes2.default.bool,
    toolbar: _propTypes2.default.element,
    validate: _propTypes2.default.func
};

SimpleForm.defaultProps = {
    submitOnEnter: true,
    toolbar: _react2.default.createElement(_Toolbar2.default, null)
};

var enhance = (0, _compose2.default)((0, _reactRedux.connect)(function (state, props) {
    return {
        initialValues: (0, _getDefaultValues2.default)(state, props)
    };
}), (0, _reduxForm.reduxForm)({
    form: 'record-form',
    enableReinitialize: true
}));

exports.default = enhance(SimpleForm);