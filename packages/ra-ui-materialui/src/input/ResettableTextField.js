import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles({
    clearIcon: {
        height: 16,
        width: 0,
    },
    visibleClearIcon: {
        width: 16,
    },
    clearButton: {
        height: 24,
        padding: 0,
        width: 0,
    },
    visibleClearButton: {
        width: 24,
    },
    selectAdornment: {
        position: 'absolute',
        right: 24,
    },
    inputAdornedEnd: {
        paddingRight: 0,
    },
});

const handleMouseDownClearButton = event => {
    event.preventDefault();
};

/**
 * An override of the default Material-UI TextField which is resettable
 */
function ResettableTextField({
    classes: classesOverride,
    clearAlwaysVisible,
    InputProps,
    value,
    resettable,
    disabled,
    variant = 'filled',
    margin = 'dense',
    ...props
}) {
    const [showClear, setShowClear] = useState(false);
    const classes = useStyles({ classes: classesOverride });
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
            setShowClear(true);
            onFocus && onFocus(event);
        },
        [onFocus]
    );

    const handleBlur = useCallback(
        event => {
            setShowClear(false);
            onBlur && onBlur(event);
        },
        [onBlur]
    );

    const {
        clearButton,
        clearIcon,
        inputAdornedEnd,
        selectAdornment,
        visibleClearButton,
        visibleClearIcon,
        ...restClasses
    } = classes;

    return (
        <MuiTextField
            classes={restClasses}
            value={value}
            InputProps={{
                classes:
                    props.select && variant === 'filled'
                        ? { adornedEnd: inputAdornedEnd }
                        : {},
                endAdornment: resettable && value && (
                    <InputAdornment
                        position="end"
                        classes={{
                            root: props.select ? selectAdornment : null,
                        }}
                    >
                        <IconButton
                            className={classNames(clearButton, {
                                [visibleClearButton]:
                                    clearAlwaysVisible || showClear,
                            })}
                            aria-label={translate(
                                'ra.action.clear_input_value'
                            )}
                            title={translate('ra.action.clear_input_value')}
                            disableRipple
                            onClick={handleClickClearButton}
                            onMouseDown={handleMouseDownClearButton}
                            disabled={disabled}
                        >
                            <ClearIcon
                                className={classNames(clearIcon, {
                                    [visibleClearIcon]:
                                        clearAlwaysVisible || showClear,
                                })}
                            />
                        </IconButton>
                    </InputAdornment>
                ),
                ...InputProps,
            }}
            disabled={disabled}
            variant={variant}
            margin={margin}
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
}

ResettableTextField.propTypes = {
    classes: PropTypes.object,
    clearAlwaysVisible: PropTypes.bool,
    disabled: PropTypes.bool,
    InputProps: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    resettable: PropTypes.bool,
    value: PropTypes.any.isRequired,
};

export default ResettableTextField;
