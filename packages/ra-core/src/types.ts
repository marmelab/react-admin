import { ComponentType, ReactElement, ReactNode } from 'react';
import { FieldPath } from 'react-hook-form';
import { WithPermissionsChildrenParams } from './auth/WithPermissions';
import { AuthActionType } from './auth/types';

/**
 * data types
 */

export type Identifier = string | number;

export interface RaRecord<IdentifierType extends Identifier = Identifier>
    extends Record<string, any> {
    id: IdentifierType;
}

export interface SortPayload {
    field: string;
    order: 'ASC' | 'DESC';
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

export type Locale = {
    locale: string;
    name: string;
};

export type I18nProvider = {
    translate: Translate;
    changeLocale: (locale: string, options?: any) => Promise<void>;
    getLocale: () => string;
    getLocales?: () => Locale[];
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
    login: (
        params: any
    ) => Promise<{ redirectTo?: string | boolean } | void | any>;
    logout: (params: any) => Promise<void | false | string>;
    checkAuth: (params: any & QueryFunctionContext) => Promise<void>;
    checkError: (error: any) => Promise<void>;
    getIdentity?: (params?: QueryFunctionContext) => Promise<UserIdentity>;
    getPermissions?: (params: any & QueryFunctionContext) => Promise<any>;
    handleCallback?: (
        params?: QueryFunctionContext
    ) => Promise<AuthRedirectResult | void | any>;
    canAccess?: <RecordType extends Record<string, any> = Record<string, any>>(
        params: QueryFunctionContext & {
            action: string;
            resource: string;
            record?: RecordType;
        }
    ) => Promise<boolean>;
    [key: string]: any;
    supportAbortSignal?: boolean;
};

export type AuthRedirectResult = {
    redirectTo?: string | false;
    logoutOnFailure?: boolean;
};

export type LegacyAuthProvider = (
    type: AuthActionType,
    params?: any
) => Promise<any>;

/**
 * dataProvider types
 */

export type DataProvider<ResourceType extends string = string> = {
    getList: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: GetListParams & QueryFunctionContext
    ) => Promise<GetListResult<RecordType>>;

    getOne: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: GetOneParams<RecordType> & QueryFunctionContext
    ) => Promise<GetOneResult<RecordType>>;

    getMany: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: GetManyParams<RecordType> & QueryFunctionContext
    ) => Promise<GetManyResult<RecordType>>;

    getManyReference: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: GetManyReferenceParams & QueryFunctionContext
    ) => Promise<GetManyReferenceResult<RecordType>>;

    update: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: UpdateParams
    ) => Promise<UpdateResult<RecordType>>;

    updateMany: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: UpdateManyParams
    ) => Promise<UpdateManyResult<RecordType>>;

    create: <
        RecordType extends Omit<RaRecord, 'id'> = any,
        ResultRecordType extends RaRecord = RecordType & { id: Identifier },
    >(
        resource: ResourceType,
        params: CreateParams
    ) => Promise<CreateResult<ResultRecordType>>;

    delete: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: DeleteParams<RecordType>
    ) => Promise<DeleteResult<RecordType>>;

    deleteMany: <RecordType extends RaRecord = any>(
        resource: ResourceType,
        params: DeleteManyParams<RecordType>
    ) => Promise<DeleteManyResult<RecordType>>;

    [key: string]: any;
    supportAbortSignal?: boolean;
};

export interface QueryFunctionContext {
    signal?: AbortSignal;
}

export interface GetListParams {
    pagination?: PaginationPayload;
    sort?: SortPayload;
    filter?: any;
    meta?: any;
    signal?: AbortSignal;
}
export interface GetListResult<RecordType extends RaRecord = any> {
    data: RecordType[];
    total?: number;
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
    meta?: any;
}

export interface GetInfiniteListResult<RecordType extends RaRecord = any>
    extends GetListResult<RecordType> {
    pageParam: number;
}
export interface GetOneParams<RecordType extends RaRecord = any> {
    id: RecordType['id'];
    meta?: any;
    signal?: AbortSignal;
}
export interface GetOneResult<RecordType extends RaRecord = any> {
    data: RecordType;
    meta?: any;
}

export interface GetManyParams<RecordType extends RaRecord = any> {
    ids: RecordType['id'][];
    meta?: any;
    signal?: AbortSignal;
}
export interface GetManyResult<RecordType extends RaRecord = any> {
    data: RecordType[];
    meta?: any;
}

export interface GetManyReferenceParams {
    target: string;
    id: Identifier;
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: any;
    meta?: any;
    signal?: AbortSignal;
}
export interface GetManyReferenceResult<RecordType extends RaRecord = any> {
    data: RecordType[];
    total?: number;
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
    meta?: any;
}

export interface UpdateParams<RecordType extends RaRecord = any> {
    id: RecordType['id'];
    data: Partial<RecordType>;
    previousData: RecordType;
    meta?: any;
}
export interface UpdateResult<RecordType extends RaRecord = any> {
    data: RecordType;
    meta?: any;
}

