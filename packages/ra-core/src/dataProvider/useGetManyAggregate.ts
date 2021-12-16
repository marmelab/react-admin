import {
    QueryClient,
    useQueryClient,
    useQuery,
    UseQueryOptions,
} from 'react-query';
import union from 'lodash/union';

import { UseGetManyHookValue } from './useGetMany';
import { Identifier, Record, GetManyParams, DataProviderProxy } from '../types';
import { useDataProvider } from '.';

/**
 * Call the dataProvider.getMany() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false, refetch }
 * - success: { data: [data from response], loading: false, loaded: true, refetch }
 * - error: { error: [error from response], loading: false, loaded: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * This hook aggregates and deduplicates calls to the same resource, so for instance, if an app calls:
 *
 * useGetMany('tags', [1, 2, 3]);
 * useGetMany('tags', [3, 4]);
 *
 * during the same tick, the hook will only call the dataProvider once with the following parameters:
 *
 * dataProvider.getMany('tags', [1, 2, 3, 4])
 *
 * @param resource The resource name, e.g. 'posts'
 * @param ids The resource identifiers, e.g. [123, 456, 789]
 * @param {Object} options Options object to pass to the dataProvider.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onError Side effect function to be executed upon failure, e.g. { onError: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, error, loading, loaded, refetch }.
 *
 * @example
 *
 * import { useGetMany } from 'react-admin';
 *
 * const PostTags = ({ record }) => {
 *     const { data, loading, error } = useGetMany('tags', record.tagIds);
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return (
 *          <ul>
 *              {data.map(tag => (
 *                  <li key={tag.id}>{tag.name}</li>
 *              ))}
 *          </ul>
 *      );
 * };
 */
export const useGetManyAggregate = <RecordType extends Record = Record>(
    resource: string,
    params: GetManyParams,
    options: UseQueryOptions<RecordType[], Error>
): UseGetManyHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { ids } = params;

    return useQuery<RecordType[], Error, RecordType[]>(
        [resource, 'getMany', { ids: ids.map(id => String(id)) }],
        () =>
            new Promise((resolve, reject) => {
                callQueries({
                    resource,
                    ids,
                    dataProvider,
                    queryClient,
                    resolve,
                    reject,
                });
            }),
        {
            onSuccess: data => {
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', String(record.id)],
                        record
                    );
                });
            },
            ...options,
        }
    );
};

/**
 * Batch all calls to a function into one single call with the arguments of all the calls.
 *
 * @example
 * let sum = 0;
 * const add = (args) => { sum = args.reduce((arg, total) => total + arg, 0); };
 * const addBatched = batch(add);
 * addBatched(2);
 * addBatched(8);
 * // add will be called once with arguments [2, 8]
 * // and sum will be equal to 10
 */
const batch = fn => {
    let capturedArgs = [];
    let timeout = null;
    return arg => {
        capturedArgs.push(arg);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            fn(capturedArgs);
            capturedArgs = [];
        }, 0);
    };
};

interface GetManyCallArgs {
    resource: string;
    ids: Identifier[];
    dataProvider: DataProviderProxy;
    queryClient: QueryClient;
    resolve: (data: any[]) => void;
    reject: (error?: any) => void;
}

const callQueries = batch((calls: GetManyCallArgs[]) => {
    const dataProvider = calls[0].dataProvider;
    const queryClient = calls[0].queryClient;

    // aggregate by resource
    const callsByResource = calls.reduce((acc, callArgs) => {
        if (!acc[callArgs.resource]) {
            acc[callArgs.resource] = [];
        }
        acc[callArgs.resource].push(callArgs);
        return acc;
    }, {} as { [resource: string]: GetManyCallArgs[] });

    // For each resource, call dataProvider.getMany() once
    Object.keys(callsByResource).forEach(resource => {
        const callsForResource = callsByResource[resource];
        /**
         * Extract ids from queries, aggregate and deduplicate them
         *
         * @example from [[1, 2], [2, null, 3], [4, null]] to [1, 2, 3, 4]
         */
        const accumulatedIds = callsForResource
            .reduce((acc, { ids }) => union(acc, ids), []) // concat + unique
            .filter(v => v != null && v !== ''); // remove null values

        if (accumulatedIds.length === 0) {
            // no need to call the data provider if all the ids are null
            callsForResource.forEach(({ resolve }) => {
                resolve([]);
            });
            return;
        }
        queryClient
            .fetchQuery<any[], Error, any[]>(
                [
                    resource,
                    'getMany',
                    { ids: accumulatedIds.map(id => String(id)) },
                ],
                () =>
                    dataProvider
                        .getMany<any>(resource, { ids: accumulatedIds })
                        .then(({ data }) => data)
            )
            .then(data => {
                callsForResource.forEach(({ ids, resolve }) => {
                    resolve(data.filter(record => ids.includes(record.id)));
                });
            })
            .catch(error =>
                callsForResource.forEach(({ reject }) => reject(error))
            );
    });
});
