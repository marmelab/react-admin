import React, {
    useState,
    ErrorInfo,
    ReactNode,
    ComponentType,
    HtmlHTMLAttributes,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { styled } from '@mui/material/styles';
import { CoreLayoutProps, ReduxState } from 'ra-core';

import { AppBar as DefaultAppBar, AppBarProps } from './AppBar';
import { Sidebar as DefaultSidebar } from './Sidebar';
import { Menu as DefaultMenu, MenuProps } from './Menu';
import { Error, ErrorProps } from './Error';
import { SkipNavigationButton } from '../button';

export const Layout = (props: LayoutProps) => {
    const {
        appBar: AppBar = DefaultAppBar,
        children,
        className,
        dashboard,
        error: errorComponent,
        logout,
        menu: Menu = DefaultMenu,
        sidebar: Sidebar = DefaultSidebar,
        title,
        ...rest
    } = props;

    const [errorInfo, setErrorInfo] = useState<ErrorInfo>(null);
    const open = useSelector<ReduxState, boolean>(
        state => state.admin.ui.sidebarOpen
    );

    const handleError = (error: Error, info: ErrorInfo) => {
        setErrorInfo(info);
    };

    return (
        <StyledLayout
            className={classnames('layout', LayoutClasses.root, className)}
            {...rest}
        >
            <SkipNavigationButton />
            <div className={LayoutClasses.appFrame}>
                <AppBar logout={logout} open={open} title={title} />
                <main className={LayoutClasses.contentWithSidebar}>
                    <Sidebar>
                        <Menu hasDashboard={!!dashboard} />
                    </Sidebar>
                    <div id="main-content" className={LayoutClasses.content}>
                        <ErrorBoundary
                            onError={handleError}
                            fallbackRender={({ error, resetErrorBoundary }) => (
                                <Error
                                    error={error}
                                    errorComponent={errorComponent}
                                    errorInfo={errorInfo}
                                    resetErrorBoundary={resetErrorBoundary}
                                    title={title}
                                />
                            )}
                        >
                            {children}
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
        </StyledLayout>
    );
};

export interface LayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    appBar?: ComponentType<AppBarProps>;
    classes?: any;
    className?: string;
    error?: ComponentType<ErrorProps>;
    menu?: ComponentType<MenuProps>;
    sidebar?: ComponentType<{ children: ReactNode }>;
}

export interface LayoutState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

const PREFIX = 'RaLayout';
export const LayoutClasses = {
    root: `${PREFIX}-root`,
    appFrame: `${PREFIX}-appFrame`,
    contentWithSidebar: `${PREFIX}-contentWithSidebar`,
    content: `${PREFIX}-content`,
};

const StyledLayout = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => [
        styles.root,
        { [`& .${LayoutClasses.appFrame}`]: styles.appFrame },
        {
            [`& .${LayoutClasses.contentWithSidebar}`]: styles.contentWithSidebar,
        },
        { [`& .${LayoutClasses.content}`]: styles.content },
    ],
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    position: 'relative',
    minWidth: 'fit-content',
    width: '100%',
    color: theme.palette.getContrastText(theme.palette.background.default),

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
        backgroundColor: theme.palette.background.default,
        zIndex: 2,
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
