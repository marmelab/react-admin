import React, { useCallback, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useField, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';
import { InputProps } from './types';

/**
 * Convert Date object to String
 *
 * @param {Date} v value to convert
 * @returns {String} A standardized date (yyyy-MM-dd), to be passed to an <input type="date" />
 */
const convertDateToString = v => {
    if (!(v instanceof Date) || isNaN(v.getDate())) return;
    const pad = '00';
    const yyyy = v.getFullYear().toString();
    const MM = (v.getMonth() + 1).toString();
    const dd = v.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const sanitizeValue = value => {
    // null, undefined and empty string values should not go through convertDateToString
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }

    if (value instanceof Date) {
        return convertDateToString(value);
    }

    // valid dates should not be converted
    if (dateRegex.test(value)) {
        return value;
    }

    return convertDateToString(new Date(value));
};

const DateInput: FunctionComponent<
    InputProps<TextFieldProps> & TextFieldProps
> = ({
    className,
    label,
    options,
    source,
    resource,
    helperText,
    validate,
    ...rest
}) => {
    const {
        input,
        isRequired,
        meta: { touched, error },
    } = useField({ source, validate, ...rest });

    const handleChange = useCallback(
        event => {
            input.onChange(event.target.value);
        },
        [input]
    );

    const value = sanitizeValue(input.value);

    return (
        <TextField
            {...input}
            className={className}
            type="date"
            margin="normal"
            id={`${resource}_${source}_date_input`}
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
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
            onChange={handleChange}
        />
    );
};

DateInput.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateInput.defaultProps = {
    options: {},
};

export default DateInput;
