import React, { PropTypes } from 'react';
import get from 'lodash.get';
import Chip from 'material-ui/Chip';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';

/**
 * Display a value in an enumeration
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
 * <SelectField source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
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
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
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
 *
 * The object passed as `options` props is passed to the material-ui <Chip> component
 */
export const SelectField = ({ source, record = {}, choices, elStyle, optionValue, optionText, translate, options, translateChoice = true }) => {
    const value = get(record, source);
    const choice = choices.find(c => c[optionValue] === value);
    if (!choice) return null;
    const choiceName = React.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
        React.cloneElement(optionText, { record: choice }) :
        (typeof optionText === 'function' ?
            optionText(choice) :
            choice[optionText]
        );
    return (
        <Chip style={elStyle} {...options}>
            {translateChoice ? translate(choiceName, { _: choiceName }) : choiceName}
        </Chip>
    );
};

SelectField.propTypes = {
    addLabel: PropTypes.bool,
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    label: PropTypes.string,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

SelectField.defaultProps = {
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

const enhance = compose(
    pure,
    translate,
);

const EnhancedSelectField = enhance(SelectField);

EnhancedSelectField.defaultProps = {
    addLabel: true,
};

export default translate(EnhancedSelectField);
