import { useRef } from 'react';
import {
    useMutation,
    useQueryClient,
    UseMutationOptions,
    UseMutationResult,
    MutateOptions,
    QueryKey,
} from 'react-query';

import { useDataProvider } from './useDataProvider';
import undoableEventEmitter from './undoableEventEmitter';
import { Record, UpdateManyParams, MutationMode } from '../types';
import { Identifier } from '..';

/**
 * Get a callback to call the dataProvider.updateMany() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The updateMany parameters { ids, data }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.ids The resource identifiers, e.g. [123, 456]
 * @prop params.data The updates to merge into the record, e.g. { views: 10 }
 *
 * @returns The current mutation state. Destructure as [updateMany, { data, error, isLoading }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [updateMany, { isLoading: false, isIdle: true }]
 * - start:   [updateMany, { isLoading: true }]
 * - success: [updateMany, { data: [data from response], isLoading: false, isSuccess: true }]
 * - error:   [updateMany, { error: [error from response], isLoading: false, isError: true }]
 *
 * The updateMany() function must be called with a resource and a parameter object: updateMany(resource, { ids, data, previousData }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the updateMany callback
 *
 * import { useUpdateMany } from 'react-admin';
 *
 * const BulkResetViewsButton = ({ selectedIds }) => {
 *     const [updateMany, { isLoading, error }] = useUpdateMany();
 *     const handleClick = () => {
 *         updateMany('posts', { ids: selectedIds, data: { views: 0 } });
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Reset views</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdateMany } from 'react-admin';
 *
 * const BulkResetViewsButton = ({ selectedIds }) => {
 *     const [updateMany, { isLoading, error }] = useUpdateMany('posts', { ids: selectedIds, data: { views: 0 } });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={() => updateMany()}>Reset views</button>;
 * };
 */
