import React, {
    ComponentType,
    createElement,
    FC,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import { DrawerProps, makeStyles } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/styles';
import classnames from 'classnames';
import { ComponentPropType, DashboardComponent, ReduxState } from 'ra-core';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import DefaultAppBar from './AppBar';
import DefaultSidebar from './Sidebar';
import DefaultMenu, { MenuProps } from './Menu';
import DefaultNotification, { NotificationProps } from './Notification';
import DefaultError from './Error';
import defaultTheme from '../defaultTheme';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';

const useStyles = makeStyles(
    theme => ({
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
    }),
    { name: 'RaLayout' }
);

const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...props
}: Partial<LayoutProps>): Omit<
    Partial<LayoutProps>,
    keyof RouteComponentProps | 'title'
> => props;

export const Layout: FC<LayoutProps> = props => {
    const {
        appBar,
        children,
        classes: classesOverride,
        className,
        customRoutes,
        error,
        dashboard,
        logout,
        menu,
        notification,
        sidebar,
        title,
        ...rest
    } = props;

    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const classes = useStyles();

    return (
        <div
            className={classnames('layout', classes.root, className)}
            {...sanitizeRestProps(rest)}
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
                        <ErrorBoundary error={error} title={title}>
                            {children}
                        </ErrorBoundary>
                    </div>
                </main>
                {createElement(notification)}
            </div>
        </div>
    );
};

Layout.propTypes = {
    appBar: ComponentPropType,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    customRoutes: PropTypes.array,
    dashboard: ComponentPropType,
    error: ComponentPropType,
    logout: PropTypes.element,
    menu: ComponentPropType,
    notification: ComponentPropType,
    open: PropTypes.bool,
    sidebar: ComponentPropType,
    title: PropTypes.element.isRequired,
};

Layout.defaultProps = {
    appBar: DefaultAppBar,
    error: DefaultError,
    menu: DefaultMenu,
    notification: DefaultNotification,
    sidebar: DefaultSidebar,
};

interface LayoutWithThemeProps extends LayoutProps {
    theme?: ThemeOptions;
}

const LayoutWithTheme: FC<LayoutWithThemeProps> = ({
    theme: themeOverride,
    ...props
}) => {
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
            <Layout {...props} />
        </ThemeProvider>
    );
};

interface LayoutProps extends RouteComponentProps, ErrorBoundaryProps {
    appBar?: ComponentType<any>;
    classes?: object;
    children: ReactElement;
    className?: string;
    customRoutes?: any[];
    dashboard?: DashboardComponent;
    logout?: ReactNode;
    menu?: ComponentType<MenuProps>;
    notification?: ComponentType<NotificationProps>;
    open?: boolean;
    sidebar?: ComponentType<DrawerProps>;
}

LayoutWithTheme.propTypes = {
    theme: PropTypes.any,
};

LayoutWithTheme.defaultProps = {
    theme: defaultTheme,
};

export default LayoutWithTheme;
