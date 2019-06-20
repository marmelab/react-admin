import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { addField, FieldTitle } from 'ra-core';

import InputHelperText from './InputHelperText';
import sanitizeRestProps from './sanitizeRestProps';

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
export const NumberInput = ({
    className,
    input,
    isRequired,
    label,
    meta,
    options,
    source,
    step,
    resource,
    helperText,
    onBlur,
    onFocus,
    onChange,
    ...rest
}) => {
    const handleBlur = useCallback(
        event => {
            /**
             * Necessary because of a React bug on <input type="number">
             * @see https://github.com/facebook/react/issues/1425
             */
            const numericValue = isNaN(parseFloat(event.target.value))
                ? null
                : parseFloat(event.target.value);
            onBlur(numericValue);
            input.onBlur(numericValue);
        },
        [input, onBlur]
    );

    const handleFocus = useCallback(
        event => {
            onFocus(event);
            input.onFocus(event);
        },
        [input, onFocus]
    );

    const handleChange = useCallback(
        event => {
            /**
             * Necessary because of a React bug on <input type="number">
             * @see https://github.com/facebook/react/issues/1425
             */
            const numericValue = isNaN(parseFloat(event.target.value))
                ? null
                : parseFloat(event.target.value);
            onChange(numericValue);
            input.onChange(numericValue);
        },
        [input, onChange]
    );

    if (typeof meta === 'undefined') {
        throw new Error(
            "The NumberInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
        );
    }
    const { touched, error } = meta;

    return (
        <TextField
            type="number"
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
            className={className}
            {...options}
            {...sanitizeRestProps(rest)}
            {...input}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
        />
    );
};

NumberInput.propTypes = {
    className: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
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
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    step: 'any',
    textAlign: 'right',
};

export const NumberInputWithField = addField(NumberInput);
NumberInputWithField.defaultProps = {
    textAlign: 'right',
};

export default NumberInputWithField;
