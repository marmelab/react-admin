import { ReactNode, ReactElement, ComponentType } from 'react';
import { RouteProps, RouteComponentProps, match as Match } from 'react-router';
import { Location } from 'history';

import { WithPermissionsChildrenParams } from './auth/WithPermissions';

export type Identifier = string | number;
export interface Record {
    id: Identifier;
    [key: string]: any;
}

export interface RecordMap {
    // Accept strings and numbers as identifiers
    [id: string]: Record;
    [id: number]: Record;
}

export interface Sort {
    field: string;
    order: string;
}
export interface Pagination {
    page: number;
    perPage: number;
}

export const I18N_TRANSLATE = 'I18N_TRANSLATE';
export const I18N_CHANGE_LOCALE = 'I18N_CHANGE_LOCALE';

export type Translate = (key: string, options?: any) => string;

export type I18nProvider = {
    translate: Translate;
    changeLocale: (locale: string, options?: any) => Promise<void>;
    [key: string]: any;
};

export type AuthActionType =
    | 'AUTH_LOGIN'
    | 'AUTH_LOGOUT'
    | 'AUTH_ERROR'
    | 'AUTH_CHECK'
    | 'AUTH_GET_PERMISSIONS';

export type AuthProvider = {
    login: (params: any) => Promise<any>;
    logout: (params: any) => Promise<void | string>;
    checkAuth: (params: any) => Promise<void>;
    checkError: (error: any) => Promise<void>;
    getPermissions: (params: any) => Promise<any>;
    [key: string]: any;
};

export type LegacyAuthProvider = (
    type: AuthActionType,
    params?: any
) => Promise<any>;

export type DataProvider = (
    type: string,
    resource: string,
    params: any
) => Promise<any>;

export interface ReduxState {
    admin: {
        ui: {
            optimistic: boolean;
            viewVersion: number;
        };
        resources: {
            [name: string]: {
                data: any;
                list: {
                    params: any;
                    ids: Identifier[];
                    loadedOnce: boolean;
                    selectedIds: Identifier[];
                    total: number;
                };
            };
        };
        references: {
            oneToMany: {
                [relatedTo: string]: { ids: Identifier[]; total: number };
            };
        };
        loading: number;
        customQueries: {
            [key: string]: any;
        };
    };
    router: {
        location: Location;
    };
}

export type Dispatch<T> = T extends (...args: infer A) => any
    ? (...args: A) => void
    : never;

export type ResourceElement = ReactElement<ResourceProps>;
export type RenderResourcesFunction = (
    permissions: any
) => ResourceElement[] | Promise<ResourceElement[]>;
export type AdminChildren = RenderResourcesFunction | ReactNode;

export interface CustomRoute extends RouteProps {
    noLayout: boolean;
}

export type CustomRoutes = Array<ReactElement<CustomRoute>>;

export type TitleComponent = string | ReactElement<any>;
export type CatchAllComponent = ComponentType<{ title?: TitleComponent }>;

interface LoginComponentProps extends RouteComponentProps {
    title?: TitleComponent;
    theme?: object;
}
export type LoginComponent = ComponentType<LoginComponentProps>;
export type DashboardComponent = ComponentType<WithPermissionsChildrenParams>;

export interface LayoutProps {
    dashboard?: DashboardComponent;
    logout: ReactNode;
    menu: ComponentType;
    theme: object;
    title?: TitleComponent;
}

export type LayoutComponent = ComponentType<LayoutProps>;

export interface ReactAdminComponentProps {
    basePath: string;
    permissions?: any;
}
export interface ReactAdminComponentPropsWithId {
    basePath: string;
    permissions?: any;
    id: Identifier;
}

export type ResourceMatch = Match<{
    id?: string;
}>;

export interface ResourceProps {
    intent?: 'route' | 'registration';
    match?: ResourceMatch;
    name: string;
    list?: ComponentType<ReactAdminComponentProps>;
    create?: ComponentType<ReactAdminComponentProps>;
    edit?: ComponentType<ReactAdminComponentPropsWithId>;
    show?: ComponentType<ReactAdminComponentPropsWithId>;
    icon?: ComponentType<any>;
    options?: object;
}
