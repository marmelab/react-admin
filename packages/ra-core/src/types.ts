import { ReactNode, ReactElement, ComponentType } from 'react';
import {
    RouteProps,
    RouteComponentProps,
    match as Match,
} from 'react-router-dom';
import { ThemeOptions } from '@material-ui/core';
import { StaticContext } from 'react-router';
import { Location, History, LocationState } from 'history';

import { WithPermissionsChildrenParams } from './auth/WithPermissions';
import { AuthActionType } from './auth/types';

/**
 * data types
 */

export type Identifier = string | number;
export interface Record {
    id: Identifier;
    [key: string]: any;
}

export interface RecordMap<RecordType extends Record = Record> {
    // Accept strings and numbers as identifiers
    [id: string]: RecordType;
    [id: number]: RecordType;
}

export interface SortPayload {
    field: string;
    order: string;
}
export interface FilterPayload {
    [k: string]: any;
}
export interface PaginationPayload {
    page: number;
    perPage: number;
}
export type ValidUntil = Date;
/**
 * i18nProvider types
 */

export const I18N_TRANSLATE = 'I18N_TRANSLATE';
export const I18N_CHANGE_LOCALE = 'I18N_CHANGE_LOCALE';

export type Translate = (key: string, options?: any) => string;

export type I18nProvider = {
    translate: Translate;
    changeLocale: (locale: string, options?: any) => Promise<void>;
    getLocale: () => string;
    [key: string]: any;
};

export interface UserIdentity {
    id: Identifier;
    fullName?: string;
    avatar?: string;
    [key: string]: any;
}

/**
 * authProvider types
 */
export type AuthProvider = {
    login: (params: any) => Promise<any>;
    logout: (params: any) => Promise<void | false | string>;
    checkAuth: (params: any) => Promise<void>;
    checkError: (error: any) => Promise<void>;
    getPermissions: (params: any) => Promise<any>;
    getIdentity?: () => Promise<UserIdentity>;
    [key: string]: any;
};

export type LegacyAuthProvider = (
    type: AuthActionType,
    params?: any
) => Promise<any>;

/**
 * dataProvider types
 */

export type DataProvider = {
    getList: <RecordType extends Record = Record>(
        resource: string,
        params: GetListParams
    ) => Promise<GetListResult<RecordType>>;

    getOne: <RecordType extends Record = Record>(
        resource: string,
        params: GetOneParams
    ) => Promise<GetOneResult<RecordType>>;

    getMany: <RecordType extends Record = Record>(
        resource: string,
        params: GetManyParams
    ) => Promise<GetManyResult<RecordType>>;

    getManyReference: <RecordType extends Record = Record>(
        resource: string,
        params: GetManyReferenceParams
    ) => Promise<GetManyReferenceResult<RecordType>>;

    update: <RecordType extends Record = Record>(
        resource: string,
        params: UpdateParams
    ) => Promise<UpdateResult<RecordType>>;

    updateMany: (
        resource: string,
        params: UpdateManyParams
    ) => Promise<UpdateManyResult>;

    create: <RecordType extends Record = Record>(
        resource: string,
        params: CreateParams
    ) => Promise<CreateResult<RecordType>>;

    delete: <RecordType extends Record = Record>(
        resource: string,
        params: DeleteParams
    ) => Promise<DeleteResult<RecordType>>;

    deleteMany: (
        resource: string,
        params: DeleteManyParams
    ) => Promise<DeleteManyResult>;

    [key: string]: any;
};

export interface GetListParams {
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: any;
}
export interface GetListResult<RecordType extends Record = Record> {
    data: RecordType[];
    total: number;
    validUntil?: ValidUntil;
}

export interface GetOneParams {
    id: Identifier;
}
export interface GetOneResult<RecordType extends Record = Record> {
    data: RecordType;
    validUntil?: ValidUntil;
}

export interface GetManyParams {
    ids: Identifier[];
}
export interface GetManyResult<RecordType extends Record = Record> {
    data: RecordType[];
    validUntil?: ValidUntil;
}

export interface GetManyReferenceParams {
    target: string;
    id: Identifier;
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: any;
}
export interface GetManyReferenceResult<RecordType extends Record = Record> {
    data: RecordType[];
    total: number;
    validUntil?: ValidUntil;
}

