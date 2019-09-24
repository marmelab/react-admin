import React, {
    createElement,
    FunctionComponent,
    ComponentType,
    useContext,
} from 'react';
import { Provider, ReactReduxContext } from 'react-redux';
import { History } from 'history';
import { createHashHistory } from 'history';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { AuthContext, convertLegacyAuthProvider } from './auth';
import { DataProviderContext, convertLegacyDataProvider } from './dataProvider';
import createAdminStore, { InitialState } from './createAdminStore';
import TranslationProvider from './i18n/TranslationProvider';
import CoreAdminRouter from './CoreAdminRouter';
import {
    AuthProvider,
    LegacyAuthProvider,
    I18nProvider,
    DataProvider,
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    LayoutProps,
    AdminChildren,
    CatchAllComponent,
    CustomRoutes,
    DashboardComponent,
    LegacyDataProvider,
} from './types';

export type ChildrenFunction = () => ComponentType[];

const DefaultLayout: FunctionComponent<LayoutProps> = ({ children }) => (
    <>{children}</>
);

export interface AdminProps {
    layout: LayoutComponent;
    appLayout?: LayoutComponent;
    authProvider?: AuthProvider | LegacyAuthProvider;
    children?: AdminChildren;
    catchAll: CatchAllComponent;
    customSagas?: any[];
    customReducers?: object;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    dataProvider: DataProvider | LegacyDataProvider;
    history: History;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    loading: ComponentType;
    locale?: string;
    loginPage: LoginComponent | boolean;
    logoutButton?: ComponentType;
    menu?: ComponentType;
    theme?: object;
    title?: TitleComponent;
}

const CoreAdmin: FunctionComponent<AdminProps> = ({
    layout,
    appLayout,
    authProvider,
    dataProvider,
    i18nProvider,
    children,
    customRoutes = [],
    dashboard,
    menu, // deprecated, use a custom layout instead
    catchAll,
    theme,
    title = 'React Admin',
    loading,
    loginPage,
    logoutButton,
    history: customHistory,
    customReducers,
    customSagas,
    initialState,
    locale,
}) => {
    const reduxIsAlreadyInitialized = !!useContext(ReactReduxContext);

    const finalDataProvider =
        dataProvider instanceof Function
            ? convertLegacyDataProvider(dataProvider)
            : dataProvider;

    const renderCore = history => {
        const logout = authProvider ? createElement(logoutButton) : null;

        if (appLayout) {
            console.warn(
                'You are using deprecated prop "appLayout", it was replaced by "layout", see https://github.com/marmelab/react-admin/issues/2918'
            );
        }
        if (loginPage === true && process.env.NODE_ENV !== 'production') {
            console.warn(
                'You passed true to the loginPage prop. You must either pass false to disable it or a component class to customize it'
            );
        }

        return (
            <DataProviderContext.Provider value={finalDataProvider}>
                <TranslationProvider
                    locale={locale}
                    i18nProvider={i18nProvider}
                >
                    <ConnectedRouter history={history}>
                        <Switch>
                            {loginPage !== false && loginPage !== true ? (
                                <Route
                                    exact
                                    path="/login"
                                    render={props =>
                                        createElement(loginPage, {
                                            ...props,
                                            title,
                                            theme,
                                        })
                                    }
                                />
                            ) : null}
                            <Route
                                path="/"
                                render={props => (
                                    <CoreAdminRouter
                                        layout={appLayout || layout}
                                        catchAll={catchAll}
                                        customRoutes={customRoutes}
                                        dashboard={dashboard}
                                        loading={loading}
                                        logout={logout}
                                        menu={menu}
                                        theme={theme}
                                        title={title}
                                        {...props}
                                    >
                                        {children}
                                    </CoreAdminRouter>
                                )}
                            />
                        </Switch>
                    </ConnectedRouter>
                </TranslationProvider>
            </DataProviderContext.Provider>
        );
    };

    let finalHistory = customHistory;
    const finalAuthProvider =
        authProvider instanceof Function
            ? convertLegacyAuthProvider(authProvider)
            : authProvider;

    if (reduxIsAlreadyInitialized) {
        if (!customHistory) {
            throw new Error(`Missing history prop.
When integrating react-admin inside an existing redux Provider, you must provide the same 'history' prop to the <Admin> as the one used to bootstrap your routerMiddleware.
React-admin uses this history for its own ConnectedRouter.`);
        }

        return (
            <AuthContext.Provider value={finalAuthProvider}>
                {renderCore(customHistory)}
            </AuthContext.Provider>
        );
    } else {
        if (!dataProvider) {
            throw new Error(`Missing dataProvider prop.
React-admin requires a valid dataProvider function to work.`);
        }

        finalHistory = customHistory || createHashHistory();

        return (
            <AuthContext.Provider value={finalAuthProvider}>
                <Provider
                    store={createAdminStore({
                        authProvider: finalAuthProvider,
                        customReducers,
                        customSagas,
                        dataProvider: finalDataProvider,
                        initialState,
                        history: finalHistory,
                    })}
                >
                    {renderCore(finalHistory)}
                </Provider>
            </AuthContext.Provider>
        );
    }
};

CoreAdmin.defaultProps = {
    catchAll: () => null,
    layout: DefaultLayout,
    appLayout: undefined,
    loading: () => null,
    loginPage: false,
};

export default CoreAdmin;
