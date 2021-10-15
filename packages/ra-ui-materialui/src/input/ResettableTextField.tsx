import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    InputAdornment,
    IconButton,
    TextField as MuiTextField,
    TextFieldProps,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { InputProps, useTranslate } from 'ra-core';

/**
 * An override of the default Material-UI TextField which is resettable
 */
export const ResettableTextField = (props: ResettableTextFieldProps) => {
    const {
        clearAlwaysVisible,
        InputProps,
        value,
        resettable,
        disabled,
        variant = 'filled',
        margin = 'dense',
        ...rest
    } = props;

    const translate = useTranslate();

    const { onChange, onFocus, onBlur } = props;
    const handleClickClearButton = useCallback(
        event => {
            event.preventDefault();
            onChange('');
        },
        [onChange]
    );

    const handleFocus = useCallback(
        event => {
            onFocus && onFocus(event);
        },
        [onFocus]
    );

    const handleBlur = useCallback(
        event => {
            onBlur && onBlur(event);
        },
        [onBlur]
    );

    const {
        clearButton,
        clearIcon,
        inputAdornedEnd,
        selectAdornment,
        visibleClearIcon,
        ...restClasses
    } = ResettableTextFieldClasses;

    const { endAdornment, ...InputPropsWithoutEndAdornment } = InputProps || {};

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
                        classes={{
                            root: props.select ? selectAdornment : null,
                        }}
                    >
                        <IconButton
                            className={clearButton}
                            aria-label={translate(
                                'ra.action.clear_input_value'
                            )}
                            title={translate('ra.action.clear_input_value')}
                            disableRipple
                            disabled={true}
                            size="large"
                        >
                            <ClearIcon
                                className={classNames(
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
                            classes={{
                                root: props.select ? selectAdornment : null,
                            }}
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
                    classes={{
                        root: props.select ? selectAdornment : null,
                    }}
                >
                    <IconButton
                        className={clearButton}
                        aria-label={translate('ra.action.clear_input_value')}
                        title={translate('ra.action.clear_input_value')}
                        disableRipple
                        onClick={handleClickClearButton}
                        onMouseDown={handleMouseDownClearButton}
                        disabled={disabled}
                        size="large"
                    >
                        <ClearIcon
                            className={classNames(clearIcon, {
                                [visibleClearIcon]: clearAlwaysVisible || value,
                            })}
                        />
                    </IconButton>
                </InputAdornment>
            );
        }
    };

    return (
        <StyledTextField
            classes={restClasses}
            value={value}
            InputProps={{
                classes:
                    props.select && variant === 'filled'
                        ? { adornedEnd: inputAdornedEnd }
                        : {},
                endAdornment: getEndAdornment(),
                ...InputPropsWithoutEndAdornment,
            }}
            disabled={disabled}
            variant={variant}
            margin={margin}
            {...rest}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
};

export {};

const handleMouseDownClearButton = event => {
    event.preventDefault();
};

ResettableTextField.propTypes = {
    clearAlwaysVisible: PropTypes.bool,
    disabled: PropTypes.bool,
    InputProps: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    resettable: PropTypes.bool,
    value: PropTypes.any.isRequired,
};

interface Props {
    clearAlwaysVisible?: boolean;
    resettable?: boolean;
}

export type ResettableTextFieldProps = InputProps<Props & TextFieldProps>;

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

const StyledTextField = styled(MuiTextField, { name: PREFIX })(
    ResettableTextFieldStyles
);
