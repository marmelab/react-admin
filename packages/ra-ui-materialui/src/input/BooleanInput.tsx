import React, { FunctionComponent, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup, { FormGroupProps } from '@material-ui/core/FormGroup';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import { FieldTitle, useInput, InputProps } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';
import InputPropTypes from './InputPropTypes';

const BooleanInput: FunctionComponent<
    InputProps<SwitchProps> &
        Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'>
> = ({
    label,
    fullWidth,
    helperText,
    onBlur,
    onChange,
    onFocus,
    options,
    resource,
    source,
    validate,
    ...rest
}) => {
    const {
        id,
        input: { onChange: finalFormOnChange, type, value, ...inputProps },
        isRequired,
        meta: { error, touched },
    } = useInput({
        onBlur,
        onChange,
        onFocus,
        resource,
        source,
        type: 'checkbox',
        validate,
        ...rest,
    });

    const handleChange = useCallback(
        (event, value) => {
            finalFormOnChange(value);
        },
        [finalFormOnChange]
    );

    return (
        <FormGroup {...sanitizeRestProps(rest)}>
            <FormControlLabel
                htmlFor={id}
                control={
                    <Switch
                        id={id}
                        color="primary"
                        checked={!!value}
                        onChange={handleChange}
                        {...inputProps}
                        {...options}
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
            {(touched && error) || helperText ? (
                <FormHelperText error={!!error}>
                    <InputHelperText
                        touched={touched}
                        error={error}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </FormGroup>
    );
};

BooleanInput.propTypes = {
    ...InputPropTypes,
    options: PropTypes.shape(Switch.propTypes),
};

BooleanInput.defaultProps = {
    options: {},
};

export default BooleanInput;
