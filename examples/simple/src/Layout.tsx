import * as React from 'react';
import { styled } from '@mui/material/styles';
import { forwardRef, memo } from 'react';
import { Layout, AppBar, UserMenu, useLocale, useSetLocale } from 'react-admin';
import { MenuItem, MenuItemProps, ListItemIcon } from '@mui/material';
import Language from '@mui/icons-material/Language';

const PREFIX = 'Layout';

const classes = {
    menuItem: `${PREFIX}-menuItem`,
    icon: `${PREFIX}-icon`,
};

const StyledLayout = styled(Layout)(({ theme }) => ({
    [`& .${classes.menuItem}`]: {
        color: theme.palette.text.secondary,
    },

    [`& .${classes.icon}`]: { minWidth: theme.spacing(5) },
}));

const SwitchLanguage = forwardRef<HTMLLIElement, MenuItemProps>(
    (props, ref) => {
        const locale = useLocale();
        const setLocale = useSetLocale();

        return (
            <MenuItem
                ref={ref}
                className={classes.menuItem}
                onClick={event => {
                    setLocale(locale === 'en' ? 'fr' : 'en');
                    props.onClick(event);
                }}
            >
                <ListItemIcon className={classes.icon}>
                    <Language />
                </ListItemIcon>
                Switch Language
            </MenuItem>
        );
    }
);

const MyUserMenu = props => (
    <UserMenu {...props}>
        <SwitchLanguage />
    </UserMenu>
);

const MyAppBar = memo(props => <AppBar {...props} userMenu={<MyUserMenu />} />);

export default props => <StyledLayout {...props} appBar={MyAppBar} />;
