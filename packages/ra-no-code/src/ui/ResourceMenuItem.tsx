import React, { forwardRef } from 'react';
import { MenuItemLink, MenuItemLinkProps } from 'react-admin';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import DefaultIcon from '@material-ui/icons/ViewList';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { ResourceConfiguration } from '../ResourceConfiguration';

export const ResourceMenuItem = (
    props: Omit<MenuItemLinkProps, 'to' | 'resource'> & {
        resource: ResourceConfiguration;
    }
) => {
    const { resource, ...rest } = props;
    const classes = useStyles(props);
    return (
        <div className={classes.root}>
            <MenuItemLink
                key={resource.name}
                className={classes.resource}
                to={{
                    pathname: `/${resource.name}`,
                    state: { _scrollToTop: true },
                }}
                primaryText={resource?.label || resource.name}
                leftIcon={<DefaultIcon />}
                {...rest}
            />
            <IconButton
                component={NavLinkRef}
                to={{
                    pathname: `/configure/${resource.name}`,
                }}
                className={classes.settings}
            >
                <SettingsIcon />
            </IconButton>
        </div>
    );
};

const NavLinkRef = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => (
    <NavLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    resource: {
        flexGrow: 1,
    },
    settings: {
        marginLeft: 'auto',
    },
}));
