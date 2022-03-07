import { ReactNode, ReactElement, ComponentType } from 'react';

import { WithPermissionsChildrenParams } from './auth/WithPermissions';
import { AuthActionType } from './auth/types';

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
    getIdentity?: () => Promise<UserIdentity>;
    getPermissions: (params: any) => Promise<any>;
    getRoles?: () => Promise<any>;
    [key: string]: any;
};

export type LegacyAuthProvider = (
    type: AuthActionType,
    params?: any
) => Promise<any>;

/**
 * dataProvider types
 */

// https://stackoverflow.com/questions/51465182/how-to-remove-index-signature-using-mapped-types/68261113#68261113
type RemoveIndex<T> = {
    [P in keyof T as string extends P
        ? never
        : number extends P
        ? never
        : P]: T[P];
};

// curious hack to work around Literals not showing up in hints.
// Basically, this is a string.
// https://github.com/Microsoft/TypeScript/issues/29729
type AnyString = string & Record<never, never>;

type PickByValue<T, V> = {
    [K in keyof T]: T[K] extends V ? T[K] : never;
};

export type ExtractDataProviderDefinition<T> = T extends BaseDataProvider<
    infer Definition
>
    ? Definition
    : never;

export type DataProviderDefinition<
    ResourceType extends string = string,
    RecordType extends RaRecord = RaRecord
> = Record<ResourceType, RecordType>;
export interface RegisteredDataProviderDefinition
    extends DataProviderDefinition {}
export interface RegisteredDataProviderDefinition
    extends DataProviderDefinition<'hi', RaRecord & { name: string }> {}

export type ResourceTypes<
    Definition extends DataProviderDefinition,
    RecordTypes extends RaRecord = RaRecord
> =
    | (keyof RemoveIndex<PickByValue<Definition, RecordTypes>> & string)
    | AnyString;

export type RecordTypes<
    Definition extends DataProviderDefinition,
    _ResourceTypes extends ResourceTypes<Definition> = ResourceTypes<Definition>
> = Definition[_ResourceTypes];

export type RegisteredResourceTypes =
    ResourceTypes<RegisteredDataProviderDefinition>;

export type RegisteredRecordTypes<
    _ResourceTypes extends RegisteredResourceTypes = RegisteredResourceTypes
> = RecordTypes<RegisteredDataProviderDefinition, _ResourceTypes>;

export interface BaseDataProvider<Definition extends DataProviderDefinition> {
    getList<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: GetListParams
    ): Promise<GetListResult<RecordType>>;
    getList<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: GetListParams
    ): Promise<GetListResult<RecordType>>;

    getOne<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: GetOneParams
    ): Promise<GetOneResult<RecordType>>;
    getOne<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: GetOneParams
    ): Promise<GetOneResult<RecordType>>;

    getMany<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: GetManyParams
    ): Promise<GetManyResult<RecordType>>;
    getMany<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: GetManyParams
    ): Promise<GetManyResult<RecordType>>;

    getManyReference<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>>;
    getManyReference<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>>;

    update<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: UpdateParams
    ): Promise<UpdateResult<RecordType>>;
    update<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: UpdateParams
    ): Promise<UpdateResult<RecordType>>;

    updateMany<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: UpdateManyParams
    ): Promise<UpdateManyResult<RecordType>>;
    updateMany<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: UpdateManyParams
    ): Promise<UpdateManyResult<RecordType>>;

    create<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: CreateParams
    ): Promise<CreateResult<RecordType>>;
    create<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: CreateParams
    ): Promise<CreateResult<RecordType>>;

    delete<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>>;
    delete<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>>;

    deleteMany<
        ResourceType extends ResourceTypes<Definition>,
        RecordType extends RaRecord = Definition[ResourceType]
    >(
        resource: ResourceType,
        params: DeleteManyParams<RecordType>
    ): Promise<DeleteManyResult<RecordType>>;
    deleteMany<
        RecordType extends RecordTypes<Definition>,
        ResourceType extends string = ResourceTypes<Definition, RecordType>
    >(
        resource: ResourceType,
        params: DeleteManyParams<RecordType>
    ): Promise<DeleteManyResult<RecordType>>;

    [key: string]: any;
}

