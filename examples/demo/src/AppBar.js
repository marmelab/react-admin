import React from 'react';
import { AppBar, UserMenu, MenuItemLink, translate } from 'react-admin';
import SettingsIcon from '@material-ui/icons/Settings';

const CustomUserMenu = translate(({ translate, ...props }) => (
    <UserMenu {...props}>
        <MenuItemLink
            to="/configuration"
            primaryText={translate('pos.configuration')}
            leftIcon={<SettingsIcon />}
        />
    </UserMenu>
));

const CustomAppBar = props => (
    <AppBar {...props} userMenu={<CustomUserMenu />} />
);

export default CustomAppBar;
