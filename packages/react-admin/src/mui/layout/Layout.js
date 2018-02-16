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

import AppBar from './AppBar';
import Sidebar from './Sidebar';
import Menu from './Menu';
import Notification from './Notification';
import defaultTheme from '../defaultTheme';

const styles = theme => ({
    root: {
        width: '100%',
        zIndex: 1,
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    content: {
        width: '100%',
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        [theme.breakpoints.up('xs')]: {
            marginTop: '4em',
            paddingLeft: 5,
        },
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: '3em',
        },
    },
});

const sanitizeRestProps = ({ staticContext, ...props }) => props;

const Layout = ({
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
    ...props
}) => (
    <MuiThemeProvider theme={createMuiTheme(theme)}>
        <div
            className={classnames('layout', classes.root, className)}
            {...sanitizeRestProps(props)}
        >
            <div className={classes.appFrame}>
                <Hidden xsDown>
                    <AppBar title={title} open={open} logout={logout} />
                </Hidden>
                <Sidebar>
                    {createElement(menu || Menu, {
                        logout,
                        hasDashboard: !!dashboard,
                    })}
                </Sidebar>
                <main className={classes.content}>{children}</main>
                <Notification />
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
