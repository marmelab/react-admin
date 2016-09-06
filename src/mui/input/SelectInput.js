import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/**
 * An Input component using a select box.
 *
 * Pass possible choices as an array of { label, value } in the choices attribute.
 *
 * @example
 * <SelectInput label="Gender" source="gender" choices={[
 *    { label: 'Male', value: 'M' },
 *    { label: 'Female', value: 'F' },
 * ]} />
 */
class SelectInput extends Component {
    handleChange = (event, key, payload) => {
        this.props.onChange(this.props.source, payload);
    }

    render() {
        const { source, label, record, choices, options } = this.props;
        return (
            <SelectField
                menuStyle={{ maxHeight: '41px', overflowY: 'hidden' }}
                floatingLabelText={label}
                value={record[source]}
                onChange={this.handleChange}
                autoWidth
                {...options}
            >
                {choices.map(item =>
                    <MenuItem key={item.label} primaryText={item.label} value={item.value} />
                )}
            </SelectField>
        );
    }
}

SelectInput.propTypes = {
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
    choices: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
    })).isRequired,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

SelectInput.defaultProps = {
    record: {},
    options: {},
    includesLabel: true,
};

export default SelectInput;
