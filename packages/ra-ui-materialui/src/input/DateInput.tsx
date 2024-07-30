import * as React from 'react';
import clsx from 'clsx';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useInput, FieldTitle } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';

/**
 * Form input to edit a Date string value in the "YYYY-MM-DD" format (e.g. '2021-06-23').
 *
 * Renders a date picker (the exact UI depends on the browser).
 *
 * @example
 * import { Edit, SimpleForm, DateInput } from 'react-admin';
 *
 * const PostEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <DateInput source="published_at" />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 * // If the initial value is a Date object, DateInput converts it to a string
 * // but you must pass a custom parse method to convert the form value
 * // (which is always a date string) back to a Date object.
 * <DateInput source="published_at" parse={val => new Date(val)} />
 */
export const DateInput = ({
    className,
    defaultValue,
    format = getStringFromDate,
    label,
    source,
    resource,
    helperText,
    margin,
    onBlur,
    onChange,
    onFocus,
    parse,
    validate,
    variant,
    disabled,
    readOnly,
    ...rest
}: DateInputProps) => {
    const { field, fieldState, id, isRequired } = useInput({
        defaultValue,
        onBlur,
        resource,
        source,
        validate,
        disabled,
        readOnly,
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
                    : getStringFromDate(target.valueAsDate)
                : parse
                  ? parse(target.value)
                  : getStringFromDate(target.value);

        // if value empty, set it to null
        if (newValue === '') {
            field.onChange(null);
            return;
        }

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

    const { error, invalid } = fieldState;
    const renderHelperText = helperText !== false || invalid;

    const { ref, name } = field;

    console.log('field', field);

    return (
        <TextField
            id={id}
            name={name}
            inputRef={ref}
            defaultValue={format(initialDefaultValueRef.current)}
            key={renderCount}
            type="date"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={clsx('ra-input', `ra-input-${source}`, className)}
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

export type DateInputProps = CommonInputProps &
    Omit<TextFieldProps, 'helperText' | 'label'>;

/**
 * Convert Date object to String
 *
 * @param {Date} value value to convert
 * @returns {String} A standardized date (yyyy-MM-dd), to be passed to an <input type="date" />
 */
const convertDateToString = (value: Date) => {
    if (!(value instanceof Date) || isNaN(value.getDate())) return '';
    const pad = '00';
    const yyyy = value.getFullYear().toString();
    const MM = (value.getMonth() + 1).toString();
    const dd = value.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const defaultInputLabelProps = { shrink: true };

const getStringFromDate = (value: string | Date) => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return null;
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
