import React, { Children, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import { toggleSidebar as toggleSidebarAction, ComponentPropType } from 'ra-core';

import LoadingIndicator from './LoadingIndicator';
import UserMenu from './UserMenu';
import HideOnScroll from './HideOnScroll';

const styles = theme =>
    createStyles({
        toolbar: {
            paddingRight: 24,
        },
        menuButton: {
            marginLeft: '0.5em',
            marginRight: '0.5em',
        },
        menuButtonIconClosed: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(0deg)',
        },
        menuButtonIconOpen: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(180deg)',
        },
        title: {
            flex: 1,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
    });

const AppBar = ({
    children,
    classes,
    className,
    logo,
    logout,
    open,
    title,
    toggleSidebar,
    userMenu,
    width,
    ...rest
}) => (
    <HideOnScroll>
        <MuiAppBar className={className} color="secondary" {...rest}>
            <Toolbar
                disableGutters
                variant={width === 'xs' ? 'regular' : 'dense'}
                className={classes.toolbar}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleSidebar}
                    className={classNames(classes.menuButton)}
                >
                    <MenuIcon
                        classes={{
                            root: open
                                ? classes.menuButtonIconOpen
                                : classes.menuButtonIconClosed,
                        }}
                    />
                </IconButton>
                {Children.count(children) === 0 ? (
                    <Typography
                        variant="h6"
                        color="inherit"
                        className={classes.title}
                        id="react-admin-title"
                    />
                ) : (
                    children
                )}
                <LoadingIndicator />
                {createElement(userMenu, { logout })}
            </Toolbar>
        </MuiAppBar>
    </HideOnScroll>
);

AppBar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    logout: ComponentPropType,
    open: PropTypes.bool,
    toggleSidebar: PropTypes.func.isRequired,
    userMenu: ComponentPropType,
    width: PropTypes.string,
};

AppBar.defaultProps = {
    userMenu: UserMenu,
};

const enhance = compose(
    connect(
        state => ({
            locale: state.i18n.locale, // force redraw on locale change
        }),
        {
            toggleSidebar: toggleSidebarAction,
        }
    ),
    withStyles(styles),
    withWidth()
);

export default enhance(AppBar);
