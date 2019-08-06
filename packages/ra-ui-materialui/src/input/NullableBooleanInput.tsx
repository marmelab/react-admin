import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useField, useTranslate, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';
import { InputProps } from './types';

const useStyles = makeStyles(theme => ({
    input: { width: theme.spacing(16) },
}));

const NullableBooleanInput: FunctionComponent<
    InputProps<TextFieldProps> & TextFieldProps
> = ({
    className,
    label,
    options,
    resource,
    source,
    helperText,
    validate,
    ...rest
}) => {
    const classes = useStyles({});
    const translate = useTranslate();

    const getBooleanFromString = value => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return null;
    };

    const getStringFromBoolean = value => {
        if (value === true) return 'true';
        if (value === false) return 'false';
        return '';
    };

    const {
        id,
        input,
        isRequired,
        meta: { touched, error },
    } = useField({
        source,
        validate,
        parse: getBooleanFromString,
        format: getStringFromBoolean,
        ...rest,
    });

    return (
        <TextField
            id={id}
            select
            margin="normal"
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
            {...input}
            {...options}
            {...sanitizeRestProps(rest)}
        >
            <MenuItem value="" />
            <MenuItem value="false">{translate('ra.boolean.false')}</MenuItem>
            <MenuItem value="true">{translate('ra.boolean.true')}</MenuItem>
        </TextField>
    );
};

NullableBooleanInput.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

export default NullableBooleanInput;
