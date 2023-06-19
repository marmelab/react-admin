import { useRef } from 'react';
import {
    useMutation,
    useQueryClient,
    UseMutationOptions,
    UseMutationResult,
    MutateOptions,
    QueryKey,
    UseInfiniteQueryResult,
} from 'react-query';

import { useDataProvider } from './useDataProvider';
import undoableEventEmitter from './undoableEventEmitter';
import {
    RaRecord,
    DeleteManyParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
} from '../types';
import { useEvent } from '../util';

/**
 * Get a callback to call the dataProvider.delete() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The delete parameters { ids }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.ids The resource identifiers, e.g. [123, 456]
 *
 * @returns The current mutation state. Destructure as [deleteMany, { data, error, isLoading }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [deleteMany, { isLoading: false, isIdle: true }]
 * - start:   [deleteMany, { isLoading: true }]
 * - success: [deleteMany, { data: [data from response], isLoading: false, isSuccess: true }]
 * - error:   [deleteMany, { error: [error from response], isLoading: false, isError: true }]
 *
 * The deleteMany() function must be called with a resource and a parameter object: deleteMany(resource, { ids, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query-v3.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the deleteMany callback
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { isLoading, error }] = useDeleteMany();
 *     const handleClick = () => {
 *         deleteMany('posts', { ids: selectedIds })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Delete selected posts</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { isLoading, error }] = useDeleteMany('posts', { ids: selectedIds });
 *     const handleClick = () => {
 *         deleteMany()
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Delete selected posts</button>;
 * };
 *
 * @example // TypeScript
 * const [deleteMany, { data }] = useDeleteMany<Product>('products', { ids });
 *                        \-- data is Product
 */
export const useDeleteMany = <
    RecordType extends RaRecord = any,
    MutationError = unknown
