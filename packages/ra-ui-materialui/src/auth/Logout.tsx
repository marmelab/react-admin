import React, { useCallback, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { ListItemIcon, MenuItem, makeStyles } from '@material-ui/core';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import { Theme } from '@material-ui/core/styles';

import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import classnames from 'classnames';
import { useTranslate, useLogout } from 'ra-core';

interface Props {
    className?: string;
    redirectTo?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    menuItem: {
        color: theme.palette.text.secondary,
    },
    icon: { minWidth: theme.spacing(5) },
}));

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
const LogoutWithRef: FunctionComponent<
    Props & MenuItemProps<'li', { button: true }> // HACK: https://github.com/mui-org/material-ui/issues/16245
> = React.forwardRef(function Logout(props, ref) {
    const { className, redirectTo, ...rest } = props;
    const classes = useStyles({}); // the empty {} is a temp fix for https://github.com/mui-org/material-ui/issues/15942
    const translate = useTranslate();
    const logout = useLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleClick = useCallback(() => logout(redirectTo), [
        redirectTo,
        logout,
    ]);
    return (
        <MenuItem
            className={classnames('logout', classes.menuItem, className)}
            onClick={handleClick}
            ref={ref}
            {...rest}
        >
            <ListItemIcon className={classes.icon}>
                <ExitIcon />
            </ListItemIcon>
            {translate('ra.auth.logout')}
        </MenuItem>
    );
});

LogoutWithRef.propTypes = {
    className: PropTypes.string,
    redirectTo: PropTypes.string,
};

export default LogoutWithRef;
