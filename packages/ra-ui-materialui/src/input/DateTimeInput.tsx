import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useInput, FieldTitle, InputProps } from 'ra-core';

import sanitizeInputRestProps from './sanitizeInputRestProps';
import InputHelperText from './InputHelperText';

const leftPad = (nb = 2) => value => ('0'.repeat(nb) + value).slice(-nb);
const leftPad4 = leftPad(4);
const leftPad2 = leftPad(2);

/**
 * @param {Date} value value to convert
 * @returns {String} A standardized datetime (yyyy-MM-ddThh:mm), to be passed to an <input type="datetime-local" />
 */
const convertDateToString = (value: Date) => {
    if (!(value instanceof Date) || isNaN(value.getDate())) return '';
    const yyyy = leftPad4(value.getFullYear());
    const MM = leftPad2(value.getMonth() + 1);
    const dd = leftPad2(value.getDate());
    const hh = leftPad2(value.getHours());
    const mm = leftPad2(value.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

// yyyy-MM-ddThh:mm
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const defaultInputLabelProps = { shrink: true };

/**
 * Converts a date from the Redux store, with timezone, to a date string
 * without timezone for use in an <input type="datetime-local" />.
 *
 * @param {Date | String} value date string or object
 */
const formatDateTime = (value: string | Date) => {
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
 * @param {string} value Date string, formatted as yyyy-MM-ddThh:mm
 * @return {Date}
 */
const parseDateTime = (value: string) => new Date(value);

/**
 * Input component for entering a date and a time with timezone, using the browser locale
 */
const DateTimeInput = ({
    defaultValue,
    format = formatDateTime,
    initialValue,
    label,
    helperText,
    margin = 'dense',
    onBlur,
    onChange,
    onFocus,
    options,
    source,
    resource,
    parse = parseDateTime,
    validate,
    variant = 'filled',
    ...rest
}: DateTimeInputProps) => {
    const { id, input, isRequired, meta } = useInput({
        defaultValue,
        format,
        initialValue,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'datetime-local',
        validate,
        ...rest,
    });

    const { error, submitError, touched } = meta;

    return (
        <TextField
            id={id}
            {...input}
            // Workaround https://github.com/final-form/react-final-form/issues/529
            // and https://github.com/final-form/react-final-form/issues/431
            value={format(input.value) || ''}
            variant={variant}
            margin={margin}
            error={!!(touched && (error || submitError))}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error || submitError}
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
            InputLabelProps={defaultInputLabelProps}
            {...options}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

DateTimeInput.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateTimeInput.defaultProps = {
    options: {},
};

export type DateTimeInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'helperText' | 'label'>;

export default DateTimeInput;
