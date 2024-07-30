import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';
import { useInput, useTranslate, FieldTitle } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';

export const NullableBooleanInput = (props: NullableBooleanInputProps) => {
    const {
        className,
        format = getStringFromBoolean,
        helperText,
        label,
        margin,
        onBlur,
        onChange,
        parse = getBooleanFromString,
        resource,
        disabled,
        readOnly,
        source,
        validate,
        variant,
        nullLabel = 'ra.boolean.null',
        falseLabel = 'ra.boolean.false',
        trueLabel = 'ra.boolean.true',
        ...rest
    } = props;

    const translate = useTranslate();

    const {
        field,
        fieldState: { error, invalid },
        id,
        isRequired,
    } = useInput({
        format,
        parse,
        onBlur,
        onChange,
        resource,
        source,
        validate,
        disabled,
        readOnly,
        ...rest,
    });
    const renderHelperText = helperText !== false || invalid;
    return (
        <StyledTextField
            id={id}
            size="small"
            {...field}
            className={clsx(
                'ra-input',
                `ra-input-${source}`,
                NullableBooleanInputClasses.input,
                className
            )}
            select
            disabled={disabled || readOnly}
            readOnly={readOnly}
            margin={margin}
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            error={invalid}
            helperText={
                renderHelperText ? (
                    <InputHelperText
                        error={error?.message}
                        helperText={helperText}
                    />
                ) : null
            }
            variant={variant}
            {...sanitizeInputRestProps(rest)}
        >
            <MenuItem value="">{translate(nullLabel)}</MenuItem>
            <MenuItem value="false">{translate(falseLabel)}</MenuItem>
            <MenuItem value="true">{translate(trueLabel)}</MenuItem>
        </StyledTextField>
    );
};

const PREFIX = 'RaNullableBooleanInput';

export const NullableBooleanInputClasses = {
    input: `${PREFIX}-input`,
};

const StyledTextField = styled(TextField, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    minWidth: theme.spacing(20),
    [theme.breakpoints.down('sm')]: {
        [`&.${NullableBooleanInputClasses.input}`]: {
            width: '100%',
        },
    },
}));

const getBooleanFromString = (value: string): boolean | null => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
};

const getStringFromBoolean = (value?: boolean | null): string => {
    if (value === true) return 'true';
    if (value === false) return 'false';
    return '';
};

export type NullableBooleanInputProps = CommonInputProps &
    Omit<TextFieldProps, 'label' | 'helperText' | 'readOnly'> & {
        nullLabel?: string;
        falseLabel?: string;
        trueLabel?: string;
    };
