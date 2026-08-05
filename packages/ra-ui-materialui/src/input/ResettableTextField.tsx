import * as React from 'react';
import { forwardRef, useCallback } from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import clsx from 'clsx';
import {
    InputAdornment,
    IconButton,
    TextField as MuiTextField,
    type TextFieldProps,
    major as muiMajor,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslate } from 'ra-core';

/**
 * An override of the default Material UI TextField which is resettable
 */
export const ResettableTextField = forwardRef(
    (inProps: ResettableTextFieldProps, ref) => {
        // This ensures we inherit the theme props from the TextField component (variant for instance)
        const textFieldProps = useThemeProps({
            props: inProps,
            name: 'MuiTextField',
        });
        const props = useThemeProps({
            props: textFieldProps,
            name: PREFIX,
        });
        const {
            clearAlwaysVisible,
            InputProps,
            value,
            resettable,
            disabled,
            readOnly,
            variant,
            margin,
            className,
            'aria-required': ariaRequired,
            inputProps: htmlInputPropsFromConsumer,
            ...rest
        } = props;

        const translate = useTranslate();

        const { onChange } = props;
        const handleClickClearButton = useCallback(
            event => {
                event.preventDefault();
                onChange && onChange('');
            },
            [onChange]
        );

        const {
            clearButton,
            clearIcon,
            inputAdornedEnd,
            selectAdornment,
            visibleClearIcon,
        } = ResettableTextFieldClasses;

        const { endAdornment, ...InputPropsWithoutEndAdornment } =
            InputProps || {};

        if (clearAlwaysVisible && endAdornment) {
            throw new Error(
                'ResettableTextField cannot display both an endAdornment and a clear button always visible'
            );
        }

        const getEndAdornment = () => {
            if (!resettable) {
                return endAdornment;
            } else if (!value) {
                if (clearAlwaysVisible) {
                    // show clear button, inactive
                    return (
                        <InputAdornment
                            position="end"
                            className={
                                props.select ? selectAdornment : undefined
                            }
                        >
                            <IconButton
                                className={clearButton}
                                aria-label={translate(
                                    'ra.action.clear_input_value'
                                )}
                                title={translate('ra.action.clear_input_value')}
                                disabled={true}
                                size="large"
                            >
                                <ClearIcon
                                    className={clsx(
                                        clearIcon,
                                        visibleClearIcon
                                    )}
                                />
                            </IconButton>
                        </InputAdornment>
                    );
                } else {
                    if (endAdornment) {
                        return endAdornment;
                    } else {
                        // show spacer
                        return (
                            <InputAdornment
                                position="end"
                                className={
                                    props.select ? selectAdornment : undefined
                                }
                            >
                                <span className={clearButton}>&nbsp;</span>
                            </InputAdornment>
                        );
                    }
                }
            } else {
                // show clear
                return (
                    <InputAdornment
                        position="end"
                        className={props.select ? selectAdornment : undefined}
                    >
                        <IconButton
                            className={clearButton}
                            aria-label={translate(
                                'ra.action.clear_input_value'
                            )}
                            title={translate('ra.action.clear_input_value')}
                            onClick={handleClickClearButton}
                            onMouseDown={handleMouseDownClearButton}
                            disabled={disabled || readOnly}
                            size="large"
                        >
                            <ClearIcon
                                className={clsx(clearIcon, {
                                    [visibleClearIcon]:
                                        clearAlwaysVisible || value,
                                })}
                            />
                        </IconButton>
                    </InputAdornment>
                );
            }
        };

        const inputProps = {
            readOnly: readOnly,
            classes:
                props.select && variant === 'filled'
                    ? { adornedEnd: inputAdornedEnd }
                    : {},
            endAdornment: getEndAdornment(),
            ...InputPropsWithoutEndAdornment,
        };

        // Props forwarded to the native <input> element. We translate the
        // `aria-required` prop here (rather than forwarding the native
        // `required` attribute) because react-admin relies on JS validation,
        // not the browser's native validation. This marks inputs with a
        // `required()` validator as required for assistive technologies
        // without triggering native browser validation. See issue #9585.
        const htmlInputProps = {
            ...htmlInputPropsFromConsumer,
            ...(ariaRequired ? { 'aria-required': true } : {}),
        };
        const hasHtmlInputProps = Object.keys(htmlInputProps).length > 0;

        // @ts-expect-error slotProps do not yet exist in MUI v5
        const htmlInputSlot = rest.slotProps?.htmlInput;
        // slotProps.htmlInput may be an object or, in MUI v6+, a callback
        // receiving the owner state. Preserve the caller's form when merging.
        const mergedHtmlInputSlot =
            typeof htmlInputSlot === 'function'
                ? ownerState => ({
                      ...htmlInputProps,
                      ...htmlInputSlot(ownerState),
                  })
                : { ...htmlInputProps, ...htmlInputSlot };

        const mergedSlotProps = {
            // @ts-expect-error slotProps do not yet exist in MUI v5
            ...rest.slotProps,
            // @ts-expect-error slotProps do not yet exist in MUI v5
            input: { ...inputProps, ...rest.slotProps?.input },
            ...(hasHtmlInputProps ? { htmlInput: mergedHtmlInputSlot } : {}),
        };

        return (
            <StyledTextField
                value={value}
                InputProps={inputProps}
                disabled={disabled || readOnly}
                variant={variant}
                margin={margin}
                className={className}
                {...rest}
                {...(muiMajor >= 6
                    ? { slotProps: mergedSlotProps }
                    : hasHtmlInputProps
                      ? { inputProps: htmlInputProps }
                      : {})}
                inputRef={ref}
            />
        );
    }
);

