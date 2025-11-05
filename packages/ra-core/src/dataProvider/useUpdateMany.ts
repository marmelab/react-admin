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
    UpdateManyParams,
    MutationMode,
    GetListResult as OriginalGetListResult,
    GetInfiniteListResult,
    DataProvider,
    UpdateManyResult,
} from '../types';
import { useMutationWithMutationMode } from './useMutationWithMutationMode';
import { useEvent } from '../util';

/**
 * Get a callback to call the dataProvider.updateMany() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The updateMany parameters { ids, data, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.ids The resource identifiers, e.g. [123, 456]
 * @prop params.data The updates to merge into the record, e.g. { views: 10 }
 * @prop params.meta Optional meta parameters
 *
 * @returns The current mutation state. Destructure as [updateMany, { data, error, isPending }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [updateMany, { isPending: false, isIdle: true }]
 * - start:   [updateMany, { isPending: true }]
 * - success: [updateMany, { data: [data from response], isPending: false, isSuccess: true }]
 * - error:   [updateMany, { error: [error from response], isPending: false, isError: true }]
 *
 * The updateMany() function must be called with a resource and a parameter object: updateMany(resource, { ids, data, previousData }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://tanstack.com/query/v5/docs/react/reference/useMutation
 *
 * @example // set params when calling the updateMany callback
 *
 * import { useUpdateMany, useListContext } from 'react-admin';
 *
 * const BulkResetViewsButton = () => {
 *     const { selectedIds } = useListContext();
 *     const [updateMany, { isPending, error }] = useUpdateMany();
 *     const handleClick = () => {
 *         updateMany('posts', { ids: selectedIds, data: { views: 0 } });
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={handleClick}>Reset views</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdateMany, useListContext } from 'react-admin';
 *
 * const BulkResetViewsButton = () => {
 *     const { selectedIds } = useListContext();
 *     const [updateMany, { isPending, error }] = useUpdateMany('posts', { ids: selectedIds, data: { views: 0 } });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isPending} onClick={() => updateMany()}>Reset views</button>;
 * };
 */
export const useUpdateMany = <
    RecordType extends RaRecord = any,
    MutationError = unknown,
