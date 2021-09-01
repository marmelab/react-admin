import * as React from 'react';
import { ComponentType, useContext, useState } from 'react';
import { Provider, ReactReduxContext } from 'react-redux';
import { History } from 'history';
import { createHashHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';

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
    CustomRoutes,
    DashboardComponent,
    LegacyDataProvider,
    InitialState,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

export interface AdminContextProps {
    authProvider?: AuthProvider | LegacyAuthProvider;
    children?: AdminChildren;
    customSagas?: any[];
    customReducers?: object;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    dataProvider: DataProvider | LegacyDataProvider;
    history?: History;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    theme?: object;
}

const CoreAdminContext = (props: AdminContextProps) => {
    const {
        authProvider,
        dataProvider,
        i18nProvider,
        children,
        history,
        customReducers,
        customSagas,
        initialState,
    } = props;
    const reduxIsAlreadyInitialized = !!useContext(ReactReduxContext);

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

    const finalHistory = history || createHashHistory();

    const renderCore = () => {
        return (
            <AuthContext.Provider value={finalAuthProvider}>
                <DataProviderContext.Provider value={finalDataProvider}>
                    <TranslationProvider i18nProvider={i18nProvider}>
                        {typeof window !== 'undefined' ? (
                            <ConnectedRouter history={finalHistory}>
                                {children}
                            </ConnectedRouter>
                        ) : (
                            children
                        )}
                    </TranslationProvider>
                </DataProviderContext.Provider>
            </AuthContext.Provider>
        );
    };

    const [store] = useState(() =>
        !reduxIsAlreadyInitialized
            ? createAdminStore({
                  authProvider: finalAuthProvider,
                  customReducers,
                  customSagas,
                  dataProvider: finalDataProvider,
                  initialState,
                  history: finalHistory,
              })
            : undefined
    );

    if (reduxIsAlreadyInitialized) {
        if (!history) {
            throw new Error(`Missing history prop.
When integrating react-admin inside an existing redux Provider, you must provide the same 'history' prop to the <Admin> as the one used to bootstrap your routerMiddleware.
React-admin uses this history for its own ConnectedRouter.`);
        }
        return renderCore();
    } else {
        return <Provider store={store}>{renderCore()}</Provider>;
    }
};

export default CoreAdminContext;
