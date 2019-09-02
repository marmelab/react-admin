import React from 'react';
import TextField from '@material-ui/core/TextField';
import { FieldTitle } from 'ra-core';

const AutoCompleteInputTextField = ({
    InputProps,
    classes,
    inputRef,
    labelProps,
    source,
    resource,
    isRequired,
    handleChange,
    ...props
}) => {
    return (
        <TextField
            label={
                <FieldTitle
                    {...labelProps}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            InputProps={{
                inputRef,
                ...InputProps,
                onChange: event => {
                    InputProps.onChange(event);
                    handleChange(event.target.value);
                },
            }}
            {...props}
        />
    );
};

export default AutoCompleteInputTextField;
