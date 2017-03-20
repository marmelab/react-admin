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
 * The `type="embedded"` will result the array of choices with full json object inside.
 * If you just want the result value is array of ids, please use `type="object"`.
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <ArrayInput source="gender" type="embedded" choices={choices} />
 *
 * Values => ['M']
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <ArrayInput source="author_id" type="embedded" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */
export class ArrayInput extends Component {
    // Comment input onBlur because ArrayInput don't pass correct values on this event
    handleBlur = (eventOrValue) => {
        // this.props.onBlur(eventOrValue);
        // this.props.input.onBlur(eventOrValue);
    };
    // Comment input onFocus because ArrayInput don't pass correct values on this event
    handleFocus = (event) => {
        // this.props.onFocus(event);
        // this.props.input.onFocus(event);
    };

    handleChange = (eventOrValue) => {
        if (this.props.type == 'object') {
            eventOrValue = this.extractIds(eventOrValue);
        }
        this.props.onChange(eventOrValue);
        this.props.input.onChange(eventOrValue);
    };

    extractIds = (eventOrValue) => {
        let value = eventOrValue;
        if (value.target && value.target.value) {
            value = value.target.value;
        }
        if (Array.isArray(value)) {
            return value.map((o) => o[this.props.optionValue])
        }
        return value;
    };

    filterObjectByIds = (ids) => {
        return this.props.choices.filter((o) => ids.indexOf(o[this.props.optionValue]) >= 0);
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

        // Always use uncontrolled mode
        let defaultValue = input.value || [];
        if (type == 'object') {
            defaultValue = this.filterObjectByIds(defaultValue);
        }

        if (type == 'embedded' || type == 'object') {
            // Convert the name of fields in choices
            options['dataSourceConfig'] = {
                'text': optionText,
                'value': optionValue,
            };
        } else {
            delete options['dataSourceConfig'];
        }
        options['dataSource'] = choices;


        return (
            <ChipInput
                {...input}
                defaultValue={defaultValue}
                value={null}
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
    type: PropTypes.oneOf(['string', 'object', 'embedded']),
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
