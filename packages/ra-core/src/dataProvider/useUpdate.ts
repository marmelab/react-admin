import {
    useMutation,
    useQueryClient,
    UseMutationOptions,
    UseMutationResult,
    MutateOptions,
} from 'react-query';

import useDataProvider from './useDataProvider';
import undoableEventEmitter from './undoableEventEmitter';
import {
    Identifier,
    Record,
    UpdateParams,
    UpdateResult,
    MutationMode,
} from '../types';

/**
 * Get a callback to call the dataProvider.update() method, the result and the loading state.
 *
 * The return value is the same as react-query's useMutation. It updates according to the request state:
 *
 * - initial: { mutate, isLoading: false, isIdle: true }
 * - start:   { mutate, isLoading: true }
 * - success: { mutate, data: [data from response], isLoading: false, isSuccess: true }
 * - error:   { mutate, error: [error from response], isLoading: false, isError: true }
 *
 * @param {Params} params The update parameters { resource, id, data, previousData }
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @typedef Params
 * @prop params.resource The resource name, e.g. 'posts'
 * @props params.id The resource identifier, e.g. 123
 * @props params.data The updates to merge into the record, e.g. { views: 10 }
 * @props params.previousData The record before the update is applied
 *
 * @returns The current mutation state. Destructure as { mutate, data, error, isLoading }.
 *
 * The mutate() function must be called with a parameter object: mutate({ resource, id, data, previousData }, options)
 *
 * @see https://react-query.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the update callback
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const { mutate, isLoading, error } = useUpdate();
 *     const handleClick = () => {
 *         mutate({ resource: 'likes', id: record.id, data: diff, previousData: record })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Like</div>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const { mutate, isLoading, error } = useUpdate({ resource: 'likes', id: record.id, data: diff, previousData: record });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={() => mutate()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const { mutate, data } = useUpdate<Product>({ resource: 'products', id, data: diff, previousData: product });
 *                    \-- data is Product
 */
