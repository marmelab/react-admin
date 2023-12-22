import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useInput, FieldTitle } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';

/**
 * Converts a datetime string without timezone to a date object
 * with timezone, using the browser timezone.
 *
 * @param {string} value Date string, formatted as yyyy-MM-ddThh:mm
 * @return {Date}
 */
const parseDateTime = (value: string) =>
    value ? new Date(value) : value === '' ? null : value;

/**
 * Input component for entering a date and a time with timezone, using the browser locale
 */
export const DateTimeInput = ({
    className,
    defaultValue,
    format = formatDateTime,
    label,
    helperText,
    margin,
    onBlur,
    onChange,
    onFocus,
    source,
    resource,
    parse = parseDateTime,
    validate,
    variant,
    ...rest
}: DateTimeInputProps) => {
    const {
        field,
        fieldState: { error, invalid, isTouched },
        formState: { isSubmitted },
        id,
        isRequired,
    } = useInput({
        defaultValue,
        onBlur,
        resource,
        source,
        validate,
        ...rest,
    });
    const [renderCount, setRenderCount] = React.useState(1);

    const initialDefaultValueRef = React.useRef(field.value);

    React.useEffect(() => {
        const initialDateValue =
            new Date(initialDefaultValueRef.current).getTime() || null;

        const fieldDateValue = new Date(field.value).getTime() || null;

        if (initialDateValue !== fieldDateValue) {
            setRenderCount(r => r + 1);
            parse
                ? field.onChange(parse(field.value))
                : field.onChange(field.value);
            initialDefaultValueRef.current = field.value;
        }
    }, [setRenderCount, parse, field]);

    const { onBlur: onBlurFromField } = field;
    const hasFocus = React.useRef(false);

    // update the input text when the user types in the input
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(event);
        }
        if (
            typeof event.target === 'undefined' ||
            typeof event.target.value === 'undefined'
        ) {
            return;
        }
        const target = event.target;

        const newValue =
            target.valueAsDate !== undefined &&
            target.valueAsDate !== null &&
            !isNaN(new Date(target.valueAsDate).getTime())
                ? parse
                    ? parse(target.valueAsDate)
                    : target.valueAsDate
                : parse
                ? parse(target.value)
                : formatDateTime(target.value);

        field.onChange(newValue);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        if (onFocus) {
            onFocus(event);
        }
        hasFocus.current = true;
    };

    const handleBlur = () => {
        if (onBlurFromField) {
            onBlurFromField();
        }
        hasFocus.current = false;
    };

    const renderHelperText =
        helperText !== false || ((isTouched || isSubmitted) && invalid);

    const { ref, name } = field;

    return (
        <TextField
            id={id}
            inputRef={ref}
            name={name}
            defaultValue={format(initialDefaultValueRef.current)}
            key={renderCount}
            type="datetime-local"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            size="small"
            variant={variant}
            margin={margin}
            error={(isTouched || isSubmitted) && invalid}
            helperText={
                renderHelperText ? (
                    <InputHelperText
                        touched={isTouched || isSubmitted}
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

DateTimeInput.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    resource: PropTypes.string,
    source: PropTypes.string,
};

export type DateTimeInputProps = CommonInputProps &
    Omit<TextFieldProps, 'helperText' | 'label'>;

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
 * Converts a date from the dataProvider, with timezone, to a date string
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
