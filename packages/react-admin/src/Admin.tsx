import * as React from 'react';
import { ComponentType } from 'react';
import { CoreAdminProps, localStorageStore } from 'ra-core';
import { AdminUI, AdminContext, RaThemeOptions } from 'ra-ui-materialui';

import { defaultI18nProvider } from './defaultI18nProvider';
const defaultStore = localStorageStore();

/**
 * Main admin component, entry point to the application.
 *
 * Initializes the various contexts (auth, data, i18n, router)
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
 *     Admin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'react-admin';
 *
 * const App = () => (
 *     <Admin dataProvider={myDataProvider}>
 *         <Resource name="posts" list={ListGuesser} />
 *     </Admin>
 * );
 *
 * // dynamic list of resources based on permissions
 *
 * import {
 *     Admin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'react-admin';
 *
 * const App = () => (
 *     <Admin dataProvider={myDataProvider}>
 *         {permissions => [
 *             <Resource name="posts" key="posts" list={ListGuesser} />,
 *         ]}
 *     </Admin>
 * );
 *
 * // If you have to build a dynamic list of resources using a side effect,
 * // you can't use <Admin>. But as it delegates to sub components,
 * // it's relatively straightforward to replace it:
 *
 * import * as React from 'react';
import { useEffect, useState } from 'react';
 * import {
 *     AdminContext,
 *     AdminUI,
 *     defaultI18nProvider,
 *     localStorageStore,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'react-admin';
 *
 * const store = localStorageStore();
 *
 * const App = () => (
 *     <AdminContext dataProvider={myDataProvider} i18nProvider={defaultI18nProvider} store={store}>
 *         <Resources />
 *     </AdminContext>
 * );
 *
 * const Resources = () => {
 *     const [resources, setResources] = useState([]);
 *     const dataProvider = useDataProvider();
 *     useEffect(() => {
 *         dataProvider.introspect().then(r => setResources(r));
 *     }, []);
 *
 *     return (
 *         <AdminUI>
 *             {resources.map(resource => (
 *                 <Resource name={resource.name} key={resource.key} list={ListGuesser} />
 *             ))}
 *         </AdminUI>
 *     );
 * };
 */
export const Admin = (props: AdminProps) => {
    const {
        authProvider,
        basename,
        catchAll,
        children,
        dashboard,
        dataProvider,
        disableTelemetry,
        history,
        i18nProvider = defaultI18nProvider,
        layout,
        loading,
        loginPage,
        authCallbackPage,
        menu, // deprecated, use a custom layout instead
        notification,
        queryClient,
        requireAuth,
        store = defaultStore,
        ready,
        theme,
        lightTheme,
        darkTheme,
        defaultTheme,
        title = 'React Admin',
    } = props;

    if (loginPage === true && process.env.NODE_ENV !== 'production') {
        console.warn(
            'You passed true to the loginPage prop. You must either pass false to disable it or a component class to customize it'
        );
    }

    return (
        <AdminContext
            authProvider={authProvider}
            basename={basename}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            store={store}
            history={history}
            queryClient={queryClient}
            theme={theme}
            lightTheme={lightTheme}
            darkTheme={darkTheme}
            defaultTheme={defaultTheme}
        >
            <AdminUI
                layout={layout}
                dashboard={dashboard}
                disableTelemetry={disableTelemetry}
                menu={menu}
                catchAll={catchAll}
                title={title}
                loading={loading}
                loginPage={loginPage}
                authCallbackPage={authCallbackPage}
                notification={notification}
                requireAuth={requireAuth}
                ready={ready}
            >
                {children}
            </AdminUI>
        </AdminContext>
    );
};

export default Admin;

export interface AdminProps extends CoreAdminProps {
    theme?: RaThemeOptions;
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
    defaultTheme?: 'light' | 'dark';
    notification?: ComponentType;
}
