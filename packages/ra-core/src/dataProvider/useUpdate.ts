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
import undoableEventEmitter from './undoableEventEmitter';
import {
    RaRecord,
    UpdateParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
} from '../types';
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
export const useUpdate = <RecordType extends RaRecord = any>(
    resource?: string,
    params: Partial<UpdateParams<RecordType>> = {},
    options: UseUpdateOptions<RecordType> = {}
): UseUpdateResult<RecordType, boolean> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { id, data, meta } = params;
    const { mutationMode = 'pessimistic', ...mutationOptions } = options;
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef = useRef<Partial<UpdateParams<RecordType>>>(params);
    const snapshot = useRef<Snapshot>([]);
    const hasCallTimeOnError = useRef(false);
    const hasCallTimeOnSuccess = useRef(false);
    const hasCallTimeOnSettled = useRef(false);

    const updateCache = ({ resource, id, data }) => {
        // hack: only way to tell react-query not to fetch this query for the next 5 seconds
        // because setQueryData doesn't accept a stale time option
        const now = Date.now();
        const updatedAt = mode.current === 'undoable' ? now + 5 * 1000 : now;

        const updateColl = (old: RecordType[]) => {
            if (!old) return;
            const index = old.findIndex(
                // eslint-disable-next-line eqeqeq
                record => record.id == id
            );
            if (index === -1) {
                return old;
            }
            return [
                ...old.slice(0, index),
                { ...old[index], ...data },
                ...old.slice(index + 1),
            ];
        };

        type GetListResult = Omit<OriginalGetListResult, 'data'> & {
            data?: RecordType[];
        };

        queryClient.setQueryData(
            [resource, 'getOne', { id: String(id), meta }],
            (record: RecordType) => ({ ...record, ...data }),
            { updatedAt }
        );
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
        RecordType,
        Error,
        Partial<UseUpdateMutateParams<RecordType>>
    >({
        mutationFn: ({
            resource: callTimeResource = resource,
            id: callTimeId = paramsRef.current.id,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
            previousData: callTimePreviousData = paramsRef.current.previousData,
        } = {}) =>
            dataProvider
                .update<RecordType>(callTimeResource, {
                    id: callTimeId,
                    data: callTimeData,
                    previousData: callTimePreviousData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data),
        ...mutationOptions,
        onMutate: async (
            variables: Partial<UseUpdateMutateParams<RecordType>>
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
        onError: (error, variables = {}, context: { snapshot: Snapshot }) => {
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
            data: RecordType,
            variables: Partial<UseUpdateMutateParams<RecordType>> = {},
            context: unknown
        ) => {
            if (mode.current === 'pessimistic') {
                // update the getOne and getList query cache with the new result
                const {
                    resource: callTimeResource = resource,
                    id: callTimeId = id,
                } = variables;
                updateCache({
                    resource: callTimeResource,
                    id: callTimeId,
                    data,
                });

                if (
                    mutationOptions.onSuccess &&
                    !hasCallTimeOnSuccess.current
                ) {
                    mutationOptions.onSuccess(data, variables, context);
                }
            }
        },
        onSettled: (
            data,
            error,
            variables = {},
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

    const update = async (
        callTimeResource: string = resource,
        callTimeParams: Partial<UpdateParams<RecordType>> = {},
        callTimeOptions: MutateOptions<
            RecordType,
            unknown,
            Partial<UseUpdateMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode; returnPromise?: boolean } = {}
    ) => {
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
            id: callTimeId = id,
            data: callTimeData = data,
            meta: callTimeMeta = meta,
        } = callTimeParams;

        // optimistic update as documented in https://react-query-v3.tanstack.com/guides/optimistic-updates
        // except we do it in a mutate wrapper instead of the onMutate callback
        // to have access to success side effects

        const previousRecord = queryClient.getQueryData<RecordType>([
            callTimeResource,
            'getOne',
            { id: String(callTimeId), meta: callTimeMeta },
        ]);

        const queryKeys = [
            [
                callTimeResource,
                'getOne',
                { id: String(callTimeId), meta: callTimeMeta },
            ],
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
         * @see https://react-query-v3.tanstack.com/reference/QueryClient#queryclientgetqueriesdata
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
            id: callTimeId,
            data: callTimeData,
        });

        // run the success callbacks during the next tick
        if (otherCallTimeOptions.onSuccess) {
            setTimeout(
                () =>
                    otherCallTimeOptions.onSuccess(
                        { ...previousRecord, ...callTimeData },
                        { resource: callTimeResource, ...callTimeParams },
                        { snapshot: snapshot.current }
                    ),
                0
            );
        } else if (mutationOptions.onSuccess && !hasCallTimeOnSuccess.current) {
            setTimeout(
                () =>
                    mutationOptions.onSuccess(
                        { ...previousRecord, ...callTimeData },
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
                {
                    onSettled: otherCallTimeOptions.onSettled,
                    onError: otherCallTimeOptions.onError,
                }
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

    return [useEvent(update), mutationResult];
};

type Snapshot = [key: QueryKey, value: any][];

export interface UseUpdateMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    id?: RecordType['id'];
    data?: Partial<RecordType>;
    previousData?: any;
    meta?: any;
}

export type UseUpdateOptions<
    RecordType extends RaRecord = any
> = UseMutationOptions<
    RecordType,
    Error,
    Partial<Omit<UseUpdateMutateParams<RecordType>, 'mutationFn'>>
> & { mutationMode?: MutationMode; returnPromise?: boolean };

export type UpdateMutationFunction<
    RecordType extends RaRecord = any,
    TReturnPromise extends boolean = boolean
> = (
    resource?: string,
    params?: Partial<UpdateParams<RecordType>>,
    options?: MutateOptions<
        RecordType,
        Error,
        Partial<UseUpdateMutateParams<RecordType>>,
        unknown
    > & { mutationMode?: MutationMode; returnPromise?: TReturnPromise }
) => Promise<TReturnPromise extends true ? RecordType : void>;

export type UseUpdateResult<
    RecordType extends RaRecord = any,
    TReturnPromise extends boolean = boolean
> = [
    UpdateMutationFunction<RecordType, TReturnPromise>,
    UseMutationResult<
        RecordType,
        Error,
        Partial<UpdateParams<RecordType> & { resource?: string }>,
        unknown
    >
];
