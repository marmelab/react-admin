'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.datify = undefined;

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

var _DatePicker = require('material-ui/DatePicker');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _FieldTitle = require('../../util/FieldTitle');

var _FieldTitle2 = _interopRequireDefault(_FieldTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var datify = exports.datify = function datify(input) {
    if (!input) {
        return null;
    }

    var date = input instanceof Date ? input : new Date(input);
    if (isNaN(date)) {
        throw new Error('Invalid date: ' + input);
    }

    return date;
};

var DateInput = function (_Component) {
    (0, _inherits3.default)(DateInput, _Component);

    function DateInput() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, DateInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = DateInput.__proto__ || Object.getPrototypeOf(DateInput)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (_, date) {
            _this.props.input.onChange(date);
            _this.props.input.onBlur();
        }, _this.onBlur = function () {}, _this.onDismiss = function () {
            return _this.props.input.onBlur();
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    /**
     * This aims to fix a bug created by the conjunction of
     * redux-form, which expects onBlur to be triggered after onChange, and
     * material-ui, which triggers onBlur on <DatePicker> when the user clicks
     * on the input to bring the focus on the calendar rather than the input.
     *
     * @see https://github.com/erikras/redux-form/issues/1218#issuecomment-229072652
     */


    (0, _createClass3.default)(DateInput, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                input = _props.input,
                isRequired = _props.isRequired,
                label = _props.label,
                _props$meta = _props.meta,
                touched = _props$meta.touched,
                error = _props$meta.error,
                options = _props.options,
                source = _props.source,
                elStyle = _props.elStyle,
                resource = _props.resource;


            return _react2.default.createElement(_DatePicker2.default, (0, _extends3.default)({}, input, {
                errorText: touched && error,
                floatingLabelText: _react2.default.createElement(_FieldTitle2.default, { label: label, source: source, resource: resource, isRequired: isRequired }),
                DateTimeFormat: Intl.DateTimeFormat,
                container: 'inline',
                autoOk: true,
                value: datify(input.value),
                onChange: this.onChange,
                onBlur: this.onBlur,
                onDismiss: this.onDismiss,
                style: elStyle
            }, options));
        }
    }]);
    return DateInput;
}(_react.Component);

DateInput.propTypes = {
    addField: _propTypes2.default.bool.isRequired,
    elStyle: _propTypes2.default.object,
    input: _propTypes2.default.object,
    isRequired: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    meta: _propTypes2.default.object,
    options: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string
};

DateInput.defaultProps = {
    addField: true,
    options: {}
};

exports.default = DateInput;