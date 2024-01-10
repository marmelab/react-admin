import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { useCallback, FunctionComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
} from '@mui/material';
import { MenuItemProps } from '@mui/material/MenuItem';

import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import clsx from 'clsx';
import { useTranslate, useLogout, useAuthState } from 'ra-core';

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
export const Logout: FunctionComponent<
    LogoutProps & MenuItemProps<'li'>
> = React.forwardRef(function Logout(props, ref) {
    const { className, redirectTo, icon, ...rest } = props;

    const { authenticated } = useAuthState();
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const translate = useTranslate();
    const logout = useLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleClick = useCallback(() => logout(null, redirectTo, false), [
        redirectTo,
        logout,
    ]);

    if (!authenticated) return null;

    return (
        <StyledMenuItem
            className={clsx('logout', className)}
            onClick={handleClick}
            ref={ref}
            // @ts-ignore
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
});

Logout.propTypes = {
    className: PropTypes.string,
    redirectTo: PropTypes.string,
    icon: PropTypes.element,
};

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
    icon?: ReactElement;
}
