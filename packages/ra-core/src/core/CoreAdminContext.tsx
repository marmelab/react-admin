import * as React from 'react';
import { useMemo } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { History } from 'history';

import { AdminRouter } from '../routing';
import { AuthContext, convertLegacyAuthProvider } from '../auth';
import {
    DataProviderContext,
    convertLegacyDataProvider,
    defaultDataProvider,
} from '../dataProvider';
import { StoreContextProvider, Store, memoryStore } from '../store';
import { PreferencesEditorContextProvider } from '../preferences/PreferencesEditorContextProvider';
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
} from '../types';

const defaultStore = memoryStore();

export interface CoreAdminContextProps {
    authProvider?: AuthProvider | LegacyAuthProvider;
    basename?: string;
    children?: AdminChildren;
    dashboard?: DashboardComponent;
    dataProvider?: DataProvider | LegacyDataProvider;
    store?: Store;
    queryClient?: QueryClient;
    /**
     * @deprecated Wrap your Admin inside a Router to change the routing strategy
     */
    history?: History;
    i18nProvider?: I18nProvider;
    theme?: object;
}

export const CoreAdminContext = (props: CoreAdminContextProps) => {
    const {
        authProvider,
        basename,
        dataProvider = defaultDataProvider,
        i18nProvider,
        store = defaultStore,
        children,
        history,
        queryClient,
    } = props;

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

    return (
        <AuthContext.Provider value={finalAuthProvider}>
            <DataProviderContext.Provider value={finalDataProvider}>
                <StoreContextProvider value={store}>
                    <PreferencesEditorContextProvider>
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
                    </PreferencesEditorContextProvider>
                </StoreContextProvider>
            </DataProviderContext.Provider>
        </AuthContext.Provider>
    );
};
