import React, { useCallback, SFC } from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import { useDispatch } from 'react-redux';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/styles';

import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import classnames from 'classnames';
import { useTranslate, userLogout } from 'ra-core';

interface Props {
    className?: string;
    redirectTo?: string;
}

const useStyles = makeStyles(theme => ({
    menuItem: {
        color: theme.palette.text.secondary,
    },
    iconMenuPaddingStyle: {
        paddingRight: '1.2em',
    },
    iconPaddingStyle: {
        paddingRight: theme.spacing(1),
    },
}));

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
const LogoutWithRef: SFC<Props & MenuItemProps> = React.forwardRef(
    function Logout(props, ref) {
        const { className, redirectTo, ...rest } = props;
        const classes = useStyles();
        const translate = useTranslate();
        const dispatch = useDispatch();
        const logout = useCallback(() => dispatch(userLogout(redirectTo)), [
            redirectTo,
        ]);
        return (
            <MenuItem
                className={classnames('logout', classes.menuItem, className)}
                onClick={logout}
                ref={ref}
                {...rest}
            >
                <span className={classes.iconMenuPaddingStyle}>
                    <ExitIcon />
                </span>
                {translate('ra.auth.logout')}
            </MenuItem>
        );
    }
);

LogoutWithRef.propTypes = {
    className: PropTypes.string,
    redirectTo: PropTypes.string,
};

export default LogoutWithRef;
