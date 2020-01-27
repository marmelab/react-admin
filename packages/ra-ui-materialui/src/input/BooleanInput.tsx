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
    format,
    label,
    fullWidth,
    helperText,
    onBlur,
    onChange,
    onFocus,
    options,
    parse,
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
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
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
                control={
                    <Switch
                        id={id}
                        color="primary"
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
            <FormHelperText error={!!error}>
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            </FormHelperText>
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
