import * as React from 'react';
import { AppBar, Logout, UserMenu, useTranslate } from 'react-admin';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';

import Logo from './Logo';

const ConfigurationMenu = React.forwardRef((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItem
            component={Link}
            // @ts-ignore
            ref={ref}
            {...props}
            to="/configuration"
        >
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText>{translate('pos.configuration')}</ListItemText>
        </MenuItem>
    );
});
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
