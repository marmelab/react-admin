import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useInput, FieldTitle } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { InputHelperText } from './InputHelperText';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';

/**
 * An Input component for a number
 *
 * @example
 * <NumberInput source="nb_views" />
 *
 * You can customize the `step` props (which defaults to "any")
 * @example
 * <NumberInput source="nb_views" step={1} />
 *
 */
export const NumberInput = ({
    className,
    defaultValue = null,
    format = convertNumberToString,
    helperText,
    label,
    margin,
    onChange,
    onBlur,
    onFocus,
    parse,
    resource,
    source,
    step = 'any',
    min,
    max,
    validate,
    variant,
    inputProps: overrideInputProps,
    ...rest
}: NumberInputProps) => {
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
    const { onBlur: onBlurFromField } = field;

    const inputProps = { ...overrideInputProps, step, min, max };

    // This is a controlled input that renders directly the string typed by the user.
    // This string is converted to a number on change, and stored in the form state,
    // but that number is not not displayed.
    // This is to allow transitory values like '1.0' that will lead to '1.02'

    // text typed by the user and displayed in the input, unparsed
    const [value, setValue] = React.useState(format(field.value));

    const hasFocus = React.useRef(false);

    // update the input text when the record changes
    React.useEffect(() => {
        if (!hasFocus.current) {
            const stringValue = format(field.value);
            setValue(value => (value !== stringValue ? stringValue : value));
        }
    }, [field.value, format]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setValue(target.value);
        const newValue =
            target.valueAsNumber !== undefined &&
            target.valueAsNumber !== null &&
            !isNaN(target.valueAsNumber)
                ? parse
                    ? parse(target.valueAsNumber)
                    : target.valueAsNumber
                : parse
                ? parse(target.value)
                : convertStringToNumber(target.value);
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
        const stringValue = format(field.value);
        setValue(value => (value !== stringValue ? stringValue : value));
    };

    const renderHelperText =
        helperText !== false || ((isTouched || isSubmitted) && invalid);

    const { ref, ...fieldWithoutRef } = field;
    return (
        <TextField
            id={id}
            {...fieldWithoutRef}
            inputRef={ref}
            // use the locally controlled state instead of the react-hook-form field state
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            type="number"
            size="small"
            variant={variant}
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
            margin={margin}
            inputProps={inputProps}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

NumberInput.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

NumberInput.defaultProps = {
    step: 'any',
    textAlign: 'right',
};

export interface NumberInputProps
    extends CommonInputProps,
        Omit<
            TextFieldProps,
            | 'label'
            | 'helperText'
            | 'defaultValue'
            | 'onChange'
            | 'onBlur'
            | 'type'
        > {
    step?: string | number;
    min?: string | number;
    max?: string | number;
}

const convertStringToNumber = value => {
    if (value == null || value === '') {
        return null;
    }
    const float = parseFloat(value);

    return isNaN(float) ? 0 : float;
};

const convertNumberToString = value =>
    value == null || isNaN(value) ? '' : value.toString();