// Backwards compatibility, acts a translation layer, so `DataProvider<string>` is still valid.
export type DataProvider<
    MaybeDefinition extends
        | string
        | DataProviderDefinition = DataProviderDefinition
> = BaseDataProvider<
    MaybeDefinition extends string ? DataProviderDefinition : MaybeDefinition
>;

export type RegisteredDataProvider = DataProvider<
    // There isn't such thing as a 'global' DataProvider, so use it to define hints.
    Partial<RegisteredDataProviderDefinition> | DataProviderDefinition
>;

export interface GetListParams {
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: any;
    meta?: any;
}
export interface GetListResult<RecordType extends RaRecord = any> {
    data: RecordType[];
    total?: number;
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
}

export interface GetOneParams<RecordType extends RaRecord = any> {
    id: RecordType['id'];
    meta?: any;
}
export interface GetOneResult<RecordType extends RaRecord = any> {
    data: RecordType;
}

export interface GetManyParams {
    ids: Identifier[];
    meta?: any;
}
export interface GetManyResult<RecordType extends RaRecord = any> {
    data: RecordType[];
}

export interface GetManyReferenceParams {
    target: string;
    id: Identifier;
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: any;
    meta?: any;
}
export interface GetManyReferenceResult<RecordType extends RaRecord = any> {
    data: RecordType[];
    total?: number;
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
}

export interface UpdateParams<T = any> {
    id: Identifier;
    data: Partial<T>;
    previousData: T;
    meta?: any;
}
export interface UpdateResult<RecordType extends RaRecord = any> {
    data: RecordType;
}

export interface UpdateManyParams<T = any> {
    ids: Identifier[];
    data: T;
    meta?: any;
}
export interface UpdateManyResult<RecordType extends RaRecord = any> {
    data?: RecordType['id'][];
}

export interface CreateParams<T = any> {
    data: T;
    meta?: any;
}
export interface CreateResult<RecordType extends RaRecord = any> {
    data: RecordType;
}

export interface DeleteParams<RecordType extends RaRecord = any> {
    id: Identifier;
    previousData?: RecordType;
    meta?: any;
}
export interface DeleteResult<RecordType extends RaRecord = any> {
    data: RecordType;
}

export interface DeleteManyParams<RecordType extends RaRecord = any> {
    ids: RecordType['id'][];
    meta?: any;
}
export interface DeleteManyResult<RecordType extends RaRecord = any> {
    data?: RecordType['id'][];
}

export type DataProviderResult<RecordType extends RaRecord = any> =
    | CreateResult<RecordType>
    | DeleteResult<RecordType>
    | DeleteManyResult
    | GetListResult<RecordType>
    | GetManyResult<RecordType>
    | GetManyReferenceResult<RecordType>
    | GetOneResult<RecordType>
    | UpdateResult<RecordType>
    | UpdateManyResult;

export type MutationMode = 'pessimistic' | 'optimistic' | 'undoable';
export type OnSuccess = (
    response?: any,
    variables?: any,
    context?: any
) => void;
export type onError = (error?: any, variables?: any, context?: any) => void;
export type TransformData = (
    data: any,
    options?: { previousData: any }
) => any | Promise<any>;

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

export type LoginComponent = ComponentType<{}> | ReactElement<any>;
export type DashboardComponent = ComponentType<WithPermissionsChildrenParams>;

export interface CoreLayoutProps {
    children?: ReactNode;
    dashboard?: DashboardComponent;
    menu?: ComponentType<{
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
    list?: ComponentType<any> | ReactElement;
    create?: ComponentType<any> | ReactElement;
    edit?: ComponentType<any> | ReactElement;
    show?: ComponentType<any> | ReactElement;
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
