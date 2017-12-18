import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

const styles = {
    iconPaddingStyle: { paddingRight: '0.5em' },
};

export class MenuItemLink extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        to: PropTypes.string.isRequired,
    };

    handleMenuTap = () => {
        this.props.onClick && this.props.onClick();
    };

    render() {
        const {
            classes,
            className,
            primaryText,
            leftIcon,
            staticContext,
            ...props
        } = this.props;

        return (
            <MenuItem
                className={className}
                component={Link}
                {...props}
                onClick={this.handleMenuTap}
            >
                {leftIcon && (
                    <span className={classes.iconPaddingStyle}>{leftIcon}</span>
                )}
                {primaryText}
            </MenuItem>
        );
    }
}

export default withStyles(styles)(MenuItemLink);
