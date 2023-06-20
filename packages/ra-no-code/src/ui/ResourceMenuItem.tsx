import React, { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import { MenuItemLink, MenuItemLinkProps } from 'react-admin';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DefaultIcon from '@mui/icons-material/ViewList';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { ResourceConfiguration } from '../ResourceConfiguration';

const PREFIX = 'ResourceMenuItem';

const classes = {
    root: `${PREFIX}-root`,
    resource: `${PREFIX}-resource`,
    settings: `${PREFIX}-settings`,
};

const Root = styled('div')({
    [`&.${classes.root}`]: {
        display: 'flex',
    },

    [`& .${classes.resource}`]: {
        flexGrow: 1,
    },

    [`& .${classes.settings}`]: {
        marginLeft: 'auto',
    },
});

export const ResourceMenuItem = (
    props: Omit<MenuItemLinkProps, 'to' | 'resource'> & {
        resource: ResourceConfiguration;
    }
) => {
    const { resource, ...rest } = props;

    return (
        <Root className={classes.root}>
            <MenuItemLink
                key={resource.name}
                className={classes.resource}
                to={`/${resource.name}`}
                state={{ _scrollToTop: true }}
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
                size="large"
            >
                <SettingsIcon />
            </IconButton>
        </Root>
    );
};

const NavLinkRef = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => (
    <NavLink ref={ref} {...props} />
));
