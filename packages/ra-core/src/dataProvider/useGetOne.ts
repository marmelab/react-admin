import { Identifier, Record } from '../types';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import useDataProvider from './useDataProvider';

/**
 * Call the dataProvider.getOne() method and return the resolved value
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isLoading: true, isFetching: true, refetch }
 * - success: { data: [data from response], isLoading: false, refetch }
 * - error: { error: [error from response], isLoading: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param {Object} options Options object to pass to the react-query queryClient.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onError Side effect function to be executed upon failure, e.g. { onError: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetOne } from 'react-admin';
 *
 * const UserProfile = ({ record }) => {
 *     const { data, isLoading, error } = useGetOne('users', record.id);
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 */
const useGetOne = <RecordType extends Record = Record>(
    resource: string,
    id: Identifier,
    options?: UseQueryOptions<RecordType>
): UseGetOneHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    return useQuery<RecordType, unknown, RecordType>(
        [resource, 'getOne', id],
        () =>
            dataProvider
                .getOne<RecordType>(resource, { id })
                .then(({ data }) => data),
        options
    );
};

export type UseGetOneHookValue<
    RecordType extends Record = Record
> = UseQueryResult<RecordType>;

export default useGetOne;
