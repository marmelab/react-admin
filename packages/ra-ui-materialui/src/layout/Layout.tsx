import React, {
    type ComponentType,
    type ErrorInfo,
    Suspense,
    useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import clsx from 'clsx';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';

import { AppBar as DefaultAppBar, type AppBarProps } from './AppBar';
import { Sidebar as DefaultSidebar, type SidebarProps } from './Sidebar';
import { Menu as DefaultMenu, type MenuProps } from './Menu';
import { Error, type ErrorProps } from './Error';
import { SkipNavigationButton } from '../button';
import { Inspector } from '../preferences';
import { Loading } from './Loading';

export const Layout = (inProps: LayoutProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        appBar: AppBar = DefaultAppBar,
        appBarAlwaysOn,
        children,
        className,
        error: errorComponent,
        menu: Menu = DefaultMenu,
        sidebar: Sidebar = DefaultSidebar,
        ...rest
    } = props;

    const [errorInfo, setErrorInfo] = useState<ErrorInfo | undefined>(
        undefined
    );

    const handleError = (error: Error, info: ErrorInfo) => {
        setErrorInfo(info);
    };

    return (
        <Core className={clsx('layout', className)} {...rest}>
            <SkipNavigationButton />
            <div className={LayoutClasses.appFrame}>
                <AppBar alwaysOn={appBarAlwaysOn} />
                <main className={LayoutClasses.contentWithSidebar}>
                    <Sidebar appBarAlwaysOn={appBarAlwaysOn}>
                        <Menu />
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
                                />
                            )}
                        >
                            <Suspense fallback={<Loading />}>
                                {children}
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </main>
                <Inspector />
            </div>
        </Core>
    );
};

export interface LayoutProps {
    appBar?: ComponentType<AppBarProps>;
    appBarAlwaysOn?: boolean;
    className?: string;
    children: React.ReactNode;
    error?: ComponentType<ErrorProps>;
    menu?: ComponentType<MenuProps>;
    sidebar?: ComponentType<SidebarProps>;
    sx?: SxProps<Theme>;
}

export interface LayoutState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

const PREFIX = 'RaLayout';
export const LayoutClasses = {
    appFrame: `${PREFIX}-appFrame`,
    contentWithSidebar: `${PREFIX}-contentWithSidebar`,
    content: `${PREFIX}-content`,
};

const Core = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    minHeight: '100vh',
    backgroundColor: (theme.vars || theme).palette.background.default,
    position: 'relative',
    minWidth: 'fit-content',
    width: '100%',

    [`& .${LayoutClasses.appFrame}`]: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        marginTop: theme.spacing(6),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7),
        },
    },
    [`& .${LayoutClasses.contentWithSidebar}`]: {
        display: 'flex',
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    [`& .${LayoutClasses.content}`]: {
        backgroundColor: (theme.vars || theme).palette.background.default,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        flexBasis: 0,
        padding: 0,
        [theme.breakpoints.up('xs')]: {
            paddingRight: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        },
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaLayout: 'root' | 'appFrame' | 'contentWithSidebar' | 'content';
    }

    interface ComponentsPropsList {
        RaLayout: Partial<LayoutProps>;
    }

    interface Components {
        RaLayout?: {
            defaultProps?: ComponentsPropsList['RaLayout'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaLayout'];
        };
    }
}
