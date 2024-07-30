import * as React from 'react';
import { useCallback } from 'react';
import clsx from 'clsx';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup, { FormGroupProps } from '@mui/material/FormGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { FieldTitle, useInput } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';

export const BooleanInput = (props: BooleanInputProps) => {
    const {
        className,
        row = false,
        defaultValue = false,
        format,
        label,
        fullWidth,
        helperText,
        onBlur,
        onChange,
        onFocus,
        readOnly,
        disabled,
        parse,
        resource,
        source,
        validate,
        options = defaultOptions,
        sx,
        ...rest
    } = props;
    const {
        id,
        field,
        isRequired,
        fieldState: { error, invalid },
    } = useInput({
        defaultValue,
        format,
        parse,
        resource,
        source,
        onBlur,
        onChange,
        type: 'checkbox',
        validate,
        disabled,
        readOnly,
        ...rest,
    });

    const handleChange = useCallback(
        event => {
            field.onChange(event);
            // Ensure field is considered as touched
            field.onBlur();
        },
        [field]
    );

    const renderHelperText = helperText !== false || invalid;

    return (
        <FormGroup
            className={clsx('ra-input', `ra-input-${source}`, className)}
            row={row}
            sx={sx}
        >
            <FormControlLabel
                inputRef={field.ref}
                control={
                    <Switch
                        id={id}
                        name={field.name}
                        onChange={handleChange}
                        onFocus={onFocus}
                        checked={Boolean(field.value)}
                        {...sanitizeInputRestProps(rest)}
                        {...options}
                        disabled={disabled || readOnly}
                        readOnly={readOnly}
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
            {renderHelperText ? (
                <FormHelperText error={invalid}>
                    <InputHelperText
                        error={error?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </FormGroup>
    );
};

export type BooleanInputProps = CommonInputProps &
    Omit<SwitchProps, 'defaultValue'> &
    Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'> & {
        options?: SwitchProps;
    };

const defaultOptions = {};
