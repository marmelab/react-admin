import * as React from 'react';
import clsx from 'clsx';
import {
    Chip,
    Autocomplete,
    AutocompleteProps,
    TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useInput, FieldTitle } from 'ra-core';
import { InputHelperText } from './InputHelperText';
import { CommonInputProps } from './CommonInputProps';

export type TextArrayInputProps = CommonInputProps &
    Omit<
        AutocompleteProps<string, true, true | false, true>,
        'options' | 'renderInput' | 'renderTags' | 'multiple' | 'freeSolo'
    > &
    // allow to override options and renderTags
    Partial<
        Pick<
            AutocompleteProps<string, true, true | false, true>,
            'options' | 'renderTags'
        >
    >;

export const TextArrayInput = ({
    className,
    disabled,
    format,
    helperText,
    label,
    margin,
    parse,
    readOnly,
    size,
    source,
    sx,
    validate,
    variant,
    ...props
}: TextArrayInputProps) => {
    const {
        field,
        fieldState: { error, invalid },
        id,
        isRequired,
    } = useInput({
        disabled,
        format,
        parse,
        readOnly,
        source,
        validate,
        ...props,
    });

    const renderHelperText = helperText !== false || invalid;

    return (
        <StyledAutocomplete
            multiple
            freeSolo
            autoSelect
            options={[]}
            id={id}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                        <Chip
                            size="small"
                            label={option}
                            key={key}
                            {...tagProps}
                        />
                    );
                })
            }
            renderInput={params => (
                <TextField
                    {...params}
                    label={
                        label !== '' && label !== false ? (
                            <FieldTitle
                                label={label}
                                source={source}
                                resource={props.resource}
                                isRequired={isRequired}
                            />
                        ) : null
                    }
                    helperText={
                        renderHelperText ? (
                            <InputHelperText
                                error={error?.message}
                                helperText={helperText}
                            />
                        ) : null
                    }
                    error={invalid}
                    variant={variant}
                    margin={margin}
                    size={size}
                />
            )}
            sx={sx}
            {...field}
            value={field.value || emptyArray} // Autocomplete does not accept null or undefined
            onChange={(e, newValue: string[]) => field.onChange(newValue)}
            {...props}
            disabled={disabled || readOnly}
        />
    );
};

const emptyArray = [];

const PREFIX = 'RaTextArrayInput';

const StyledAutocomplete = styled(
    Autocomplete<string, true, true | false, true>,
    {
        name: PREFIX,
        overridesResolver: (props, styles) => styles.root,
    }
)(({ theme }) => ({
    minWidth: theme.spacing(20),
}));
