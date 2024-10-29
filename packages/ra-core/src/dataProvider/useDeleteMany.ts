import { useMemo, useRef } from 'react';
import {
    useMutation,
    useQueryClient,
    UseMutationOptions,
    UseMutationResult,
    MutateOptions,
    QueryKey,
    UseInfiniteQueryResult,
    InfiniteData,
} from '@tanstack/react-query';

import { useDataProvider } from './useDataProvider';
import { useAddUndoableMutation } from './undo/useAddUndoableMutation';
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
 * @returns The current mutation state. Destructure as [deleteMany, { data, error, isPending }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [deleteMany, { isPending: false, isIdle: true }]
 * - start:   [deleteMany, { isPending: true }]
 * - success: [deleteMany, { data: [data from response], isPending: false, isSuccess: true }]
 * - error:   [deleteMany, { error: [error from response], isPending: false, isError: true }]
 *
 * The deleteMany() function must be called with a resource and a parameter object: deleteMany(resource, { ids, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://tanstack.com/query/v5/docs/react/reference/useMutation
 *
 * @example // set params when calling the deleteMany callback
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { isPending, error }] = useDeleteMany();
 *     const handleClick = () => {
 *         deleteMany('posts', { ids: selectedIds })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { isPending, error }] = useDeleteMany('posts', { ids: selectedIds });
 *     const handleClick = () => {
 *         deleteMany()
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
 * };
 *
 * @example // TypeScript
 * const [deleteMany, { data }] = useDeleteMany<Product>('products', { ids });
 *                        \-- data is Product
 */
export const useDeleteMany = <
    RecordType extends RaRecord = any,
    MutationError = unknown,
>(
    resource?: string,
    params: Partial<DeleteManyParams<RecordType>> = {},
    options: UseDeleteManyOptions<RecordType, MutationError> = {}
): UseDeleteManyResult<RecordType, MutationError> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const addUndoableMutation = useAddUndoableMutation();
    const { ids } = params;
    const { mutationMode = 'pessimistic', ...mutationOptions } = options;
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef = useRef<Partial<DeleteManyParams<RecordType>>>({});
    const snapshot = useRef<Snapshot>([]);
    const hasCallTimeOnError = useRef(false);
    const hasCallTimeOnSuccess = useRef(false);
    const hasCallTimeOnSettled = useRef(false);

    const updateCache = ({ resource, ids }) => {
        // hack: only way to tell react-query not to fetch this query for the next 5 seconds
        // because setQueryData doesn't accept a stale time option
        const now = Date.now();
        const updatedAt = mode.current === 'undoable' ? now + 5 * 1000 : now;

        const updateColl = (old: RecordType[]) => {
            if (!old) return old;
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
            { queryKey: [resource, 'getList'] },
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
            { queryKey: [resource, 'getInfiniteList'] },
            (
                res: UseInfiniteQueryResult<
                    InfiniteData<GetInfiniteListResult>
                >['data']
            ) => {
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
            { queryKey: [resource, 'getMany'] },
            (coll: RecordType[]) =>
                coll && coll.length > 0 ? updateColl(coll) : coll,
            { updatedAt }
        );
        queryClient.setQueriesData(
            { queryKey: [resource, 'getManyReference'] },
            (res: GetListResult) => {
                if (!res || !res.data) return res;
                const newCollection = updateColl(res.data);
                const recordWasFound = newCollection.length < res.data.length;
                if (!recordWasFound) {
                    return res;
                }
                if (res.total) {
                    return {
                        data: newCollection,
                        total:
                            res.total -
                            (res.data.length - newCollection.length),
                    };
                }
                if (res.pageInfo) {
                    return {
                        data: newCollection,
                        pageInfo: res.pageInfo,
                    };
                }
                throw new Error(
                    'Found getList result in cache without total or pageInfo'
                );
            },
            { updatedAt }
        );
    };

    const mutation = useMutation<
        RecordType['id'][],
        MutationError,
        Partial<UseDeleteManyMutateParams<RecordType>>
    >({
        mutationFn: ({
            resource: callTimeResource = resource,
            ids: callTimeIds = paramsRef.current.ids,
            meta: callTimeMeta = paramsRef.current.meta,
        } = {}) => {
            if (!callTimeResource) {
                throw new Error(
                    'useDeleteMany mutation requires a non-empty resource'
                );
            }
            if (!callTimeIds) {
                throw new Error(
                    'useDeleteMany mutation requires an array of ids'
                );
            }
            if (callTimeIds.length === 0) {
                return Promise.resolve([]);
            }
            return dataProvider
                .deleteMany<RecordType>(callTimeResource, {
                    ids: callTimeIds,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data || []);
        },
        ...mutationOptions,
        onMutate: async (
            variables: Partial<UseDeleteManyMutateParams<RecordType>>
        ) => {
            if (mutationOptions.onMutate) {
                const userContext =
                    (await mutationOptions.onMutate(variables)) || {};
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
            if (mode.current === 'optimistic' || mode.current === 'undoable') {
                // If the mutation fails, use the context returned from onMutate to rollback
                context.snapshot.forEach(([key, value]) => {
                    queryClient.setQueryData(key, value);
                });
            }

            if (mutationOptions.onError && !hasCallTimeOnError.current) {
                return mutationOptions.onError(error, variables, context);
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

                if (
                    mutationOptions.onSuccess &&
                    !hasCallTimeOnSuccess.current
                ) {
                    mutationOptions.onSuccess(data, variables, context);
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
            if (mode.current === 'optimistic' || mode.current === 'undoable') {
                // Always refetch after error or success:
                context.snapshot.forEach(([queryKey]) => {
                    queryClient.invalidateQueries({ queryKey });
                });
            }

            if (mutationOptions.onSettled && !hasCallTimeOnSettled.current) {
                return mutationOptions.onSettled(
                    data,
                    error,
                    variables,
                    context
                );
            }
        },
    });

    const mutate = async (
        callTimeResource: string | undefined = resource,
        callTimeParams: Partial<DeleteManyParams<RecordType>> = {},
        callTimeOptions: MutateOptions<
            RecordType['id'][],
            unknown,
            Partial<UseDeleteManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode } = {}
    ) => {
        const { mutationMode, ...otherCallTimeOptions } = callTimeOptions;
        hasCallTimeOnError.current = !!callTimeOptions.onError;
        hasCallTimeOnSuccess.current = !!callTimeOptions.onSuccess;
        hasCallTimeOnSettled.current = !!callTimeOptions.onSettled;
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
                {
                    onSuccess: otherCallTimeOptions.onSuccess,
                    onSettled: otherCallTimeOptions.onSettled,
                    onError: otherCallTimeOptions.onError,
                }
            );
        }

        const { ids: callTimeIds = ids } = callTimeParams;
        if (!callTimeIds) {
            throw new Error('useDeleteMany mutation requires an array of ids');
        }

        // optimistic update as documented in https://react-query-v5.tanstack.com/guides/optimistic-updates
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
         * @see https://tanstack.com/query/v5/docs/react/reference/QueryClient#queryclientgetqueriesdata
         */
        snapshot.current = queryKeys.reduce(
            (prev, queryKey) =>
                prev.concat(queryClient.getQueriesData({ queryKey })),
            [] as Snapshot
        );

        // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
        await Promise.all(
            snapshot.current.map(([queryKey]) =>
                queryClient.cancelQueries({ queryKey })
            )
        );

        // Optimistically update to the new value
        updateCache({
            resource: callTimeResource,
            ids: callTimeIds,
        });

        // run the success callbacks during the next tick
        setTimeout(() => {
            if (otherCallTimeOptions.onSuccess) {
                otherCallTimeOptions.onSuccess(
                    callTimeIds,
                    { resource: callTimeResource, ...callTimeParams },
                    { snapshot: snapshot.current }
                );
            } else if (mutationOptions.onSuccess) {
                mutationOptions.onSuccess(
                    callTimeIds,
                    { resource: callTimeResource, ...callTimeParams },
                    { snapshot: snapshot.current }
                );
            }
        }, 0);

        if (mode.current === 'optimistic') {
            // call the mutate method without success side effects
            return mutation.mutate(
                { resource: callTimeResource, ...callTimeParams },
                {
                    onSettled: otherCallTimeOptions.onSettled,
                    onError: otherCallTimeOptions.onError,
                }
            );
        } else {
            // Undoable mutation: add the mutation to the undoable queue.
            // The Notification component will dequeue it when the user confirms or cancels the message.
            addUndoableMutation(({ isUndo }) => {
                if (isUndo) {
                    // rollback
                    snapshot.current.forEach(([key, value]) => {
                        queryClient.setQueryData(key, value);
                    });
                } else {
                    // call the mutate method without success side effects
                    mutation.mutate(
                        { resource: callTimeResource, ...callTimeParams },
                        {
                            onSettled: otherCallTimeOptions.onSettled,
                            onError: otherCallTimeOptions.onError,
                        }
                    );
                }
            });
        }
    };

    const mutationResult = useMemo(
        () => ({
            isLoading: mutation.isPending,
            ...mutation,
        }),
        [mutation]
    );

    return [useEvent(mutate), mutationResult];
};

type Snapshot = [key: QueryKey, value: any][];

export interface UseDeleteManyMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    ids?: RecordType['id'][];
    meta?: any;
}

export type UseDeleteManyOptions<
    RecordType extends RaRecord = any,
    MutationError = unknown,
> = UseMutationOptions<
    RecordType['id'][],
    MutationError,
    Partial<UseDeleteManyMutateParams<RecordType>>
> & { mutationMode?: MutationMode };

export type UseDeleteManyResult<
    RecordType extends RaRecord = any,
    MutationError = unknown,
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
    > & { isLoading: boolean },
];
