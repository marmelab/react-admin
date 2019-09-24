import { ReactNode, ReactElement, ComponentType } from 'react';
import { RouteProps, RouteComponentProps, match as Match } from 'react-router';
import { Location } from 'history';

import { WithPermissionsChildrenParams } from './auth/WithPermissions';
import { AuthActionType } from './auth/types';

export type Identifier = string | number;
export interface Record {
    id: Identifier;
    [key: string]: any;
}

export interface RecordMap<RecordType = Record> {
    // Accept strings and numbers as identifiers
    [id: string]: RecordType;
    [id: number]: RecordType;
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

export type LegacyDataProvider = (
    type: string,
    resource: string,
    params: any
) => Promise<any>;

export interface CreateResult<RecordType = Record> {
    data: RecordType;
}

export interface CreateParams<DataType = Record> {
    data: DataType;
}

export interface DeleteResult<RecordType = Record> {
    data?: RecordType;
}

export interface DeleteParams {
    id: Identifier;
}

export interface DeleteManyResult {
    data?: Identifier[];
}

export interface DeleteManyParams {
    ids: Identifier[];
}

export interface GetListResult<RecordType = Record> {
    data: RecordType[];
    total: number;
}

export interface GetListParams<FilterType = any> {
    pagination: Pagination;
    sort: Sort;
    filter: FilterType;
}

export interface GetManyResult<RecordType = Record> {
    data: RecordType[];
}

export interface GetManyParams {
    ids: Identifier[];
}

export interface GetManyReferenceResult<RecordType = Record> {
    data: RecordType[];
    total: number;
}

export interface GetManyReferenceParams<FilterType = any> {
    target: string;
    id: Identifier;
    pagination: Pagination;
    sort: Sort;
    filter: FilterType;
}

export interface GetOneResult<RecordType = Record> {
    data: RecordType;
}

export interface GetOneParams {
    id: Identifier;
}

export interface UpdateResult<RecordType = Record> {
    data: RecordType;
}

export interface UpdateParams<RecordType = Record, DataType = RecordType> {
    id: Identifier;
    data: DataType;
    previousData: RecordType;
}

export interface UpdateManyResult<RecordType = Record> {
    data: RecordType;
}

export interface UpdateManyParams<DataType = Record> {
    ids: Identifier[];
    data: DataType;
}

export type DataProvider = {
    create: <RecordType = Record, DataType = RecordType>(
        resource: string,
        params: CreateParams<DataType>
    ) => Promise<CreateResult<RecordType>>;

    delete: <RecordType = Record>(
        resource: string,
        params: DeleteParams
    ) => Promise<DeleteResult<RecordType>>;

    deleteMany: (
        resource: string,
        params: DeleteManyParams
    ) => Promise<DeleteManyResult>;

    getList: <RecordType = Record, FilterType = any>(
        resource: string,
        params: GetListParams<FilterType>
    ) => Promise<GetListResult<RecordType>>;

    getMany: <RecordType = Record>(
        resource: string,
        params: GetManyParams
    ) => Promise<GetManyResult<RecordType>>;

    getManyReference: <RecordType = Record, FilterType = any>(
        resource: string,
        params: GetManyReferenceParams<FilterType>
    ) => Promise<GetManyReferenceResult<RecordType>>;

    getOne: <RecordType = Record>(
        resource: string,
        params: GetOneParams
    ) => Promise<GetOneResult<RecordType>>;

    update: <RecordType = Record, DataType = RecordType>(
        resource: string,
        params: UpdateParams<RecordType, DataType>
    ) => Promise<UpdateResult<RecordType>>;

    updateMany: <RecordType = Record, DataType = RecordType>(
        resource: string,
        params: UpdateManyParams<DataType>
    ) => Promise<UpdateManyResult<RecordType>>;

    [key: string]: any;
};

export interface UseDataProviderOptions {
    action?: string;
    fetch?: string;
    meta?: object;
    undoable?: boolean;
    onSuccess?: any;
    onFailure?: any;
}

export type HookDataProvider = {
    create: <RecordType = Record, DataType = RecordType>(
        resource: string,
        params: CreateParams<DataType>,
        options?: UseDataProviderOptions
    ) => Promise<CreateResult<RecordType>>;

    delete: <RecordType = Record>(
        resource: string,
        params: DeleteParams,
        options?: UseDataProviderOptions
    ) => Promise<DeleteResult<RecordType>>;

    deleteMany: (
        resource: string,
        params: DeleteManyParams,
        options?: UseDataProviderOptions
    ) => Promise<DeleteManyResult>;

    getList: <RecordType = Record, FilterType = any>(
        resource: string,
        params: GetListParams<FilterType>,
        options?: UseDataProviderOptions
    ) => Promise<GetListResult<RecordType>>;

    getMany: <RecordType = Record>(
        resource: string,
        params: GetManyParams,
        options?: UseDataProviderOptions
    ) => Promise<GetManyResult<RecordType>>;

    getManyReference: <RecordType = Record, FilterType = any>(
        resource: string,
        params: GetManyReferenceParams<FilterType>,
        options?: UseDataProviderOptions
    ) => Promise<GetManyReferenceResult<RecordType>>;

    getOne: <RecordType = Record>(
        resource: string,
        params: GetOneParams,
        options?: UseDataProviderOptions
    ) => Promise<GetOneResult<RecordType>>;

    update: <RecordType = Record, DataType = RecordType>(
        resource: string,
        params: UpdateParams<RecordType, DataType>,
        options?: UseDataProviderOptions
    ) => Promise<UpdateResult<RecordType>>;

    updateMany: <RecordType = Record, DataType = RecordType>(
        resource: string,
        params: UpdateManyParams<DataType>,
        options?: UseDataProviderOptions
    ) => Promise<UpdateManyResult<RecordType>>;

    [key: string]: any;
};

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
