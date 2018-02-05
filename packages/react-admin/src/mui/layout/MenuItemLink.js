import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    active: { color: theme.palette.secondary.main },
    iconPaddingStyle: { paddingRight: '0.5em' },
});

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
            activeClassName,
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
                activeClassName={activeClassName || classes.active}
                component={NavLink}
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