export interface UpdateManyParams<T = any> {
    ids: Identifier[];
    data: Partial<T>;
    meta?: any;
}
export interface UpdateManyResult<RecordType extends RaRecord = any> {
    data?: RecordType['id'][];
    meta?: any;
}

export interface CreateParams<T = any> {
    data: Partial<T>;
    meta?: any;
}
export interface CreateResult<RecordType extends RaRecord = any> {
    data: RecordType;
    meta?: any;
}

export interface DeleteParams<RecordType extends RaRecord = any> {
    id: RecordType['id'];
    previousData?: RecordType;
    meta?: any;
}
export interface DeleteResult<RecordType extends RaRecord = any> {
    data: RecordType;
    meta?: any;
}

export interface DeleteManyParams<RecordType extends RaRecord = any> {
    ids: RecordType['id'][];
    meta?: any;
}
export interface DeleteManyResult<RecordType extends RaRecord = any> {
    data?: RecordType['id'][];
    meta?: any;
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

export type OnError = (error?: any, variables?: any, context?: any) => void;

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
    onError?: OnError;
    enabled?: boolean;
}

export type LegacyDataProvider = (
    type: string,
    resource: string,
    params: any
) => Promise<any>;

export type RecordToStringFunction = (record: any) => string;

export interface ResourceDefinition<OptionsType extends ResourceOptions = any> {
    readonly name: string;
    readonly options?: OptionsType;
    readonly hasList?: boolean;
    readonly hasEdit?: boolean;
    readonly hasShow?: boolean;
    readonly hasCreate?: boolean;
    readonly icon?: any;
    readonly recordRepresentation?:
        | ReactElement
        | RecordToStringFunction
        | string;
}

/**
 * Misc types
 */

export type Dispatch<T> = T extends (...args: infer A) => any
    ? (...args: A) => void
    : never;

export type ResourceElement = ReactElement<ResourceProps>;
export type RenderResourcesFunction = (permissions: any) =>
    | ReactNode // (permissions) => <><Resource /><Resource /><Resource /></>
    | Promise<ReactNode> // (permissions) => fetch().then(() => <><Resource /><Resource /><Resource /></>)
    | ResourceElement[] // // (permissions) => [<Resource />, <Resource />, <Resource />]
    | Promise<ResourceElement[]>; // (permissions) => fetch().then(() => [<Resource />, <Resource />, <Resource />])
export type AdminChildren =
    | RenderResourcesFunction
    | Iterable<ReactNode | RenderResourcesFunction>
    | ReactNode;

export type TitleComponent = string | ReactElement<any>;
export type CatchAllComponent = ComponentType<{ title?: TitleComponent }>;

export type LoginComponent = ComponentType<{}> | ReactElement<any>;
export type DashboardComponent = ComponentType<WithPermissionsChildrenParams>;

export interface CoreLayoutProps {
    children: ReactNode;
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

export interface ResourceOptions {
    label?: string;
    [key: string]: any;
}

export interface ResourceProps {
    intent?: 'route' | 'registration';
    name: string;
    list?: ComponentType<any> | ReactElement;
    create?: ComponentType<any> | ReactElement;
    edit?: ComponentType<any> | ReactElement;
    show?: ComponentType<any> | ReactElement;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    icon?: ComponentType<any>;
    recordRepresentation?: ReactElement | RecordToStringFunction | string;
    options?: ResourceOptions;
    children?: ReactNode;
}

export type Exporter<RecordType extends RaRecord = any> = (
    data: RecordType[],
    fetchRelatedRecords: FetchRelatedRecords,
    dataProvider: DataProvider,
    resource?: string
) => void | Promise<void>;

export type FetchRelatedRecords = <RecordType = any>(
    data: any[],
    field: string,
    resource: string
) => Promise<{ [key: Identifier]: RecordType }>;

export type SetOnSave = (
    onSave?: (values: object, redirect: any) => void
) => void;

export type FormFunctions = {
    setOnSave?: SetOnSave;
};

// Type for a string that accept one of the known values but also any other string
// Useful for IDE autocompletion without preventing custom values
export type HintedString<KnownValues extends string> = AnyString | KnownValues;

// Re-export react-hook-form implementation of FieldPath that returns all possible paths of an object
// This will allow us to either include the FieldPath implementation from react-hook-form or replace it with our own
// should we move away from react-hook-form
// type Post = { title: string; author: { name: string; }; tags: { id: string; name: string} };
// => Valid paths are "title" | "author" | "author.name" | "tags.id" | "tags.name"
export type RecordValues = Record<string, any>;
export type RecordPath<TRecordValues extends RecordValues> =
    FieldPath<TRecordValues>;

// Returns the union of all possible paths of a type if it is provided, otherwise returns a string
// Useful for props such as "source" in react-admin components
export type ExtractRecordPaths<T extends RecordValues> =
    // Trick that allows to check whether T was provided
    [T] extends [never] ? string : RecordPath<T>;

export type AnyString = string & {};
