import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
} from '@material-ui/core/styles';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import classnames from 'classnames';
import {
    withTranslate,
    userLogout as userLogoutAction,
    TranslationContextProps,
} from 'ra-core';

interface Props {
    redirectTo?: string;
}

interface EnhancedProps
    extends TranslationContextProps,
        WithStyles<typeof styles> {
    userLogout: () => void;
}

const styles = (theme: Theme) =>
    createStyles({
        menuItem: {
            color: theme.palette.text.secondary,
        },
        iconMenuPaddingStyle: {
            paddingRight: '1.2em',
        },
        iconPaddingStyle: {
            paddingRight: theme.spacing.unit,
        },
    });

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
const Logout: SFC<Props & EnhancedProps & MenuItemProps> = ({
    classes,
    className,
    locale,
    redirectTo,
    translate,
    userLogout,
    ...rest
}) => (
    <MenuItem
        className={classnames('logout', classes.menuItem, className)}
        onClick={userLogout}
        {...rest}
    >
        <span className={classes.iconMenuPaddingStyle}>
            <ExitIcon />
        </span>
        {translate('ra.auth.logout')}
    </MenuItem>
);

const mapDispatchToProps = (dispatch, { redirectTo }) => ({
    userLogout: () => dispatch(userLogoutAction(redirectTo)),
});

const enhance = compose<Props & EnhancedProps, Props>(
    withTranslate,
    connect(
        undefined,
        mapDispatchToProps
    ),
    withStyles(styles)
);

const EnhancedLogout = enhance(Logout);

EnhancedLogout.propTypes = {
    className: PropTypes.string,
    redirectTo: PropTypes.string,
};

export default EnhancedLogout;
