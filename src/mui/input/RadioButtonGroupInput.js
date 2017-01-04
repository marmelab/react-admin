import React, { Component, PropTypes } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Labeled from './Labeled';

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
 * The object passed as `options` props is passed to the material-ui <RadioButtonGroup> component
 */
class RadioButtonGroupInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    }

    render() {
        const { label, source, input, choices, optionText, optionValue, options, elStyle } = this.props;
        const option = React.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
            choice => React.cloneElement(optionText, { record: choice }) :
            (typeof optionText === 'function' ?
                optionText :
                choice => choice[optionText]
            );
        return (
            <Labeled label={label} onChange={this.handleChange} source={source}>
                <RadioButtonGroup
                    name={source}
                    defaultSelected={input.value}
                    style={elStyle}
                    {...options}
                >
                    {choices.map(choice =>
                        <RadioButton key={choice[optionValue]} label={option(choice)} value={choice[optionValue]} />
                    )}
                </RadioButtonGroup>
            </Labeled>
        );
    }
}

RadioButtonGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    includesField: PropTypes.bool.isRequired,
    includesLabel: PropTypes.bool.isRequired,
    label: PropTypes.string,
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

RadioButtonGroupInput.defaultProps = {
    choices: [],
    includesField: false,
    includesLabel: true,
    options: {},
    optionText: 'name',
    optionValue: 'id',
};

export default RadioButtonGroupInput;