export interface UpdateParams<T = any> {
    id: Identifier;
    data: T;
    previousData: Record;
}
export interface UpdateResult<RecordType extends Record = Record> {
    data: RecordType;
    validUntil?: ValidUntil;
}

export interface UpdateManyParams<T = any> {
    ids: Identifier[];
    data: T;
}
export interface UpdateManyResult {
    data?: Identifier[];
    validUntil?: ValidUntil;
}

export interface CreateParams<T = any> {
    data: T;
}
export interface CreateResult<RecordType extends Record = Record> {
    data: RecordType;
    validUntil?: ValidUntil;
}

export interface DeleteParams {
    id: Identifier;
    previousData?: Record;
}
export interface DeleteResult<RecordType extends Record = Record> {
    data: RecordType;
}

export interface DeleteManyParams {
    ids: Identifier[];
}
export interface DeleteManyResult {
    data?: Identifier[];
}

export type DataProviderResult<RecordType extends Record = Record> =
    | CreateResult<RecordType>
    | DeleteResult<RecordType>
    | DeleteManyResult
    | GetListResult<RecordType>
    | GetManyResult<RecordType>
    | GetManyReferenceResult<RecordType>
    | GetOneResult<RecordType>
    | UpdateResult<RecordType>
    | UpdateManyResult;

// This generic function type extracts the parameters of the function passed as its DataProviderMethod generic parameter.
// It returns another function with the same parameters plus an optional options parameter used by the useDataProvider hook to specify side effects.
// The returned function has the same result type as the original
type DataProviderProxyMethod<
    TDataProviderMethod
> = TDataProviderMethod extends (...a: any[]) => infer Result
    ? (
          // This strange spread usage is required for two reasons
          // 1. It keeps the named parameters of the original function
          // 2. It allows to add an optional options parameter as the LAST parameter
          ...a: [
              ...Args: Parameters<TDataProviderMethod>,
              options?: UseDataProviderOptions
          ]
      ) => Result
    : never;

export type DataProviderProxy<
    TDataProvider extends DataProvider = DataProvider
> = {
    [MethodKey in keyof TDataProvider]: DataProviderProxyMethod<
        TDataProvider[MethodKey]
    >;
} & {
    getList: <RecordType extends Record = Record>(
        resource: string,
        params: GetListParams,
        options?: UseDataProviderOptions
    ) => Promise<GetListResult<RecordType>>;

    getOne: <RecordType extends Record = Record>(
        resource: string,
        params: GetOneParams,
        options?: UseDataProviderOptions
    ) => Promise<GetOneResult<RecordType>>;

    getMany: <RecordType extends Record = Record>(
        resource: string,
        params: GetManyParams,
        options?: UseDataProviderOptions
    ) => Promise<GetManyResult<RecordType>>;

    getManyReference: <RecordType extends Record = Record>(
        resource: string,
        params: GetManyReferenceParams,
        options?: UseDataProviderOptions
    ) => Promise<GetManyReferenceResult<RecordType>>;

    update: <RecordType extends Record = Record>(
        resource: string,
        params: UpdateParams,
        options?: UseDataProviderOptions
    ) => Promise<UpdateResult<RecordType>>;

    create: <RecordType extends Record = Record>(
        resource: string,
        params: CreateParams
    ) => Promise<CreateResult<RecordType>>;

    delete: <RecordType extends Record = Record>(
        resource: string,
        params: DeleteParams
    ) => Promise<DeleteResult<RecordType>>;
};

export type MutationMode = 'pessimistic' | 'optimistic' | 'undoable';
export type OnSuccess = (response?: any) => void;
export type OnFailure = (error?: any) => void;

export interface UseDataProviderOptions {
    action?: string;
    fetch?: string;
    meta?: object;
    // @deprecated use mode: 'undoable' instead
    undoable?: boolean;
    mutationMode?: MutationMode;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    enabled?: boolean;
}

export type LegacyDataProvider = (
    type: string,
    resource: string,
    params: any
) => Promise<any>;

export interface ResourceDefinition {
    readonly name: string;
    readonly options?: any;
    readonly hasList?: boolean;
    readonly hasEdit?: boolean;
    readonly hasShow?: boolean;
    readonly hasCreate?: boolean;
    readonly icon?: any;
}

/**
 * Redux state type
 */
