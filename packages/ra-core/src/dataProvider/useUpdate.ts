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
    UpdateParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
    DataProvider,
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
export const useUpdate = <RecordType extends RaRecord = any, ErrorType = Error>(
    resource?: string,
    params: Partial<UpdateParams<RecordType>> = {},
    options: UseUpdateOptions<RecordType, ErrorType> = {}
): UseUpdateResult<RecordType, boolean, ErrorType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const addUndoableMutation = useAddUndoableMutation();
    const { id, data, meta } = params;
    const {
        mutationMode = 'pessimistic',
        getMutateWithMiddlewares,
        ...mutationOptions
    } = options;
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef = useRef<Partial<UpdateParams<RecordType>>>(params);
    const snapshot = useRef<Snapshot>([]);
    // Ref that stores the mutation with middlewares to avoid losing them if the calling component is unmounted
    const mutateWithMiddlewares = useRef(dataProvider.update);
    // We need to store the call-time onError and onSettled in refs to be able to call them in the useMutation hook even
    // when the calling component is unmounted
    const callTimeOnError =
        useRef<UseUpdateOptions<RecordType, ErrorType>['onError']>();
    const callTimeOnSettled =
        useRef<UseUpdateOptions<RecordType, ErrorType>['onSettled']>();

    // We don't need to keep a ref on the onSuccess callback as we call it ourselves for optimistic and
    // undoable mutations. There is a limitation though: if one of the side effects applied by the onSuccess callback
    // unmounts the component that called the useUpdate hook (redirect for instance), it must be the last one applied,
    // otherwise the other side effects may not applied.
    const hasCallTimeOnSuccess = useRef(false);

    const updateCache = ({ resource, id, data, meta }) => {
        // hack: only way to tell react-query not to fetch this query for the next 5 seconds
        // because setQueryData doesn't accept a stale time option
        const now = Date.now();
        const updatedAt = mode.current === 'undoable' ? now + 5 * 1000 : now;
        // Stringify and parse the data to remove undefined values.
        // If we don't do this, an update with { id: undefined } as payload
        // would remove the id from the record, which no real data provider does.
        const clonedData = JSON.parse(JSON.stringify(data));

        const updateColl = (old: RecordType[]) => {
            if (!old) return old;
            const index = old.findIndex(
                // eslint-disable-next-line eqeqeq
                record => record.id == id
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

        queryClient.setQueryData(
            [resource, 'getOne', { id: String(id), meta }],
            (record: RecordType) => ({ ...record, ...clonedData }),
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
        ErrorType,
        Partial<UseUpdateMutateParams<RecordType>>
    >({
        mutationFn: ({
            resource: callTimeResource = resource,
            id: callTimeId = paramsRef.current.id,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
            previousData: callTimePreviousData = paramsRef.current.previousData,
        } = {}) => {
            if (!callTimeResource) {
                throw new Error(
                    'useUpdate mutation requires a non-empty resource'
                );
            }
            if (callTimeId == null) {
                throw new Error('useUpdate mutation requires a non-empty id');
            }
            if (!callTimeData) {
                throw new Error(
                    'useUpdate mutation requires a non-empty data object'
                );
            }

            return mutateWithMiddlewares
                .current(callTimeResource, {
                    id: callTimeId,
                    data: callTimeData,
                    previousData: callTimePreviousData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data);
        },
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

            if (callTimeOnError.current) {
                return callTimeOnError.current(error, variables, context);
            }
            if (mutationOptions.onError) {
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
                    meta: mutationOptions.meta ?? paramsRef.current.meta,
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

            if (callTimeOnSettled.current) {
                return callTimeOnSettled.current(
                    data,
                    error,
                    variables,
                    context
                );
            }
            if (mutationOptions.onSettled) {
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
        callTimeResource: string | undefined = resource,
        callTimeParams: Partial<UpdateParams<RecordType>> = {},
        callTimeOptions: MutateOptions<
            RecordType,
            ErrorType,
            Partial<UseUpdateMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode; returnPromise?: boolean } = {}
    ) => {
        const {
            mutationMode,
            returnPromise = mutationOptions.returnPromise,
            onError,
            onSettled,
            onSuccess,
            ...otherCallTimeOptions
        } = callTimeOptions;

        // Store the mutation with middlewares to avoid losing them if the calling component is unmounted
        if (getMutateWithMiddlewares) {
            mutateWithMiddlewares.current = getMutateWithMiddlewares(
                dataProvider.update.bind(dataProvider)
            );
        } else {
            mutateWithMiddlewares.current = dataProvider.update;
        }

        // We need to keep the onSuccess callback here and not in the useMutation for undoable mutations
        hasCallTimeOnSuccess.current = !!onSuccess;
        // We need to store the onError and onSettled callbacks here to be able to call them in the useMutation hook
        // so that they are called even when the calling component is unmounted
        callTimeOnError.current = onError;
        callTimeOnSettled.current = onSettled;

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
                    // We don't pass onError and onSettled here as we will call them in the useMutation hook side effects
                    { onSuccess, ...otherCallTimeOptions }
                );
            }
            return mutation.mutate(
                { resource: callTimeResource, ...callTimeParams },
                // We don't pass onError and onSettled here as we will call them in the useMutation hook side effects
                { onSuccess, ...otherCallTimeOptions }
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
            meta: callTimeMeta,
        });

        // run the success callbacks during the next tick
        setTimeout(() => {
            if (onSuccess) {
                onSuccess(
                    { ...previousRecord, ...callTimeData } as RecordType,
                    { resource: callTimeResource, ...callTimeParams },
                    { snapshot: snapshot.current }
                );
            } else if (
                mutationOptions.onSuccess &&
                !hasCallTimeOnSuccess.current
            ) {
                mutationOptions.onSuccess(
                    { ...previousRecord, ...callTimeData } as RecordType,
                    { resource: callTimeResource, ...callTimeParams },
                    { snapshot: snapshot.current }
                );
            }
        }, 0);

        if (mode.current === 'optimistic') {
            // call the mutate method without success side effects
            return mutation.mutate({
                resource: callTimeResource,
                // We don't pass onError and onSettled here as we will call them in the useMutation hook side effects
                ...callTimeParams,
            });
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
                    mutation.mutate({
                        resource: callTimeResource,
                        ...callTimeParams,
                    });
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
    RecordType extends RaRecord = any,
    ErrorType = Error,
> = UseMutationOptions<
    RecordType,
    ErrorType,
    Partial<Omit<UseUpdateMutateParams<RecordType>, 'mutationFn'>>
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
