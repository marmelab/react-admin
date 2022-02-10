import * as React from 'react';
import { AppBar, UserMenu, MenuItemLink, Logout } from 'react-admin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';

import Logo from './Logo';

const CustomUserMenu = () => (
    <UserMenu logout={<Logout />}>
        <MenuItemLink
            to="/configuration"
            primaryText="pos.configuration"
            leftIcon={<SettingsIcon />}
            sidebarIsOpen
        />
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
