import * as React from 'react';
import clsx from 'clsx';
import {
    Chip,
    Autocomplete,
    type AutocompleteProps,
    TextField,
    major as muiMajor,
} from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { useInput, FieldTitle } from 'ra-core';
import { InputHelperText } from './InputHelperText';
import type { CommonInputProps } from './CommonInputProps';

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

const renderChips = (
    value: readonly string[],
    getProps: (args: { index: number }) => any
) =>
    value.map((option: string, index: number) => {
        const { key, ...chipProps } = getProps({ index });
        return <Chip size="small" label={option} key={key} {...chipProps} />;
    });

export const TextArrayInput = (inProps: TextArrayInputProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
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
        ...rest
    } = props;
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
        ...rest,
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
            {...(muiMajor >= 7
                ? { renderValue: renderChips }
                : { renderTags: renderChips })}
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
            {...rest}
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaTextArrayInput: 'root';
    }

    interface ComponentsPropsList {
        RaTextArrayInput: Partial<TextArrayInputProps>;
    }

    interface Components {
        RaTextArrayInput?: {
            defaultProps?: ComponentsPropsList['RaTextArrayInput'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaTextArrayInput'];
        };
    }
}
