import React, { FunctionComponent, useCallback } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useField, FieldTitle } from 'ra-core';

import InputHelperText from './InputHelperText';
import sanitizeRestProps from './sanitizeRestProps';
import { InputProps } from './types';

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
export const NumberInput: FunctionComponent<
    InputProps<TextFieldProps> & TextFieldProps
> = ({
    label,
    options,
    source,
    step,
    resource,
    helperText,
    validate,
    onBlur,
    onChange,
    onFocus,
    ...rest
}) => {
    const {
        id,
        input,
        isRequired,
        meta: { touched, error },
    } = useField({
        source,
        validate,
        format: getStringFromNumber,
        parse: getNumberFromString,
        type: 'number',
        onBlur,
        onChange,
        onFocus,
        ...rest,
    });

    return (
        <TextField
            {...input}
            margin="normal"
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
            step={step}
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            id={id}
            {...options}
            {...sanitizeRestProps(rest)}
        />
    );
};

NumberInput.propTypes = {
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    validate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
};

NumberInput.defaultProps = {
    options: {},
    step: 'any',
    textAlign: 'right',
};

/**
 * Necessary because of a React bug on <input type="number">
 * @see https://github.com/facebook/react/issues/1425
 */
const getNumberFromString = (value: string) =>
    isNaN(parseFloat(value)) ? null : parseFloat(value);

const getStringFromNumber = (value: number) =>
    !value || isNaN(value) ? '' : value.toString();

export default NumberInput;
