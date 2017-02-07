import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import Labeled from './Labeled';

/**
 * An Input component for a checkbox group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * The expected input must be an array of objects, objects must be present (by their 'optionValue')
 * in 'choices' attribute to be displayed as part of the checkbox list.
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
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
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
 */
export class CheckboxGroupInput extends Component {
    handleCheck = (choice, isChecked) => {
        const { optionValue, input: { value, onChange } } = this.props;

        if (isChecked) {
            onChange([...value, ...[choice]]);
        } else {
            onChange(value.filter(v => (v[optionValue] != choice[optionValue])));
        }
    };

    render() {
        const {
            choices,
            optionValue,
            optionText,
            label,
            source,
            options,
            input: { value },
        } = this.props;

        const option = React.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
            choice => React.cloneElement(optionText, { record: choice }) :
            (typeof optionText === 'function' ?
                optionText :
                choice => choice[optionText]
            );

        return (
            <Labeled label={label} source={source}>
                <div>
                    {choices.map(choice =>
                        <Checkbox
                            key={choice[optionValue]}
                            checked={value.filter(v => (v[optionValue] == choice[optionValue])).length > 0}
                            onCheck={(e, isChecked) => this.handleCheck(choice, isChecked)}
                            value={choice[optionValue]}
                            label={option(choice)}
                            {...options}
                        />,
                    )}
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
};

CheckboxGroupInput.defaultProps = {
    addField: true,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
};

export default CheckboxGroupInput;
