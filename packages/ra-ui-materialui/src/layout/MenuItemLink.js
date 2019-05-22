import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ComponentPropType } from 'ra-core';

const NavLinkRef = React.forwardRef((props, ref) => (
    <NavLink innerRef={ref} {...props} />
));

const styles = theme =>
    createStyles({
        root: {
            color: theme.palette.text.secondary,
        },
        active: {
            color: theme.palette.text.primary,
        },
        icon: { minWidth: theme.spacing(5) },
    });

export class MenuItemLink extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        className: PropTypes.string,
        leftIcon: ComponentPropType,
        onClick: PropTypes.func,
        primaryText: PropTypes.node,
        staticContext: PropTypes.object,
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
            .isRequired,
    };

    handleMenuTap = e => {
        this.props.onClick && this.props.onClick(e);
    };

    render() {
        const {
            classes,
            className,
            primaryText,
            leftIcon: LeftIcon,
            staticContext,
            ...props
        } = this.props;

        return (
            <MenuItem
                className={classnames(classes.root, className)}
                activeClassName={classes.active}
                component={NavLinkRef}
                {...props}
                onClick={this.handleMenuTap}
            >
                {LeftIcon && (
                    <ListItemIcon className={classes.icon}>
                        <LeftIcon titleAccess={primaryText} />
                    </ListItemIcon>
                )}
                {primaryText}
            </MenuItem>
        );
    }
}

export default withStyles(styles)(MenuItemLink);
