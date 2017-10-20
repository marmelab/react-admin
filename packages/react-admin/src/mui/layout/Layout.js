import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import { CircularProgress } from 'material-ui/Progress';
import Hidden from 'material-ui/Hidden';
import compose from 'recompose/compose';

import AdminRoutes from '../../AdminRoutes';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import Menu from './Menu';
import Notification from './Notification';
import defaultTheme from '../defaultTheme';
import { setSidebarVisibility } from '../../actions';
import { DRAWER_WIDTH } from './Sidebar';

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
        [theme.breakpoints.up('sm')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64,
            },
        },
        [theme.breakpoints.up('xs')]: {
            marginTop: '4em',
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: '3em',
            padding: 0,
        },
    },
    contentShift: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: DRAWER_WIDTH,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
        color: 'white',
    },
});

class Layout extends Component {
    componentWillMount() {
        const { width, setSidebarVisibility } = this.props;
        if (width !== 'xs' && width !== 'sm') {
            setSidebarVisibility(true);
        }
    }

    render() {
        const {
            catchAll,
            children,
            classes,
            customRoutes,
            dashboard,
            isLoading,
            logout,
            menu,
            open,
            title,
            width,
        } = this.props;

        return (
            <div className={classes.root}>
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
                        className={classNames(
                            classes.content,
                            open && classes.contentShift
                        )}
                    >
                        <AdminRoutes
                            customRoutes={customRoutes}
                            dashboard={dashboard}
                            catchAll={catchAll}
                        >
                            {children}
                        </AdminRoutes>
                    </main>

                    <Notification />
                    {isLoading && (
                        <CircularProgress
                            className={classNames('app-loader', classes.loader)}
                            size={width === 'xs' || width === 'sm' ? 20 : 30}
                            thickness={2}
                        />
                    )}
                </div>
            </div>
        );
    }
}

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

Layout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    classes: PropTypes.object,
    catchAll: componentPropType,
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    isLoading: PropTypes.bool.isRequired,
    logout: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.string,
    ]),
    menu: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    open: PropTypes.bool,
    setSidebarVisibility: PropTypes.func.isRequired,
    title: PropTypes.node.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.string,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

const mapStateToProps = state => ({
    isLoading: state.admin.loading > 0,
    open: state.admin.ui.sidebarOpen,
});
const enhance = compose(
    connect(mapStateToProps, {
        setSidebarVisibility,
    }),
    withStyles(styles),
    withWidth()
);

export default enhance(Layout);
