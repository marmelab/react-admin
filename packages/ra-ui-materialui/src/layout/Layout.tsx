import React, {
    Component,
    ComponentType,
    createElement,
    ErrorInfo,
    HTMLAttributes,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
    createMuiTheme,
    withStyles,
    createStyles,
} from '@material-ui/core/styles';
import { ThemeProvider, ClassNameMap } from '@material-ui/styles';
import compose from 'recompose/compose';

import DefaultAppBar, { AppBarProps } from './AppBar';
import DefaultSidebar, { SidebarProps } from './Sidebar';
import DefaultMenu, { MenuProps } from './Menu';
import DefaultNotification, { NotificationProps } from './Notification';
import DefaultError, { ErrorProps } from './Error';
import defaultTheme from '../defaultTheme';
import { ComponentPropType, CustomRoutes } from 'ra-core';

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
}: Omit<LayoutProps, 'title'>) => props;

class Layout extends Component<LayoutProps, LayoutState> {
    state = { hasError: false, errorMessage: null, errorInfo: null };

    static propTypes = {
        appBar: ComponentPropType,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        classes: PropTypes.object,
        className: PropTypes.string,
        customRoutes: PropTypes.array,
        dashboard: ComponentPropType,
        error: ComponentPropType,
        history: PropTypes.object.isRequired,
        logout: PropTypes.element,
        menu: ComponentPropType,
        notification: ComponentPropType,
        open: PropTypes.bool,
        sidebar: ComponentPropType,
        title: PropTypes.node.isRequired,
    };

    static defaultProps = {
        appBar: DefaultAppBar,
        error: DefaultError,
        menu: DefaultMenu,
        notification: DefaultNotification,
        sidebar: DefaultSidebar,
    };

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

interface Props {
    appBar?: ComponentType<AppBarProps>;
    open?: boolean;
    classes?: ClassNameMap;
    className?: string;
    customRoutes?: CustomRoutes;
    error?: ComponentType<ErrorProps>;
    dashboard?: ComponentType<any>;
    logout?: ReactElement;
    menu?: ComponentType<MenuProps>;
    notification?: ComponentType<NotificationProps>;
    sidebar?: ComponentType<SidebarProps>;
    title: string;
}

interface LayoutState {
    hasError: boolean;
    errorMessage?: string;
    errorInfo?: ErrorInfo;
}

export type LayoutProps = Props &
    RouteComponentProps &
    HTMLAttributes<HTMLDivElement>;

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

const LayoutWithTheme = ({ theme: themeOverride, ...props }) => {
    const themeProp = useRef(themeOverride);
    const [theme, setTheme] = useState(createMuiTheme(themeOverride));

    useEffect(() => {
        if (themeProp.current !== themeOverride) {
            themeProp.current = themeOverride;
            setTheme(createMuiTheme(themeOverride));
        }
    }, [themeOverride, themeProp, theme, setTheme]);

    return (
        <ThemeProvider theme={theme}>
            <EnhancedLayout {...props} />
        </ThemeProvider>
    );
};

LayoutWithTheme.propTypes = {
    theme: PropTypes.object,
};

LayoutWithTheme.defaultProps = {
    theme: defaultTheme,
};

export default LayoutWithTheme;
