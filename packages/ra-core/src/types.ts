import { ReactNode, ReactElement, ComponentType } from 'react';
import { RouteProps, RouteComponentProps, match as Match } from 'react-router';

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

export type I18nProvider = (locale: string) => object | Promise<object>;
export type Translate = (id: string, options?: any) => string;

export type AuthActionType =
    | 'AUTH_LOGIN'
    | 'AUTH_LOGOUT'
    | 'AUTH_ERROR'
    | 'AUTH_CHECK'
    | 'AUTH_GET_PERMISSIONS';

export type AuthProvider = (type: AuthActionType, params?: any) => Promise<any>;

export type DataProvider = (
    type: string,
    resource: string,
    params: any
) => Promise<any>;

export interface ReduxState {
    admin: {
        ui: {
            optimistic: boolean;
        };
        resources: {
            [name: string]: {
                data: any;
            };
        };
        references: {
            oneToMany: {
                [relatedTo: string]: { ids: Identifier[]; total: number };
            };
        };
        loading: number;
    };
    i18n: {
        locale: string;
        messages: object;
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

interface ReactAdminComponentProps {
    basePath: string;
}
interface ReactAdminComponentPropsWithId {
    id: Identifier;
    basePath: string;
}

export type ResourceMatch = Match<{
    id?: string;
}>;

export interface ResourceProps {
    context: 'route' | 'registration';
    match?: ResourceMatch;
    name: string;
    list?: ComponentType<ReactAdminComponentProps>;
    create?: ComponentType<ReactAdminComponentProps>;
    edit?: ComponentType<ReactAdminComponentPropsWithId>;
    show?: ComponentType<ReactAdminComponentPropsWithId>;
    icon?: ComponentType<any>;
    options: object;
}
