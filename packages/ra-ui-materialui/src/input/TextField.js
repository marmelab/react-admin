import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MuiTextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';

import { translate } from 'ra-core';

const styles = () => ({
    clearIcon: {
        height: 16,
        width: 16,
    },
    clearButton: {
        width: 24,
        height: 24,
    },
});

/**
 * An override of the default Material-UI TextField which is resettable
 */
class TextField extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        clearAlwaysVisible: PropTypes.bool,
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
            ...props
        } = this.props;
        const { showClear } = this.state;
        const { clearButton, clearIcon, ...restClasses } = classes;

        return (
            <MuiTextField
                classes={restClasses}
                value={value}
                InputProps={{
                    endAdornment: resettable &&
                        value && (
                            <InputAdornment position="end">
                                <IconButton
                                    className={clearButton}
                                    aria-label={translate(
                                        'ra.action.clear_input_value'
                                    )}
                                    title={translate(
                                        'ra.action.clear_input_value'
                                    )}
                                    disableRipple
                                    onClick={this.handleClickClearButton}
                                    onMouseDown={
                                        this.handleMouseDownClearButton
                                    }
                                    style={{
                                        width:
                                            !clearAlwaysVisible &&
                                            !showClear &&
                                            0,
                                    }}
                                >
                                    <ClearIcon
                                        className={classes.clearIcon}
                                        style={{
                                            width:
                                                clearAlwaysVisible || showClear
                                                    ? 'auto'
                                                    : 0,
                                        }}
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    ...InputProps,
                }}
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
)(TextField);
