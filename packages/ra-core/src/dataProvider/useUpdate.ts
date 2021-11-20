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
 * The return value updates according to the request state:
 *
 * - initial: [update, { loading: false, loaded: false }]
 * - start:   [update, { loading: true, loaded: false }]
 * - success: [update, { data: [data from response], loading: false, loaded: true }]
 * - error:   [update, { error: [error from response], loading: false, loaded: false }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param data The updates to merge into the record, e.g. { views: 10 }
 * @param previousData The record before the update is applied
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [update, { data, error, loading, loaded }].
 *
 * The update() function can be called in 3 different ways:
 *  - with the same parameters as the useUpdate() hook: update(resource, id, data, previousData, options)
 *  - with the same syntax as useMutation: update({ resource, payload: { id, data, previousData } }, options)
 *  - with no parameter (if they were already passed to useUpdate()): update()
 *
 * @example // set params when calling the update callback
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { loading, error }] = useUpdate();
 *     const handleClick = () => {
 *         update('likes', record.id, diff, record)
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={handleClick}>Like</div>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { loading, error }] = useUpdate('likes', record.id, diff, record);
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={update}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [update, { data }] = useUpdate<Product>('products', id, changes, product);
 *                    \-- data is Product
 */
export const useUpdate = <RecordType extends Record = Record>(
    resource?: string,
    id?: Identifier,
    data?: Partial<RecordType>,
    previousData?: any,
    options?: UseMutationOptions<
        UpdateResult<RecordType>,
        unknown,
        Partial<UpdateParams<RecordType>>
    > & { mutationMode?: MutationMode }
): UseUpdateHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { mutationMode = 'optimistic', ...reactMutationOptions } =
        options || {};

    const updateCache = async ({ id, data }) => {
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
        Partial<UpdateParams<RecordType>>
    >(
        ({
            id: callTimeId,
            data: callTimeData,
            previousData: callTimePreviousData,
        }) => {
            return dataProvider.update<RecordType>(resource, {
                id: callTimeId || id,
                data: callTimeData || data,
                previousData: callTimePreviousData || previousData,
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
                variables: Partial<UpdateParams<RecordType>>,
                context: { previousGetOne: any; previousGetList: any }
            ) => {
                console.log('onError');
                const { id: callTimeId } = variables;
                if (
                    mutationMode === 'optimistic' ||
                    mutationMode === 'undoable'
                ) {
                    // If the mutation fails, use the context returned from onMutate to roll back
                    queryClient.setQueryData(
                        [resource, 'getOne', callTimeId || id],
                        context.previousGetOne
                    );
                    queryClient.setQueriesData(
                        [resource, 'getList'],
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
                variables: UpdateParams<RecordType>,
                context: unknown
            ) => {
                console.log('onSuccess');
                if (mutationMode === 'pessimistic') {
                    // Optimistically update to the new value in getOne
                    const { id: callTimeId, data: callTimeData } = variables;
                    updateCache({
                        id: callTimeId || id,
                        data: callTimeData || data,
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
                variables: UpdateParams<RecordType>,
                context: unknown
            ) => {
                console.log('onSettled');
                const { id: callTimeId } = variables;
                if (
                    mutationMode === 'optimistic' ||
                    mutationMode === 'undoable'
                ) {
                    // Always refetch after error or success:
                    queryClient.invalidateQueries([
                        resource,
                        'getOne',
                        callTimeId || id,
                    ]);
                    queryClient.invalidateQueries([resource, 'getList']);
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
        variables: UpdateParams<RecordType>,
        callTimeOptions: MutateOptions<
            UpdateResult<RecordType>,
            unknown,
            Partial<UpdateParams<RecordType>>,
            unknown
        > = {}
    ) => {
        const { onSuccess, onSettled, onError } = callTimeOptions;
        console.log('preMutate');
        const { id: callTimeId, data: callTimeData } = variables;
        if (mutationMode === 'optimistic' || mutationMode === 'undoable') {
            // optimistic update as documented in https://react-query.tanstack.com/guides/optimistic-updates
            // except we wo it in a mutate wrapper instead of the onMutete callback
            // to have access to success side effects

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries([
                resource,
                'getOne',
                callTimeId || id,
            ]);
            await queryClient.cancelQueries([resource, 'getList']);

            // Snapshot the previous values
            const previousGetOne = queryClient.getQueryData([
                resource,
                'getOne',
                callTimeId || id,
            ]);
            const previousGetList = queryClient.getQueriesData([
                resource,
                'getList',
            ]);

            // Optimistically update to the new value in getOne
            await updateCache({
                id: callTimeId || id,
                data: callTimeData || data,
            });

            context = { previousGetOne, previousGetList };

            // run the success callbacks during the next tick
            if (onSuccess) {
                setTimeout(
                    () =>
                        onSuccess(
                            queryClient.getQueryData([
                                resource,
                                'getOne',
                                callTimeId || id,
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
                            [resource, 'getOne', callTimeId || id],
                            context.previousGetOne
                        );
                        queryClient.setQueriesData(
                            [resource, 'getList'],
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
        mutate: (variables: UpdateParams<RecordType>, options) => {
            mutateAsync(variables, options);
        },
    };
};

export type UseUpdateHookValue<
    RecordType extends Record = Record
> = UseMutationResult<
    UpdateResult<RecordType>,
    unknown,
    Partial<UpdateParams<RecordType>>,
    unknown
>;
