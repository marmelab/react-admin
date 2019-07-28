import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MuiTextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';

import { translate } from 'ra-core';

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
        width: 0,
    },
    visibleClearButton: {
        width: 24,
    },
});

/**
 * An override of the default Material-UI TextField which is resettable
 */

const ResettableTextField = ({
    translate,
    clearAlwaysVisible,
    InputProps,
    value,
    resettable,
    disabled,
    onBlur,
    onChange,
    onFocus,
    ...props
}) => {
    const classes = useStyles();
    const [showClear, setShowClear] = useState(false);

    const {
        clearButton,
        clearIcon,
        visibleClearButton,
        visibleClearIcon,
        ...restClasses
    } = classes;

    const handleClickClearButton = event => {
        event.preventDefault();
        onChange('');
    };

    const handleMouseDownClearButton = event => {
        event.preventDefault();
    };

    const handleFocus = event => {
        setShowClear(true);
        onFocus && onFocus(event);
    };

    const handleBlur = event => {
        setShowClear(false);
        onBlur && onBlur(event);
    };

    return (
        <MuiTextField
            classes={restClasses}
            value={value}
            InputProps={{
                endAdornment: resettable && value && (
                    <InputAdornment position="end">
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
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
};

ResettableTextField.propTypes = {
    clearAlwaysVisible: PropTypes.bool,
    disabled: PropTypes.bool,
    InputProps: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    resettable: PropTypes.bool,
    translate: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
};

export default translate()(ResettableTextField);
