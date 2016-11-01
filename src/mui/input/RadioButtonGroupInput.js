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
 *
 * @example
 * <RadioButtonGroupInput source="gender" choices={[
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', label: 'Female' },
 * ]} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 *
 * @example
 * <RadioButtonGroupInput label="Author" source="author_id" optionText="full_name" optionValue="_id" choices={[
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ]} />
 */
class RadioButtonGroupInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    }

    render() {
        const { label, source, record, choices, optionText, optionValue, options, style } = this.props;
        return (
            <Labeled label={label} onChange={this.handleChange} source={source}>
                <RadioButtonGroup
                    name={source}
                    defaultSelected={record[source]}
                    style={style}
                    {...options}
                >
                    {choices.map(choice =>
                        <RadioButton key={choice[optionText]} label={choice[optionText]} value={choice[optionValue]} />
                    )}
                </RadioButtonGroup>
            </Labeled>
        );
    }
}

RadioButtonGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    includesLabel: PropTypes.bool.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object,
    optionText: PropTypes.string.isRequired,
    optionValue: PropTypes.string.isRequired,
    record: PropTypes.object,
    source: PropTypes.string,
    style: PropTypes.object,
};

RadioButtonGroupInput.defaultProps = {
    record: {},
    options: {},
    optionText: 'name',
    optionValue: 'id',
    includesLabel: true,
};

export default RadioButtonGroupInput;
