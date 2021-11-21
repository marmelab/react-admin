import * as React from 'react';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';
import { AppBar, UserMenu, MenuItemLink, useTranslate } from 'react-admin';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';

import Logo from './Logo';

const PREFIX = 'CustomAppBar';

const classes = {
    title: `${PREFIX}-title`,
    spacer: `${PREFIX}-spacer`,
};

const StyledAppBar = styled(AppBar)({
    [`& .${classes.title}`]: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    [`& .${classes.spacer}`]: {
        flex: 1,
    },
});

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
        <StyledAppBar
            {...props}
            color="secondary"
            elevation={1}
            userMenu={<CustomUserMenu />}
        >
            <Typography
                variant="h6"
                color="inherit"
                className={classes.title}
                id="react-admin-title"
            />
            <Logo />
            <span className={classes.spacer} />
        </StyledAppBar>
    );
};

export default CustomAppBar;
