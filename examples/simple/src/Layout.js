import React, { forwardRef } from 'react';
import { Layout, AppBar, UserMenu, useLocale, useSetLocale } from 'react-admin';
import { makeStyles, MenuItem, ListItemIcon } from '@material-ui/core';
import Language from '@material-ui/icons/Language';

const useStyles = makeStyles(theme => ({
    menuItem: {
        color: theme.palette.text.secondary,
    },
    icon: { minWidth: theme.spacing(5) },
}));

const SwitchLanguage = forwardRef((props, ref) => {
    const locale = useLocale();
    const setLocale = useSetLocale();
    const classes = useStyles();
    return (
        <MenuItem
            ref={ref}
            className={classes.menuItem}
            onClick={() => {
                setLocale(locale === 'en' ? 'fr' : 'en');
                props.onClick();
            }}
        >
            <ListItemIcon className={classes.icon}>
                <Language />
            </ListItemIcon>
            Switch Language
        </MenuItem>
    );
});

const MyUserMenu = props => (
    <UserMenu {...props}>
        <SwitchLanguage />
    </UserMenu>
);

const MyAppBar = props => <AppBar {...props} userMenu={<MyUserMenu />} />;

export default props => <Layout {...props} appBar={MyAppBar} />;
