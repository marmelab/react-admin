import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {},
    active: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    icon: { paddingRight: '0.5em' },
});

export class MenuItemLink extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        className: PropTypes.string,
        leftIcon: PropTypes.node,
        onClick: PropTypes.func,
        primaryText: PropTypes.string,
        staticContext: PropTypes.object,
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
                className={classnames(classes.root, className)}
                activeClassName={classes.active}
                component={NavLink}
                {...props}
                onClick={this.handleMenuTap}
            >
                {leftIcon && <span className={classes.icon}>{leftIcon}</span>}
                {primaryText}
            </MenuItem>
        );
    }
}

export default withStyles(styles)(MenuItemLink);
