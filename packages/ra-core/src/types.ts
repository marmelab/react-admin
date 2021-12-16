import { ReactNode, ReactElement, ComponentType } from 'react';
import { DeprecatedThemeOptions } from '@mui/material';
import { Location, History } from 'history';
import { QueryClient } from 'react-query';

import { WithPermissionsChildrenParams } from './auth/WithPermissions';
import { AuthActionType } from './auth/types';
import {
    CreateControllerProps,
    EditControllerProps,
    ListControllerProps,
    ShowControllerProps,
} from './controller';

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

    updateMany: <RecordType extends Record = Record>(
        resource: string,
        params: UpdateManyParams
    ) => Promise<UpdateManyResult<RecordType>>;

    create: <RecordType extends Record = Record>(
        resource: string,
        params: CreateParams
    ) => Promise<CreateResult<RecordType>>;

    delete: <RecordType extends Record = Record>(
        resource: string,
        params: DeleteParams<RecordType>
    ) => Promise<DeleteResult<RecordType>>;

    deleteMany: <RecordType extends Record = Record>(
        resource: string,
        params: DeleteManyParams<RecordType>
    ) => Promise<DeleteManyResult<RecordType>>;

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

export interface GetOneParams<RecordType extends Record = Record> {
    id: RecordType['id'];
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
    data: Partial<T>;
    previousData: T;
}
export interface UpdateResult<RecordType extends Record = Record> {
    data: RecordType;
    validUntil?: ValidUntil;
}

export interface UpdateManyParams<T = any> {
    ids: Identifier[];
    data: T;
}
export interface UpdateManyResult<RecordType extends Record = Record> {
    data?: RecordType['id'][];
    validUntil?: ValidUntil;
}

export interface CreateParams<T = any> {
    data: T;
}
export interface CreateResult<RecordType extends Record = Record> {
    data: RecordType;
    validUntil?: ValidUntil;
}

export interface DeleteParams<RecordType extends Record = Record> {
    id: Identifier;
    previousData?: RecordType;
}
export interface DeleteResult<RecordType extends Record = Record> {
    data: RecordType;
}

export interface DeleteManyParams<RecordType extends Record = Record> {
    ids: RecordType['id'][];
}
export interface DeleteManyResult<RecordType extends Record = Record> {
    data?: RecordType['id'][];
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

    updateMany: <RecordType extends Record = Record>(
        resource: string,
        params: UpdateManyParams,
        options?: UseDataProviderOptions
    ) => Promise<UpdateManyResult<RecordType>>;

    create: <RecordType extends Record = Record>(
        resource: string,
        params: CreateParams
    ) => Promise<CreateResult<RecordType>>;

    delete: <RecordType extends Record = Record>(
        resource: string,
        params: DeleteParams
    ) => Promise<DeleteResult<RecordType>>;

    deleteMany: <RecordType extends Record = Record>(
        resource: string,
        params: DeleteManyParams<RecordType>
    ) => Promise<DeleteManyResult<RecordType>>;
};

export type MutationMode = 'pessimistic' | 'optimistic' | 'undoable';
export type OnSuccess = (
    response?: any,
    variables?: any,
    context?: any
) => void;
export type OnFailure = (error?: any, variables?: any, context?: any) => void;

export interface UseDataProviderOptions {
    action?: string;
    fetch?: string;
    meta?: object;
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
            optimistic: boolean;
            sidebarOpen: boolean;
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
        loading: number;
        references: {
            oneToMany: {
                [relatedTo: string]: { ids: Identifier[]; total: number };
            };
        };
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

export type TitleComponent = string | ReactElement<any>;
export type CatchAllComponent = ComponentType<{ title?: TitleComponent }>;

interface LoginComponentProps {
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
    theme?: DeprecatedThemeOptions;
    title?: TitleComponent;
}

export type LayoutComponent = ComponentType<CoreLayoutProps>;
export type LoadingComponent = ComponentType<{
    theme?: DeprecatedThemeOptions;
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

export interface ResourceProps {
    intent?: 'route' | 'registration';
    name: string;
    list?: ComponentType<ListControllerProps>;
    create?: ComponentType<CreateControllerProps>;
    edit?: ComponentType<EditControllerProps>;
    show?: ComponentType<ShowControllerProps>;
    icon?: ComponentType<any>;
    options?: object;
}

export interface AdminProps {
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
    theme?: DeprecatedThemeOptions;
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

export type FormGroupSubscriber = () => void;
export type FormContextValue = {
    setOnSave?: SetOnSave;
    registerGroup: (name: string) => void;
    unregisterGroup: (name: string) => void;
    registerField: (source: string, group?: string) => void;
    unregisterField: (source: string, group?: string) => void;
    getGroupFields: (name: string) => string[];
    /**
     * Subscribe to any changes of the group content (fields added or removed).
     * Subscribers can get the current fields of the group by calling getGroupFields.
     * Returns a function to unsubscribe.
     */
    subscribe: (name: string, subscriber: FormGroupSubscriber) => () => void;
};

export type FormFunctions = {
    setOnSave?: SetOnSave;
};
