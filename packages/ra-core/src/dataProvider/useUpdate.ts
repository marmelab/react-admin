import {
    useQueryClient,
    type UseMutationResult,
    type MutateOptions,
    type UseInfiniteQueryResult,
    type InfiniteData,
    UseMutationOptions,
} from '@tanstack/react-query';

import { useDataProvider } from './useDataProvider';
import type {
    RaRecord,
    UpdateParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
    DataProvider,
    UpdateResult,
} from '../types';
import { useMutationWithMutationMode } from './useMutationWithMutationMode';
import { useEvent } from '../util';

/**
 * Get a callback to call the dataProvider.update() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The update parameters { id, data, previousData, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.id The resource identifier, e.g. 123
 * @prop params.data The updates to merge into the record, e.g. { views: 10 }
 * @prop params.previousData The record before the update is applied
 * @prop params.meta Optional meta data
 *
 * @returns The current mutation state. Destructure as [update, { data, error, isPending }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [update, { isPending: false, isIdle: true }]
 * - start:   [update, { isPending: true }]
 * - success: [update, { data: [data from response], isPending: false, isSuccess: true }]
 * - error:   [update, { error: [error from response], isPending: false, isError: true }]
 *
 * The update() function must be called with a resource and a parameter object: update(resource, { id, data, previousData }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query-v3.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the update callback
 *
 * import { useUpdate, useRecordContext } from 'react-admin';
 *
 * const IncreaseLikeButton = () => {
 *     const record = useRecordContext();
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { isPending, error }] = useUpdate();
 *     const handleClick = () => {
 *         update('likes', { id: record.id, data: diff, previousData: record })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Like</div>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdate, useRecordContext } from 'react-admin';
 *
 * const IncreaseLikeButton = () => {
 *     const record = useRecordContext();
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { isPending, error }] = useUpdate('likes', { id: record.id, data: diff, previousData: record });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={() => update()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [update, { data }] = useUpdate<Product>('products', { id, data: diff, previousData: product });
 *                    \-- data is Product
 */
