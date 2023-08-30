import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
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
        fieldState: { error, invalid, isTouched },
        formState: { isSubmitted },
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
        ...rest,
    });
    const renderHelperText =
        helperText !== false || ((isTouched || isSubmitted) && invalid);
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
            margin={margin}
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
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
            variant={variant}
            {...sanitizeInputRestProps(rest)}
        >
            <MenuItem value="">{translate(nullLabel)}</MenuItem>
            <MenuItem value="false">{translate(falseLabel)}</MenuItem>
            <MenuItem value="true">{translate(trueLabel)}</MenuItem>
        </StyledTextField>
    );
};

NullableBooleanInput.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    nullLabel: PropTypes.string,
    falseLabel: PropTypes.string,
    trueLabel: PropTypes.string,
};

const PREFIX = 'RaNullableBooleanInput';

export const NullableBooleanInputClasses = {
    input: `${PREFIX}-input`,
};

const StyledTextField = styled(TextField, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme, fullWidth }) => ({
    [`&.${NullableBooleanInputClasses.input}`]: {
        width: fullWidth ? '100%' : theme.spacing(16),
    },
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
    Omit<TextFieldProps, 'label' | 'helperText'> & {
        nullLabel?: string;
        falseLabel?: string;
        trueLabel?: string;
    };
