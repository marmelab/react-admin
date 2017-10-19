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

const styles = theme => ({
    wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        [theme.breakpoints.up('xs')]: {
            backgroundColor: '#edecec',
            display: 'flex',
            flex: 1,
            overflowY: 'hidden',
            overflowX: 'scroll',
        },
        [theme.breakpoints.down('sm')]: {
            backgroundColor: '#fff',
        },
    },
    content: {
        flex: 1,
        [theme.breakpoints.up('xs')]: {
            paddingTop: '4em',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '2em',
        },
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    },
    progress: {
        primaryColor: {
            color: 'white',
        },
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
            children,
            classes,
            customRoutes,
            dashboard,
            isLoading,
            logout,
            menu,
            catchAll,
            title,
            width,
        } = this.props;

        return (
            <div className={classes.wrapper}>
                <div className={classes.main}>
                    <Hidden xsDown>
                        <AppBar title={title} />
                    </Hidden>
                    <div className={classNames('body', classes.body)}>
                        <div className={classes.content}>
                            <AdminRoutes
                                customRoutes={customRoutes}
                                dashboard={dashboard}
                                catchAll={catchAll}
                            >
                                {children}
                            </AdminRoutes>
                        </div>
                        <Sidebar>
                            {createElement(menu || Menu, {
                                logout,
                                hasDashboard: !!dashboard,
                            })}
                        </Sidebar>
                    </div>
                    <Notification />
                    {isLoading && (
                        <CircularProgress
                            classes={{
                                primaryColor: classes.progress.primaryColor,
                            }}
                            className="app-loader"
                            size={width === 'xs' || width === 'sm' ? 20 : 30}
                            thickness={2}
                            style={styles.loader}
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
    setSidebarVisibility: PropTypes.func.isRequired,
    title: PropTypes.node.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.string,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

const enhance = compose(
    connect(state => ({ isLoading: state.admin.loading > 0 }), {
        setSidebarVisibility,
    }),
    withStyles(styles),
    withWidth()
);

export default enhance(Layout);
