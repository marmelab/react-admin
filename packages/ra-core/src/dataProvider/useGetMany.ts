import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
    hashQueryKey,
} from 'react-query';

import { RaRecord, GetManyParams } from '../types';
import { useDataProvider } from './useDataProvider';

/**
 * Call the dataProvider.getMany() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isLoading: true, refetch }
 * - success: { data: [data from store], isLoading: false, refetch }
 * - error: { error: [error from response], isLoading: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getMany parameters { ids, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.ids The ids to get, e.g. [123, 456, 789]
 * @prop params.meta Optional meta parameters
 *
 * @returns The current request state. Destructure as { data, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetMany } from 'react-admin';
 *
 * const PostTags = ({ post }) => {
 *     const { data, isLoading, error } = useGetMany(
 *         'tags',
 *         { ids: post.tags },
 *     );
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(tag =>
 *         <li key={tag.id}>{tag.name}</li>
 *     )}</ul>;
 * };
 */
export const useGetMany = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetManyParams> = {},
    options?: UseQueryOptions<RecordType[], Error>
): UseGetManyHookValue<RecordType> => {
    const { ids, meta } = params;
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();

    return useQuery<RecordType[], Error, RecordType[]>(
        [
            resource,
            'getMany',
            {
                ids: !ids || ids.length === 0 ? [] : ids.map(id => String(id)),
                meta,
            },
        ],
        () => {
            if (!ids || ids.length === 0) {
                // no need to call the dataProvider
                return Promise.resolve([]);
            }
            return dataProvider
                .getMany<RecordType>(resource, { ids, meta })
                .then(({ data }) => data);
        },
        {
            placeholderData: () => {
                const records =
                    !ids || ids.length === 0
                        ? []
                        : ids.map(id => {
                              const queryHash = hashQueryKey([
                                  resource,
                                  'getOne',
                                  { id: String(id), meta },
                              ]);
                              return queryCache.get<RecordType>(queryHash)
                                  ?.state?.data;
                          });
                if (records.some(record => record === undefined)) {
                    return undefined;
                } else {
                    return records as RecordType[];
                }
            },
            onSuccess: data => {
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', { id: String(record.id), meta }],
                        oldRecord => oldRecord ?? record
                    );
                });
            },
            retry: false,
            ...options,
        }
    );
};

export type UseGetManyHookValue<
    RecordType extends RaRecord = any
> = UseQueryResult<RecordType[], Error>;
