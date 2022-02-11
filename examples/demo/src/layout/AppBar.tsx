import * as React from 'react';
import {
    AppBar,
    Logout,
    MenuItemLink,
    UserMenu,
    useUserMenu,
} from 'react-admin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';

import Logo from './Logo';

const ConfigurationMenu = () => {
    const { onClose } = useUserMenu();
    return (
        <MenuItemLink
            to="/configuration"
            primaryText="pos.configuration"
            leftIcon={<SettingsIcon />}
            sidebarIsOpen
            onClick={onClose}
        />
    );
};

const CustomUserMenu = () => (
    <UserMenu>
        <ConfigurationMenu />
        <Logout />
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
