import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useField, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import { InputProps } from './types';

const DisabledInput: FunctionComponent<
    InputProps<TextFieldProps> & TextFieldProps
> = ({
    classes,
    className,
    record,
    label,
    resource,
    source,
    options,
    validate,
    ...rest
}) => {
    const { input, isRequired } = useField({ source, validate, ...rest });

    return (
        <TextField
            disabled
            margin="normal"
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            className={className}
            classes={classes}
            {...input}
            {...options}
            {...sanitizeRestProps(rest)}
        />
    );
};

DisabledInput.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

export default DisabledInput;
