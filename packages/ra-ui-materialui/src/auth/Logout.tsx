import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { useCallback, FunctionComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { ListItemIcon, MenuItem, useMediaQuery } from '@mui/material';
import { MenuItemProps } from '@mui/material/MenuItem';

import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import classnames from 'classnames';
import { useTranslate, useLogout } from 'ra-core';

const PREFIX = 'RaLogout';

const classes = {
    menuItem: `${PREFIX}-menuItem`,
    icon: `${PREFIX}-icon`,
};

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    [`&.${classes.menuItem}`]: {
        color: theme.palette.text.secondary,
    },

    [`& .${classes.icon}`]: { minWidth: theme.spacing(5) },
}));

interface Props {
    className?: string;
    redirectTo?: string;
    icon?: ReactElement;
}

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
const LogoutWithRef: FunctionComponent<
    Props & MenuItemProps<'li', { button: true }> // HACK: https://github.com/mui-org/material-ui/issues/16245
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
            className={classnames('logout', classes.menuItem, className)}
            onClick={handleClick}
            ref={ref}
            // @ts-ignore
            component={isXSmall ? 'span' : 'li'}
            {...rest}
        >
            <ListItemIcon className={classes.icon}>
                {icon ? icon : <ExitIcon />}
            </ListItemIcon>
            {translate('ra.auth.logout')}
        </StyledMenuItem>
    );
});

LogoutWithRef.propTypes = {
    className: PropTypes.string,
    redirectTo: PropTypes.string,
    icon: PropTypes.element,
};

export default LogoutWithRef;
