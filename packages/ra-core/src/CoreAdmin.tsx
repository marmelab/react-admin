import React, { FunctionComponent, ComponentType } from 'react';
import { History } from 'history';

import { InitialState } from './createAdminStore';
import CoreAdminContext from './CoreAdminContext';
import CoreSwitch from './CoreSwitch';
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
} from './types';

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
            <CoreSwitch
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
            </CoreSwitch>
        </CoreAdminContext>
    );
};

export default CoreAdmin;
