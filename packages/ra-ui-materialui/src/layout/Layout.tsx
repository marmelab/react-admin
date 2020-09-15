import React, {
    Component,
    createElement,
    useEffect,
    useRef,
    useState,
    ErrorInfo,
    ReactElement,
    ReactNode,
    ComponentType,
    HtmlHTMLAttributes,
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
import { ThemeProvider } from '@material-ui/styles';
import { ThemeOptions } from '@material-ui/core';
import { ComponentPropType, CustomRoutes, LayoutProps } from 'ra-core';
import compose from 'lodash/flowRight';

import DefaultAppBar from './AppBar';
import DefaultSidebar from './Sidebar';
import DefaultMenu from './Menu';
import DefaultNotification from './Notification';
import DefaultError from './Error';
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
}: RestProps) => props;

class Layout extends Component<MuiLayoutProps, LayoutState> {
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
            <>
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
}

export interface MuiLayoutProps
    extends LayoutProps,
        RouteComponentProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    className?: string;
    classes?: any;
    customRoutes?: CustomRoutes;
    appBar?: ComponentType<{
        title?: string | ReactElement<any>;
        open?: boolean;
        logout?: ReactNode;
    }>;
    sidebar?: ComponentType<{ children: JSX.Element }>;
    error?: ComponentType<{
        error?: string;
        errorInfo?: React.ErrorInfo;
        title?: string | ReactElement<any>;
    }>;
    notification?: ComponentType;
    open?: boolean;
}

export type RestProps = Omit<
    MuiLayoutProps,
    | 'appBar'
    | 'children'
    | 'classes'
    | 'className'
    | 'customRoutes'
    | 'error'
    | 'dashboard'
    | 'logout'
    | 'menu'
    | 'notification'
    | 'open'
    | 'sidebar'
    | 'title'
>;

export interface LayoutState {
    hasError: boolean;
    errorMessage: string;
    errorInfo: ErrorInfo;
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
)(Layout);

const LayoutWithTheme = ({
    theme: themeOverride,
    ...props
}: LayoutWithThemeProps): JSX.Element => {
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

interface LayoutWithThemeProps extends LayoutProps {
    theme?: ThemeOptions;
}

export default LayoutWithTheme;
