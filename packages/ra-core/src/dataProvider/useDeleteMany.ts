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
    DeleteManyParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
    DeleteManyResult,
} from '../types';
import { useEvent } from '../util';
import {
    type Snapshot,
    useMutationWithMutationMode,
} from './useMutationWithMutationMode';

/**
 * Get a callback to call the dataProvider.delete() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The delete parameters { ids }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.ids The resource identifiers, e.g. [123, 456]
 *
 * @returns The current mutation state. Destructure as [deleteMany, { data, error, isPending }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [deleteMany, { isPending: false, isIdle: true }]
 * - start:   [deleteMany, { isPending: true }]
 * - success: [deleteMany, { data: [data from response], isPending: false, isSuccess: true }]
 * - error:   [deleteMany, { error: [error from response], isPending: false, isError: true }]
 *
 * The deleteMany() function must be called with a resource and a parameter object: deleteMany(resource, { ids, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://tanstack.com/query/v5/docs/react/reference/useMutation
 *
 * @example // set params when calling the deleteMany callback
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { isPending, error }] = useDeleteMany();
 *     const handleClick = () => {
 *         deleteMany('posts', { ids: selectedIds })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { isPending, error }] = useDeleteMany('posts', { ids: selectedIds });
 *     const handleClick = () => {
 *         deleteMany()
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
 * };
 *
 * @example // TypeScript
 * const [deleteMany, { data }] = useDeleteMany<Product>('products', { ids });
 *                        \-- data is Product
 */
export const useDeleteMany = <
    RecordType extends RaRecord = any,
    MutationError = unknown,
>(
    resource?: string,
    params: Partial<DeleteManyParams<RecordType>> = {},
    options: UseDeleteManyOptions<RecordType, MutationError> = {}
): UseDeleteManyResult<RecordType, MutationError> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { mutationMode = 'pessimistic', ...mutationOptions } = options;

    const [mutate, mutationResult] = useMutationWithMutationMode<
        MutationError,
        DeleteManyResult<RecordType>,
        UseDeleteManyMutateParams<RecordType>
    >(
        { resource, ...params },
        {
            ...mutationOptions,
            mutationKey: [resource, 'deleteMany', params],
            mutationMode,
            mutationFn: ({ resource, ...params }) => {
                if (resource == null) {
                    throw new Error(
                        'useDeleteMany mutation requires a resource'
                    );
                }
                if (params.ids == null) {
                    throw new Error(
                        'useDeleteMany mutation requires an array of ids'
                    );
                }
                return dataProvider.deleteMany<RecordType>(
                    resource,
                    params as DeleteManyParams<RecordType>
                );
            },
            updateCache: ({ resource, ...params }, { mutationMode }) => {
                // hack: only way to tell react-query not to fetch this query for the next 5 seconds
                // because setQueryData doesn't accept a stale time option
                const now = Date.now();
                const updatedAt =
                    mutationMode === 'undoable' ? now + 5 * 1000 : now;

                const updateColl = (old: RecordType[]) => {
                    if (!old) return old;
                    let newCollection = [...old];
                    params.ids?.forEach(id => {
                        const index = newCollection.findIndex(
                            // eslint-disable-next-line eqeqeq
                            record => record.id == id
                        );
                        if (index === -1) {
                            return;
                        }
                        newCollection = [
                            ...newCollection.slice(0, index),
                            ...newCollection.slice(index + 1),
                        ];
                    });
                    return newCollection;
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
                                  ...res,
                                  data: newCollection,
                                  total: res.total
                                      ? res.total -
                                        (res.data.length - newCollection.length)
                                      : undefined,
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
                                              ? page.total -
                                                (page.data.length -
                                                    newCollection.length)
                                              : undefined,
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
                        if (!recordWasFound) {
                            return res;
                        }
                        if (res.total) {
                            return {
                                ...res,
                                data: newCollection,
                                total:
                                    res.total -
                                    (res.data.length - newCollection.length),
                            };
                        }
                        if (res.pageInfo) {
                            return {
                                ...res,
                                data: newCollection,
                            };
                        }
                        throw new Error(
                            'Found getManyReference result in cache without total or pageInfo'
                        );
                    },
                    { updatedAt }
                );

                return params.ids;
            },
            getQueryKeys: ({ resource }) => {
                const queryKeys = [
                    [resource, 'getList'],
                    [resource, 'getInfiniteList'],
                    [resource, 'getMany'],
                    [resource, 'getManyReference'],
                ];
                return queryKeys;
            },
            onSettled: (
                result,
                error,
                variables,
                context: { snapshot: Snapshot }
            ) => {
                // For deletion, we always refetch after error or success:
                context.snapshot.forEach(([queryKey]) => {
                    queryClient.invalidateQueries({ queryKey });
                });
            },
        }
    );

    const deleteMany = useEvent(
        (
            callTimeResource: string | undefined = resource,
            callTimeParams: Partial<DeleteManyParams<RecordType>> = {},
            callTimeOptions: MutateOptions<
                Array<RecordType['id']>,
                MutationError,
                Partial<UseDeleteManyMutateParams<RecordType>>,
                unknown
            > & {
                mutationMode?: MutationMode;
                returnPromise?: boolean;
            } = {}
        ) => {
            return mutate(
                {
                    resource: callTimeResource,
                    ...callTimeParams,
                },
                callTimeOptions
            );
        }
    );

    return [deleteMany, mutationResult];
};

export interface UseDeleteManyMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    ids?: Array<RecordType['id']>;
    meta?: any;
}

export type UseDeleteManyOptions<
    RecordType extends RaRecord = any,
    MutationError = unknown,
    TReturnPromise extends boolean = boolean,
> = Omit<
    UseMutationOptions<
        Array<RecordType['id']> | undefined,
        MutationError,
        Partial<UseDeleteManyMutateParams<RecordType>>
    >,
    'mutationFn'
> & { mutationMode?: MutationMode; returnPromise?: TReturnPromise };

export type UseDeleteManyResult<
    RecordType extends RaRecord = any,
    MutationError = unknown,
    TReturnPromise extends boolean = boolean,
> = [
    (
        resource?: string,
        params?: Partial<DeleteManyParams<RecordType>>,
        options?: MutateOptions<
            Array<RecordType['id']> | undefined,
            MutationError,
            Partial<UseDeleteManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode; returnPromise?: TReturnPromise }
    ) => Promise<
        TReturnPromise extends true ? Array<RecordType['id']> | undefined : void
    >,
    UseMutationResult<
        Array<RecordType['id']> | undefined,
        MutationError,
        Partial<DeleteManyParams<RecordType> & { resource?: string }>,
        unknown
    > & { isLoading: boolean },
];
