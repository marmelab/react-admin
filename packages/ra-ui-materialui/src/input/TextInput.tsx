import * as React from 'react';
import clsx from 'clsx';
import { useInput, FieldTitle } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import {
    ResettableTextField,
    ResettableTextFieldProps,
} from './ResettableTextField';
import { InputHelperText } from './InputHelperText';
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
 */
export const TextInput = (props: TextInputProps) => {
    const {
        className,
        defaultValue,
        label,
        format,
        helperText,
        onBlur,
        onChange,
        parse,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const {
        field,
        fieldState: { error, invalid },
        id,
        isRequired,
    } = useInput({
        defaultValue,
        format,
        parse,
        resource,
        source,
        type: 'text',
        validate,
        onBlur,
        onChange,
        ...rest,
    });

    const renderHelperText = helperText !== false || invalid;

    return (
        <ResettableTextField
            id={id}
            {...field}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            label={
                label !== '' && label !== false ? (
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                ) : null
            }
            error={invalid}
            helperText={
                renderHelperText ? (
                    <InputHelperText
                        error={error?.message}
                        helperText={helperText}
                    />
                ) : null
            }
            {...sanitizeInputRestProps(rest)}
        />
    );
};

export type TextInputProps = CommonInputProps &
    Omit<ResettableTextFieldProps, 'label' | 'helperText'>;
