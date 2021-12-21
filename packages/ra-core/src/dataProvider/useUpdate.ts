import { useRef } from 'react';
import {
    useMutation,
    useQueryClient,
    UseMutationOptions,
    UseMutationResult,
    MutateOptions,
} from 'react-query';

import useDataProvider from './useDataProvider';
import undoableEventEmitter from './undoableEventEmitter';
import { Record, UpdateParams, MutationMode } from '../types';

/**
 * Get a callback to call the dataProvider.update() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The update parameters { id, data, previousData }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.id The resource identifier, e.g. 123
 * @prop params.data The updates to merge into the record, e.g. { views: 10 }
 * @prop params.previousData The record before the update is applied
 *
 * @returns The current mutation state. Destructure as [update, { data, error, isLoading }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [update, { isLoading: false, isIdle: true }]
 * - start:   [update, { isLoading: true }]
 * - success: [update, { data: [data from response], isLoading: false, isSuccess: true }]
 * - error:   [update, { error: [error from response], isLoading: false, isError: true }]
 *
 * The update() function must be called with a resource and a parameter object: update(resource, { id, data, previousData }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the update callback
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { isLoading, error }] = useUpdate();
 *     const handleClick = () => {
 *         update('likes', { id: record.id, data: diff, previousData: record })
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
 *     const [update, { isLoading, error }] = useUpdate('likes', { id: record.id, data: diff, previousData: record });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={() => update()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [update, { data }] = useUpdate<Product>('products', { id, data: diff, previousData: product });
 *                    \-- data is Product
 */
