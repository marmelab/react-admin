'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RadioButtonGroupInput = undefined;

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

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _RadioButton = require('material-ui/RadioButton');

var _Labeled = require('./Labeled');

var _Labeled2 = _interopRequireDefault(_Labeled);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An Input component for a radio button group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <RadioButtonGroupInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <RadioButtonGroupInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <RadioButtonGroupInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <RadioButtonGroupInput source="gender" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <RadioButtonGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <RadioButtonGroup> component
 */
var RadioButtonGroupInput = exports.RadioButtonGroupInput = function (_Component) {
    (0, _inherits3.default)(RadioButtonGroupInput, _Component);

    function RadioButtonGroupInput() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, RadioButtonGroupInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = RadioButtonGroupInput.__proto__ || Object.getPrototypeOf(RadioButtonGroupInput)).call.apply(_ref, [this].concat(args))), _this), _this.handleChange = function (event, value) {
            _this.props.input.onChange(value);
        }, _this.renderRadioButton = function (choice) {
            var _this$props = _this.props,
                optionText = _this$props.optionText,
                optionValue = _this$props.optionValue,
                translate = _this$props.translate,
                translateChoice = _this$props.translateChoice;

            var choiceName = _react2.default.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
            _react2.default.cloneElement(optionText, { record: choice }) : typeof optionText === 'function' ? optionText(choice) : (0, _lodash2.default)(choice, optionText);
            return _react2.default.createElement(_RadioButton.RadioButton, {
                key: (0, _lodash2.default)(choice, optionValue),
                label: translateChoice ? translate(choiceName, { _: choiceName }) : choiceName,
                value: (0, _lodash2.default)(choice, optionValue)
            });
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(RadioButtonGroupInput, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                label = _props.label,
                resource = _props.resource,
                source = _props.source,
                input = _props.input,
                isRequired = _props.isRequired,
                choices = _props.choices,
                options = _props.options,
                elStyle = _props.elStyle;

            return _react2.default.createElement(
                _Labeled2.default,
                { label: label, onChange: this.handleChange, resource: resource, source: source, isRequired: isRequired },
                _react2.default.createElement(
                    _RadioButton.RadioButtonGroup,
                    (0, _extends3.default)({
                        name: source,
                        defaultSelected: input.value,
                        style: elStyle
                    }, options),
                    choices.map(this.renderRadioButton)
                )
            );
        }
    }]);
    return RadioButtonGroupInput;
}(_react.Component);

RadioButtonGroupInput.propTypes = {
    choices: _propTypes2.default.arrayOf(_propTypes2.default.object),
    elStyle: _propTypes2.default.object,
    input: _propTypes2.default.object,
    isRequired: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    options: _propTypes2.default.object,
    optionText: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func, _propTypes2.default.element]).isRequired,
    optionValue: _propTypes2.default.string.isRequired,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string,
    translate: _propTypes2.default.func.isRequired,
    translateChoice: _propTypes2.default.bool.isRequired
};

RadioButtonGroupInput.defaultProps = {
    addField: true,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true
};

exports.default = (0, _translate2.default)(RadioButtonGroupInput);