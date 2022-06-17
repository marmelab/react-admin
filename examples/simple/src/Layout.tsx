import * as React from 'react';
import { forwardRef, memo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
    AppBar,
    Layout,
    Logout,
    UserMenu,
    useLocaleState,
    useUserMenu,
} from 'react-admin';
import {
    MenuItem,
    MenuItemProps,
    ListItemIcon,
    CssBaseline,
} from '@mui/material';
import Language from '@mui/icons-material/Language';

const SwitchLanguage = forwardRef<HTMLLIElement, MenuItemProps>(
    (props, ref) => {
        const [locale, setLocale] = useLocaleState();
        const { onClose } = useUserMenu();

        return (
            <MenuItem
                ref={ref}
                {...props}
                sx={{ color: 'text.secondary' }}
                onClick={event => {
                    setLocale(locale === 'en' ? 'fr' : 'en');
                    onClose();
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

const MyUserMenu = () => (
    <UserMenu>
        <SwitchLanguage />
        <Logout />
    </UserMenu>
);

const MyAppBar = memo(props => <AppBar {...props} userMenu={<MyUserMenu />} />);

export default props => (
    <>
        <CssBaseline />
        <Layout {...props} appBar={MyAppBar} />
        <ReactQueryDevtools
            initialIsOpen={false}
            toggleButtonProps={{ style: { width: 20, height: 30 } }}
        />
    </>
);
