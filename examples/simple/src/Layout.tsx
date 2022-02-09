import * as React from 'react';
import { forwardRef, memo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppBar, Layout, Logout, UserMenu, useLocaleState } from 'react-admin';
import { MenuItem, MenuItemProps, ListItemIcon } from '@mui/material';
import Language from '@mui/icons-material/Language';

const SwitchLanguage = forwardRef<HTMLLIElement, MenuItemProps>(
    (props, ref) => {
        const [locale, setLocale] = useLocaleState();

        return (
            <MenuItem
                ref={ref}
                sx={{ color: 'text.secondary' }}
                onClick={event => {
                    setLocale(locale === 'en' ? 'fr' : 'en');
                    props.onClick(event);
                }}
            >
                <ListItemIcon sx={{ minWidth: 5 }}>
                    <Language />
                </ListItemIcon>
                Switch Language
            </MenuItem>
        );
    }
);

const MyUserMenu = props => (
    <UserMenu {...props} logout={<Logout />}>
        <SwitchLanguage />
    </UserMenu>
);

const MyAppBar = memo(props => <AppBar {...props} userMenu={<MyUserMenu />} />);

export default props => (
    <>
        <Layout {...props} appBar={MyAppBar} />
        <ReactQueryDevtools
            initialIsOpen={false}
            toggleButtonProps={{ style: { width: 20, height: 30 } }}
        />
    </>
);
