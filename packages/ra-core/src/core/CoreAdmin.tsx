import * as React from 'react';
import { ComponentType } from 'react';
import { QueryClient } from 'react-query';
import { History } from 'history';

import CoreAdminContext from './CoreAdminContext';
import { CoreAdminUI } from './CoreAdminUI';
import {
    AuthProvider,
    LegacyAuthProvider,
    CatchAllComponent,
    AdminChildren,
    DashboardComponent,
    DataProvider,
    LegacyDataProvider,
    I18nProvider,
    InitialState,
    LayoutComponent,
    LoginComponent,
    TitleComponent,
} from '../types';

/**
 * Main admin component, entry point to the application.
 *
 * Initializes the various contexts (auth, data, i18n, redux, router)
 * and defines the main routes.
 *
 * Expects a list of resources as children, or a function returning a list of
 * resources based on the permissions.
 *
 * @example
 *
 * // static list of resources
 *
 * import {
 *     CoreAdmin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'ra-core';
 *
 * const App = () => (
 *     <Core dataProvider={myDataProvider}>
 *         <Resource name="posts" list={ListGuesser} />
 *     </Core>
 * );
 *
 * // dynamic list of resources based on permissions
 *
 * import {
 *     CoreAdmin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'ra-core';
 *
 * const App = () => (
 *     <CoreAdmin dataProvider={myDataProvider}>
 *         {permissions => [
 *             <Resource name="posts" key="posts" list={ListGuesser} />,
 *         ]}
 *     </CoreAdmin>
 * );
 *
 * // If you have to build a dynamic list of resources using a side effect,
 * // you can't use <CoreAdmin>. But as it delegates to sub components,
 * // it's relatively straightforward to replace it:
 *
 * import * as React from 'react';
 * import { useEffect, useState } from 'react';
 * import {
 *     CoreAdminContext,
 *     CoreAdminUI,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'ra-core';
 *
 * const App = () => (
 *     <CoreAdminContext dataProvider={myDataProvider}>
 *         <UI />
 *     </CoreAdminContext>
 * );
 *
 * const UI = () => {
 *     const [resources, setResources] = useState([]);
 *     const dataProvider = useDataProvider();
 *     useEffect(() => {
 *         dataProvider.introspect().then(r => setResources(r));
 *     }, []);
 *
 *     return (
 *         <CoreAdminUI>
 *             {resources.map(resource => (
 *                 <Resource name={resource.name} key={resource.key} list={ListGuesser} />
 *             ))}
 *         </CoreAdminUI>
 *     );
 * };
 */
export const CoreAdmin = (props: CoreAdminProps) => {
    const {
        appLayout,
        authProvider,
        basename,
        catchAll,
        children,
        customReducers,
        dashboard,
        dataProvider,
        disableTelemetry,
        history,
        i18nProvider,
        initialState,
        queryClient,
        layout,
        loading,
        loginPage,
        logoutButton,
        menu, // deprecated, use a custom layout instead
        title = 'React Admin',
    } = props;
    return (
        <CoreAdminContext
            authProvider={authProvider}
            basename={basename}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            queryClient={queryClient}
            history={history}
            customReducers={customReducers}
            initialState={initialState}
        >
            <CoreAdminUI
                layout={appLayout || layout}
                dashboard={dashboard}
                disableTelemetry={disableTelemetry}
                menu={menu}
                catchAll={catchAll}
                title={title}
                loading={loading}
                loginPage={loginPage}
                logout={authProvider ? logoutButton : undefined}
            >
                {children}
            </CoreAdminUI>
        </CoreAdminContext>
    );
};

export interface CoreAdminProps {
    appLayout?: LayoutComponent;
    authProvider?: AuthProvider | LegacyAuthProvider;
    basename?: string;
    catchAll?: CatchAllComponent;
    children?: AdminChildren;
    customReducers?: object;
    dashboard?: DashboardComponent;
    dataProvider: DataProvider | LegacyDataProvider;
    disableTelemetry?: boolean;
    history?: History;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    layout?: LayoutComponent;
    loading?: ComponentType;
    locale?: string;
    loginPage?: LoginComponent | boolean;
    logoutButton?: ComponentType;
    menu?: ComponentType;
    queryClient?: QueryClient;
    ready?: ComponentType;
    title?: TitleComponent;
}
