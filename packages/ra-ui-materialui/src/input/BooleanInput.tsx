import React, { FunctionComponent, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup, { FormGroupProps } from '@material-ui/core/FormGroup';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import { FieldTitle, useField } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';
import { InputProps } from './types';

const BooleanInput: FunctionComponent<
    InputProps<SwitchProps> &
        Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'>
> = ({
    className,
    label,
    source,
    resource,
    options,
    fullWidth,
    helperText,
    validate,
    ...rest
}) => {
    const {
        input: { value, onChange, type, ...inputProps },
        isRequired,
        meta: { touched, error },
    } = useField({ source, validate, ...rest });

    const handleChange = useCallback(
        event => {
            onChange(event.target.checked);
        },
        [onChange]
    );

    return (
        <FormGroup className={className} {...sanitizeRestProps(rest)}>
            <FormControlLabel
                control={
                    <Switch
                        color="primary"
                        checked={!!value}
                        onChange={handleChange}
                        {...inputProps}
                        type="button"
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
            {helperText || (touched && !!error) ? (
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
    className: PropTypes.string,
    id: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
};

BooleanInput.defaultProps = {
    options: {},
};

export default BooleanInput;