export const useUpdateMany = <RecordType extends Record = Record>(
    resource?: string,
    params: Partial<UpdateManyParams<Partial<RecordType>>> = {},
    options: UseUpdateManyOptions<RecordType> = {}
): UseUpdateManyResult<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { ids, data } = params;
    const { mutationMode = 'pessimistic', ...reactMutationOptions } = options;
    const mode = useRef<MutationMode>(mutationMode);
    const paramsRef = useRef<Partial<UpdateManyParams<Partial<RecordType>>>>(
        {}
    );
    const snapshot = useRef<Snapshot>([]);

    const updateCache = async ({
        resource,
        ids,
        data,
    }: {
        resource: string;
        ids: Identifier[];
        data: any;
    }) => {
        // hack: only way to tell react-query not to fetch this query for the next 5 seconds
        // because setQueryData doesn't accept a stale time option
        const updatedAt =
            mode.current === 'undoable' ? Date.now() + 1000 * 5 : Date.now();

        const updateColl = (old: RecordType[]) => {
            if (!old) return;
            let newCollection = [...old];
            ids.forEach(id => {
                // eslint-disable-next-line eqeqeq
                const index = old.findIndex(record => record.id == id);
                if (index === -1) {
                    return;
                }
                newCollection = [
                    ...newCollection.slice(0, index),
                    { ...newCollection[index], ...data },
                    ...newCollection.slice(index + 1),
                ];
            });
            return newCollection;
        };

        type GetListResult = { data?: RecordType[]; total?: number };

        ids.forEach(id =>
            queryClient.setQueryData(
                [resource, 'getOne', { id: String(id) }],
                (record: RecordType) => ({ ...record, ...data }),
                { updatedAt }
            )
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
        Array<RecordType['id']>,
        unknown,
        Partial<UseUpdateManyMutateParams<RecordType>>
    >(
        ({
            resource: callTimeResource = resource,
            ids: callTimeIds = paramsRef.current.ids,
            data: callTimeData = paramsRef.current.data,
        } = {}) =>
            dataProvider
                .updateMany(callTimeResource, {
                    ids: callTimeIds,
                    data: callTimeData,
                })
                .then(({ data }) => data),
        {
            ...reactMutationOptions,
            onMutate: async (
                variables: Partial<UseUpdateManyMutateParams<RecordType>>
            ) => {
                if (reactMutationOptions.onMutate) {
                    const userContext =
                        (await reactMutationOptions.onMutate(variables)) || {};
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
                error: unknown,
                variables: Partial<UseUpdateManyMutateParams<RecordType>> = {},
                context: { snapshot: Snapshot }
            ) => {
                if (
                    mode.current === 'optimistic' ||
                    mode.current === 'undoable'
                ) {
                    // If the mutation fails, use the context returned from onMutate to rollback
                    context.snapshot.forEach(([key, value]) => {
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
                data: Array<RecordType['id']>,
                variables: Partial<UseUpdateManyMutateParams<RecordType>> = {},
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
                data: Array<RecordType['id']>,
                error: unknown,
                variables: Partial<UseUpdateManyMutateParams<RecordType>> = {},
                context: { snapshot: Snapshot }
            ) => {
                if (
                    mode.current === 'optimistic' ||
                    mode.current === 'undoable'
                ) {
                    // Always refetch after error or success:
                    context.snapshot.forEach(([key]) => {
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

    const updateMany = async (
        callTimeResource: string = resource,
        callTimeParams: Partial<UpdateManyParams<RecordType>> = {},
        updateOptions: MutateOptions<
            Array<RecordType['id']>,
            unknown,
            Partial<UseUpdateManyMutateParams<RecordType>>,
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
            ids: callTimeIds = ids,
            data: callTimeData = data,
        } = callTimeParams;

        // optimistic update as documented in https://react-query.tanstack.com/guides/optimistic-updates
        // except we do it in a mutate wrapper instead of the onMutate callback
        // to have access to success side effects

        const queryKeys = [
            [callTimeResource, 'getOne'],
            [callTimeResource, 'getList'],
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
         * @see https://react-query.tanstack.com/reference/QueryClient#queryclientgetqueriesdata
         */
        snapshot.current = queryKeys.reduce(
            (prev, curr) => prev.concat(queryClient.getQueriesData(curr)),
            [] as Snapshot
        );

        // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
        await Promise.all(
            snapshot.current.map(([key]) => queryClient.cancelQueries(key))
        );

        // Optimistically update to the new data
        await updateCache({
            resource: callTimeResource,
            ids: callTimeIds,
            data: callTimeData,
        });

        // run the success callbacks during the next tick
        if (onSuccess) {
            setTimeout(
                () =>
                    onSuccess(
                        callTimeIds,
                        { resource: callTimeResource, ...callTimeParams },
                        { snapshot: snapshot.current }
                    ),
                0
            );
        }
        if (reactMutationOptions.onSuccess) {
            setTimeout(
                () =>
                    reactMutationOptions.onSuccess(
                        callTimeIds,
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
                { onSettled, onError }
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
                        { onSettled, onError }
                    );
                }
            });
        }
    };

    return [updateMany, mutation];
};

type Snapshot = [key: QueryKey, value: any][];

export interface UseUpdateManyMutateParams<RecordType extends Record = Record> {
    resource?: string;
    ids?: Array<RecordType['id']>;
    data?: Partial<RecordType>;
    previousData?: any;
}

export type UseUpdateManyOptions<
    RecordType extends Record = Record
> = UseMutationOptions<
    Array<RecordType['id']>,
    unknown,
    Partial<UseUpdateManyMutateParams<RecordType>>
> & { mutationMode?: MutationMode };

export type UseUpdateManyResult<RecordType extends Record = Record> = [
    (
        resource?: string,
        params?: Partial<UpdateManyParams<RecordType>>,
        options?: MutateOptions<
            Array<RecordType['id']>,
            unknown,
            Partial<UseUpdateManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode }
    ) => Promise<void>,
    UseMutationResult<
        Array<RecordType['id']>,
        unknown,
        Partial<UpdateManyParams<Partial<RecordType>> & { resource?: string }>,
        unknown
    >
];
