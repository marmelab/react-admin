'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectField = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Display a value in an enumeration
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <SelectField source="gender" choices={choices} />
 *
 * By default, the text is built by
 * - finding a choice where the 'id' property equals the field value
 * - using the 'name' property an the option text
 *
 * You can also customize the properties to use for the value and text,
 * thanks to the 'optionValue' and 'optionText' attributes.
 *
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectField source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <SelectField source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <Chip>{record.first_name} {record.last_name}</Chip>;
 * <SelectField source="gender" choices={choices} optionText={<FullNameField />}/>
 *
 * The current choice is translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceField>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <SelectField source="gender" choices={choices} translateChoice={false}/>
 *
 * **Tip**: <ReferenceField> sets `translateChoice` to false by default.
 */
var SelectField = exports.SelectField = function SelectField(_ref) {
    var source = _ref.source,
        record = _ref.record,
        choices = _ref.choices,
        elStyle = _ref.elStyle,
        optionValue = _ref.optionValue,
        optionText = _ref.optionText,
        translate = _ref.translate,
        translateChoice = _ref.translateChoice;

    var value = (0, _lodash2.default)(record, source);
    var choice = choices.find(function (c) {
        return c[optionValue] === value;
    });
    if (!choice) return null;
    var choiceName = _react2.default.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
    _react2.default.cloneElement(optionText, { record: choice }) : typeof optionText === 'function' ? optionText(choice) : choice[optionText];
    return _react2.default.createElement(
        'span',
        { style: elStyle },
        translateChoice ? translate(choiceName, { _: choiceName }) : choiceName
    );
};

SelectField.propTypes = {
    addLabel: _propTypes2.default.bool,
    choices: _propTypes2.default.arrayOf(_propTypes2.default.object),
    elStyle: _propTypes2.default.object,
    label: _propTypes2.default.string,
    optionText: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func, _propTypes2.default.element]).isRequired,
    optionValue: _propTypes2.default.string.isRequired,
    resource: _propTypes2.default.string,
    record: _propTypes2.default.object,
    source: _propTypes2.default.string.isRequired,
    translate: _propTypes2.default.func.isRequired,
    translateChoice: _propTypes2.default.bool.isRequired
};

SelectField.defaultProps = {
    record: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true
};

var enhance = (0, _compose2.default)(_pure2.default, _translate2.default);

var EnhancedSelectField = enhance(SelectField);

EnhancedSelectField.defaultProps = {
    addLabel: true
};

exports.default = EnhancedSelectField;