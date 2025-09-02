import {
    useQueryClient,
    type UseMutationOptions,
    type UseMutationResult,
    type MutateOptions,
    type UseInfiniteQueryResult,
    type InfiniteData,
} from '@tanstack/react-query';

import { useDataProvider } from './useDataProvider';
import type {
    RaRecord,
    DeleteParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
} from '../types';
import {
    type Snapshot,
    useMutationWithMutationMode,
} from './useMutationWithMutationMode';
import { useEvent } from '../util';

/**
 * Get a callback to call the dataProvider.delete() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The delete parameters { id, previousData }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.id The resource identifier, e.g. 123
 * @prop params.previousData The record before the update is applied
 *
 * @returns The current mutation state. Destructure as [deleteOne, { data, error, isPending }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [deleteOne, { isPending: false, isIdle: true }]
 * - start:   [deleteOne, { isPending: true }]
 * - success: [deleteOne, { data: [data from response], isPending: false, isSuccess: true }]
 * - error:   [deleteOne, { error: [error from response], isPending: false, isError: true }]
 *
 * The deleteOne() function must be called with a resource and a parameter object: deleteOne(resource, { id, previousData, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://tanstack.com/query/v5/docs/react/reference/useMutation
 *
 * @example // set params when calling the deleteOne callback
 *
 * import { useDelete, useRecordContext } from 'react-admin';
 *
 * const DeleteButton = () => {
 *     const record = useRecordContext();
 *     const [deleteOne, { isPending, error }] = useDelete();
 *     const handleClick = () => {
 *         deleteOne('likes', { id: record.id, previousData: record })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Delete</div>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useDelete, useRecordContext } from 'react-admin';
 *
 * const DeleteButton = () => {
 *     const record = useRecordContext();
 *     const [deleteOne, { isPending, error }] = useDelete('likes', { id: record.id, previousData: record });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={() => deleteOne()}>Delete</button>;
 * };
 *
 * @example // TypeScript
 * const [delete, { data }] = useDelete<Product>('products', { id, previousData: product });
 *                    \-- data is Product
 */
export const useDelete = <
    RecordType extends RaRecord = any,
    MutationError = unknown,
>(
    resource?: string,
    params: Partial<DeleteParams<RecordType>> = {},
    options: UseDeleteOptions<RecordType, MutationError> = {}
): UseDeleteResult<RecordType, MutationError> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { mutationMode = 'pessimistic', ...mutationOptions } = options;

    const updateCache = useEvent(
        (
            resource: string,
            { id }: Partial<DeleteParams<RecordType>>,
            { mutationMode }: { mutationMode: MutationMode }
        ) => {
            // hack: only way to tell react-query not to fetch this query for the next 5 seconds
            // because setQueryData doesn't accept a stale time option
            const now = Date.now();
            const updatedAt =
                mutationMode === 'undoable' ? now + 5 * 1000 : now;

            const updateColl = (old: RecordType[]) => {
                if (!old) return old;
                const index = old.findIndex(
                    // eslint-disable-next-line eqeqeq
                    record => record.id == id
                );
                if (index === -1) {
                    return old;
                }
                return [...old.slice(0, index), ...old.slice(index + 1)];
            };

            type GetListResult = Omit<OriginalGetListResult, 'data'> & {
                data?: RecordType[];
            };

            queryClient.setQueriesData(
                { queryKey: [resource, 'getList'] },
                (res: GetListResult) => {
                    if (!res || !res.data) return res;
                    const newCollection = updateColl(res.data);
                    const recordWasFound =
                        newCollection.length < res.data.length;
                    return recordWasFound
                        ? {
                              data: newCollection,
                              total: res.total ? res.total - 1 : undefined,
                              pageInfo: res.pageInfo,
                          }
                        : res;
                },
                { updatedAt }
            );
            queryClient.setQueriesData(
                { queryKey: [resource, 'getInfiniteList'] },
                (
                    res: UseInfiniteQueryResult<
                        InfiniteData<GetInfiniteListResult>
                    >['data']
                ) => {
                    if (!res || !res.pages) return res;
                    return {
                        ...res,
                        pages: res.pages.map(page => {
                            const newCollection = updateColl(page.data);
                            const recordWasFound =
                                newCollection.length < page.data.length;
                            return recordWasFound
                                ? {
                                      ...page,
                                      data: newCollection,
                                      total: page.total
                                          ? page.total - 1
                                          : undefined,
                                      pageInfo: page.pageInfo,
                                  }
                                : page;
                        }),
                    };
                },
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
                (res: GetListResult) => {
                    if (!res || !res.data) return res;
                    const newCollection = updateColl(res.data);
                    const recordWasFound =
                        newCollection.length < res.data.length;
                    return recordWasFound
                        ? {
                              data: newCollection,
                              total: res.total! - 1,
                          }
                        : res;
                },
                { updatedAt }
            );

            return {
                id,
            };
        }
    );

    const getSnapshot = useEvent((resource: string) => {
        const queryKeys = [
            [resource, 'getList'],
            [resource, 'getInfiniteList'],
            [resource, 'getMany'],
            [resource, 'getManyReference'],
        ];

        /**
         * Snapshot the previous values via queryClient.getQueriesData()
         *
         * The snapshotData ref will contain an array of tuples [query key, associated data]
         *
         * @example
         * [
         *   [['posts', 'getList'], { data: [{ id: 1, title: 'Hello' }], total: 1 }],
         *   [['posts', 'getMany'], [{ id: 1, title: 'Hello' }]],
         * ]
         *
         * @see https://tanstack.com/query/v5/docs/react/reference/QueryClient#queryclientgetqueriesdata
         */
        const snapshot = queryKeys.reduce(
            (prev, queryKey) =>
                prev.concat(queryClient.getQueriesData({ queryKey })),
            [] as Snapshot
        );

        return snapshot;
    });

    return useMutationWithMutationMode(resource, params, {
        ...mutationOptions,
        mutationKey: [resource, 'delete', params],
        mutationMode,
        mutationFn: dataProvider.delete.bind(dataProvider),
        updateCache,
        getSnapshot,
    });
};

export interface UseDeleteMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    id?: RecordType['id'];
    data?: Partial<RecordType>;
    previousData?: any;
    meta?: any;
}

export type UseDeleteOptions<
    RecordType extends RaRecord = any,
    MutationError = unknown,
> = UseMutationOptions<
    RecordType,
    MutationError,
    Partial<UseDeleteMutateParams<RecordType>>
> & {
    mutationMode?: MutationMode;
    onSuccess?: (
        data: RecordType | undefined,
        variables: Partial<UseDeleteMutateParams<RecordType>>,
        context: unknown
    ) => void;
};

export type UseDeleteResult<
    RecordType extends RaRecord = any,
    MutationError = unknown,
> = [
    (
        resource?: string,
        params?: Partial<DeleteParams<RecordType>>,
        options?: MutateOptions<
            RecordType,
            MutationError,
            Partial<UseDeleteMutateParams<RecordType>>,
            unknown
        > & {
            mutationMode?: MutationMode;
        }
    ) => Promise<void>,
    UseMutationResult<
        RecordType,
        MutationError,
        Partial<DeleteParams<RecordType> & { resource?: string }>,
        unknown
    > & { isLoading: boolean },
];
