import * as React from 'react';
import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useInput, FieldTitle, InputProps } from 'ra-core';

import InputHelperText from './InputHelperText';
import sanitizeInputRestProps from './sanitizeInputRestProps';

const convertStringToNumber = value => {
    const float = parseFloat(value);

    return isNaN(float) ? null : float;
};

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
const NumberInput: FunctionComponent<NumberInputProps> = ({
    format,
    helperText,
    label,
    margin = 'dense',
    onBlur,
    onFocus,
    onChange,
    options,
    parse = convertStringToNumber,
    resource,
    source,
    step,
    min,
    max,
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
        format,
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

    const inputProps = { ...overrideInputProps, step, min, max };

    return (
        <TextField
            id={id}
            {...input}
            variant={variant}
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
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
            margin={margin}
            inputProps={inputProps}
            {...options}
            {...sanitizeInputRestProps(rest)}
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

export interface NumberInputProps
    extends InputProps<TextFieldProps>,
        Omit<
            TextFieldProps,
            | 'label'
            | 'helperText'
            | 'onChange'
            | 'onBlur'
            | 'onFocus'
            | 'defaultValue'
        > {
    step?: string | number;
    min?: string | number;
    max?: string | number;
}

export default NumberInput;
