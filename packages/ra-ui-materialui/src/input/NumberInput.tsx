import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useInput, FieldTitle, InputProps } from 'ra-core';

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
    onFocus,
    onChange,
    options,
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
    const theme = useTheme();

    const {
        id,
        input,
        isRequired,
        meta: { error, submitError, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'number',
        validate,
        ...rest,
    });

    const inputProps = { ...overrideInputProps, step, min, max };

    return (
        <TextField
            id={id}
            {...input}
            variant={
                theme.components?.MuiTextField?.defaultProps?.variant || variant
            }
            margin={
                theme.components?.MuiTextField?.defaultProps?.margin || margin
            }
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
            inputProps={inputProps}
            {...options}
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
    extends InputProps<TextFieldProps>,
        Omit<
            TextFieldProps,
            | 'label'
            | 'helperText'
            | 'onChange'
            | 'onBlur'
            | 'onFocus'
            | 'defaultValue'
        > {
    step?: string | number;
    min?: string | number;
    max?: string | number;
}

const convertStringToNumber = value => {
    const float = parseFloat(value);

    return isNaN(float) ? null : float;
};