>(
    resource?: string,
    params: Partial<DeleteManyParams<RecordType>> = {},
    options: UseDeleteManyOptions<RecordType, MutationError> = {}
): UseDeleteManyResult<RecordType, MutationError> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { ids } = params;
    const { mutationMode = 'pessimistic', ...reactMutationOptions } = options;
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef = useRef<Partial<DeleteManyParams<RecordType>>>({});
    const snapshot = useRef<Snapshot>([]);

    const updateCache = ({ resource, ids }) => {
        // hack: only way to tell react-query not to fetch this query for the next 5 seconds
        // because setQueryData doesn't accept a stale time option
        const now = Date.now();
        const updatedAt = mode.current === 'undoable' ? now + 5 * 1000 : now;

        const updateColl = (old: RecordType[]) => {
            if (!old) return;
            let newCollection = [...old];
            ids.forEach(id => {
                const index = newCollection.findIndex(
                    // eslint-disable-next-line eqeqeq
                    record => record.id == id
                );
                if (index === -1) {
                    return;
                }
                newCollection = [
                    ...newCollection.slice(0, index),
                    ...newCollection.slice(index + 1),
                ];
            });
            return newCollection;
        };

        type GetListResult = Omit<OriginalGetListResult, 'data'> & {
            data?: RecordType[];
        };

        queryClient.setQueriesData(
            [resource, 'getList'],
            (res: GetListResult) => {
                if (!res || !res.data) return res;
                const newCollection = updateColl(res.data);
                const recordWasFound = newCollection.length < res.data.length;
                return recordWasFound
                    ? {
                          data: newCollection,
                          total: res.total
                              ? res.total -
                                (res.data.length - newCollection.length)
                              : undefined,
                          pageInfo: res.pageInfo,
                      }
                    : res;
            },
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getInfiniteList'],
            (res: UseInfiniteQueryResult<GetInfiniteListResult>['data']) => {
                if (!res || !res.pages) return res;
                return {
                    ...res,
                    pages: res.pages.map(page => {
                        const newCollection = updateColl(page.data);
                        const recordWasFound =
                            newCollection.length < page.data.length;
                        return recordWasFound
                            ? {
                                  ...page,
                                  data: newCollection,
                                  total: page.total
                                      ? page.total -
                                        (page.data.length -
                                            newCollection.length)
                                      : undefined,
                                  pageInfo: page.pageInfo,
                              }
                            : page;
                    }),
                };
            },
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getMany'],
            (coll: RecordType[]) =>
                coll && coll.length > 0 ? updateColl(coll) : coll,
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getManyReference'],
            (res: GetListResult) => {
                if (!res || !res.data) return res;
                const newCollection = updateColl(res.data);
                const recordWasFound = newCollection.length < res.data.length;
                return recordWasFound
                    ? {
                          data: newCollection,
                          total:
                              res.total -
                              (res.data.length - newCollection.length),
                      }
                    : res;
            },
            { updatedAt }
        );
    };

    const mutation = useMutation<
        RecordType['id'][],
        MutationError,
        Partial<UseDeleteManyMutateParams<RecordType>>
    >(
        ({
            resource: callTimeResource = resource,
            ids: callTimeIds = paramsRef.current.ids,
            meta: callTimeMeta = paramsRef.current.meta,
        } = {}) =>
            dataProvider
                .deleteMany<RecordType>(callTimeResource, {
                    ids: callTimeIds,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data),
        {
            ...reactMutationOptions,
            onMutate: async (
                variables: Partial<UseDeleteManyMutateParams<RecordType>>
            ) => {
                if (reactMutationOptions.onMutate) {
                    const userContext =
                        (await reactMutationOptions.onMutate(variables)) || {};
                    return {
                        snapshot: snapshot.current,
                        // @ts-ignore
                        ...userContext,
                    };
                } else {
                    // Return a context object with the snapshot value
                    return { snapshot: snapshot.current };
                }
            },
            onError: (
                error: MutationError,
                variables: Partial<UseDeleteManyMutateParams<RecordType>> = {},
                context: { snapshot: Snapshot }
            ) => {
                if (
                    mode.current === 'optimistic' ||
                    mode.current === 'undoable'
                ) {
                    // If the mutation fails, use the context returned from onMutate to rollback
                    context.snapshot.forEach(([key, value]) => {
                        queryClient.setQueryData(key, value);
                    });
                }

                if (reactMutationOptions.onError) {
                    return reactMutationOptions.onError(
                        error,
                        variables,
                        context
                    );
                }
                // call-time error callback is executed by react-query
            },
            onSuccess: (
                data: RecordType['id'][],
                variables: Partial<UseDeleteManyMutateParams<RecordType>> = {},
                context: unknown
            ) => {
                if (mode.current === 'pessimistic') {
                    // update the getOne and getList query cache with the new result
                    const {
                        resource: callTimeResource = resource,
                        ids: callTimeIds = ids,
                    } = variables;
                    updateCache({
                        resource: callTimeResource,
                        ids: callTimeIds,
                    });

                    if (reactMutationOptions.onSuccess) {
                        reactMutationOptions.onSuccess(
                            data,
                            variables,
                            context
                        );
                    }
                    // call-time success callback is executed by react-query
                }
            },
            onSettled: (
                data: RecordType['id'][],
                error: MutationError,
                variables: Partial<UseDeleteManyMutateParams<RecordType>> = {},
                context: { snapshot: Snapshot }
            ) => {
                if (
                    mode.current === 'optimistic' ||
                    mode.current === 'undoable'
                ) {
                    // Always refetch after error or success:
                    context.snapshot.forEach(([key]) => {
                        queryClient.invalidateQueries(key);
                    });
                }

                if (reactMutationOptions.onSettled) {
                    return reactMutationOptions.onSettled(
                        data,
                        error,
                        variables,
                        context
                    );
                }
            },
        }
    );

    const mutate = async (
        callTimeResource: string = resource,
        callTimeParams: Partial<DeleteManyParams<RecordType>> = {},
        updateOptions: MutateOptions<
            RecordType['id'][],
            unknown,
            Partial<UseDeleteManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode } = {}
    ) => {
        const { mutationMode, onSuccess, onSettled, onError } = updateOptions;

        // store the hook time params *at the moment of the call*
        // because they may change afterwards, which would break the undoable mode
        // as the previousData would be overwritten by the optimistic update
        paramsRef.current = params;

        if (mutationMode) {
            mode.current = mutationMode;
        }

        if (mode.current === 'pessimistic') {
            return mutation.mutate(
                { resource: callTimeResource, ...callTimeParams },
                { onSuccess, onSettled, onError }
            );
        }

        const { ids: callTimeIds = ids } = callTimeParams;

        // optimistic update as documented in https://react-query-v3.tanstack.com/guides/optimistic-updates
        // except we do it in a mutate wrapper instead of the onMutate callback
        // to have access to success side effects

        const queryKeys = [
            [callTimeResource, 'getList'],
            [callTimeResource, 'getInfiniteList'],
            [callTimeResource, 'getMany'],
            [callTimeResource, 'getManyReference'],
        ];

        /**
         * Snapshot the previous values via queryClient.getQueriesData()
         *
         * The snapshotData ref will contain an array of tuples [query key, associated data]
         *
         * @example
         * [
         *   [['posts', 'getList'], { data: [{ id: 1, title: 'Hello' }], total: 1 }],
         *   [['posts', 'getMany'], [{ id: 1, title: 'Hello' }]],
         * ]
         *
         * @see https://react-query-v3.tanstack.com/reference/QueryClient#queryclientgetqueriesdata
         */
        snapshot.current = queryKeys.reduce(
            (prev, curr) => prev.concat(queryClient.getQueriesData(curr)),
            [] as Snapshot
        );

        // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
        await Promise.all(
            snapshot.current.map(([key]) => queryClient.cancelQueries(key))
        );

        // Optimistically update to the new value
        updateCache({
            resource: callTimeResource,
            ids: callTimeIds,
        });

        // run the success callbacks during the next tick
        if (onSuccess) {
            setTimeout(
                () =>
                    onSuccess(
                        callTimeIds,
                        { resource: callTimeResource, ...callTimeParams },
                        { snapshot: snapshot.current }
                    ),
                0
            );
        }
        if (reactMutationOptions.onSuccess) {
            setTimeout(
                () =>
                    reactMutationOptions.onSuccess(
                        callTimeIds,
                        { resource: callTimeResource, ...callTimeParams },
                        { snapshot: snapshot.current }
                    ),
                0
            );
        }

        if (mode.current === 'optimistic') {
            // call the mutate method without success side effects
            return mutation.mutate(
                { resource: callTimeResource, ...callTimeParams },
                { onSettled, onError }
            );
        } else {
            // undoable mutation: register the mutation for later
            undoableEventEmitter.once('end', ({ isUndo }) => {
                if (isUndo) {
                    // rollback
                    snapshot.current.forEach(([key, value]) => {
                        queryClient.setQueryData(key, value);
                    });
                } else {
                    // call the mutate method without success side effects
                    mutation.mutate(
                        { resource: callTimeResource, ...callTimeParams },
                        { onSettled, onError }
                    );
                }
            });
        }
    };

    return [useEvent(mutate), mutation];
};

type Snapshot = [key: QueryKey, value: any][];

export interface UseDeleteManyMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    ids?: RecordType['id'][];
    meta?: any;
}

export type UseDeleteManyOptions<
    RecordType extends RaRecord = any,
    MutationError = unknown
> = UseMutationOptions<
    RecordType['id'][],
    MutationError,
    Partial<UseDeleteManyMutateParams<RecordType>>
> & { mutationMode?: MutationMode };

export type UseDeleteManyResult<
    RecordType extends RaRecord = any,
    MutationError = unknown
> = [
    (
        resource?: string,
        params?: Partial<DeleteManyParams<RecordType>>,
        options?: MutateOptions<
            RecordType['id'][],
            MutationError,
            Partial<UseDeleteManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode }
    ) => Promise<void>,
    UseMutationResult<
        RecordType['id'][],
        MutationError,
        Partial<DeleteManyParams<RecordType> & { resource?: string }>,
        unknown
    >
];
