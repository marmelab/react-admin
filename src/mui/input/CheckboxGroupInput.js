import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

import Labeled from './Labeled';
import translate from '../../i18n/translate';

/**
 * An Input component for a checkbox group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * The expected input must be an array of identifiers (e.g. [12, 31]) which correspond to
 * the 'optionValue' of 'choices' attribute objects.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *     { id: 12, name: 'Ray Hakt' },
 *     { id: 31, name: 'Ann Gullar' },
 *     { id: 42, name: 'Sean Phonee' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi' },
 *    { _id: 456, full_name: 'Jane Austen' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'programming', name: 'myroot.category.programming' },
 *    { id: 'lifestyle', name: 'myroot.category.lifestyle' },
 *    { id: 'photography', name: 'myroot.category.photography' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <CheckboxGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <Checkbox> components
 */
export class CheckboxGroupInput extends Component {
    handleCheck = (event, isChecked) => {
        const { input: { value, onChange } } = this.props;

        if (isChecked) {
            onChange([...value, ...[event.target.value]]);
        } else {
            onChange(value.filter(v => (v != event.target.value)));
        }
    };

    renderCheckbox = (choice) => {
        const {
            input: { value },
            optionText,
            optionValue,
            options,
            translate,
            translateChoice
        } = this.props;
        const choiceName = React.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
            React.cloneElement(optionText, { record: choice }) :
            (typeof optionText === 'function' ?
                optionText(choice) :
                choice[optionText]
            );
        return (
            <Checkbox
                key={choice[optionValue]}
                checked={value ? value.find(v => (v == choice[optionValue])) !== undefined : false}
                onCheck={this.handleCheck}
                value={choice[optionValue]}
                label={translateChoice ? translate(choiceName, { _: choiceName }) : choiceName}
                {...options}
            />
        );
    }

    render() {
        const { choices, label, resource, source } = this.props;
        return (
            <Labeled label={label} source={source} resource={resource}>
                <div>
                    {choices.map(this.renderCheckbox)}
                </div>
            </Labeled>
        );
    }
}

CheckboxGroupInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
    }),
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

CheckboxGroupInput.defaultProps = {
    addField: true,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default translate(CheckboxGroupInput);
