import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { addField, FieldTitle } from 'ra-core';

import ResettableTextField from './ResettableTextField';
import InputHelperText from './InputHelperText';
import sanitizeRestProps from './sanitizeRestProps';

/**
 * An Input component for a string
 *
 * @example
 * <TextInput source="first_name" />
 *
 * You can customize the `type` props (which defaults to "text").
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
 * @example
 * <TextInput source="email" type="email" />
 * <NumberInput source="nb_views" />
 *
 * The object passed as `options` props is passed to the <ResettableTextField> component
 */
export const TextInput = ({
    className,
    input,
    isRequired,
    label,
    meta,
    options,
    resource,
    source,
    type,
    helperText,
    FormHelperTextProps,
    onBlur,
    onFocus,
    onChange,
    ...rest
}) => {
    const handleBlur = useCallback(
        eventOrValue => {
            onBlur(eventOrValue);
            input.onBlur(eventOrValue);
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
        eventOrValue => {
            onChange(eventOrValue);
            input.onChange(eventOrValue);
        },
        [input, onChange]
    );

    if (typeof meta === 'undefined') {
        throw new Error(
            "The TextInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
        );
    }
    const { touched, error } = meta;

    return (
        <ResettableTextField
            margin="normal"
            type={type}
            label={
                label === false ? (
                    label
                ) : (
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                )
            }
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
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

TextInput.propTypes = {
    className: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    type: PropTypes.string,
};

TextInput.defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    type: 'text',
};

export default addField(TextInput);
