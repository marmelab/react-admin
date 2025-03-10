import { useMemo, useRef } from 'react';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQueryClient,
    MutateOptions,
    QueryKey,
} from '@tanstack/react-query';

import { useDataProvider } from './useDataProvider';
import {
    RaRecord,
    CreateParams,
    Identifier,
    DataProvider,
    MutationMode,
} from '../types';
import { useEvent } from '../util';
import { useAddUndoableMutation } from './undo';

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
    const addUndoableMutation = useAddUndoableMutation();
    const { data, meta } = params;

    const {
        mutationMode = 'pessimistic',
        getMutateWithMiddlewares,
        ...mutationOptions
    } = options;
    const mode = useRef<MutationMode>(mutationMode);

    const paramsRef =
        useRef<Partial<CreateParams<Partial<RecordType>>>>(params);
    const snapshot = useRef<Snapshot>([]);

    // Ref that stores the mutation with middlewares to avoid losing them if the calling component is unmounted
    const mutateWithMiddlewares = useRef(dataProvider.create);

    // We need to store the call-time onError and onSettled in refs to be able to call them in the useMutation hook even
    // when the calling component is unmounted
    const callTimeOnError =
        useRef<
            UseCreateOptions<
                RecordType,
                MutationError,
                ResultRecordType
            >['onError']
        >();
    const callTimeOnSettled =
        useRef<
            UseCreateOptions<
                RecordType,
                MutationError,
                ResultRecordType
            >['onSettled']
        >();

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

        queryClient.setQueryData(
            [resource, 'getOne', { id: String(id), meta }],
            (record: RecordType) => ({ ...record, ...clonedData }),
            { updatedAt }
        );
    };

    const mutation = useMutation<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>
    >({
        mutationFn: ({
            resource: callTimeResource = resource,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
        } = {}) => {
            if (!callTimeResource) {
                throw new Error(
                    'useCreate mutation requires a non-empty resource'
                );
            }
            if (!callTimeData) {
                throw new Error(
                    'useCreate mutation requires a non-empty data object'
                );
            }

            return mutateWithMiddlewares
                .current(callTimeResource, {
                    data: callTimeData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data);
        },
        ...mutationOptions,
        onMutate: async (
            variables: Partial<UseCreateMutateParams<RecordType>>
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
        onError: (error, variables, context: { snapshot: Snapshot }) => {
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
            data: ResultRecordType,
            variables: Partial<UseCreateMutateParams<RecordType>> = {},
            context: unknown
        ) => {
            if (mode.current === 'pessimistic') {
                const { resource: callTimeResource = resource } = variables;
                queryClient.setQueryData(
                    [callTimeResource, 'getOne', { id: String(data.id) }],
                    data
                );
                queryClient.invalidateQueries({
                    queryKey: [callTimeResource, 'getList'],
                });
                queryClient.invalidateQueries({
                    queryKey: [callTimeResource, 'getInfiniteList'],
                });
                queryClient.invalidateQueries({
                    queryKey: [callTimeResource, 'getMany'],
                });
                queryClient.invalidateQueries({
                    queryKey: [callTimeResource, 'getManyReference'],
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
            variables,
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

    const create = async (
        callTimeResource: string | undefined = resource,
        callTimeParams: Partial<CreateParams<Partial<RecordType>>> = {},
        callTimeOptions: MutateOptions<
            ResultRecordType,
            MutationError,
            Partial<UseCreateMutateParams<RecordType>>,
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
                dataProvider.create.bind(dataProvider)
            );
        } else {
            mutateWithMiddlewares.current = dataProvider.create;
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

        const { data: callTimeData = data, meta: callTimeMeta = meta } =
            callTimeParams;
        const callTimeId = callTimeData?.id;
        if (callTimeId == null) {
            console.warn(
                'useCreate() data parameter must contain an id key when used with the optimistic or undoable modes'
            );
        }
        // optimistic create as documented in https://react-query-v3.tanstack.com/guides/optimistic-updates
        // except we do it in a mutate wrapper instead of the onMutate callback
        // to have access to success side effects

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
                    callTimeData as unknown as ResultRecordType,
                    { resource: callTimeResource, ...callTimeParams },
                    { snapshot: snapshot.current }
                );
            } else if (
                mutationOptions.onSuccess &&
                !hasCallTimeOnSuccess.current
            ) {
                mutationOptions.onSuccess(
                    callTimeData as unknown as ResultRecordType,
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
                    queryClient.removeQueries({
                        queryKey: [
                            callTimeResource,
                            'getOne',
                            { id: String(callTimeId), meta },
                        ],
                        exact: true,
                    });
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

    return [useEvent(create), mutationResult];
};

type Snapshot = [key: QueryKey, value: any][];

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
