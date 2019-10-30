import React, { FunctionComponent, ComponentType } from 'react';
import { History } from 'history';

import { InitialState } from './createAdminStore';
import CoreAdminContext from './CoreAdminContext';
import CoreUI from './CoreUI';
import {
    AuthProvider,
    LegacyAuthProvider,
    I18nProvider,
    DataProvider,
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    AdminChildren,
    CatchAllComponent,
    CustomRoutes,
    DashboardComponent,
    LegacyDataProvider,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

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
 * import React, { useEffect, useState } from 'react';
 * import {
 *     CoreAdminContext,
 *     CoreUI,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'react-admin';
 *
 * const App = () => (
 *     <CoreAdminContext dataProvider={myDataProvider}>
 *         <Resources />
 *     </CoreAdminContext>
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
 *         <CoreUI>
 *             {resources.map(resource => (
 *                 <Resource name={resource.name} key={resource.key} list={ListGuesser} />
 *             ))}
 *         </CoreUI>
 *     );
 * };
 */
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
    history,
    customReducers,
    customSagas,
    initialState,
    locale,
}) => {
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
    if (locale) {
        console.warn(
            'You are using deprecated prop "locale". You must now pass the initial locale to your i18nProvider'
        );
    }

    return (
        <CoreAdminContext
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            history={history}
            customReducers={customReducers}
            customSagas={customSagas}
            initialState={initialState}
        >
            <CoreUI
                layout={appLayout || layout}
                customRoutes={customRoutes}
                dashboard={dashboard}
                menu={menu}
                catchAll={catchAll}
                theme={theme}
                title={title}
                loading={loading}
                loginPage={loginPage}
                logout={authProvider ? logoutButton : undefined}
            >
                {children}
            </CoreUI>
        </CoreAdminContext>
    );
};

export default CoreAdmin;
