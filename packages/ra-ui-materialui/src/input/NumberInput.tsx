import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useInput, FieldTitle, InputProps } from 'ra-core';

import InputHelperText from './InputHelperText';
import sanitizeRestProps from './sanitizeRestProps';

const parse = value => {
    const float = parseFloat(value);

    return isNaN(float) ? null : float;
};

interface Props {
    step: string | number;
}

/**
 * An Input component for a number
 *
 * @example
 * <NumberInput source="nb_views" />
 *
 * You can customize the `step` props (which defaults to "any")
 * @example
 * <NumberInput source="nb_views" step={1} />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
const NumberInput: FunctionComponent<
    Props &
        InputProps<TextFieldProps> &
        Omit<TextFieldProps, 'label' | 'helperText'>
> = ({
    helperText,
    label,
    margin = 'dense',
    options,
    source,
    step,
    resource,
    onBlur,
    onFocus,
    onChange,
    validate,
    variant = 'filled',
    inputProps: overrideInputProps,
    ...rest
}) => {
    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'number',
        validate,
        ...rest,
    });

    const inputProps = { ...overrideInputProps, step };

    return (
        <TextField
            id={id}
            {...input}
            variant={variant}
            error={!!(touched && error)}
            helperText={
                (touched && error) || helperText ? (
                    <InputHelperText
                        touched={touched}
                        error={error}
                        helperText={helperText}
                    />
                ) : null
            }
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            margin={margin}
            inputProps={inputProps}
            {...options}
            {...sanitizeRestProps(rest)}
        />
    );
};

NumberInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

NumberInput.defaultProps = {
    options: {},
    step: 'any',
    textAlign: 'right',
};

export default NumberInput;
