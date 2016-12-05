import React, { Component, PropTypes } from 'react';
import title from '../../util/title';
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
 *    { id: 'F', name: 'Female' },
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
    onChange = (event, index, value) => this.props.input.onChange(value);

    render() {
        const { allowEmpty, input, label, choices, optionText, optionValue, options, source, style } = this.props;

        return (
            <SelectField
                {...input}
                menuStyle={{ maxHeight: '41px', overflowY: 'hidden' }}
                floatingLabelText={title(label, source)}
                onChange={this.onChange}
                autoWidth
                style={style}
                {...options}
            >
                {allowEmpty &&
                    <MenuItem value={null} primaryText="" />
                }
                {choices.map(choice =>
                    <MenuItem key={choice[optionValue]} primaryText={choice[optionText]} value={choice[optionValue]} />
                )}
            </SelectField>
        );
    }
}

SelectInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.string.isRequired,
    optionValue: PropTypes.string.isRequired,
    source: PropTypes.string,
    style: PropTypes.object,
};

SelectInput.defaultProps = {
    allowEmpty: false,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    includesLabel: true,
};

export default SelectInput;
