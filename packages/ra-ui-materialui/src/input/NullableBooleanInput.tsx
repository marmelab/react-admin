import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useInput, useTranslate, FieldTitle, InputProps } from 'ra-core';

import sanitizeInputRestProps from './sanitizeInputRestProps';
import InputHelperText from './InputHelperText';

const useStyles = makeStyles(
    theme => ({
        input: { width: theme.spacing(16) },
    }),
    { name: 'RaNullableBooleanInput' }
);

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

export type NullableBooleanInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'label' | 'helperText'> & {
        nullLabel?: string;
        falseLabel?: string;
        trueLabel?: string;
    };

const NullableBooleanInput = (props: NullableBooleanInputProps) => {
    const {
        className,
        classes: classesOverride,
        format = getStringFromBoolean,
        helperText,
        label,
        margin = 'dense',
        onBlur,
        onChange,
        onFocus,
        options,
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
    const classes = useStyles(props);
    const translate = useTranslate();

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
        validate,
        ...rest,
    });

    return (
        <TextField
            id={id}
            {...input}
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
            error={!!(touched && (error || submitError))}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error || submitError}
                    helperText={helperText}
                />
            }
            className={classnames(classes.input, className)}
            variant={variant}
            {...options}
            {...sanitizeInputRestProps(rest)}
        >
            <MenuItem value="">{translate(nullLabel)}</MenuItem>
            <MenuItem value="false">{translate(falseLabel)}</MenuItem>
            <MenuItem value="true">{translate(trueLabel)}</MenuItem>
        </TextField>
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

export default NullableBooleanInput;
