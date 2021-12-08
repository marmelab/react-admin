import { Record, GetOneParams } from '../types';
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
 * @param {Params} params The getOne parameters { id }, e.g. { id: 123 }
 * @param {Options} options Options object to pass to the react-query queryClient.
 *
 * @typedef Params
 * @property id a resource identifier, e.g. 123
 *
 * @typedef Options
 * @property enabled Flag to conditionally run the query. If it's false, the query will not run
 * @property onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @property onError Side effect function to be executed upon failure, e.g. { onError: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetOne } from 'react-admin';
 *
 * const UserProfile = ({ record }) => {
 *     const { data, isLoading, error } = useGetOne('users', { id: record.id });
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 */
export const useGetOne = <RecordType extends Record = Record>(
    resource: string,
    { id }: GetOneParams,
    options?: UseQueryOptions<RecordType>
): UseGetOneHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    return useQuery<RecordType, unknown, RecordType>(
        // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
        // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
        // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
        [resource, 'getOne', String(id)],
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
