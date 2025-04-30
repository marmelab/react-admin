import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import { useCallback, type ReactNode } from 'react';
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    type MenuItemProps,
    useMediaQuery,
} from '@mui/material';

import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import clsx from 'clsx';
import { useTranslate, useLogout, useAuthState } from 'ra-core';

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
export const Logout: React.ForwardRefExoticComponent<
    Omit<MenuItemProps<'li'>, 'ref'> &
        React.RefAttributes<HTMLLIElement> &
        LogoutProps
> = React.forwardRef<HTMLLIElement, LogoutProps & MenuItemProps<'li'>>(
    function Logout(inProps, ref) {
        const props = useThemeProps({
            props: inProps,
            name: PREFIX,
        });
        const { className, redirectTo, icon, ...rest } = props;

        const { authenticated } = useAuthState();
        const isXSmall = useMediaQuery((theme: Theme) =>
            theme.breakpoints.down('sm')
        );
        const translate = useTranslate();
        const logout = useLogout();

        const handleClick = useCallback(
            () => logout(null, redirectTo, false),
            [redirectTo, logout]
        );

        if (!authenticated) return null;

        return (
            <StyledMenuItem
                className={clsx('logout', className)}
                onClick={handleClick}
                ref={ref}
                component={isXSmall ? 'span' : 'li'}
                {...rest}
            >
                <ListItemIcon className={LogoutClasses.icon}>
                    {icon ? icon : <ExitIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>
                    {translate('ra.auth.logout', { _: 'Logout' })}
                </ListItemText>
            </StyledMenuItem>
        );
    }
);

const PREFIX = 'RaLogout';

export const LogoutClasses = {
    icon: `${PREFIX}-icon`,
};

const StyledMenuItem = styled(MenuItem, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${LogoutClasses.icon}`]: {},
});

export interface LogoutProps {
    className?: string;
    redirectTo?: string;
    icon?: ReactNode;
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaLogout: 'root' | 'icon';
    }

    interface ComponentsPropsList {
        RaLogout: Partial<LogoutProps>;
    }

    interface Components {
        RaLogout?: {
            defaultProps?: ComponentsPropsList['RaLogout'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaLogout'];
        };
    }
}
