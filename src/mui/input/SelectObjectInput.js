import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/**
 * An Input component using a select box, based on an array of objects
 *
 * Pass possible choices as an array of objects in the objetcs attribute, and
 * the name of the property to use for the options in the property attribute.
 *
 * @example
 * <SelectObjectInput label="Author" source="author_id" property="name" objects={[
 *    { id: 123, name: 'Leo Tolstoi', sex: 'M' },
 *    { id: 456, name: 'Jane Austen', sex: 'F' },
 * ]} />
 */
class SelectObjectInput extends Component {
    handleChange = (event, key, payload) => {
        this.props.onChange(this.props.source, payload);
    }

    render() {
        const { label, source, record, objects, property, valueProperty, options } = this.props;
        return (
            <SelectField
                menuStyle={{ maxHeight: '41px', overflowY: 'hidden' }}
                floatingLabelText={label}
                value={record[source]}
                onChange={this.handleChange}
                autoWidth
                {...options}
            >
                {objects.map(obj =>
                    <MenuItem key={obj[property]} primaryText={obj[property]} value={obj[valueProperty]} />
                )}
            </SelectField>
        );
    }
}

SelectObjectInput.propTypes = {
    label: PropTypes.string,
    source: PropTypes.string,
    record: PropTypes.object,
    objects: PropTypes.arrayOf(PropTypes.object),
    property: PropTypes.string.isRequired,
    valueProperty: PropTypes.string.isRequired,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

SelectObjectInput.defaultProps = {
    record: {},
    options: {},
    valueProperty: 'id',
    includesLabel: true,
};

export default SelectObjectInput;
