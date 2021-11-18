import * as React from 'react';
import { ComponentType, useContext, useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider, ReactReduxContext } from 'react-redux';
import { createHashHistory, History } from 'history';
import { Router } from 'react-router';

import { AuthContext, convertLegacyAuthProvider } from '../auth';
import {
    DataProviderContext,
    convertLegacyDataProvider,
} from '../dataProvider';
import createAdminStore from './createAdminStore';
import TranslationProvider from '../i18n/TranslationProvider';
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

export type ChildrenFunction = () => ComponentType[];

export interface AdminContextProps {
    authProvider?: AuthProvider | LegacyAuthProvider;
    children?: AdminChildren;
    customReducers?: object;
    dashboard?: DashboardComponent;
    dataProvider: DataProvider | LegacyDataProvider;
    queryClient?: QueryClient;
    history?: History;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    theme?: object;
}

const defaultQueryClient = new QueryClient();

const CoreAdminContext = (props: AdminContextProps) => {
    const {
        authProvider,
        dataProvider,
        i18nProvider,
        children,
        history,
        customReducers,
        queryClient = defaultQueryClient,
        initialState,
    } = props;
    const needsNewRedux = !useContext(ReactReduxContext);

    if (!dataProvider) {
        throw new Error(`Missing dataProvider prop.
React-admin requires a valid dataProvider function to work.`);
    }

    const finalAuthProvider =
        authProvider instanceof Function
            ? convertLegacyAuthProvider(authProvider)
            : authProvider;

    const finalDataProvider =
        dataProvider instanceof Function
            ? convertLegacyDataProvider(dataProvider)
            : dataProvider;

    let historyRef = React.useRef<History>();
    if (historyRef.current == null) {
        historyRef.current = createHashHistory({ window });
    }

    let finalHistory = historyRef.current;
    let [historyState, setHistoryState] = React.useState({
        action: finalHistory.action,
        location: finalHistory.location,
    });

    React.useLayoutEffect(() => finalHistory.listen(setHistoryState), [
        finalHistory,
    ]);

    const renderCore = () => {
        return (
            <AuthContext.Provider value={finalAuthProvider}>
                <DataProviderContext.Provider value={finalDataProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TranslationProvider i18nProvider={i18nProvider}>
                            <Router
                                navigator={finalHistory}
                                location={historyState.location}
                                navigationType={historyState.action}
                            >
                                {children}
                            </Router>
                        </TranslationProvider>
                    </QueryClientProvider>
                </DataProviderContext.Provider>
            </AuthContext.Provider>
        );
    };

    const [store] = useState(() =>
        needsNewRedux
            ? createAdminStore({
                  customReducers,
                  initialState,
              })
            : undefined
    );

    if (needsNewRedux) {
        return <Provider store={store}>{renderCore()}</Provider>;
    } else {
        return renderCore();
    }
};

export default CoreAdminContext;
