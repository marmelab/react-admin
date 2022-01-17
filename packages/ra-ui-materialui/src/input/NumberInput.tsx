import * as React from 'react';
import PropTypes from 'prop-types';
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
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
export const NumberInput = ({
    format,
    helperText,
    label,
    margin = 'dense',
    onBlur,
    onChange,
    parse = convertStringToNumber,
    resource,
    source,
    step,
    min,
    max,
    validate,
    variant = 'filled',
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
        format,
        onBlur,
        onChange,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const inputProps = { ...overrideInputProps, step, min, max };

    return (
        <TextField
            id={id}
            {...field}
            type="number"
            variant={variant}
            error={(isTouched || isSubmitted) && invalid}
            helperText={
                <InputHelperText
                    touched={isTouched || isSubmitted}
                    error={error?.message}
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
            margin={margin}
            inputProps={inputProps}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

NumberInput.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

NumberInput.defaultProps = {
    options: {},
    step: 'any',
    textAlign: 'right',
};

export interface NumberInputProps
    extends CommonInputProps,
        Omit<
            TextFieldProps,
            'label' | 'helperText' | 'defaultValue' | 'onChange' | 'onBlur'
        > {
    step?: string | number;
    min?: string | number;
    max?: string | number;
}

const convertStringToNumber = value => {
    const float = parseFloat(value);

    return isNaN(float) ? null : float;
};
