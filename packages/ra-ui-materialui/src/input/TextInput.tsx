import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { useInput, FieldTitle, InputProps } from 'ra-core';
import { TextFieldProps } from '@material-ui/core/TextField';

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
export const TextInput: FunctionComponent<
    InputProps<TextFieldProps> & Omit<TextFieldProps, 'label' | 'helperText'>
> = ({
    label,
    options,
    resource,
    source,
    helperText,
    onBlur,
    onFocus,
    onChange,
    validate,
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
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
            {...options}
            {...sanitizeRestProps(rest)}
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

export default TextInput;