ResettableTextField.displayName = 'ResettableTextField';

const handleMouseDownClearButton = event => {
    event.preventDefault();
};

interface Props {
    clearAlwaysVisible?: boolean;
    resettable?: boolean;
    readOnly?: boolean;
}

export type ResettableTextFieldProps = Props &
    Omit<
        TextFieldProps,
        'onChange' | 'onPointerEnterCapture' | 'onPointerLeaveCapture'
    > & {
        onChange?: (eventOrValue: any) => void;
    };

const PREFIX = 'RaResettableTextField';

export const ResettableTextFieldClasses = {
    clearIcon: `${PREFIX}-clearIcon`,
    visibleClearIcon: `${PREFIX}-visibleClearIcon`,
    clearButton: `${PREFIX}-clearButton`,
    selectAdornment: `${PREFIX}-selectAdornment`,
    inputAdornedEnd: `${PREFIX}-inputAdornedEnd`,
};

export const ResettableTextFieldStyles = {
    [`& .${ResettableTextFieldClasses.clearIcon}`]: {
        height: 16,
        width: 0,
    },
    [`& .${ResettableTextFieldClasses.visibleClearIcon}`]: {
        width: 16,
    },
    [`& .${ResettableTextFieldClasses.clearButton}`]: {
        height: 24,
        width: 24,
        padding: 0,
    },
    [`& .${ResettableTextFieldClasses.selectAdornment}`]: {
        position: 'absolute',
        right: 24,
    },
    [`& .${ResettableTextFieldClasses.inputAdornedEnd}`]: {
        paddingRight: 0,
    },
};

const StyledTextField = styled(MuiTextField, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(ResettableTextFieldStyles);

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaResettableTextField:
            | 'root'
            | 'clearIcon'
            | 'visibleClearIcon'
            | 'clearButton'
            | 'selectAdornment'
            | 'inputAdornedEnd';
    }

    interface ComponentsPropsList {
        RaResettableTextField: Partial<ResettableTextFieldProps>;
    }

    interface Components {
        RaResettableTextField?: {
            defaultProps?: ComponentsPropsList['RaResettableTextField'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaResettableTextField'];
        };
    }
}
