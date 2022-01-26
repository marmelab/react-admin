import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup, { FormGroupProps } from '@mui/material/FormGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { FieldTitle, useInput } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';
import { InputPropTypes } from './InputPropTypes';

export const BooleanInput = (props: BooleanInputProps) => {
    const {
        className,
        format,
        label,
        fullWidth,
        helperText,
        onBlur,
        onChange,
        onFocus,
        disabled,
        parse,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const {
        id,
        field,
        isRequired,
        fieldState: { error, invalid, isTouched },
        formState: { isSubmitted },
    } = useInput({
        format,
        parse,
        resource,
        source,
        type: 'checkbox',
        validate,
        ...rest,
    });

    const handleChange = useCallback(
        (event, value) => {
            field.onChange(value);
            // Ensure field is considered as touched
            field.onBlur();
        },
        [field]
    );

    return (
        <FormGroup className={className} {...sanitizeInputRestProps(rest)}>
            <FormControlLabel
                control={
                    <Switch
                        id={id}
                        name={field.name}
                        color="primary"
                        onChange={handleChange}
                        checked={field.value}
                        {...sanitizeInputRestProps(rest)}
                        disabled={disabled}
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
            />
            <FormHelperText error={(isTouched || isSubmitted) && invalid}>
                <InputHelperText
                    touched={isTouched}
                    error={error?.message}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormGroup>
    );
};

BooleanInput.propTypes = {
    ...InputPropTypes,
    // @ts-ignore
    options: PropTypes.shape(Switch.propTypes),
    disabled: PropTypes.bool,
};

BooleanInput.defaultProps = {
    options: {},
};

export type BooleanInputProps = CommonInputProps &
    SwitchProps &
    Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'>;
