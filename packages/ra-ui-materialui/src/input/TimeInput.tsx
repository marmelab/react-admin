import * as React from 'react';
import clsx from 'clsx';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useInput, FieldTitle } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';

/**
 * Converts a time string without timezone to a date object
 * with timezone, using the browser timezone.
 *
 * @param {string} value Date string, formatted as hh:mm
 * @return {Date}
 */
const parseTime = (value: string) => {
    if (!value) return null;
    const timeTokens = value.split(':').map(v => parseInt(v));
    const today = new Date();
    today.setHours(timeTokens[0] ?? 0);
    today.setMinutes(timeTokens[1] ?? 0);
    return today;
};

/**
 * Form input to edit a time string value in the "HH:mm" format (e.g. '17:45'),
 * using the browser locale for the timezone.
 *
 * Renders a time picker or a text input depending on the browser.
 *
 * This component works with Date objects to handle the timezone using the browser locale.
 * You can still pass string values as long as those can be converted to a JavaScript Date object.
 *
 * @example
 * import { Edit, SimpleForm, TimeInput } from 'react-admin';
 *
 * const PostEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <TimeInput source="published_at" />
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export const TimeInput = ({
    className,
    defaultValue,
    format = formatTime,
    label,
    helperText,
    margin,
    onBlur,
    onChange,
    source,
    resource,
    disabled,
    readOnly,
    parse = parseTime,
    validate,
    variant,
    ...rest
}: TimeInputProps) => {
    const { field, fieldState, id, isRequired } = useInput({
        defaultValue,
        format,
        parse,
        onBlur,
        onChange,
        resource,
        source,
        validate,
        readOnly,
        disabled,
        ...rest,
    });

    const { error, invalid } = fieldState;

    const renderHelperText = helperText !== false || invalid;

    return (
        <TextField
            id={id}
            {...field}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            type="time"
            size="small"
            variant={variant}
            margin={margin}
            error={invalid}
            disabled={disabled || readOnly}
            readOnly={readOnly}
            helperText={
                renderHelperText ? (
                    <InputHelperText
                        error={error?.message}
                        helperText={helperText}
                    />
                ) : null
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
            {...sanitizeInputRestProps(rest)}
        />
    );
};

export type TimeInputProps = CommonInputProps &
    Omit<TextFieldProps, 'helperText' | 'label'>;

const leftPad =
    (nb = 2) =>
    value =>
        ('0'.repeat(nb) + value).slice(-nb);
const leftPad2 = leftPad(2);

/**
 * @param {Date} value value to convert
 * @returns {String} A standardized time (hh:mm), to be passed to an <input type="time" />
 */
const convertDateToString = (value: Date) => {
    if (!(value instanceof Date) || isNaN(value.getDate())) return '';
    const hh = leftPad2(value.getHours());
    const mm = leftPad2(value.getMinutes());
    return `${hh}:${mm}`;
};

// hh:mm
const timeRegex = /^\d{2}:\d{2}$/;
const defaultInputLabelProps = { shrink: true };

/**
 * Converts a date from the dataProvider, with timezone, to a time string
 * without timezone for use in an <input type="time" />.
 *
 * @param {Date | String} value date string or object
 */
const formatTime = (value: string | Date) => {
    // null, undefined and empty string values should not go through convertDateToString
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }

    if (value instanceof Date) {
        return convertDateToString(value);
    }
    // valid dates should not be converted
    if (timeRegex.test(value)) {
        return value;
    }

    return convertDateToString(new Date(value));
};
