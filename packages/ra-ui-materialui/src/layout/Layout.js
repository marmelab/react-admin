import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import {
    createMuiTheme,
    withStyles,
    createStyles,
} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import compose from 'recompose/compose';
import { ComponentPropType } from 'ra-core';

import AppBar from './AppBar';
import Sidebar from './Sidebar';
import Menu from './Menu';
import Notification from './Notification';
import Error from './Error';
import defaultTheme from '../defaultTheme';

const styles = theme =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            position: 'relative',
            minWidth: 'fit-content',
            width: '100%',
        },
        appFrame: {
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('xs')]: {
                marginTop: theme.spacing(6),
            },
            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(7),
            },
        },
        contentWithSidebar: {
            display: 'flex',
            flexGrow: 1,
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            flexBasis: 0,
            padding: theme.spacing(3),
            paddingTop: theme.spacing(1),
            paddingLeft: 0,
            [theme.breakpoints.up('xs')]: {
                paddingLeft: 5,
            },
            [theme.breakpoints.down('sm')]: {
                padding: 0,
            },
        },
    });

const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...props
}) => props;

class Layout extends Component {
    state = { hasError: false, errorMessage: null, errorInfo: null };

    constructor(props) {
        super(props);
        /**
         * Reset the error state upon navigation
         *
         * @see https://stackoverflow.com/questions/48121750/browser-navigation-broken-by-use-of-react-error-boundaries
         */
        props.history.listen(() => {
            if (this.state.hasError) {
                this.setState({ hasError: false });
            }
        });
    }

    componentDidCatch(errorMessage, errorInfo) {
        this.setState({ hasError: true, errorMessage, errorInfo });
    }

    render() {
        const {
            appBar,
            children,
            classes,
            className,
            customRoutes,
            error,
            dashboard,
            logout,
            menu,
            notification,
            open,
            sidebar,
            title,
            ...props
        } = this.props;
        const { hasError, errorMessage, errorInfo } = this.state;
        return (
            <div
                className={classnames('layout', classes.root, className)}
                {...sanitizeRestProps(props)}
            >
                <div className={classes.appFrame}>
                    {createElement(appBar, { title, open, logout })}
                    <main className={classes.contentWithSidebar}>
                        {createElement(sidebar, {
                            children: createElement(menu, {
                                logout,
                                hasDashboard: !!dashboard,
                            }),
                        })}
                        <div className={classes.content}>
                            {hasError
                                ? createElement(error, {
                                      error: errorMessage,
                                      errorInfo,
                                      title,
                                  })
                                : children}
                        </div>
                    </main>
                    {createElement(notification)}
                </div>
            </div>
        );
    }
}

Layout.propTypes = {
    appBar: ComponentPropType,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    classes: PropTypes.object,
    className: PropTypes.string,
    customRoutes: PropTypes.array,
    dashboard: ComponentPropType,
    error: ComponentPropType,
    history: PropTypes.object.isRequired,
    logout: ComponentPropType,
    menu: ComponentPropType,
    notification: ComponentPropType,
    open: PropTypes.bool,
    sidebar: ComponentPropType,
    title: PropTypes.node.isRequired,
};

Layout.defaultProps = {
    appBar: AppBar,
    error: Error,
    menu: Menu,
    notification: Notification,
    sidebar: Sidebar,
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
});

const EnhancedLayout = compose(
    connect(
        mapStateToProps,
        {} // Avoid connect passing dispatch in props
    ),
    withRouter,
    withStyles(styles)
)(Layout);

class LayoutWithTheme extends Component {
    constructor(props) {
        super(props);
        this.theme = createMuiTheme(props.theme);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.theme !== this.props.theme) {
            this.theme = createMuiTheme(nextProps.theme);
        }
    }
    render() {
        const { theme, ...rest } = this.props;
        return (
            <ThemeProvider theme={this.theme}>
                <EnhancedLayout {...rest} />
            </ThemeProvider>
        );
    }
}

LayoutWithTheme.propTypes = {
    theme: PropTypes.object,
};

LayoutWithTheme.defaultProps = {
    theme: defaultTheme,
};

export default LayoutWithTheme;
