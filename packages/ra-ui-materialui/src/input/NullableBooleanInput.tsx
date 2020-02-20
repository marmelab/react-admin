import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useInput, useTranslate, FieldTitle, InputProps } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
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

const NullableBooleanInput: FunctionComponent<
    InputProps<TextFieldProps> & Omit<TextFieldProps, 'label' | 'helperText'>
> = ({
    className,
    format = getStringFromBoolean,
    helperText,
    label,
    margin = 'dense',
    onBlur,
    onChange,
    onFocus,
    options,
    displayNull,
    parse = getBooleanFromString,
    resource,
    source,
    validate,
    variant = 'filled',
    ...rest
}) => {
    const classes = useStyles({});
    const translate = useTranslate();

    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate,
    });

    const enhancedOptions = displayNull
        ? {
              ...options,
              SelectProps: {
                  displayEmpty: true,
                  ...(options && options.SelectProps),
              },
              InputLabelProps: {
                  shrink: true,
                  ...(options && options.InputLabelProps),
              },
          }
        : options;

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
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
            className={classnames(classes.input, className)}
            variant={variant}
            {...enhancedOptions}
            {...sanitizeRestProps(rest)}
        >
            <MenuItem value="">{translate('ra.boolean.null')}</MenuItem>
            <MenuItem value="false">{translate('ra.boolean.false')}</MenuItem>
            <MenuItem value="true">{translate('ra.boolean.true')}</MenuItem>
        </TextField>
    );
};

NullableBooleanInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

export default NullableBooleanInput;