export const useUpdate = <RecordType extends RaRecord = any, ErrorType = Error>(
    resource?: string,
    params: Partial<UpdateParams<RecordType>> = {},
    options: UseUpdateOptions<RecordType, ErrorType> = {}
): UseUpdateResult<RecordType, boolean, ErrorType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const {
        mutationMode = 'pessimistic',
        getMutateWithMiddlewares,
        ...mutationOptions
    } = options;

    const dataProviderUpdate = useEvent(
        (resource: string, params: UpdateParams<RecordType>) =>
            dataProvider.update<RecordType>(resource, params)
    );

    const [mutate, mutationResult] = useMutationWithMutationMode<
        ErrorType,
        UpdateResult<RecordType>,
        UseUpdateMutateParams<RecordType>
    >(
        { resource, ...params },
        {
            ...mutationOptions,
            mutationKey: [resource, 'update', params],
            mutationMode,
            mutationFn: ({ resource, ...params }) => {
                if (resource == null) {
                    throw new Error('useUpdate mutation requires a resource');
                }
                if (params.id == null) {
                    throw new Error(
                        'useUpdate mutation requires a non-empty id'
                    );
                }
                if (!params.data) {
                    throw new Error(
                        'useUpdate mutation requires a non-empty data object'
                    );
                }
                return dataProviderUpdate(
                    resource,
                    params as UpdateParams<RecordType>
                );
            },
            updateCache: (
                { resource, ...params },
                { mutationMode },
                result
            ) => {
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
                        mutationMode === 'pessimistic' ? result : params?.data
                    )
                );

                const updateColl = (old: RecordType[]) => {
                    if (!old) return old;
                    const index = old.findIndex(
                        // eslint-disable-next-line eqeqeq
                        record => record.id == params?.id
                    );
                    if (index === -1) {
                        return old;
                    }
                    return [
                        ...old.slice(0, index),
                        { ...old[index], ...clonedData } as RecordType,
                        ...old.slice(index + 1),
                    ];
                };

                type GetListResult = Omit<OriginalGetListResult, 'data'> & {
                    data?: RecordType[];
                };

                const previousRecord = queryClient.getQueryData<RecordType>([
                    resource,
                    'getOne',
                    { id: String(params?.id), meta: params?.meta },
                ]);

                queryClient.setQueryData(
                    [
                        resource,
                        'getOne',
                        { id: String(params?.id), meta: params?.meta },
                    ],
                    (record: RecordType) => ({
                        ...record,
                        ...clonedData,
                    }),
                    { updatedAt }
                );
                queryClient.setQueriesData(
                    { queryKey: [resource, 'getList'] },
                    (res: GetListResult) =>
                        res && res.data
                            ? { ...res, data: updateColl(res.data) }
                            : res,
                    { updatedAt }
                );
                queryClient.setQueriesData(
                    { queryKey: [resource, 'getInfiniteList'] },
                    (
                        res: UseInfiniteQueryResult<
                            InfiniteData<GetInfiniteListResult>
                        >['data']
                    ) =>
                        res && res.pages
                            ? {
                                  ...res,
                                  pages: res.pages.map(page => ({
                                      ...page,
                                      data: updateColl(page.data),
                                  })),
                              }
                            : res,
                    { updatedAt }
                );
                queryClient.setQueriesData(
                    { queryKey: [resource, 'getMany'] },
                    (coll: RecordType[]) =>
                        coll && coll.length > 0 ? updateColl(coll) : coll,
                    { updatedAt }
                );
                queryClient.setQueriesData(
                    { queryKey: [resource, 'getManyReference'] },
                    (res: GetListResult) =>
                        res && res.data
                            ? { ...res, data: updateColl(res.data) }
                            : res,
                    { updatedAt }
                );

                const optimisticResult = {
                    ...previousRecord,
                    ...clonedData,
                };
                return optimisticResult;
            },
            getQueryKeys: ({ resource, ...params }) => {
                const queryKeys = [
                    [
                        resource,
                        'getOne',
                        { id: String(params?.id), meta: params?.meta },
                    ],
                    [resource, 'getList'],
                    [resource, 'getInfiniteList'],
                    [resource, 'getMany'],
                    [resource, 'getManyReference'],
                ];
                return queryKeys;
            },
            getMutateWithMiddlewares: mutationFn => {
                if (getMutateWithMiddlewares) {
                    // Immediately get the function with middlewares applied so that even if the middlewares gets unregistered (because of a redirect for instance),
                    // we still have them applied when users have called the mutate function.
                    const mutateWithMiddlewares = getMutateWithMiddlewares(
                        dataProviderUpdate.bind(dataProvider)
                    );
                    return args => {
                        // This is necessary to avoid breaking changes in useUpdate:
                        // The mutation function must have the same signature as before (resource, params) and not ({ resource, params })
                        const { resource, ...params } = args;
                        return mutateWithMiddlewares(resource, params);
                    };
                }

                return args => mutationFn(args);
            },
        }
    );

    const update = useEvent(
        (
            callTimeResource: string | undefined = resource,
            callTimeParams: Partial<UpdateParams<RecordType>> = {},
            callTimeOptions: MutateOptions<
                RecordType,
                ErrorType,
                Partial<UseUpdateMutateParams<RecordType>>,
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

    return [update, mutationResult];
};

export interface UseUpdateMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    id?: RecordType['id'];
    data?: Partial<RecordType>;
    previousData?: any;
    meta?: any;
}

export type UseUpdateOptions<
    RecordType extends RaRecord = any,
    ErrorType = Error,
> = Omit<
    UseMutationOptions<
        RecordType,
        ErrorType,
        Partial<UseUpdateMutateParams<RecordType>>
    >,
    'mutationFn'
> & {
    mutationMode?: MutationMode;
    returnPromise?: boolean;
    getMutateWithMiddlewares?: <
        UpdateFunctionType extends
            DataProvider['update'] = DataProvider['update'],
    >(
        mutate: UpdateFunctionType
    ) => (
        ...Params: Parameters<UpdateFunctionType>
    ) => ReturnType<UpdateFunctionType>;
};

export type UpdateMutationFunction<
    RecordType extends RaRecord = any,
    TReturnPromise extends boolean = boolean,
    ErrorType = Error,
> = (
    resource?: string,
    params?: Partial<UpdateParams<RecordType>>,
    options?: MutateOptions<
        RecordType,
        ErrorType,
        Partial<UseUpdateMutateParams<RecordType>>,
        unknown
    > & { mutationMode?: MutationMode; returnPromise?: TReturnPromise }
) => Promise<TReturnPromise extends true ? RecordType : void>;

export type UseUpdateResult<
    RecordType extends RaRecord = any,
    TReturnPromise extends boolean = boolean,
    ErrorType = Error,
> = [
    UpdateMutationFunction<RecordType, TReturnPromise, ErrorType>,
    UseMutationResult<
        RecordType,
        ErrorType,
        Partial<UpdateParams<RecordType> & { resource?: string }>,
        unknown
    > & { isLoading: boolean },
];
