import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup, { FormGroupProps } from '@mui/material/FormGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { FieldTitle, useInput } from 'ra-core';

import { InputProps } from './types';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';
import { InputPropTypes } from './InputPropTypes';

export const BooleanInput = (props: BooleanInputProps) => {
    const {
        defaultValue = false,
        format,
        label,
        fullWidth,
        helperText,
        onBlur,
        onChange,
        onFocus,
        options,
        disabled,
        parse,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const {
        id,
        input: {
            onBlur: formOnBlur,
            onChange: formOnChange,
            value,
            ...inputProps
        },
        isRequired,
        meta: { error, isTouched },
    } = useInput({
        defaultValue,
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const handleChange = useCallback(
        (event, value) => {
            formOnChange(value);
            formOnBlur(undefined);
        },
        [formOnBlur, formOnChange]
    );

    return (
        <FormGroup {...sanitizeInputRestProps(rest)}>
            <FormControlLabel
                control={
                    <Switch
                        id={id}
                        color="primary"
                        onChange={handleChange}
                        {...inputProps}
                        {...options}
                        checked={value}
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
            <FormHelperText error={isTouched && !!error}>
                <InputHelperText
                    touched={isTouched}
                    error={error}
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

export type BooleanInputProps = InputProps<SwitchProps> &
    Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'>;
