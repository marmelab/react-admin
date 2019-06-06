import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classNames from 'classnames';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MuiTextField from '@material-ui/core/TextField';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';

import { translate } from 'ra-core';

const styles = createStyles({
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
class ResettableTextField extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
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

    state = { showClear: false };

    handleClickClearButton = event => {
        event.preventDefault();
        this.props.onChange('');
    };

    handleMouseDownClearButton = event => {
        event.preventDefault();
    };

    handleFocus = event => {
        this.setState({ showClear: true });
        this.props.onFocus && this.props.onFocus(event);
    };

    handleBlur = event => {
        this.setState({ showClear: false });
        this.props.onBlur && this.props.onBlur(event);
    };

    render() {
        const {
            translate,
            classes,
            clearAlwaysVisible,
            InputProps,
            value,
            resettable,
            disabled,
            ...props
        } = this.props;
        const { showClear } = this.state;
        const {
            clearButton,
            clearIcon,
            visibleClearButton,
            visibleClearIcon,
            ...restClasses
        } = classes;

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
                                onClick={this.handleClickClearButton}
                                onMouseDown={this.handleMouseDownClearButton}
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
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
            />
        );
    }
}

export default compose(
    translate,
    withStyles(styles)
)(ResettableTextField);