export const useUpdate = <RecordType extends Record = Record>(
    { resource, id, data, previousData }: UseUpdateParams<RecordType> = {},
    options: UseUpdateOptions<RecordType> = {}
): UseUpdateResult<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { mutationMode = 'pessimistic', ...reactMutationOptions } = options;

    const updateCache = async ({ resource, id, data }) => {
        // hack: only way to tell react-query not to fetch this query for the next 5 seconds
        // because setQueryData doesn't accept a staletime option
        const updatedAt =
            mutationMode === 'undoable' ? Date.now() + 1000 * 5 : Date.now();
        await queryClient.setQueryData(
            [resource, 'getOne', id],
            (old: RecordType) => ({
                ...old,
                ...data,
            }),
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getList'],
            (old: RecordType[]) => {
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
            },
            { updatedAt }
        );
    };

    let context: { previousGetOne?: any; previousGetList?: any } = {};

    const mutation = useMutation<
        UpdateResult<RecordType>,
        unknown,
        Partial<UseUpdateParams<RecordType>>
    >(
        ({
            resource: callTimeResource = resource,
            id: callTimeId = id,
            data: callTimeData = data,
            previousData: callTimePreviousData = previousData,
        } = {}) => {
            return dataProvider.update<RecordType>(callTimeResource, {
                id: callTimeId,
                data: callTimeData,
                previousData: callTimePreviousData,
            });
        },
        {
            ...reactMutationOptions,
            onMutate: async (variables: UpdateParams<RecordType>) => {
                // Return a context object with the snapshotted value
                if (reactMutationOptions.onMutate) {
                    const userContext =
                        (await reactMutationOptions.onMutate(variables)) || {};
                    return {
                        ...context,
                        // @ts-ignore
                        ...userContext,
                    };
                }
                return context;
            },
            onError: (
                error: unknown,
                variables: Partial<UseUpdateParams<RecordType>> = {},
                context: { previousGetOne: any; previousGetList: any }
            ) => {
                const {
                    resource: callTimeResource = resource,
                    id: callTimeId = id,
                } = variables;
                if (
                    mutationMode === 'optimistic' ||
                    mutationMode === 'undoable'
                ) {
                    // If the mutation fails, use the context returned from onMutate to roll back
                    queryClient.setQueryData(
                        [callTimeResource, 'getOne', callTimeId],
                        context.previousGetOne
                    );
                    queryClient.setQueriesData(
                        [callTimeResource, 'getList'],
                        context.previousGetList
                    );
                }

                if (reactMutationOptions.onError) {
                    return reactMutationOptions.onError(
                        error,
                        variables,
                        context
                    );
                }
            },
            onSuccess: (
                data: UpdateResult<RecordType>,
                variables: Partial<UseUpdateParams<RecordType>> = {},
                context: unknown
            ) => {
                if (mutationMode === 'pessimistic') {
                    // Optimistically update to the new value in getOne
                    const {
                        resource: callTimeResource = resource,
                        id: callTimeId = id,
                    } = variables;
                    updateCache({
                        resource: callTimeResource,
                        id: callTimeId,
                        data,
                    });

                    if (reactMutationOptions.onSuccess) {
                        return reactMutationOptions.onSuccess(
                            data,
                            variables,
                            context
                        );
                    }
                }
            },
            onSettled: (
                data: UpdateResult<RecordType>,
                error: unknown,
                variables: Partial<UseUpdateParams<RecordType>> = {},
                context: unknown
            ) => {
                const {
                    resource: callTimeResource = resource,
                    id: callTimeId = id,
                } = variables;
                if (
                    mutationMode === 'optimistic' ||
                    mutationMode === 'undoable'
                ) {
                    // Always refetch after error or success:
                    queryClient.invalidateQueries([
                        callTimeResource,
                        'getOne',
                        callTimeId,
                    ]);
                    queryClient.invalidateQueries([
                        callTimeResource,
                        'getList',
                    ]);
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

    const mutateAsync = async (
        variables: Partial<UseUpdateParams<RecordType>> = {},
        callTimeOptions: MutateOptions<
            UpdateResult<RecordType>,
            unknown,
            Partial<UseUpdateParams<RecordType>>,
            unknown
        > = {}
    ) => {
        const { onSuccess, onSettled, onError } = callTimeOptions;
        const {
            resource: callTimeResource = resource,
            id: callTimeId = id,
            data: callTimeData = data,
        } = variables;
        if (mutationMode === 'optimistic' || mutationMode === 'undoable') {
            // optimistic update as documented in https://react-query.tanstack.com/guides/optimistic-updates
            // except we wo it in a mutate wrapper instead of the onMutete callback
            // to have access to success side effects

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries([
                callTimeResource,
                'getOne',
                callTimeId,
            ]);
            await queryClient.cancelQueries([resource, 'getList']);

            // Snapshot the previous values
            const previousGetOne = queryClient.getQueryData([
                callTimeResource,
                'getOne',
                callTimeId,
            ]);
            const previousGetList = queryClient.getQueriesData([
                callTimeResource,
                'getList',
            ]);

            // Optimistically update to the new value in getOne
            await updateCache({
                resource: callTimeResource,
                id: callTimeId,
                data: callTimeData,
            });

            context = { previousGetOne, previousGetList };

            // run the success callbacks during the next tick
            if (onSuccess) {
                setTimeout(
                    () =>
                        onSuccess(
                            queryClient.getQueryData([
                                callTimeResource,
                                'getOne',
                                callTimeId,
                            ]),
                            variables,
                            context
                        ),
                    0
                );
            }

            if (mutationMode === 'optimistic') {
                // call the mutate without success side effects
                return mutation.mutateAsync(variables, {
                    onSettled,
                    onError,
                });
            } else {
                // undoable mutation: register the mutation for later
                undoableEventEmitter.once('end', ({ isUndo }) => {
                    if (isUndo) {
                        // rollback
                        queryClient.setQueryData(
                            [callTimeResource, 'getOne', callTimeId],
                            context.previousGetOne
                        );
                        queryClient.setQueriesData(
                            [callTimeResource, 'getList'],
                            context.previousGetList
                        );
                    } else {
                        // commit
                        mutation.mutateAsync(variables, {
                            onSettled,
                            onError,
                        });
                    }
                });
            }
        } else {
            // pessimistic mode, just call the mutation
            return mutation.mutateAsync(variables, {
                onSuccess,
                onSettled,
                onError,
            });
        }
    };

    return {
        ...mutation,
        mutateAsync,
        mutate: (variables: Partial<UseUpdateParams<RecordType>>, options) => {
            mutateAsync(variables, options);
        },
    };
};

export interface UseUpdateParams<RecordType extends Record = Record> {
    resource?: string;
    id?: Identifier;
    data?: Partial<RecordType>;
    previousData?: any;
}

export type UseUpdateOptions<
    RecordType extends Record = Record
> = UseMutationOptions<
    UpdateResult<RecordType>,
    unknown,
    Partial<UpdateParams<RecordType>>
> & { mutationMode?: MutationMode };

export type UseUpdateResult<
    RecordType extends Record = Record
> = UseMutationResult<
    UpdateResult<RecordType>,
    unknown,
    Partial<UpdateParams<RecordType> & { resource?: string }>,
    unknown
>;
