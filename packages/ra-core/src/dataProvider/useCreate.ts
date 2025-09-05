import {
    useQueryClient,
    type UseMutationOptions,
    type UseMutationResult,
    type MutateOptions,
} from '@tanstack/react-query';

import { useDataProvider } from './useDataProvider';
import type {
    RaRecord,
    CreateParams,
    Identifier,
    DataProvider,
    MutationMode,
} from '../types';
import { useEvent } from '../util';
import {
    type Snapshot,
    useMutationWithMutationMode,
} from './useMutationWithMutationMode';

/**
 * Get a callback to call the dataProvider.create() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The create parameters { data }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.data The record to create, e.g. { title: 'hello, world' }
 *
 * @returns The current mutation state. Destructure as [create, { data, error, isPending }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [create, { isPending: false, isIdle: true }]
 * - start:   [create, { isPending: true }]
 * - success: [create, { data: [data from response], isPending: false, isSuccess: true }]
 * - error:   [create, { error: [error from response], isPending: false, isError: true }]
 *
 * The create() function must be called with a resource and a parameter object: create(resource, { data, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://tanstack.com/query/v5/docs/react/reference/useMutation
 *
 * @example // set params when calling the create callback
 *
 * import { useCreate, useRecordContext } from 'react-admin';
 *
 * const LikeButton = () => {
 *     const record = useRecordContext();
 *     const like = { postId: record.id };
 *     const [create, { isPending, error }] = useCreate();
 *     const handleClick = () => {
 *         create('likes', { data: like })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Like</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useCreate, useRecordContext } from 'react-admin';
 *
 * const LikeButton = () => {
 *     const record = useRecordContext();
 *     const like = { postId: record.id };
 *     const [create, { isPending, error }] = useCreate('likes', { data: like });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={() => create()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [create, { data }] = useCreate<Product>('products', { data: product });
 *                    \-- data is Product
 */
