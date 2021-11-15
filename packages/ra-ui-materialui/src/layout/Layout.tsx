import React, {
    createElement,
    useEffect,
    useRef,
    useState,
    ErrorInfo,
    ReactNode,
    ComponentType,
    HtmlHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { DeprecatedThemeOptions } from '@mui/material';
import { CoreLayoutProps, ReduxState } from 'ra-core';

import { AppBar as DefaultAppBar, AppBarProps } from './AppBar';
import { Sidebar as DefaultSidebar } from './Sidebar';
import { Menu as DefaultMenu, MenuProps } from './Menu';
import { Notification as DefaultNotification } from './Notification';
import { Error as DefaultError } from './Error';
import { defaultTheme } from '../defaultTheme';
import { SkipNavigationButton } from '../button';

const LayoutWithoutTheme = (props: LayoutWithoutThemeProps) => {
    const {
        appBar = DefaultAppBar,
        children,
        className,
        error: ErrorComponent = DefaultError,
        dashboard,
        error,
        logout,
        menu = DefaultMenu,
        notification = DefaultNotification,
        sidebar = DefaultSidebar,
        title,
        ...rest
    } = props;

    const open = useSelector<ReduxState, boolean>(
        state => state.admin.ui.sidebarOpen
    );

    return (
        // @ts-ignore
        <ErrorBoundary FallbackComponent={ErrorComponent}>
            <StyledLayout
                className={classnames('layout', LayoutClasses.root, className)}
                {...rest}
            >
                <SkipNavigationButton />
                <div className={LayoutClasses.appFrame}>
                    {createElement(appBar, { logout, open, title })}
                    <main className={LayoutClasses.contentWithSidebar}>
                        {createElement(sidebar, {
                            children: createElement(menu, {
                                hasDashboard: !!dashboard,
                            }),
                        })}
                        <div
                            id="main-content"
                            className={LayoutClasses.content}
                        >
                            {children}
                        </div>
                    </main>
                </div>
            </StyledLayout>
            {createElement(notification)}
        </ErrorBoundary>
    );
};

export interface LayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    appBar?: ComponentType<AppBarProps>;
    classes?: any;
    className?: string;
    error?: ComponentType<FallbackProps>;
    menu?: ComponentType<MenuProps>;
    notification?: ComponentType;
    sidebar?: ComponentType<{ children: ReactNode }>;
    theme?: DeprecatedThemeOptions;
}

export interface LayoutState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface LayoutWithoutThemeProps extends Omit<LayoutProps, 'theme'> {
    open?: boolean;
}

export const Layout = ({
    theme: themeOverride,
    ...props
}: LayoutProps): JSX.Element => {
    const themeProp = useRef(themeOverride);
    const [theme, setTheme] = useState(() => createTheme(themeOverride));

    useEffect(() => {
        if (themeProp.current !== themeOverride) {
            themeProp.current = themeOverride;
            setTheme(createTheme(themeOverride));
        }
    }, [themeOverride, themeProp, theme, setTheme]);

    return (
        <ThemeProvider theme={theme}>
            <LayoutWithoutTheme {...props} />
        </ThemeProvider>
    );
};

Layout.propTypes = {
    theme: PropTypes.object,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

const PREFIX = 'RaLayout';
export const LayoutClasses = {
    root: `${PREFIX}-root`,
    appFrame: `${PREFIX}-appFrame`,
    contentWithSidebar: `${PREFIX}-contentWithSidebar`,
    content: `${PREFIX}-content`,
};

const StyledLayout = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${LayoutClasses.root}`]: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        minWidth: 'fit-content',
        width: '100%',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    [`& .${LayoutClasses.appFrame}`]: {
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
    [`& .${LayoutClasses.contentWithSidebar}`]: {
        display: 'flex',
        flexGrow: 1,
    },
    [`& .${LayoutClasses.content}`]: {
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
}));
