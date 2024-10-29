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
    UpdateManyParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
} from '../types';
import { useEvent } from '../util';
import { Identifier } from '..';

/**
 * Get a callback to call the dataProvider.updateMany() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The updateMany parameters { ids, data, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.ids The resource identifiers, e.g. [123, 456]
 * @prop params.data The updates to merge into the record, e.g. { views: 10 }
 * @prop params.meta Optional meta parameters
 *
 * @returns The current mutation state. Destructure as [updateMany, { data, error, isPending }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [updateMany, { isPending: false, isIdle: true }]
 * - start:   [updateMany, { isPending: true }]
 * - success: [updateMany, { data: [data from response], isPending: false, isSuccess: true }]
 * - error:   [updateMany, { error: [error from response], isPending: false, isError: true }]
 *
 * The updateMany() function must be called with a resource and a parameter object: updateMany(resource, { ids, data, previousData }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://tanstack.com/query/v5/docs/react/reference/useMutation
 *
 * @example // set params when calling the updateMany callback
 *
 * import { useUpdateMany, useListContext } from 'react-admin';
 *
 * const BulkResetViewsButton = () => {
 *     const { selectedIds } = useListContext();
 *     const [updateMany, { isPending, error }] = useUpdateMany();
 *     const handleClick = () => {
 *         updateMany('posts', { ids: selectedIds, data: { views: 0 } });
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Reset views</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdateMany, useListContext } from 'react-admin';
 *
 * const BulkResetViewsButton = () => {
 *     const { selectedIds } = useListContext();
 *     const [updateMany, { isPending, error }] = useUpdateMany('posts', { ids: selectedIds, data: { views: 0 } });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={() => updateMany()}>Reset views</button>;
 * };
 */
export const useUpdateMany = <
    RecordType extends RaRecord = any,
    MutationError = unknown,
