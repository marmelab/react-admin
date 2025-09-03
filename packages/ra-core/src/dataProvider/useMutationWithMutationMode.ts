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

export const useMutationWithMutationMode = <
    ErrorType = Error,
    TData = unknown,
    TVariables = unknown,
>(
    params: TVariables = {} as TVariables,
    options: UseMutationWithMutationModeOptions<ErrorType, TData, TVariables>
): UseMutationWithMutationModeResult<boolean, ErrorType, TData, TVariables> => {
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

    const mutationFnEvent = useEvent(mutationFn);
    const updateCacheEvent = useEvent(updateCache);
    const getSnapshotEvent = useEvent(getSnapshot);
    const onUndoEvent = useEvent(onUndo ?? noop);
    const getMutateWithMiddlewaresEvent = useEvent(
        getMutateWithMiddlewares ??
            (noop as unknown as (
                mutate: MutationFunction<TData, TVariables>
            ) => (params: TVariables) => Promise<TData>)
    );

    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef = useRef<Partial<TVariables>>(params);
    const snapshot = useRef<Snapshot>([]);
    // Ref that stores the mutation with middlewares to avoid losing them if the calling component is unmounted
    const mutateWithMiddlewares = useRef<
        | MutationFunction<TData, TVariables>
        | DataProviderMutationWithMiddlewareFunction<TData, TVariables>
    >(mutationFnEvent);
    // We need to store the call-time onError and onSettled in refs to be able to call them in the useMutation hook even
    // when the calling component is unmounted
    const callTimeOnError =
        useRef<
            UseMutationWithMutationModeOptions<
                ErrorType,
                TData,
                TVariables
            >['onError']
        >();
    const callTimeOnSettled =
        useRef<
            UseMutationWithMutationModeOptions<
                ErrorType,
                TData,
                TVariables
            >['onSettled']
        >();

    // We don't need to keep a ref on the onSuccess callback as we call it ourselves for optimistic and
    // undoable mutations. There is a limitation though: if one of the side effects applied by the onSuccess callback
    // unmounts the component that called the useUpdate hook (redirect for instance), it must be the last one applied,
    // otherwise the other side effects may not applied.
    const hasCallTimeOnSuccess = useRef(false);

    const mutation = useMutation<TData, ErrorType, Partial<TVariables>>({
        mutationKey,
        mutationFn: async params => {
            const callTimeParams = { ...paramsRef.current, ...params };
            if (params == null) {
                throw new Error(
                    'useMutationWithMutationMode mutation requires parameters'
                );
            }

            return mutateWithMiddlewares.current(callTimeParams as TVariables);
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
                updateCacheEvent(
                    { ...paramsRef.current, ...variables },
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

    const mutate = async (
        callTimeParams: Partial<TVariables> = {},
        callTimeOptions: MutateOptions<
            TData,
            ErrorType,
            Partial<TVariables>,
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
            mutateWithMiddlewares.current = getMutateWithMiddlewaresEvent(
                (params: TVariables) => {
                    // Store the final parameters which might have been changed by middlewares
                    paramsRef.current = params;
                    return mutationFnEvent(params);
                }
            );
        } else {
            mutateWithMiddlewares.current = mutationFnEvent;
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

        snapshot.current = getSnapshotEvent(
            { ...paramsRef.current, ...callTimeParams },
            {
                mutationMode: mode.current,
            }
        );

        if (mode.current === 'pessimistic') {
            if (returnPromise) {
                return mutation.mutateAsync(
                    { ...paramsRef.current, ...callTimeParams },
                    // We don't pass onError and onSettled here as we will call them in the useMutation hook side effects
                    { onSuccess, ...otherCallTimeOptions }
                );
            }
            return mutation.mutate(
                { ...paramsRef.current, ...callTimeParams },
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
        const optimisticResult = updateCacheEvent(
            { ...paramsRef.current, ...callTimeParams },
            {
                mutationMode: mode.current,
            },
            undefined
        );

        // run the success callbacks during the next tick
        setTimeout(() => {
            if (onSuccess) {
                onSuccess(optimisticResult, callTimeParams, {
                    snapshot: snapshot.current,
                });
            } else if (
                mutationOptions.onSuccess &&
                !hasCallTimeOnSuccess.current
            ) {
                mutationOptions.onSuccess(optimisticResult, callTimeParams, {
                    snapshot: snapshot.current,
                });
            }
        }, 0);

        if (mode.current === 'optimistic') {
            // call the mutate method without success side effects
            return mutation.mutate(callTimeParams);
        } else {
            // Undoable mutation: add the mutation to the undoable queue.
            // The Notification component will dequeue it when the user confirms or cancels the message.
            addUndoableMutation(({ isUndo }) => {
                if (isUndo) {
                    if (onUndo) {
                        onUndoEvent(callTimeParams, {
                            mutationMode: mode.current,
                        });
                    }
                    // rollback
                    snapshot.current.forEach(([key, value]) => {
                        queryClient.setQueryData(key, value);
                    });
                } else {
                    // call the mutate method without success side effects
                    mutation.mutate(callTimeParams);
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

const noop = () => {};

export type Snapshot = [key: QueryKey, value: any][];

type MutationFunction<TData = unknown, TVariables = unknown> = (
    variables: TVariables
) => Promise<TData>;

export type UseMutationWithMutationModeOptions<
    ErrorType = Error,
    TData = unknown,
    TVariables = unknown,
> = Omit<
    UseMutationOptions<TData, ErrorType, Partial<TVariables>>,
    'mutationFn'
> & {
    getMutateWithMiddlewares?: (
        mutate: MutationFunction<TData, TVariables>
    ) => (params: TVariables) => Promise<TData>;
    mutationFn?: MutationFunction<TData, TVariables>;
    mutationMode?: MutationMode;
    returnPromise?: boolean;
    updateCache: <OptionsType extends { mutationMode: MutationMode }>(
        params: Partial<TVariables>,
        options: OptionsType,
        mutationResult: TData | undefined
    ) => TData;
    getSnapshot: <OptionsType extends { mutationMode: MutationMode }>(
        params: Partial<TVariables>,
        options: OptionsType
    ) => Snapshot;
    onUndo?: <OptionsType extends { mutationMode: MutationMode }>(
        params: Partial<TVariables>,
        options: OptionsType
    ) => void;
};

type DataProviderMutationWithMiddlewareFunction<
    TData = unknown,
    TVariables = unknown,
> = (params: Partial<TVariables>, options?: any) => Promise<TData>;

export type MutationFunctionWithOptions<
    TReturnPromise extends boolean = boolean,
    ErrorType = Error,
    TData = unknown,
    TVariables = unknown,
> = (
    params?: Partial<TVariables>,
    options?: MutateOptions<TData, ErrorType, Partial<TVariables>, unknown> & {
        mutationMode?: MutationMode;
        returnPromise?: TReturnPromise;
    }
) => Promise<TReturnPromise extends true ? TData : void>;

export type UseMutationWithMutationModeResult<
    TReturnPromise extends boolean = boolean,
    ErrorType = Error,
    TData = unknown,
    TVariables = unknown,
> = [
    MutationFunctionWithOptions<TReturnPromise, ErrorType, TData, TVariables>,
    UseMutationResult<TData, ErrorType, Partial<TVariables>, unknown> & {
        isLoading: boolean;
    },
];
