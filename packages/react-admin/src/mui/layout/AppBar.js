import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';

import { toggleSidebar as toggleSidebarAction } from 'react-admin-core';
import { DRAWER_WIDTH } from './Sidebar';
import LoadingIndicator from './LoadingIndicator';

const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    title: {
        flex: 1,
    },
    loadingIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1200,
        marginBottom: 16,
        marginTop: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    logout: {
        color: theme.palette.primary.contrastText,
    },
});

const AppBar = ({
    classes,
    className,
    logout,
    open,
    title,
    toggleSidebar,
    ...rest
}) => (
    <MuiAppBar
        className={classNames(
            classes.appBar,
            open && classes.appBarShift,
            className
        )}
        {...rest}
    >
        <Toolbar disableGutters={!open}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleSidebar}
                className={classNames(classes.menuButton, open && classes.hide)}
            >
                <MenuIcon />
            </IconButton>
            <Typography
                variant="title"
                color="inherit"
                className={classes.title}
            >
                {title}
            </Typography>
            {cloneElement(logout, {
                className: classes.logout,
            })}
        </Toolbar>
        <LoadingIndicator className={classes.loadingIndicator} />
    </MuiAppBar>
);

AppBar.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    logout: PropTypes.element,
    open: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(
    connect(null, {
        toggleSidebar: toggleSidebarAction,
    }),
    withStyles(styles)
);

export default enhance(AppBar);
