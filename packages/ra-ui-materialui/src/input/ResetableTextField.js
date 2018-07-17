import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';

import { translate } from 'ra-core';

const styles = theme => ({
    clearButton: {
        overflow: 'hidden',
        transitionDuration: theme.transitions.duration.shortest,
        transitionProperty: 'width',
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            background: 'unset',
            color: theme.palette.secondary.main,
        },
    },
});

class ResetableTextField extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        clearAlwaysVisible: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        translate: PropTypes.func.isRequired,
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
        const { translate, classes, clearAlwaysVisible, ...props } = this.props;
        const { showClear } = this.state;
        const { clearButton, ...restClasses } = classes;

        return (
            <TextField
                classes={restClasses}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                className={clearButton}
                                aria-label={translate(
                                    'ra.action.clear_input_value'
                                )}
                                title={translate('ra.action.clear_input_value')}
                                disableRipple
                                onClick={this.handleClickClearButton}
                                onMouseDown={this.handleMouseDownClearButton}
                                style={{
                                    width:
                                        clearAlwaysVisible || showClear
                                            ? 24
                                            : 0,
                                }}
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
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
)(ResetableTextField);
