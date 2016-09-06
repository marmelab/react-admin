import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/**
 * An Input component for a select box, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 *
 * @example
 * <SelectInput source="gender" choices={[
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', label: 'Female' },
 * ]} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 *
 * @example
 * <SelectInput label="Author" source="author_id" optionText="full_name" optionValue="_id" choices={[
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ]} />
 */
class SelectInput extends Component {
    handleChange = (event, key, payload) => {
        this.props.onChange(this.props.source, payload);
    }

    render() {
        const { label, source, record, choices, optionText, optionValue, options } = this.props;
        return (
            <SelectField
                menuStyle={{ maxHeight: '41px', overflowY: 'hidden' }}
                floatingLabelText={label}
                value={record[source]}
                onChange={this.handleChange}
                autoWidth
                {...options}
            >
                {choices.map(choice =>
                    <MenuItem key={choice[optionText]} primaryText={choice[optionText]} value={choice[optionValue]} />
                )}
            </SelectField>
        );
    }
}

SelectInput.propTypes = {
    label: PropTypes.string,
    source: PropTypes.string,
    record: PropTypes.object,
    choices: PropTypes.arrayOf(PropTypes.object),
    optionText: PropTypes.string.isRequired,
    optionValue: PropTypes.string.isRequired,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

SelectInput.defaultProps = {
    record: {},
    options: {},
    optionText: 'name',
    optionValue: 'id',
    includesLabel: true,
};

export default SelectInput;
