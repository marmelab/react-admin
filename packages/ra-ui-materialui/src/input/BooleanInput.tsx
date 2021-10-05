import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup, { FormGroupProps } from '@material-ui/core/FormGroup';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import { FieldTitle, useInput, InputProps } from 'ra-core';

import sanitizeInputRestProps from './sanitizeInputRestProps';
import InputHelperText from './InputHelperText';
import InputPropTypes from './InputPropTypes';

const BooleanInput = (props: BooleanInputProps) => {
    const {
        format,
        label,
        fullWidth,
        helperText,
        onBlur,
        onChange,
        onFocus,
        options,
        disabled,
        parse,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const {
        id,
        input: { onChange: finalFormOnChange, type, value, ...inputProps },
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
        <FormGroup {...sanitizeInputRestProps(rest)}>
            <FormControlLabel
                control={
                    <Switch
                        id={id}
                        color="primary"
                        onChange={handleChange}
                        {...inputProps}
                        {...options}
                        disabled={disabled}
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
            <FormHelperText error={!!(error || submitError)}>
                <InputHelperText
                    touched={touched}
                    error={error || submitError}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormGroup>
    );
};

BooleanInput.propTypes = {
    ...InputPropTypes,
    // @ts-ignore
    options: PropTypes.shape(Switch.propTypes),
    disabled: PropTypes.bool,
};

BooleanInput.defaultProps = {
    options: {},
};

export type BooleanInputProps = InputProps<SwitchProps> &
    Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'>;

export default BooleanInput;
