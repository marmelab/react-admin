'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AutocompleteInput = undefined;

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

var _AutoComplete = require('material-ui/AutoComplete');

var _AutoComplete2 = _interopRequireDefault(_AutoComplete);

var _FieldTitle = require('../../util/FieldTitle');

var _FieldTitle2 = _interopRequireDefault(_FieldTitle);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An Input component for an autocomplete field, using an array of objects for the options
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
 * <AutocompleteInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutocompleteInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutocompleteInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * You can customize the `filter` function used to filter the results.
 * By default, it's `AutoComplete.fuzzyFilter`, but you can use any of
 * the functions provided by `AutoComplete`, or a function of your own
 * @see http://www.material-ui.com/#/components/auto-complete
 * @example
 * import { Edit, SimpleForm, AutocompleteInput } from 'admin-on-rest/mui';
 * import AutoComplete from 'material-ui/AutoComplete';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <AutocompleteInput source="category" filter={AutoComplete.caseInsensitiveFilter} choices={choices} />
 *         </SimpleForm>
 *     </Edit>
 * );
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
 * <AutocompleteInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <AutoComplete> component
 *
 * @example
 * <AutocompleteInput source="author_id" options={{ fullWidth: true }} />
 */
var AutocompleteInput = exports.AutocompleteInput = function (_Component) {
    (0, _inherits3.default)(AutocompleteInput, _Component);

    function AutocompleteInput() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, AutocompleteInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = AutocompleteInput.__proto__ || Object.getPrototypeOf(AutocompleteInput)).call.apply(_ref, [this].concat(args))), _this), _this.handleNewRequest = function (chosenRequest, index) {
            if (index !== -1) {
                var _this$props = _this.props,
                    choices = _this$props.choices,
                    input = _this$props.input,
                    optionValue = _this$props.optionValue;

                input.onChange(choices[index][optionValue]);
            }
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(AutocompleteInput, [{
        key: 'getSuggestion',
        value: function getSuggestion(choice) {
            var _props = this.props,
                optionText = _props.optionText,
                optionValue = _props.optionValue,
                translate = _props.translate,
                translateChoice = _props.translateChoice;

            var choiceName = typeof optionText === 'function' ? optionText(choice) : (0, _lodash2.default)(choice, optionText);
            return translateChoice ? translate(choiceName, { _: choiceName }) : choiceName;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props2 = this.props,
                choices = _props2.choices,
                elStyle = _props2.elStyle,
                filter = _props2.filter,
                input = _props2.input,
                isRequired = _props2.isRequired,
                label = _props2.label,
                _props2$meta = _props2.meta,
                touched = _props2$meta.touched,
                error = _props2$meta.error,
                options = _props2.options,
                optionValue = _props2.optionValue,
                resource = _props2.resource,
                setFilter = _props2.setFilter,
                source = _props2.source;


            var selectedSource = choices.find(function (choice) {
                return (0, _lodash2.default)(choice, optionValue) === input.value;
            });
            var dataSource = choices.map(function (choice) {
                return {
                    value: (0, _lodash2.default)(choice, optionValue),
                    text: _this2.getSuggestion(choice)
                };
            });
            return _react2.default.createElement(_AutoComplete2.default, (0, _extends3.default)({
                searchText: selectedSource && this.getSuggestion(selectedSource),
                dataSource: dataSource,
                floatingLabelText: _react2.default.createElement(_FieldTitle2.default, { label: label, source: source, resource: resource, isRequired: isRequired }),
                filter: filter,
                onNewRequest: this.handleNewRequest,
                onUpdateInput: setFilter,
                openOnFocus: true,
                style: elStyle,
                errorText: touched && error
            }, options));
        }
    }]);
    return AutocompleteInput;
}(_react.Component);

AutocompleteInput.propTypes = {
    addField: _propTypes2.default.bool.isRequired,
    choices: _propTypes2.default.arrayOf(_propTypes2.default.object),
    elStyle: _propTypes2.default.object,
    filter: _propTypes2.default.func.isRequired,
    input: _propTypes2.default.object,
    isRequired: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    meta: _propTypes2.default.object,
    options: _propTypes2.default.object,
    optionElement: _propTypes2.default.element,
    optionText: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired,
    optionValue: _propTypes2.default.string.isRequired,
    resource: _propTypes2.default.string,
    setFilter: _propTypes2.default.func,
    source: _propTypes2.default.string,
    translate: _propTypes2.default.func.isRequired,
    translateChoice: _propTypes2.default.bool.isRequired
};

AutocompleteInput.defaultProps = {
    addField: true,
    choices: [],
    filter: _AutoComplete2.default.fuzzyFilter,
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true
};

exports.default = (0, _translate2.default)(AutocompleteInput);