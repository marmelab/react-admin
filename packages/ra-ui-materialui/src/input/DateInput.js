import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { addField, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';

/**
 * Convert Date object to String
 *
 * @param {Date} v value to convert
 * @returns {String} A standardized date (yyyy-MM-dd), to be passed to an <input type="date" />
 */
const dateFormatter = v => {
    if (!(v instanceof Date) || isNaN(v.getDate())) return;
    const pad = '00';
    const yyyy = v.getFullYear().toString();
    const MM = (v.getMonth() + 1).toString();
    const dd = v.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const sanitizeValue = value => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }

    if (value instanceof Date) {
        return dateFormatter(value);
    }

    // valid dates should not be converted
    if (dateRegex.test(value)) {
        return value;
    }

    return dateFormatter(new Date(value));
};

export class DateInput extends Component {
    onChange = event => {
        this.props.input.onChange(event.target.value);
    };

    render() {
        const {
            className,
            meta,
            input,
            isRequired,
            label,
            options,
            source,
            resource,
            ...rest
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The DateInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;
        const value = sanitizeValue(input.value);

        return (
            <TextField
                {...input}
                className={className}
                type="date"
                margin="normal"
                id={`${resource}_${source}_date_input`}
                error={!!(touched && error)}
                helperText={touched && error}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                InputLabelProps={{
                    shrink: true,
                }}
                {...options}
                {...sanitizeRestProps(rest)}
                value={value}
                onChange={this.onChange}
            />
        );
    }
}

DateInput.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateInput.defaultProps = {
    options: {},
};

export default addField(DateInput);
