import React, { FunctionComponent, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import { FieldTitle, useField } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';
import { InputProps } from './types';

const BooleanInput: FunctionComponent<InputProps> = ({
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
        isRequired,
        input,
        meta: { touched, error },
    } = useField({ source, type: 'checkbox', validate, ...rest });
    const { value, onChange, ...inputProps } = input;

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
    input: PropTypes.object,
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
