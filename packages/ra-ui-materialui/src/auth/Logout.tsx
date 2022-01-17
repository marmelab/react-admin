import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { useCallback, FunctionComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { ListItemIcon, MenuItem, useMediaQuery } from '@mui/material';
import { MenuItemProps } from '@mui/material/MenuItem';

import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import classnames from 'classnames';
import { useTranslate, useLogout } from 'ra-core';

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
export const Logout: FunctionComponent<
    LogoutProps & MenuItemProps<'li'>
> = React.forwardRef(function Logout(props, ref) {
    const {
        className,
        classes: classesOverride,
        redirectTo,
        icon,
        ...rest
    } = props;

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
    return (
        <StyledMenuItem
            className={classnames('logout', LogoutClasses.menuItem, className)}
            onClick={handleClick}
            ref={ref}
            // @ts-ignore
            component={isXSmall ? 'span' : 'li'}
            {...rest}
        >
            <ListItemIcon className={LogoutClasses.icon}>
                {icon ? icon : <ExitIcon />}
            </ListItemIcon>
            {translate('ra.auth.logout')}
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
    menuItem: `${PREFIX}-menuItem`,
    icon: `${PREFIX}-icon`,
};

const StyledMenuItem = styled(MenuItem, { name: 'RaLogout' })(({ theme }) => ({
    [`&.${LogoutClasses.menuItem}`]: {
        color: theme.palette.text.secondary,
    },

    [`& .${LogoutClasses.icon}`]: { minWidth: theme.spacing(5) },
}));

export interface LogoutProps {
    className?: string;
    redirectTo?: string;
    icon?: ReactElement;
}
