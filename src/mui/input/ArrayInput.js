import React, { Component, PropTypes } from 'react';
import ChipInput from 'material-ui-chip-input';
import FieldTitle from '../../util/FieldTitle';

/**
 * An Input component for a array
 *
 * @example
 * <ArrayInput source="first_name" />
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 * @example
 * const choices = [ 'Male', 'Female' ];
 * <ArrayInput source="gender" choices={choices} />
 *
 * You might want to pass the type='object', instead of 'text'. If then, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <ArrayInput source="gender" type="object" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <ArrayInput source="author_id" type="object" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */
export class ArrayInput extends Component {
    // Comment input onBlur because ArrayInput don't pass correct values on this event
    handleBlur = (eventOrValue) => {
        this.props.onBlur(eventOrValue);
        // this.props.input.onBlur(eventOrValue);
    };
    // Comment input onFocus because ArrayInput don't pass correct values on this event
    handleFocus = (event) => {
        this.props.onFocus(event);
        // this.props.input.onFocus(event);
    };

    handleChange = (eventOrValue) => {
        this.props.onChange(eventOrValue);
        this.props.input.onChange(eventOrValue);
    };

    render() {
        const {
            elStyle,
            input,
            choices,
            label,
            meta: { touched, error },
            options,
            optionText,
            optionValue,
            resource,
            source,
            type,
        } = this.props;

        if (type == 'object') {
            // Convert the name of fields in choices
            options['dataSourceConfig'] = {
                'text': optionText,
                'value': optionValue,
            };
        }
        options['dataSource'] = choices;

        // Use uncontrolled mode
        const defaultValue = input.value ? input.value : [];
        delete input.value;

        return (
            <ChipInput
                {...input}
                defaultValue={defaultValue}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onTouchTap={this.handleFocus}
                onChange={this.handleChange}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
                errorText={touched && error}
                style={elStyle}
                {...options}
            />
        );
    }
}

ArrayInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    choices: PropTypes.arrayOf(PropTypes.object),
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.object,
    optionText: PropTypes.string.isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    source: PropTypes.string,
    type: PropTypes.oneOf(['string', 'object']),
    validation: PropTypes.object,
};

ArrayInput.defaultProps = {
    addField: true,
    choices: [],
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    optionText: 'name',
    optionValue: 'id',
    type: 'string',
};

export default ArrayInput;
