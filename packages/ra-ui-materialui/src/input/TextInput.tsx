import * as React from 'react';
import clsx from 'clsx';
import { useInput, FieldTitle } from 'ra-core';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

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
    } = useThemeProps({
        props: props,
        name: PREFIX,
    });

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
        <StyledResettableTextField
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

const PREFIX = 'RaTextInput';

const StyledResettableTextField = styled(ResettableTextField, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<TextInputProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
