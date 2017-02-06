import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import Labeled from './Labeled';

/**
 * An Input component for a checkbox group, using an array of objects for the options
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
 * <CheckboxGroupInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <CheckboxGroupInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <CheckboxGroupInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <CheckboxGroupInput source="gender" choices={choices} optionText={<FullNameField />}/>
 *
 * The object passed as `options` props is passed to the material-ui <RadioButtonGroup> component
 */
export class CheckboxGroupInput extends Component {
    handleChange = (event, value) => {
        console.log(this.props.input.value);
        this.props.input.onChange(value);
    }

    render() {
        const { input, label, source, choices, optionText, optionValue } = this.props;
        const option = React.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
            choice => React.cloneElement(optionText, { record: choice }) :
            (typeof optionText === 'function' ?
                optionText :
                choice => choice[optionText]
            );

        return (
            <Labeled label={label} onChange={this.handleChange} source={source}>
                <div>
                    {choices.map((choice, index) => (
                        <input
                            key={choice[optionValue]}
                            type="checkbox"
                            checked={input.value.indexOf(choice[optionValue]) >= 0}
                            onChange={event => {
                                const index = input.value.indexOf(choice[optionValue]);
                                if (index < 0) { // wasn't selected
                                    if(event.target.checked) { // was checked
                                        input.onChange(input.value.concat(choice[optionValue]));
                                    }
                                } else {
                                    if(event.target.checked) { // was unchecked
                                        const copy = [...input.value]; // make copy to not mutate value
                                        copy.splice(index, 1); // remove item at index
                                        input.onChange(copy);
                                    }
                                }
                            }}
                        />
                    ))}
                </div>
            </Labeled>
        );
    }
}

CheckboxGroupInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    label: PropTypes.string,
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
    }),
    onChange: PropTypes.func,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    source: PropTypes.string,
    style: PropTypes.object,
};

CheckboxGroupInput.defaultProps = {
    addField: false,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
};

export default CheckboxGroupInput;
