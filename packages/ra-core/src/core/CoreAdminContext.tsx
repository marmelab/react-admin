import * as React from 'react';
import { useContext, useMemo, useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider, ReactReduxContext } from 'react-redux';
import { History } from 'history';

import { AdminRouter } from '../routing';
import { AuthContext, convertLegacyAuthProvider } from '../auth';
import {
    DataProviderContext,
    convertLegacyDataProvider,
    defaultDataProvider,
} from '../dataProvider';
import { StoreContextProvider, Store, memoryStore } from '../store';
import createAdminStore from './createAdminStore';
import { I18nContextProvider } from '../i18n';
import { ResourceDefinitionContextProvider } from './ResourceDefinitionContext';
import { NotificationContextProvider } from '../notification';
import {
    AuthProvider,
    LegacyAuthProvider,
    I18nProvider,
    DataProvider,
    AdminChildren,
    DashboardComponent,
    LegacyDataProvider,
    InitialState,
} from '../types';

export interface CoreAdminContextProps {
    authProvider?: AuthProvider | LegacyAuthProvider;
    basename?: string;
    children?: AdminChildren;
    customReducers?: object;
    dashboard?: DashboardComponent;
    dataProvider?: DataProvider | LegacyDataProvider;
    store?: Store;
    queryClient?: QueryClient;
    /**
     * @deprecated Wrap your Admin inside a Router to change the routing strategy
     */
    history?: History;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    theme?: object;
}

export const CoreAdminContext = (props: CoreAdminContextProps) => {
    const {
        authProvider,
        basename,
        dataProvider,
        i18nProvider,
        store,
        children,
        history,
        customReducers,
        queryClient,
        initialState,
    } = props;
    const needsNewRedux = !useContext(ReactReduxContext);

    if (!dataProvider) {
        throw new Error(`Missing dataProvider prop.
React-admin requires a valid dataProvider function to work.`);
    }

    const finalQueryClient = useMemo(() => queryClient || new QueryClient(), [
        queryClient,
    ]);

    const finalAuthProvider = useMemo(
        () =>
            authProvider instanceof Function
                ? convertLegacyAuthProvider(authProvider)
                : authProvider,
        [authProvider]
    );

    const finalDataProvider = useMemo(
        () =>
            dataProvider instanceof Function
                ? convertLegacyDataProvider(dataProvider)
                : dataProvider,
        [dataProvider]
    );

    const renderCore = () => (
        <AuthContext.Provider value={finalAuthProvider}>
            <DataProviderContext.Provider value={finalDataProvider}>
                <StoreContextProvider value={store}>
                    <QueryClientProvider client={finalQueryClient}>
                        <AdminRouter history={history} basename={basename}>
                            <I18nContextProvider value={i18nProvider}>
                                <NotificationContextProvider>
                                    <ResourceDefinitionContextProvider>
                                        {children}
                                    </ResourceDefinitionContextProvider>
                                </NotificationContextProvider>
                            </I18nContextProvider>
                        </AdminRouter>
                    </QueryClientProvider>
                </StoreContextProvider>
            </DataProviderContext.Provider>
        </AuthContext.Provider>
    );

    const [reduxStore] = useState(() =>
        needsNewRedux
            ? createAdminStore({
                  customReducers,
                  initialState,
              })
            : undefined
    );

    if (needsNewRedux) {
        return <Provider store={reduxStore}>{renderCore()}</Provider>;
    } else {
        return renderCore();
    }
};

CoreAdminContext.defaultProps = {
    dataProvider: defaultDataProvider,
    store: memoryStore(),
};
