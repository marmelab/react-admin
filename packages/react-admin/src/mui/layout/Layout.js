import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
    MuiThemeProvider,
    createMuiTheme,
    withStyles,
} from 'material-ui/styles';
import Hidden from 'material-ui/Hidden';
import compose from 'recompose/compose';

import AdminRoutes from '../../AdminRoutes';
import AppBar from './AppBar';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import LoadingIndicator from './LoadingIndicator';
import Menu from './Menu';
import Notification from './Notification';
import defaultTheme from '../defaultTheme';

const styles = theme => ({
    root: {
        width: '100%',
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    content: {
        width: '100%',
        marginLeft: 0,
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height: 'calc(100% - 56px)',
        [theme.breakpoints.up('md')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64,
            },
        },
        [theme.breakpoints.up('xs')]: {
            marginTop: '4em',
        },
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        },
    },
    contentShift: {
        [theme.breakpoints.up('md')]: {
            marginLeft: DRAWER_WIDTH,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
});

const Layout = ({
    catchAll,
    children,
    classes,
    className,
    customRoutes,
    dashboard,
    logout,
    menu,
    open,
    theme,
    title,
    ...rest
}) => (
    <MuiThemeProvider theme={createMuiTheme(theme)}>
        <div className={classnames(classes.root, className)} {...rest}>
            <div className={classes.appFrame}>
                <Hidden xsDown>
                    <AppBar title={title} open={open} />
                </Hidden>
                <Sidebar>
                    {createElement(menu || Menu, {
                        logout,
                        hasDashboard: !!dashboard,
                    })}
                </Sidebar>
                <main
                    className={classnames(
                        classes.content,
                        open && classes.contentShift
                    )}
                >
                    <AdminRoutes
                        customRoutes={customRoutes}
                        dashboard={dashboard}
                        catchAll={catchAll}
                        title={title}
                    >
                        {children}
                    </AdminRoutes>
                </main>
                <Notification />
                <LoadingIndicator />
            </div>
        </div>
    </MuiThemeProvider>
);

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

Layout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    classes: PropTypes.object,
    className: PropTypes.string,
    catchAll: componentPropType,
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    logout: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.string,
    ]),
    menu: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    open: PropTypes.bool,
    title: PropTypes.node.isRequired,
    theme: PropTypes.object.isRequired,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
});
const enhance = compose(
    connect(
        mapStateToProps,
        {} // Avoid connect passing dispatch in props
    ),
    withStyles(styles)
);

export default enhance(Layout);
