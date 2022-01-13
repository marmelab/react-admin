import { ReactNode, ReactElement, ComponentType } from 'react';

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

export interface RaRecord {
    id: Identifier;
    [key: string]: any;
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
    getList: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: GetListParams
    ) => Promise<GetListResult<RaRecordType>>;

    getOne: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: GetOneParams
    ) => Promise<GetOneResult<RaRecordType>>;

    getMany: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: GetManyParams
    ) => Promise<GetManyResult<RaRecordType>>;

    getManyReference: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: GetManyReferenceParams
    ) => Promise<GetManyReferenceResult<RaRecordType>>;

    update: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: UpdateParams
    ) => Promise<UpdateResult<RaRecordType>>;

    updateMany: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: UpdateManyParams
    ) => Promise<UpdateManyResult<RaRecordType>>;

    create: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: CreateParams
    ) => Promise<CreateResult<RaRecordType>>;

    delete: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: DeleteParams<RaRecordType>
    ) => Promise<DeleteResult<RaRecordType>>;

    deleteMany: <RaRecordType extends RaRecord = any>(
        resource: string,
        params: DeleteManyParams<RaRecordType>
    ) => Promise<DeleteManyResult<RaRecordType>>;

    [key: string]: any;
};

export interface GetListParams {
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: any;
}
export interface GetListResult<RaRecordType extends RaRecord = any> {
    data: RaRecordType[];
    total: number;
    validUntil?: ValidUntil;
}

export interface GetOneParams<RaRecordType extends RaRecord = any> {
    id: RaRecordType['id'];
}
export interface GetOneResult<RaRecordType extends RaRecord = any> {
    data: RaRecordType;
    validUntil?: ValidUntil;
}

export interface GetManyParams {
    ids: Identifier[];
}
export interface GetManyResult<RaRecordType extends RaRecord = any> {
    data: RaRecordType[];
    validUntil?: ValidUntil;
}

export interface GetManyReferenceParams {
    target: string;
    id: Identifier;
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: any;
}
export interface GetManyReferenceResult<RaRecordType extends RaRecord = any> {
    data: RaRecordType[];
    total: number;
    validUntil?: ValidUntil;
}

export interface UpdateParams<T = any> {
    id: Identifier;
    data: Partial<T>;
    previousData: T;
}
export interface UpdateResult<RaRecordType extends RaRecord = any> {
    data: RaRecordType;
    validUntil?: ValidUntil;
}

export interface UpdateManyParams<T = any> {
    ids: Identifier[];
    data: T;
}
export interface UpdateManyResult<RaRecordType extends RaRecord = any> {
    data?: RaRecordType['id'][];
    validUntil?: ValidUntil;
}

export interface CreateParams<T = any> {
    data: T;
}
export interface CreateResult<RaRecordType extends RaRecord = any> {
    data: RaRecordType;
    validUntil?: ValidUntil;
}

export interface DeleteParams<RaRecordType extends RaRecord = any> {
    id: Identifier;
    previousData?: RaRecordType;
}
export interface DeleteResult<RaRecordType extends RaRecord = any> {
    data: RaRecordType;
}

export interface DeleteManyParams<RaRecordType extends RaRecord = any> {
    ids: RaRecordType['id'][];
}
export interface DeleteManyResult<RaRecordType extends RaRecord = any> {
    data?: RaRecordType['id'][];
}

export type DataProviderResult<RaRecordType extends RaRecord = any> =
    | CreateResult<RaRecordType>
    | DeleteResult<RaRecordType>
    | DeleteManyResult
    | GetListResult<RaRecordType>
    | GetManyResult<RaRecordType>
    | GetManyReferenceResult<RaRecordType>
    | GetOneResult<RaRecordType>
    | UpdateResult<RaRecordType>
    | UpdateManyResult;

export type MutationMode = 'pessimistic' | 'optimistic' | 'undoable';
export type OnSuccess = (
    response?: any,
    variables?: any,
    context?: any
) => void;
export type onError = (error?: any, variables?: any, context?: any) => void;
export type TransformData = (data: any) => any | Promise<any>;

export interface UseDataProviderOptions {
    action?: string;
    fetch?: string;
    meta?: object;
    mutationMode?: MutationMode;
    onSuccess?: OnSuccess;
    onError?: onError;
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
            sidebarOpen: boolean;
        };
        expandedRows: {
            [name: string]: Identifier[];
        };
        selectedIds: {
            [name: string]: Identifier[];
        };
        listParams: {
            [name: string]: {
                sort: string;
                order: string;
                page: number;
                perPage: number;
                filter: any;
            };
        };
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

export interface LoginComponentProps {
    title?: TitleComponent;
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
    title?: TitleComponent;
}

export type LayoutComponent = ComponentType<CoreLayoutProps>;
export type LoadingComponent = ComponentType<{
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

export type Exporter = (
    data: any,
    fetchRelatedRecords: (
        data: any,
        field: string,
        resource: string
    ) => Promise<any>,
    dataProvider: DataProvider,
    resource?: string
) => void | Promise<void>;

export type SetOnSave = (
    onSave?: (values: object, redirect: any) => void
) => void;

export type FormFunctions = {
    setOnSave?: SetOnSave;
};