>(
    resource?: string,
    params: Partial<UpdateManyParams<Partial<RecordType>>> = {},
    options: UseUpdateManyOptions<RecordType, MutationError> = {}
): UseUpdateManyResult<RecordType, boolean, MutationError> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const {
        mutationMode = 'pessimistic',
        getMutateWithMiddlewares,
        ...mutationOptions
    } = options;

    const dataProviderUpdateMany = useEvent(
        (resource: string, params: UpdateManyParams<RecordType>) =>
            dataProvider.updateMany<RecordType>(resource, params)
    );

    const [mutate, mutationResult] = useMutationWithMutationMode<
        MutationError,
        UpdateManyResult<RecordType>,
        UseUpdateManyMutateParams<RecordType>
    >(
        { resource, ...params },
        {
            ...mutationOptions,
            mutationKey: [resource, 'updateMany', params],
            mutationMode,
            mutationFn: ({ resource, ...params }) => {
                if (resource == null) {
                    throw new Error(
                        'useUpdateMany mutation requires a resource'
                    );
                }
                if (params.ids == null) {
                    throw new Error(
                        'useUpdateMany mutation requires an array of ids'
                    );
                }
                if (!params.data) {
                    throw new Error(
                        'useUpdateMany mutation requires a non-empty data object'
                    );
                }
                return dataProviderUpdateMany(
                    resource,
                    params as UpdateManyParams<RecordType>
                );
            },
            updateCache: ({ resource, ...params }, { mutationMode }) => {
                // hack: only way to tell react-query not to fetch this query for the next 5 seconds
                // because setQueryData doesn't accept a stale time option
                const updatedAt =
                    mutationMode === 'undoable'
                        ? Date.now() + 1000 * 5
                        : Date.now();
                // Stringify and parse the data to remove undefined values.
                // If we don't do this, an update with { id: undefined } as payload
                // would remove the id from the record, which no real data provider does.
                const clonedData = params?.data
                    ? JSON.parse(JSON.stringify(params?.data))
                    : undefined;

                const updateColl = (old: RecordType[]) => {
                    if (!old) return old;
                    let newCollection = [...old];
                    (params?.ids ?? []).forEach(id => {
                        // eslint-disable-next-line eqeqeq
                        const index = old.findIndex(record => record.id == id);
                        if (index === -1) {
                            return;
                        }
                        newCollection = [
                            ...newCollection.slice(0, index),
                            { ...newCollection[index], ...clonedData },
                            ...newCollection.slice(index + 1),
                        ];
                    });
                    return newCollection;
                };

                type GetListResult = Omit<OriginalGetListResult, 'data'> & {
                    data?: RecordType[];
                };

                (params?.ids ?? []).forEach(id => {
                    queryClient.setQueryData(
                        [
                            resource,
                            'getOne',
                            { id: String(id), meta: params?.meta },
                        ],
                        (record: RecordType) => ({
                            ...record,
                            ...clonedData,
                        }),
                        { updatedAt }
                    );
                });
                queryClient.setQueriesData(
                    { queryKey: [resource, 'getList'] },
                    (res: GetListResult) =>
                        res && res.data
                            ? { ...res, data: updateColl(res.data) }
                            : res,
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
                            ? { ...res, data: updateColl(res.data) }
                            : res,
                    { updatedAt }
                );

                return params?.ids;
            },
            getQueryKeys: ({ resource }) => {
                const queryKeys = [
                    [resource, 'getOne'],
                    [resource, 'getList'],
                    [resource, 'getInfiniteList'],
                    [resource, 'getMany'],
                    [resource, 'getManyReference'],
                ];
                return queryKeys;
            },
            getMutateWithMiddlewares: mutationFn => {
                if (getMutateWithMiddlewares) {
                    // Immediately get the function with middlewares applied so that even if the middlewares gets unregistered (because of a redirect for instance),
                    // we still have them applied when users have called the mutate function.
                    const mutateWithMiddlewares = getMutateWithMiddlewares(
                        dataProviderUpdateMany.bind(dataProvider)
                    );
                    return args => {
                        // This is necessary to avoid breaking changes in useUpdateMany:
                        // The mutation function must have the same signature as before (resource, params) and not ({ resource, params })
                        const { resource, ...params } = args;
                        return mutateWithMiddlewares(resource, params);
                    };
                }

                return args => mutationFn(args);
            },
        }
    );

    const updateMany = useEvent(
        (
            callTimeResource: string | undefined = resource,
            callTimeParams: Partial<UpdateManyParams<RecordType>> = {},
            callTimeOptions: MutateOptions<
                Array<RecordType['id']> | undefined,
                MutationError,
                Partial<UseUpdateManyMutateParams<RecordType>>,
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
    return [updateMany, mutationResult];
};

export interface UseUpdateManyMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    ids?: Array<RecordType['id']>;
    data?: Partial<RecordType>;
    previousData?: any;
    meta?: any;
}

export type UseUpdateManyOptions<
    RecordType extends RaRecord = any,
    MutationError = unknown,
> = Omit<
    UseMutationOptions<
        Array<RecordType['id']>,
        MutationError,
        Partial<UseUpdateManyMutateParams<RecordType>>
    >,
    'mutationFn'
> & {
    mutationMode?: MutationMode;
    returnPromise?: boolean;
    getMutateWithMiddlewares?: <
        UpdateFunctionType extends
            DataProvider['updateMany'] = DataProvider['updateMany'],
    >(
        mutate: UpdateFunctionType
    ) => (
        ...Params: Parameters<UpdateFunctionType>
    ) => ReturnType<UpdateFunctionType>;
};

export type UseUpdateManyResult<
    RecordType extends RaRecord = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
> = [
    (
        resource?: string,
        params?: Partial<UpdateManyParams<RecordType>>,
        options?: MutateOptions<
            Array<RecordType['id']>,
            MutationError,
            Partial<UseUpdateManyMutateParams<RecordType>>,
            unknown
        > & { mutationMode?: MutationMode; returnPromise?: TReturnPromise }
    ) => Promise<TReturnPromise extends true ? Array<RecordType['id']> : void>,
    UseMutationResult<
        Array<RecordType['id']> | undefined,
        MutationError,
        Partial<UpdateManyParams<Partial<RecordType>> & { resource?: string }>,
        unknown
    > & { isLoading: boolean },
];
