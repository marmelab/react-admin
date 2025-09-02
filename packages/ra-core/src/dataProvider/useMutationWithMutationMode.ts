import { useMemo, useRef } from 'react';
import {
    useMutation,
    useQueryClient,
    UseMutationOptions,
    UseMutationResult,
    MutateOptions,
    QueryKey,
} from '@tanstack/react-query';

import { useAddUndoableMutation } from './undo/useAddUndoableMutation';
import { MutationMode } from '../types';
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
export const useMutationWithMutationMode = <
    ErrorType = Error,
    DataProviderMutationFunctionParams extends BaseParams = BaseParams,
    DataProviderMutationFunction extends
        DataProviderMutationFunctionBase<DataProviderMutationFunctionParams> = DataProviderMutationFunctionBase<DataProviderMutationFunctionParams>,
>(
    resource?: string,
    params: DataProviderMutationFunctionParams = {} as DataProviderMutationFunctionParams,
    options: UseMutationWithMutationModeOptions<
        ErrorType,
        DataProviderMutationFunctionParams,
        DataProviderMutationFunction
    > = {
        updateCache: () => {
            throw new Error(
                'updateCache must be provided to useMutationWithMutationMode'
            );
        },
        getSnapshot: () => {
            throw new Error(
                'getSnapshot must be provided to useMutationWithMutationMode'
            );
        },
    }
): UseMutationWithMutationModeResult<boolean, ErrorType> => {
    const queryClient = useQueryClient();
    const addUndoableMutation = useAddUndoableMutation();
    const {
        mutationKey,
        mutationMode = 'pessimistic',
        mutationFn,
        getMutateWithMiddlewares,
        updateCache,
        getSnapshot,
        onUndo,
        ...mutationOptions
    } = options;

    if (mutationFn == null) {
        throw new Error(
            'useMutationWithMutationMode mutation requires a mutationFn'
        );
    }
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef =
        useRef<Partial<DataProviderMutationFunctionParams>>(params);
    const snapshot = useRef<Snapshot>([]);
    // Ref that stores the mutation with middlewares to avoid losing them if the calling component is unmounted
    const mutateWithMiddlewares = useRef<
        | DataProviderMutationFunction
        | DataProviderMutationWithMiddlewareFunction<
              DataProviderMutationFunctionParams,
              DataProviderMutationFunction
          >
    >(mutationFn);
    // We need to store the call-time onError and onSettled in refs to be able to call them in the useMutation hook even
    // when the calling component is unmounted
    const callTimeOnError =
        useRef<
            UseMutationWithMutationModeOptions<
                ErrorType,
                DataProviderMutationFunctionParams,
                DataProviderMutationFunction
            >['onError']
        >();
    const callTimeOnSettled =
        useRef<
            UseMutationWithMutationModeOptions<
                ErrorType,
                DataProviderMutationFunctionParams,
                DataProviderMutationFunction
            >['onSettled']
        >();

    // We don't need to keep a ref on the onSuccess callback as we call it ourselves for optimistic and
    // undoable mutations. There is a limitation though: if one of the side effects applied by the onSuccess callback
    // unmounts the component that called the useUpdate hook (redirect for instance), it must be the last one applied,
    // otherwise the other side effects may not applied.
    const hasCallTimeOnSuccess = useRef(false);

    const mutation = useMutation<
        Awaited<ReturnType<DataProviderMutationFunction>>,
        ErrorType,
        Partial<DataProviderMutationFunctionParams>
    >({
        mutationKey,
        mutationFn: async ({
            resource: callTimeResource = resource,
            ...otherCallTimeParams
        } = {}) => {
            if (!callTimeResource) {
                throw new Error(
                    'useMutationWithMutationMode mutation requires a non-empty resource'
                );
            }
            const callTimeParams = {
                ...paramsRef.current,
                ...otherCallTimeParams,
            };
            if (callTimeParams == null) {
                throw new Error(
                    'useMutationWithMutationMode mutation requires parameters'
                );
            }

            const result = await mutateWithMiddlewares
                .current(
                    callTimeResource,
                    callTimeParams as DataProviderMutationFunctionParams
                )
                .then(({ data }) => data);

            return result;
        },
        ...mutationOptions,
        onMutate: async variables => {
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
        onSuccess: (data, variables = {}, context) => {
            if (mode.current === 'pessimistic') {
                // update the getOne and getList query cache with the new result
                const {
                    resource: callTimeResource = resource,
                    ...callTimeParams
                } = variables;

                updateCache(
                    callTimeResource as string,
                    { ...paramsRef.current, ...callTimeParams },
                    {
                        mutationMode: mode.current,
                    },
                    data
                );

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
            // Always refetch after error or success:
            context.snapshot.forEach(([queryKey]) => {
                queryClient.invalidateQueries({ queryKey });
            });

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
        callTimeParams: Partial<DataProviderMutationFunctionParams> = {},
        callTimeOptions: MutateOptions<
            Awaited<ReturnType<DataProviderMutationFunction>>,
            ErrorType,
            Partial<DataProviderMutationFunctionParams>,
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
                // @ts-expect-error
                (resource: string, params: any, options: any) => {
                    // Store the final parameters which might have been changed by middlewares
                    paramsRef.current = params;
                    return mutationFn(resource, params, options);
                }
            );
        } else {
            mutateWithMiddlewares.current = mutationFn;
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

        snapshot.current = getSnapshot(
            callTimeResource as string,
            { ...paramsRef.current, ...callTimeParams },
            {
                mutationMode: mode.current,
            }
        );

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

        // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
        await Promise.all(
            snapshot.current.map(([queryKey]) =>
                queryClient.cancelQueries({ queryKey })
            )
        );

        // Optimistically update to the new value
        const optimisticResult = updateCache(
            callTimeResource as string,
            { ...paramsRef.current, ...callTimeParams },
            {
                mutationMode: mode.current,
            },
            undefined
        );

        // run the success callbacks during the next tick
        setTimeout(() => {
            if (onSuccess) {
                onSuccess(
                    optimisticResult,
                    { resource: callTimeResource, ...callTimeParams },
                    { snapshot: snapshot.current }
                );
            } else if (
                mutationOptions.onSuccess &&
                !hasCallTimeOnSuccess.current
            ) {
                mutationOptions.onSuccess(
                    optimisticResult,
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
                    if (onUndo) {
                        onUndo(callTimeResource!, callTimeParams, {
                            mutationMode: mode.current,
                        });
                    }
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

export type Snapshot = [key: QueryKey, value: any][];

type BaseParams = Record<string, any>;
type DataProviderMutationFunctionBase<Params extends BaseParams> = (
    resource: string,
    params: Params,
    options?: any
) => Promise<any>;

export type UseMutationWithMutationModeOptions<
    ErrorType = Error,
    DataProviderMutationFunctionParams extends BaseParams = BaseParams,
    DataProviderMutationFunction extends
        DataProviderMutationFunctionBase<DataProviderMutationFunctionParams> = DataProviderMutationFunctionBase<DataProviderMutationFunctionParams>,
> = Omit<
    UseMutationOptions<
        Awaited<ReturnType<DataProviderMutationFunction>>,
        ErrorType,
        Partial<DataProviderMutationFunctionParams>
    >,
    'mutationFn'
> & {
    getMutateWithMiddlewares?: (
        mutate: DataProviderMutationFunction
    ) => (
        resource: string,
        params: DataProviderMutationFunctionParams,
        options?: any
    ) => ReturnType<DataProviderMutationFunction>;
    mutationFn?: DataProviderMutationFunction;
    mutationMode?: MutationMode;
    returnPromise?: boolean;
    updateCache: <OptionsType extends { mutationMode: MutationMode }>(
        resource: string,
        params: Partial<DataProviderMutationFunctionParams>,
        options: OptionsType,
        mutationResult:
            | Awaited<ReturnType<DataProviderMutationFunction>>
            | undefined
    ) => Awaited<ReturnType<DataProviderMutationFunction>>;
    getSnapshot: <OptionsType extends { mutationMode: MutationMode }>(
        resource: string,
        params: Partial<DataProviderMutationFunctionParams>,
        options: OptionsType
    ) => Snapshot;
    onUndo?: <OptionsType extends { mutationMode: MutationMode }>(
        resource: string,
        params: Partial<DataProviderMutationFunctionParams>,
        options: OptionsType
    ) => void;
};

type DataProviderMutationWithMiddlewareFunction<
    DataProviderMutationFunctionParams extends BaseParams = BaseParams,
    DataProviderMutationFunction extends
        DataProviderMutationFunctionBase<DataProviderMutationFunctionParams> = DataProviderMutationFunctionBase<DataProviderMutationFunctionParams>,
> = (
    resource: string,
    params: Partial<DataProviderMutationFunctionParams>,
    options?: any
) => ReturnType<DataProviderMutationFunction>;

export type UpdateMutationFunction<
    TReturnPromise extends boolean = boolean,
    ErrorType = Error,
    DataProviderMutationFunctionParams extends BaseParams = BaseParams,
    DataProviderMutationFunction extends
        DataProviderMutationFunctionBase<DataProviderMutationFunctionParams> = DataProviderMutationFunctionBase<DataProviderMutationFunctionParams>,
> = (
    resource?: string,
    params?: Partial<DataProviderMutationFunctionParams>,
    options?: MutateOptions<
        Awaited<ReturnType<DataProviderMutationFunction>>,
        ErrorType,
        Partial<DataProviderMutationFunctionParams>,
        unknown
    > & { mutationMode?: MutationMode; returnPromise?: TReturnPromise }
) => Promise<
    TReturnPromise extends true
        ? Awaited<ReturnType<DataProviderMutationFunction>>
        : void
>;

export type UseMutationWithMutationModeResult<
    TReturnPromise extends boolean = boolean,
    ErrorType = Error,
    DataProviderMutationFunctionParams extends BaseParams = BaseParams,
    DataProviderMutationFunction extends
        DataProviderMutationFunctionBase<DataProviderMutationFunctionParams> = DataProviderMutationFunctionBase<DataProviderMutationFunctionParams>,
> = [
    UpdateMutationFunction<
        TReturnPromise,
        ErrorType,
        DataProviderMutationFunctionParams
    >,
    UseMutationResult<
        Awaited<ReturnType<DataProviderMutationFunction>>,
        ErrorType,
        Partial<DataProviderMutationFunctionParams & { resource?: string }>,
        unknown
    > & { isLoading: boolean },
];