export interface ReduxState {
    admin: {
        ui: {
            automaticRefreshEnabled: boolean;
            optimistic: boolean;
            sidebarOpen: boolean;
            viewVersion: number;
        };
        resources: {
            [name: string]: {
                props: ResourceDefinition;
                data: RecordMap;
                list: {
                    cachedRequests?: {
                        ids: Identifier[];
                        total: number;
                        validity: Date;
                    };
                    expanded: Identifier[];
                    ids: Identifier[];
                    loadedOnce: boolean;
                    params: any;
                    selectedIds: Identifier[];
                    total: number;
                };
                validity: {
                    [key: string]: Date;
                    [key: number]: Date;
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

    // leave space for custom reducers
    [key: string]: any;
}

export type InitialState = object | (() => object);

/**
 * Misc types
 */

export type Dispatch<T> = T extends (...args: infer A) => any
    ? (...args: A) => void
    : never;

export type ResourceElement = ReactElement<ResourceProps>;
export type RenderResourcesFunction = (
    permissions: any
) => ResourceElement[] | Promise<ResourceElement[]>;
export type AdminChildren = RenderResourcesFunction | ReactNode;

export interface CustomRoute extends RouteProps {
    noLayout?: boolean;
    [key: string]: any;
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

export interface CoreLayoutProps {
    children?: ReactNode;
    dashboard?: DashboardComponent;
    logout?: ReactNode;
    menu?: ComponentType<{
        logout?: ReactNode;
        hasDashboard?: boolean;
    }>;
    theme?: ThemeOptions;
    title?: TitleComponent;
}

export type LayoutComponent = ComponentType<CoreLayoutProps>;
export type LoadingComponent = ComponentType<{
    theme?: ThemeOptions;
    loadingPrimary?: string;
    loadingSecondary?: string;
}>;

export interface ResourceComponentInjectedProps {
    basePath?: string;
    permissions?: any;
    resource?: string;
    options?: any;
    hasList?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasCreate?: boolean;
}

export interface ResourceComponentProps<
    Params extends { [K in keyof Params]?: string } = {},
    C extends StaticContext = StaticContext,
    S = LocationState
> extends Partial<RouteComponentProps<Params, C, S>>,
        ResourceComponentInjectedProps {}

// deprecated name, use ResourceComponentProps instead
export type ReactAdminComponentProps = ResourceComponentProps;

export interface ResourceComponentPropsWithId<
    Params extends { id?: string } = {},
    C extends StaticContext = StaticContext,
    S = LocationState
> extends Partial<RouteComponentProps<Params, C, S>>,
        ResourceComponentInjectedProps {
    id?: string;
}

// deprecated name, use ResourceComponentPropsWithId instead
export type ReactAdminComponentPropsWithId = ResourceComponentPropsWithId;

export type ResourceMatch = Match<{
    id?: string;
}>;

export interface ResourceProps {
    intent?: 'route' | 'registration';
    match?: ResourceMatch;
    name: string;
    list?: ComponentType<ResourceComponentProps>;
    create?: ComponentType<ResourceComponentProps>;
    edit?: ComponentType<ResourceComponentPropsWithId>;
    show?: ComponentType<ResourceComponentPropsWithId>;
    icon?: ComponentType<any>;
    options?: object;
}

export interface AdminProps {
    appLayout?: LayoutComponent;
    authProvider?: AuthProvider | LegacyAuthProvider;
    catchAll?: CatchAllComponent;
    children?: AdminChildren;
    customReducers?: object;
    customRoutes?: CustomRoutes;
    customSagas?: any[];
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
    ready?: ComponentType;
    theme?: ThemeOptions;
    title?: TitleComponent;
}

export type Exporter = (
    data: any,
    fetchRelatedRecords: (
        data: any,
        field: string,
        resource: string
    ) => Promise<any>,
    dataProvider: DataProviderProxy,
    resource?: string
) => void | Promise<void>;

export type SetOnSave = (
    onSave?: (values: object, redirect: any) => void
) => void;

export type FormContextValue = {
    setOnSave?: SetOnSave;
    registerGroup: (name: string) => void;
    unregisterGroup: (name: string) => void;
    registerField: (source: string, group?: string) => void;
    unregisterField: (source: string, group?: string) => void;
    getGroupFields: (name: string) => string[];
};

export type FormFunctions = {
    setOnSave?: SetOnSave;
};
