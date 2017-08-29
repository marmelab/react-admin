'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextInput = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _FieldTitle = require('../../util/FieldTitle');

var _FieldTitle2 = _interopRequireDefault(_FieldTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An Input component for a string
 *
 * @example
 * <TextInput source="first_name" />
 *
 * You can customize the `type` props (which defaults to "text").
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
 * @example
 * <TextInput source="email" type="email" />
 * <NumberInput source="nb_views" />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
var TextInput = exports.TextInput = function (_Component) {
    (0, _inherits3.default)(TextInput, _Component);

    function TextInput() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, TextInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call.apply(_ref, [this].concat(args))), _this), _this.handleBlur = function (eventOrValue) {
            _this.props.onBlur(eventOrValue);
            _this.props.input.onBlur(eventOrValue);
        }, _this.handleFocus = function (event) {
            _this.props.onFocus(event);
            _this.props.input.onFocus(event);
        }, _this.handleChange = function (eventOrValue) {
            _this.props.onChange(eventOrValue);
            _this.props.input.onChange(eventOrValue);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(TextInput, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                elStyle = _props.elStyle,
                input = _props.input,
                isRequired = _props.isRequired,
                label = _props.label,
                _props$meta = _props.meta,
                touched = _props$meta.touched,
                error = _props$meta.error,
                options = _props.options,
                resource = _props.resource,
                source = _props.source,
                type = _props.type;


            return _react2.default.createElement(_TextField2.default, (0, _extends3.default)({}, input, {
                onBlur: this.handleBlur,
                onFocus: this.handleFocus,
                onChange: this.handleChange,
                type: type,
                floatingLabelText: _react2.default.createElement(_FieldTitle2.default, { label: label, source: source, resource: resource, isRequired: isRequired }),
                errorText: touched && error,
                style: elStyle
            }, options));
        }
    }]);
    return TextInput;
}(_react.Component);

TextInput.propTypes = {
    addField: _propTypes2.default.bool.isRequired,
    elStyle: _propTypes2.default.object,
    input: _propTypes2.default.object,
    isRequired: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    meta: _propTypes2.default.object,
    name: _propTypes2.default.string,
    onBlur: _propTypes2.default.func,
    onChange: _propTypes2.default.func,
    onFocus: _propTypes2.default.func,
    options: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string,
    type: _propTypes2.default.string
};

TextInput.defaultProps = {
    addField: true,
    onBlur: function onBlur() {},
    onChange: function onChange() {},
    onFocus: function onFocus() {},
    options: {},
    type: 'text'
};

exports.default = TextInput;