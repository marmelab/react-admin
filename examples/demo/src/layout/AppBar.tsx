import * as React from 'react';
import { forwardRef } from 'react';
import { AppBar, UserMenu, MenuItemLink, useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';

import Logo from './Logo';

const ConfigurationMenu = forwardRef<any, any>((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItemLink
            ref={ref}
            to="/configuration"
            primaryText={translate('pos.configuration')}
            leftIcon={<SettingsIcon />}
            onClick={props.onClick}
            sidebarIsOpen
        />
    );
});

const CustomUserMenu = (props: any) => (
    <UserMenu {...props}>
        <ConfigurationMenu />
    </UserMenu>
);

const CustomAppBar = (props: any) => {
    return (
        <AppBar
            {...props}
            color="secondary"
            elevation={1}
            userMenu={<CustomUserMenu />}
        >
            <Typography
                variant="h6"
                color="inherit"
                sx={{
                    flex: 1,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}
                id="react-admin-title"
            />
            <Logo />
            <Box component="span" sx={{ flex: 1 }} />
        </AppBar>
    );
};

export default CustomAppBar;