>(
    resource?: string,
    params: Partial<UpdateManyParams<Partial<RecordType>>> = {},
    options: UseUpdateManyOptions<RecordType, MutationError> = {}
): UseUpdateManyResult<RecordType, boolean, MutationError> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const addUndoableMutation = useAddUndoableMutation();
    const { ids, data, meta } = params;
    const { mutationMode = 'pessimistic', ...mutationOptions } = options;
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef =
        useRef<Partial<UpdateManyParams<Partial<RecordType>>>>(params);
    const snapshot = useRef<Snapshot>([]);
    const hasCallTimeOnError = useRef(false);
    const hasCallTimeOnSuccess = useRef(false);
    const hasCallTimeOnSettled = useRef(false);

    const updateCache = async ({
        resource,
        ids,
        data,
        meta,
    }: {
        resource: string;
        ids: Identifier[];
        data: any;
        meta?: any;
    }) => {
        // hack: only way to tell react-query not to fetch this query for the next 5 seconds
        // because setQueryData doesn't accept a stale time option
        const updatedAt =
            mode.current === 'undoable' ? Date.now() + 1000 * 5 : Date.now();
        // Stringify and parse the data to remove undefined values.
        // If we don't do this, an update with { id: undefined } as payload
        // would remove the id from the record, which no real data provider does.
        const clonedData = JSON.parse(JSON.stringify(data));

        const updateColl = (old: RecordType[]) => {
            if (!old) return old;
            let newCollection = [...old];
            ids.forEach(id => {
                // eslint-disable-next-line eqeqeq
                const index = old.findIndex(record => record.id == id);
                if (index === -1) {
                    return;
                }
                newCollection = [
                    ...newCollection.slice(0, index),
                    { ...newCollection[index], ...clonedData },
                    ...newCollection.slice(index + 1),
                ];
            });
            return newCollection;
        };

        type GetListResult = Omit<OriginalGetListResult, 'data'> & {
            data?: RecordType[];
        };

        ids.forEach(id => {
            queryClient.setQueryData(
                [resource, 'getOne', { id: String(id), meta }],
                (record: RecordType) => ({ ...record, ...clonedData }),
                { updatedAt }
            );
        });
        queryClient.setQueriesData(
            { queryKey: [resource, 'getList'] },
            (res: GetListResult) =>
                res && res.data ? { ...res, data: updateColl(res.data) } : res,
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
                    ? { data: updateColl(res.data), total: res.total }
                    : res,
            { updatedAt }
        );
    };

    const mutation = useMutation<
        Array<RecordType['id']>,
        MutationError,
        Partial<UseUpdateManyMutateParams<RecordType>>
    >({
        mutationFn: ({
            resource: callTimeResource = resource,
            ids: callTimeIds = paramsRef.current.ids,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
        } = {}) => {
            if (!callTimeResource) {
                throw new Error(
                    'useUpdateMany mutation requires a non-empty resource'
                );
            }
            if (!callTimeIds) {
                throw new Error(
                    'useUpdateMany mutation requires an array of ids'
                );
            }
            if (!callTimeData) {
                throw new Error(
                    'useUpdateMany mutation requires a non-empty data object'
                );
            }
            return dataProvider
                .updateMany<RecordType>(callTimeResource, {
                    ids: callTimeIds,
                    data: callTimeData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data || []);
        },
        ...mutationOptions,
        onMutate: async (
            variables: Partial<UseUpdateManyMutateParams<RecordType>>
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
            variables: Partial<UseUpdateManyMutateParams<RecordType>> = {},
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
            dataFromResponse: Array<RecordType['id']>,
            variables: Partial<UseUpdateManyMutateParams<RecordType>> = {},
            context: unknown
        ) => {
            if (mode.current === 'pessimistic') {
                // update the getOne and getList query cache with the new result
                const {
                    resource: callTimeResource = resource,
                    ids: callTimeIds = ids,
                    data: callTimeData = data,
                    meta: callTimeMeta = meta,
                } = variables;
                if (!callTimeResource) {
                    throw new Error(
                        'useUpdateMany mutation requires a non-empty resource'
                    );
                }
                if (!callTimeIds) {
                    throw new Error(
                        'useUpdateMany mutation requires an array of ids'
                    );
                }
                updateCache({
                    resource: callTimeResource,
                    ids: callTimeIds,
                    data: callTimeData,
                    meta: callTimeMeta,
                });

                if (
                    mutationOptions.onSuccess &&
                    !hasCallTimeOnSuccess.current
                ) {
                    mutationOptions.onSuccess(
                        dataFromResponse,
                        variables,
                        context
                    );
                }
            }
        },
        onSettled: (
            data: Array<RecordType['id']>,
            error: MutationError,
            variables: Partial<UseUpdateManyMutateParams<RecordType>> = {},
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

    const updateMany = async (
        callTimeResource: string | undefined = resource,
        callTimeParams: Partial<UpdateManyParams<RecordType>> = {},
        callTimeOptions: MutateOptions<
            Array<RecordType['id']>,
            unknown,
            Partial<UseUpdateManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode; returnPromise?: boolean } = {}
    ) => {
        if (!callTimeResource) {
            throw new Error(
                'useUpdateMany mutation requires a non-empty resource'
            );
        }
        const {
            mutationMode,
            returnPromise = mutationOptions.returnPromise,
            ...otherCallTimeOptions
        } = callTimeOptions;

        hasCallTimeOnError.current = !!otherCallTimeOptions.onError;
        hasCallTimeOnSuccess.current = !!otherCallTimeOptions.onSuccess;
        hasCallTimeOnSettled.current = !!otherCallTimeOptions.onSettled;

        // store the hook time params *at the moment of the call*
        // because they may change afterwards, which would break the undoable mode
        // as the previousData would be overwritten by the optimistic update
        paramsRef.current = params;

        if (mutationMode) {
            mode.current = mutationMode;
        }

        if (returnPromise && mode.current !== 'pessimistic') {
            console.warn(
                'The returnPromise parameter can only be used if the mutationMode is set to pessimistic'
            );
        }

        if (mode.current === 'pessimistic') {
            if (returnPromise) {
                return mutation.mutateAsync(
                    { resource: callTimeResource, ...callTimeParams },
                    otherCallTimeOptions
                );
            }
            return mutation.mutate(
                { resource: callTimeResource, ...callTimeParams },
                otherCallTimeOptions
            );
        }

        const {
            ids: callTimeIds = ids,
            data: callTimeData = data,
            meta: callTimeMeta = meta,
        } = callTimeParams;
        if (!callTimeIds) {
            throw new Error('useUpdateMany mutation requires an array of ids');
        }

        // optimistic update as documented in https://react-query-v5.tanstack.com/guides/optimistic-updates
        // except we do it in a mutate wrapper instead of the onMutate callback
        // to have access to success side effects

        const queryKeys = [
            [callTimeResource, 'getOne'],
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
         *   [['posts', 'getOne', { id: '1' }], { id: 1, title: 'Hello' }],
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

        // Optimistically update to the new data
        await updateCache({
            resource: callTimeResource,
            ids: callTimeIds,
            data: callTimeData,
            meta: callTimeMeta,
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

    return [useEvent(updateMany), mutationResult];
};

type Snapshot = [key: QueryKey, value: any][];

export interface UseUpdateManyMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    ids?: Array<RecordType['id']>;
    data?: Partial<RecordType>;
    previousData?: any;
    meta?: any;
}

export type UseUpdateManyOptions<
    RecordType extends RaRecord = any,
    MutationError = unknown,
> = UseMutationOptions<
    Array<RecordType['id']>,
    MutationError,
    Partial<Omit<UseUpdateManyMutateParams<RecordType>, 'mutationFn'>>
> & { mutationMode?: MutationMode; returnPromise?: boolean };

export type UseUpdateManyResult<
    RecordType extends RaRecord = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
> = [
    (
        resource?: string,
        params?: Partial<UpdateManyParams<RecordType>>,
        options?: MutateOptions<
            Array<RecordType['id']>,
            MutationError,
            Partial<UseUpdateManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode; returnPromise?: TReturnPromise }
    ) => Promise<TReturnPromise extends true ? Array<RecordType['id']> : void>,
    UseMutationResult<
        Array<RecordType['id']>,
        MutationError,
        Partial<UpdateManyParams<Partial<RecordType>> & { resource?: string }>,
        unknown
    > & { isLoading: boolean },
];
