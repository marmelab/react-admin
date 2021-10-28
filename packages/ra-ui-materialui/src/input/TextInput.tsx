import * as React from 'react';
import PropTypes from 'prop-types';
import { useInput, FieldTitle } from 'ra-core';
import { TextFieldProps } from '@mui/material/TextField';

import {
    ResettableTextField,
    ResettableTextFieldProps,
} from './ResettableTextField';
import { InputHelperText } from './InputHelperText';
import { InputProps } from './types';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';

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
export const TextInput = (props: TextInputProps) => {
    const {
        defaultValue,
        label,
        format,
        helperText,
        onBlur,
        onFocus,
        onChange,
        options,
        parse,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const {
        id,
        input,
        isRequired,
        meta: { error, isTouched },
    } = useInput({
        defaultValue,
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'text',
        validate,
        ...rest,
    });

    return (
        <ResettableTextField
            id={id}
            {...input}
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            error={!!(isTouched && error)}
            helperText={
                <InputHelperText
                    touched={isTouched}
                    error={error}
                    helperText={helperText}
                />
            }
            {...options}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

TextInput.propTypes = {
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

TextInput.defaultProps = {
    options: {},
};

export type TextInputProps = InputProps<TextFieldProps> &
    ResettableTextFieldProps &
    Omit<TextFieldProps, 'label' | 'helperText'>;