export const useUpdate = <RecordType extends Record = Record>(
    resource?: string,
    params: Partial<UpdateParams<RecordType>> = {},
    options: UseUpdateOptions<RecordType> = {}
): UseUpdateResult<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { id, data } = params;
    const { mutationMode = 'pessimistic', ...reactMutationOptions } = options;
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef = useRef<Partial<UpdateParams<RecordType>>>({});
    const rollbackData = useRef<RollbackData>([]);

    const updateCache = async ({ resource, id, data }) => {
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

        type GetListResult = { data?: RecordType[]; total?: number };

        queryClient.setQueryData(
            [resource, 'getOne', String(id)],
            (record: RecordType) => ({ ...record, ...data }),
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getList'],
            (res: GetListResult) =>
                res && res.data
                    ? { data: updateColl(res.data), total: res.total }
                    : res,
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
            (res: GetListResult) =>
                res && res.data
                    ? { data: updateColl(res.data), total: res.total }
                    : res,
            { updatedAt }
        );
    };

    const mutation = useMutation<
        RecordType,
        unknown,
        Partial<UseUpdateMutateParams<RecordType>>
    >(
        ({
            resource: callTimeResource = resource,
            id: callTimeId = paramsRef.current.id,
            data: callTimeData = paramsRef.current.data,
            previousData: callTimePreviousData = paramsRef.current.previousData,
        } = {}) =>
            dataProvider
                .update<RecordType>(callTimeResource, {
                    id: callTimeId,
                    data: callTimeData,
                    previousData: callTimePreviousData,
                })
                .then(({ data }) => data),
        {
            ...reactMutationOptions,
            onMutate: async (
                variables: Partial<UseUpdateMutateParams<RecordType>>
            ) => {
                if (reactMutationOptions.onMutate) {
                    const userContext =
                        (await reactMutationOptions.onMutate(variables)) || {};
                    return {
                        rollbackData: rollbackData.current,
                        // @ts-ignore
                        ...userContext,
                    };
                } else {
                    // Return a context object with the snapshot value
                    return { rollbackData: rollbackData.current };
                }
            },
            onError: (
                error: unknown,
                variables: Partial<UseUpdateMutateParams<RecordType>> = {},
                context: { rollbackData: RollbackData }
            ) => {
                if (
                    mode.current === 'optimistic' ||
                    mode.current === 'undoable'
                ) {
                    // If the mutation fails, use the context returned from onMutate to roll back
                    context.rollbackData.forEach(({ key, value }) => {
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
                data: RecordType,
                error: unknown,
                variables: Partial<UseUpdateMutateParams<RecordType>> = {},
                context: { rollbackData: RollbackData }
            ) => {
                if (
                    mode.current === 'optimistic' ||
                    mode.current === 'undoable'
                ) {
                    // Always refetch after error or success:
                    context.rollbackData.forEach(({ key }) => {
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

    const update = async (
        callTimeResource: string = resource,
        callTimeParams: Partial<UpdateParams<RecordType>> = {},
        updateOptions: MutateOptions<
            RecordType,
            unknown,
            Partial<UseUpdateMutateParams<RecordType>>,
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

        const {
            id: callTimeId = id,
            data: callTimeData = data,
        } = callTimeParams;

        // optimistic update as documented in https://react-query.tanstack.com/guides/optimistic-updates
        // except we do it in a mutate wrapper instead of the onMutate callback
        // to have access to success side effects

        const previousRecord = queryClient.getQueryData<RecordType>([
            callTimeResource,
            'getOne',
            String(callTimeId),
        ]);

        // Snapshot the previous values
        rollbackData.current = [
            [callTimeResource, 'getOne', String(callTimeId)],
            [callTimeResource, 'getList'],
            [callTimeResource, 'getMany'],
            [callTimeResource, 'getManyReference'],
        ].map(key => ({ key, value: queryClient.getQueryData(key) }));

        // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
        await rollbackData.current.forEach(({ key }) =>
            queryClient.cancelQueries(key)
        );

        // Optimistically update to the new value in getOne
        await updateCache({
            resource: callTimeResource,
            id: callTimeId,
            data: callTimeData,
        });

        // run the success callbacks during the next tick
        if (onSuccess) {
            setTimeout(
                () =>
                    onSuccess(
                        previousRecord,
                        { resource: callTimeResource, ...callTimeParams },
                        { rollbackData: rollbackData.current }
                    ),
                0
            );
        }
        if (reactMutationOptions.onSuccess) {
            setTimeout(
                () =>
                    reactMutationOptions.onSuccess(
                        previousRecord,
                        { resource: callTimeResource, ...callTimeParams },
                        { rollbackData: rollbackData.current }
                    ),
                0
            );
        }

        if (mode.current === 'optimistic') {
            // call the mutate without success side effects
            return mutation.mutate(
                { resource: callTimeResource, ...callTimeParams },
                { onSettled, onError }
            );
        } else {
            // undoable mutation: register the mutation for later
            undoableEventEmitter.once('end', ({ isUndo }) => {
                if (isUndo) {
                    // rollback
                    rollbackData.current.forEach(({ key, value }) => {
                        queryClient.setQueryData(key, value);
                    });
                } else {
                    // call the mutate without success side effects
                    mutation.mutate(
                        { resource: callTimeResource, ...callTimeParams },
                        { onSettled, onError }
                    );
                }
            });
        }
    };

    return [update, mutation];
};

type RollbackData = { key: any[]; value: any }[];

export interface UseUpdateMutateParams<RecordType extends Record = Record> {
    resource?: string;
    id?: RecordType['id'];
    data?: Partial<RecordType>;
    previousData?: any;
}

export type UseUpdateOptions<
    RecordType extends Record = Record
> = UseMutationOptions<
    RecordType,
    unknown,
    Partial<UseUpdateMutateParams<RecordType>>
> & { mutationMode?: MutationMode };

export type UseUpdateResult<RecordType extends Record = Record> = [
    (
        resource?: string,
        params?: Partial<UpdateParams<RecordType>>,
        options?: MutateOptions<
            RecordType,
            unknown,
            Partial<UseUpdateMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode }
    ) => Promise<void>,
    UseMutationResult<
        RecordType,
        unknown,
        Partial<UpdateParams<RecordType> & { resource?: string }>,
        unknown
    >
];