export const useCreate = <
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
>(
    resource?: string,
    params: Partial<CreateParams<Partial<RecordType>>> = {},
    options: UseCreateOptions<RecordType, MutationError, ResultRecordType> = {}
): UseCreateResult<RecordType, boolean, MutationError, ResultRecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();

    const {
        mutationMode = 'pessimistic',
        getMutateWithMiddlewares,
        ...mutationOptions
    } = options;

    const dataProviderCreate = useEvent((resource: string, params) =>
        dataProvider
            .create<
                RecordType,
                ResultRecordType
            >(resource, params as CreateParams<RecordType>)
            .then(({ data }) => data)
    );

    const [mutate, mutationResult] = useMutationWithMutationMode<
        MutationError,
        ResultRecordType,
        UseCreateMutateParams<RecordType>
    >(
        { resource, ...params },
        {
            ...mutationOptions,
            mutationKey: [resource, 'create', params],
            mutationMode,
            mutationFn: ({ resource, ...params }) => {
                if (resource == null) {
                    throw new Error('useCreate mutation requires a resource');
                }
                if (params == null) {
                    throw new Error('useCreate mutation requires parameters');
                }
                return dataProviderCreate(resource, params);
            },
            updateCache: (
                { resource, ...params },
                { mutationMode },
                result
            ) => {
                const id =
                    mutationMode === 'pessimistic'
                        ? result?.id
                        : params.data?.id;
                if (!id) {
                    return undefined;
                }
                // hack: only way to tell react-query not to fetch this query for the next 5 seconds
                // because setQueryData doesn't accept a stale time option
                const now = Date.now();
                const updatedAt =
                    mutationMode === 'undoable' ? now + 5 * 1000 : now;
                // Stringify and parse the data to remove undefined values.
                // If we don't do this, an update with { id: undefined } as payload
                // would remove the id from the record, which no real data provider does.
                const clonedData = JSON.parse(
                    JSON.stringify(
                        mutationMode === 'pessimistic' ? result : params.data
                    )
                );

                queryClient.setQueryData(
                    [resource, 'getOne', { id: String(id), meta: params.meta }],
                    (record: RecordType) => ({ ...record, ...clonedData }),
                    { updatedAt }
                );

                return clonedData;
            },
            getSnapshot: ({ resource, ...params }, { mutationMode }) => {
                const queryKeys: any[] = [
                    [resource, 'getList'],
                    [resource, 'getInfiniteList'],
                    [resource, 'getMany'],
                    [resource, 'getManyReference'],
                ];

                if (mutationMode !== 'pessimistic' && params.data?.id) {
                    queryKeys.push([
                        resource,
                        'getOne',
                        { id: String(params.data.id), meta: params.meta },
                    ]);
                }

                /**
                 * Snapshot the previous values via queryClient.getQueriesData()
                 *
                 * The snapshotData ref will contain an array of tuples [query key, associated data]
                 *
                 * @example
                 * [
                 *   [['posts', 'getOne', { id: '1' }], { id: 1, title: 'Hello' }],
                 *   [['posts', 'getList'], { data: [{ id: 1, title: 'Hello' }], total: 1 }],
                 *   [['posts', 'getMany'], [{ id: 1, title: 'Hello' }]],
                 * ]
                 *
                 * @see https://react-query-v3.tanstack.com/reference/QueryClient#queryclientgetqueriesdata
                 */
                const snapshot = queryKeys.reduce(
                    (prev, queryKey) =>
                        prev.concat(queryClient.getQueriesData({ queryKey })),
                    [] as Snapshot
                );

                return snapshot;
            },
            getMutateWithMiddlewares: mutationFn => args => {
                // This is necessary to avoid breaking changes in useCreate:
                // The mutation function must have the same signature as before (resource, params) and not ({ resource, params })
                if (getMutateWithMiddlewares) {
                    const { resource, ...params } = args;
                    return getMutateWithMiddlewares(
                        dataProviderCreate.bind(dataProvider)
                    )(resource, params);
                }
                return mutationFn(args);
            },
            onUndo: ({ resource, data, meta }) => {
                queryClient.removeQueries({
                    queryKey: [
                        resource,
                        'getOne',
                        { id: String(data?.id), meta },
                    ],
                    exact: true,
                });
            },
        }
    );

    const create = useEvent(
        (
            callTimeResource: string | undefined = resource,
            callTimeParams: Partial<CreateParams<RecordType>> = {},
            callTimeOptions: MutateOptions<
                ResultRecordType,
                MutationError,
                Partial<UseCreateMutateParams<RecordType>>,
                unknown
            > & {
                mutationMode?: MutationMode;
                returnPromise?: boolean;
            } = {}
        ) => {
            return mutate(
                {
                    resource: callTimeResource,
                    ...callTimeParams,
                },
                callTimeOptions
            );
        }
    );

    return [create, mutationResult];
};

export interface UseCreateMutateParams<
    RecordType extends Omit<RaRecord, 'id'> = any,
> {
    resource?: string;
    data?: Partial<Omit<RecordType, 'id'>>;
    meta?: any;
}

export type UseCreateOptions<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
> = Omit<
    UseMutationOptions<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>
    >,
    'mutationFn'
> & {
    mutationMode?: MutationMode;
    returnPromise?: boolean;
    getMutateWithMiddlewares?: <
        CreateFunctionType extends
            DataProvider['create'] = DataProvider['create'],
    >(
        mutate: CreateFunctionType
    ) => (
        ...Params: Parameters<CreateFunctionType>
    ) => ReturnType<CreateFunctionType>;
};

export type CreateMutationFunction<
    RecordType extends Omit<RaRecord, 'id'> = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
> = (
    resource?: string,
    params?: Partial<CreateParams<Partial<RecordType>>>,
    options?: MutateOptions<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>,
        unknown
    > & { mutationMode?: MutationMode; returnPromise?: TReturnPromise }
) => Promise<TReturnPromise extends true ? ResultRecordType : void>;

export type UseCreateResult<
    RecordType extends Omit<RaRecord, 'id'> = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
> = [
    CreateMutationFunction<
        RecordType,
        TReturnPromise,
        MutationError,
        ResultRecordType
    >,
    UseMutationResult<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>,
        unknown
    > & { isLoading: boolean },
];
