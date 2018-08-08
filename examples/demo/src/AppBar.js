import React from 'react';
import { AppBar, MenuItemLink, translate } from 'react-admin';
import SettingsIcon from '@material-ui/icons/Settings';

const CustomAppBar = ({ translate, ...props }) => (
    <AppBar {...props}>
        <MenuItemLink
            to="/configuration"
            primaryText={translate('pos.configuration')}
            leftIcon={<SettingsIcon />}
        />
    </AppBar>
);

export default translate(CustomAppBar);
