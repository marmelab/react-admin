import * as React from 'react';

import { CoreAdminContext, CoreAdminContextProps } from './CoreAdminContext';
import { CoreAdminUI, CoreAdminUIProps } from './CoreAdminUI';

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
 *     CoreAdmin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'ra-core';
 *
 * const App = () => (
 *     <CoreAdmin dataProvider={myDataProvider}>
 *         <Resource name="posts" list={ListGuesser} />
 *     </CoreAdmin>
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
        authProvider,
        basename,
        catchAll,
        children,
        dashboard,
        dataProvider,
        disableTelemetry,
        history,
        i18nProvider,
        queryClient,
        layout,
        loading,
        loginPage,
        menu, // deprecated, use a custom layout instead
        ready,
        requireAuth,
        store,
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
            store={store}
        >
            <CoreAdminUI
                layout={layout}
                dashboard={dashboard}
                disableTelemetry={disableTelemetry}
                menu={menu}
                catchAll={catchAll}
                title={title}
                loading={loading}
                loginPage={loginPage}
                requireAuth={requireAuth}
                ready={ready}
            >
                {children}
            </CoreAdminUI>
        </CoreAdminContext>
    );
};

export type CoreAdminProps = CoreAdminContextProps & CoreAdminUIProps;
