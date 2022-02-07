import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import classnames from 'classnames';
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
        margin = 'dense',
        onBlur,
        onChange,
        parse = getBooleanFromString,
        resource,
        source,
        validate,
        variant = 'filled',
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

    return (
        <StyledTextField
            id={id}
            {...field}
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
                <InputHelperText
                    touched={isTouched}
                    error={error?.message}
                    helperText={helperText}
                />
            }
            className={classnames(NullableBooleanInputClasses.input, className)}
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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
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

const StyledTextField = styled(TextField, { name: PREFIX })(({ theme }) => ({
    [`&.${NullableBooleanInputClasses.input}`]: { width: theme.spacing(16) },
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
