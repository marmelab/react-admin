import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup, { FormGroupProps } from '@mui/material/FormGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Booleans, Call, Objects } from 'hotscript';
import { FieldTitle, useInput } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';
import { InputPropTypes } from './InputPropTypes';

export const BooleanInput = <
    RecordType extends Record<string, any> = Record<string, any>,
    // By default, Source should allow all possible paths for RecordType (author, author.name, etc.)
    Source extends string = Call<
        Objects.AllPaths,
        // Here we pick only the paths that contain a boolean
        Call<Objects.PickBy<Booleans.Equals<boolean>>, RecordType>
    > extends never // But if RecordType is not provided explicitly, Source would be never
        ? string // So we default to string in this case
        : Call<
              Objects.AllPaths,
              Call<Objects.PickBy<Booleans.Equals<boolean>>, RecordType>
          >
>(
    props: BooleanInputProps<RecordType, Source>
) => {
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
        disabled,
        parse,
        resource,
        source,
        validate,
        options,
        sx,
        ...rest
    } = props;
    const {
        id,
        field,
        isRequired,
        fieldState: { error, invalid, isTouched },
        formState: { isSubmitted },
    } = useInput<Source, boolean>({
        defaultValue,
        format,
        parse,
        resource,
        source,
        onBlur,
        onChange,
        type: 'checkbox',
        validate,
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

    return (
        <FormGroup
            className={clsx('ra-input', `ra-input-${source}`, className)}
            row={row}
            sx={sx}
        >
            <FormControlLabel
                control={
                    <Switch
                        id={id}
                        name={field.name}
                        color="primary"
                        onChange={handleChange}
                        onFocus={onFocus}
                        checked={field.value}
                        {...sanitizeInputRestProps(rest)}
                        {...options}
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
                    touched={isTouched || isSubmitted}
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

export type BooleanInputProps<
    RecordType extends Record<string, any> = Record<string, any>,
    // By default, Source should allow all possible paths for RecordType (author, author.name, etc.)
    Source extends string = Call<
        Objects.AllPaths,
        // Here we pick only the paths that contain a boolean
        Call<Objects.PickBy<Booleans.Equals<boolean>>, RecordType>
    > extends never // But if RecordType is not provided explicitly, Source would be never
        ? string // So we default to string in this case
        : Call<
              Objects.AllPaths,
              Call<Objects.PickBy<Booleans.Equals<boolean>>, RecordType>
          >
> = CommonInputProps<Source, boolean> &
    SwitchProps &
    Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'> & {
        options: SwitchProps;
    };
