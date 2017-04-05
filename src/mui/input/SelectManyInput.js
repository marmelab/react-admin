import React, { Component, PropTypes } from 'react';
import ChipInput from 'material-ui-chip-input';
import FieldTitle from '../../util/FieldTitle';

/**
 * An Input component for a array
 *
 * @example
 * <SelectManyInput source="first_name" />
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
 * <SelectManyInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectManyInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */
export class SelectManyInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values : this.resolveValues(props.input.value || []),
        };
    }

    handleBlur = () => {
        var extracted = this.extractIds(this.state.values);
        this.props.onBlur(extracted);
        this.props.input.onBlur(extracted);
    };
    handleFocus = () => {
        var extracted = this.extractIds(this.state.values);
        this.props.onFocus(extracted);
        this.props.input.onFocus(extracted);
    };

    handleAdd = (newValue) => {
        this.state.values = [...this.state.values, newValue];
        this.handleChange(this.state.values);
    };

    handleDelete = (newValue) => {
        this.state.values = this.state.values.filter(v => (v[this.props.optionValue] !== newValue));
        this.handleChange(this.state.values);
    };

    handleChange = (eventOrValue) => {
        var extracted = this.extractIds(eventOrValue);
        this.props.onChange(extracted);
        this.props.input.onChange(extracted);
    };

    extractIds = (eventOrValue) => {
        let value = eventOrValue;
        if (value.target && value.target.value) {
            value = value.target.value;
        }
        if (Array.isArray(value)) {
            return value.map((o) => o[this.props.optionValue])
        }
        return [ value ];
    };

    resolveValues = (ids) => {
        if (this.props.choices && this.props.choices.length > 0) {
            return this.props.choices.filter((o) => ids.indexOf(o[this.props.optionValue]) >= 0);
        } else {
            return ids.map((id) => {
                let o = {};
                o[this.props.optionValue] = id;
                o[this.props.optionText] = id;
                return o;
            });
        }
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

        // Convert the name of fields in choices
        options['dataSourceConfig'] = {
            'text': optionText,
            'value': optionValue,
        };
        options['dataSource'] = choices;


        return (
            <ChipInput
                {...input}
                value={this.state.values}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onTouchTap={this.handleFocus}
                onRequestDelete={this.handleDelete}
                onRequestAdd={this.handleAdd}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
                errorText={touched && error}
                style={elStyle}
                {...options}
            />
        );
    }
}

SelectManyInput.propTypes = {
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
    validation: PropTypes.object,
};

SelectManyInput.defaultProps = {
    addField: true,
    choices: [],
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    optionText: 'name',
    optionValue: 'id',
};

export default SelectManyInput;
