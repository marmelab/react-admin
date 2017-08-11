'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectArrayInput = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _materialUiChipInput = require('material-ui-chip-input');

var _materialUiChipInput2 = _interopRequireDefault(_materialUiChipInput);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

var _FieldTitle = require('../../util/FieldTitle');

var _FieldTitle2 = _interopRequireDefault(_FieldTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataSourceConfig = { text: 'text', value: 'value' };

/**
 * An Input component for an array
 *
 * @example
 * <SelectArrayInput source="categories" />
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: '1', name: 'Book' },
 *    { id: '2', name: 'Video' },
 *    { id: '3', name: 'Audio' },
 * ];
 * <SelectArrayInput source="categories" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: '1', name: 'Book', plural_name: 'Books' },
 *    { _id: '2', name: 'Video', plural_name: 'Videos' },
 *    { _id: '3', name: 'Audio', plural_name: 'Audios' },
 * ];
 * <SelectArrayInput source="categories" choices={choices} optionText="plural_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: '1', name: 'Book', quantity: 23 },
 *    { id: '2', name: 'Video', quantity: 56 },
 *    { id: '3', name: 'Audio', quantity: 12 },
 * ];
 * const optionRenderer = choice => `${choice.name} (${choice.quantity})`;
 * <SelectArrayInput source="categories" choices={choices} optionText={optionRenderer} />
 *
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */

var SelectArrayInput = exports.SelectArrayInput = function (_Component) {
    (0, _inherits3.default)(SelectArrayInput, _Component);

    function SelectArrayInput() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, SelectArrayInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SelectArrayInput.__proto__ || Object.getPrototypeOf(SelectArrayInput)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            values: []
        }, _this.componentWillMount = function () {
            _this.setState({
                values: _this.getChoicesForValues(_this.props.input.value || [], _this.props.choices)
            });
        }, _this.componentWillReceiveProps = function (nextProps) {
            if (_this.props.choices !== nextProps.choices || _this.props.input.value !== nextProps.input.value) {
                _this.setState({
                    values: _this.getChoicesForValues(nextProps.input.value || [], nextProps.choices)
                });
            }
        }, _this.handleBlur = function () {
            var extracted = _this.extractIds(_this.state.values);
            _this.props.onBlur(extracted);
            _this.props.input.onBlur(extracted);
        }, _this.handleFocus = function () {
            var extracted = _this.extractIds(_this.state.values);
            _this.props.onFocus(extracted);
            _this.props.input.onFocus(extracted);
        }, _this.handleAdd = function (newValue) {
            var values = [].concat((0, _toConsumableArray3.default)(_this.state.values), [newValue]);
            _this.setState({ values: values });
            _this.handleChange(values);
        }, _this.handleDelete = function (newValue) {
            var values = _this.state.values.filter(function (v) {
                return v.value !== newValue;
            });
            _this.setState({ values: values });
            _this.handleChange(values);
        }, _this.handleChange = function (eventOrValue) {
            var extracted = _this.extractIds(eventOrValue);
            _this.props.onChange(extracted);
            _this.props.input.onChange(extracted);
        }, _this.extractIds = function (eventOrValue) {
            var value = eventOrValue.target && eventOrValue.target.value ? eventOrValue.target.value : eventOrValue;
            if (Array.isArray(value)) {
                return value.map(function (o) {
                    return o.value;
                });
            }
            return [value];
        }, _this.getChoicesForValues = function (values) {
            var choices = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var _this$props = _this.props,
                optionValue = _this$props.optionValue,
                optionText = _this$props.optionText;

            if (!values || !Array.isArray(values)) {
                throw Error('Value of SelectArrayInput should be an array');
            }
            return values.map(function (value) {
                var _ref2;

                return choices.find(function (c) {
                    return c[optionValue] === value;
                }) || (_ref2 = {}, (0, _defineProperty3.default)(_ref2, optionValue, value), (0, _defineProperty3.default)(_ref2, optionText, value), _ref2);
            }).map(_this.formatChoice);
        }, _this.formatChoices = function (choices) {
            return choices.map(_this.formatChoice);
        }, _this.formatChoice = function (choice) {
            var _this$props2 = _this.props,
                optionText = _this$props2.optionText,
                optionValue = _this$props2.optionValue,
                translateChoice = _this$props2.translateChoice,
                translate = _this$props2.translate;

            var choiceText = typeof optionText === 'function' ? optionText(choice) : (0, _lodash2.default)(choice, optionText);
            return {
                value: (0, _lodash2.default)(choice, optionValue),
                text: translateChoice ? translate(choiceText, { _: choiceText }) : choiceText
            };
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(SelectArrayInput, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                elStyle = _props.elStyle,
                input = _props.input,
                isRequired = _props.isRequired,
                choices = _props.choices,
                label = _props.label,
                _props$meta = _props.meta,
                touched = _props$meta.touched,
                error = _props$meta.error,
                options = _props.options,
                optionText = _props.optionText,
                optionValue = _props.optionValue,
                resource = _props.resource,
                source = _props.source,
                setFilter = _props.setFilter,
                translate = _props.translate,
                translateChoice = _props.translateChoice;


            return _react2.default.createElement(_materialUiChipInput2.default, (0, _extends3.default)({}, input, {
                value: this.state.values,
                onBlur: this.handleBlur,
                onFocus: this.handleFocus,
                onTouchTap: this.handleFocus,
                onRequestAdd: this.handleAdd,
                onRequestDelete: this.handleDelete,
                onUpdateInput: setFilter,
                floatingLabelText: _react2.default.createElement(_FieldTitle2.default, { label: label, source: source, resource: resource, isRequired: isRequired }),
                errorText: touched && error,
                style: elStyle,
                dataSource: this.formatChoices(choices),
                dataSourceConfig: dataSourceConfig,
                openOnFocus: true
            }, options));
        }
    }]);
    return SelectArrayInput;
}(_react.Component);

SelectArrayInput.propTypes = {
    addField: _propTypes2.default.bool.isRequired,
    elStyle: _propTypes2.default.object,
    choices: _propTypes2.default.arrayOf(_propTypes2.default.object),
    input: _propTypes2.default.object,
    isRequired: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    meta: _propTypes2.default.object,
    name: _propTypes2.default.string,
    onBlur: _propTypes2.default.func,
    onChange: _propTypes2.default.func,
    onFocus: _propTypes2.default.func,
    setFilter: _propTypes2.default.func,
    options: _propTypes2.default.object,
    optionText: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired,
    optionValue: _propTypes2.default.string.isRequired,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string,
    translate: _propTypes2.default.func.isRequired,
    translateChoice: _propTypes2.default.bool.isRequired
};

SelectArrayInput.defaultProps = {
    addField: true,
    choices: [],
    onBlur: function onBlur() {
        return true;
    },
    onChange: function onChange() {
        return true;
    },
    onFocus: function onFocus() {
        return true;
    },
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true
};

exports.default = (0, _translate2.default)(SelectArrayInput);