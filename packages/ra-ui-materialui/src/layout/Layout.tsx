import React, {
    Component,
    createElement,
    useEffect,
    useRef,
    useState,
    ErrorInfo,
    ReactElement,
    ComponentType,
    HtmlHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    createStyles,
    adaptV4Theme,
    ThemeProvider,
    StyledEngineProvider,
    Theme,
} from '@mui/material/styles';
import { DeprecatedThemeOptions } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ComponentPropType, CoreLayoutProps } from 'ra-core';
import compose from 'lodash/flowRight';

import DefaultAppBar, { AppBarProps } from './AppBar';
import DefaultSidebar from './Sidebar';
import DefaultMenu, { MenuProps } from './Menu';
import DefaultNotification from './Notification';
import DefaultError from './Error';
import defaultTheme from '../defaultTheme';
import SkipNavigationButton from '../button/SkipNavigationButton';
import { createMuiTheme } from './createMuiTheme';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

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
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        appFrame: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            [theme.breakpoints.up('xs')]: {
                marginTop: theme.spacing(6),
            },
            [theme.breakpoints.down('sm')]: {
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
            [theme.breakpoints.down('md')]: {
                padding: 0,
            },
        },
    });

class LayoutWithoutTheme extends Component<
    LayoutWithoutThemeProps,
    LayoutState
> {
    state: LayoutState = { hasError: false, error: null, errorInfo: null };

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

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ hasError: true, error, errorInfo });
    }

    render() {
        const {
            appBar,
            children,
            classes,
            className,
            error: ErrorComponent,
            dashboard,
            logout,
            menu,
            notification,
            open,
            sidebar,
            title,
            // sanitize react-router props
            match,
            location,
            history,
            staticContext,
            ...props
        } = this.props;
        const { hasError, error, errorInfo } = this.state;
        return (
            <>
                <div
                    className={classnames('layout', classes.root, className)}
                    {...props}
                >
                    <SkipNavigationButton />
                    <div className={classes.appFrame}>
                        {createElement(appBar, { title, open, logout })}
                        <main className={classes.contentWithSidebar}>
                            {createElement(sidebar, {
                                children: createElement(menu, {
                                    logout,
                                    hasDashboard: !!dashboard,
                                }),
                            })}
                            <div id="main-content" className={classes.content}>
                                {hasError ? (
                                    <ErrorComponent
                                        error={error}
                                        errorInfo={errorInfo}
                                        title={title}
                                    />
                                ) : (
                                    children
                                )}
                            </div>
                        </main>
                    </div>
                </div>
                {createElement(notification)}
            </>
        );
    }

    static propTypes = {
        appBar: ComponentPropType,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        classes: PropTypes.object,
        className: PropTypes.string,
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
}

export interface LayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    appBar?: ComponentType<AppBarProps>;
    classes?: any;
    className?: string;
    error?: ComponentType<{
        error?: Error;
        errorInfo?: ErrorInfo;
        title?: string | ReactElement<any>;
    }>;
    menu?: ComponentType<MenuProps>;
    notification?: ComponentType;
    sidebar?: ComponentType<{ children: JSX.Element }>;
    theme?: DeprecatedThemeOptions;
}

export interface LayoutState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface LayoutWithoutThemeProps
    extends RouteComponentProps,
        Omit<LayoutProps, 'theme'> {
    open?: boolean;
}

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
});

const EnhancedLayout = compose(
    connect(
        mapStateToProps,
        {} // Avoid connect passing dispatch in props
    ),
    withRouter,
    withStyles(styles, { name: 'RaLayout' })
)(LayoutWithoutTheme);

const Layout = ({
    theme: themeOverride,
    ...props
}: LayoutProps): JSX.Element => {
    const themeProp = useRef(themeOverride);
    const [theme, setTheme] = useState(() =>
        createMuiTheme(adaptV4Theme(themeOverride))
    );

    useEffect(() => {
        if (themeProp.current !== themeOverride) {
            themeProp.current = themeOverride;
            setTheme(createMuiTheme(adaptV4Theme(themeOverride)));
        }
    }, [themeOverride, themeProp, theme, setTheme]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <EnhancedLayout {...props} />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

Layout.propTypes = {
    theme: PropTypes.object,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

export default Layout;
