import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { addField, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';

const leftPad = (nb = 2) => value => ('0'.repeat(nb) + value).slice(-nb);
const leftPad4 = leftPad(4);
const leftPad2 = leftPad(2);

/**
 * @param {Date} v value to convert
 * @returns {String} A standardized datetime (yyyy-MM-ddThh:mm), to be passed to an <input type="datetime-local" />
 */
const convertDateToString = v => {
    if (!(v instanceof Date) || isNaN(v)) return '';
    const yyyy = leftPad4(v.getFullYear());
    const MM = leftPad2(v.getMonth() + 1);
    const dd = leftPad2(v.getDate());
    const hh = leftPad2(v.getHours());
    const mm = leftPad2(v.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

// yyyy-MM-ddThh:mm
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/**
 * Converts a date from the Redux store, with timezone, to a date string
 * without timezone for use in an <input type="datetime-local" />.
 *
 * @param {Date | String} value date string or object
 */
const format = value => {
    // null, undefined and empty string values should not go through convertDateToString
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }

    if (value instanceof Date) {
        return convertDateToString(value);
    }
    // valid dates should not be converted
    if (dateTimeRegex.test(value)) {
        return value;
    }

    return convertDateToString(new Date(value));
};

/**
 * Converts a datetime string without timezone to a date object
 * with timezone, using the browser timezone.
 *
 * @param {String} value Date string, formatted as yyyy-MM-ddThh:mm
 * @return {Date}
 */
const parse = value => new Date(value);

/**
 * Input component for entering a date and a time with timezone, using the browser locale
 */
export const DateTimeInput = ({
    className,
    meta: { touched, error },
    input,
    isRequired,
    label,
    options,
    source,
    resource,
    ...rest
}) => (
    <TextField
        {...input}
        className={className}
        type="datetime-local"
        margin="normal"
        error={!!(touched && error)}
        helperText={touched && error}
        label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
        InputLabelProps={{
            shrink: true,
        }}
        {...options}
        {...sanitizeRestProps(rest)}
        value={input.value}
    />
);

DateTimeInput.propTypes = {
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

DateTimeInput.defaultProps = {
    options: {},
};

export default addField(DateTimeInput, { format, parse });
