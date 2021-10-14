import get from 'lodash/get';

import {
    Identifier,
    Record,
    ReduxState,
    UseDataProviderOptions,
} from '../types';
import { useQueryWithStore, Refetch } from './useQueryWithStore';

/**
 * Call the dataProvider.getOne() method and return the resolved value
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
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param {Object} options Options object to pass to the dataProvider.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, error, loading, loaded, refetch }.
 *
 * @example
 *
 * import { useGetOne } from 'react-admin';
 *
 * const UserProfile = ({ record }) => {
 *     const { data, loading, error } = useGetOne('users', record.id);
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 */
const useGetOne = <RecordType extends Record = Record>(
    resource: string,
    id: Identifier,
    options?: UseDataProviderOptions
): UseGetOneHookValue<RecordType> =>
    useQueryWithStore(
        { type: 'getOne', resource, payload: { id } },
        options,
        (state: ReduxState) => {
            if (
                // resources are registered
                Object.keys(state.admin.resources).length > 0 &&
                // no registered resource matching the query
                !state.admin.resources[resource]
            ) {
                throw new Error(
                    `No <Resource> defined for "${resource}". useGetOne() relies on the Redux store, so it cannot work if you don't include a <Resource>.`
                );
            }
            return get(state, ['admin', 'resources', resource, 'data', id]);
        }
    );

export type UseGetOneHookValue<RecordType extends Record = Record> = {
    data?: RecordType;
    loading: boolean;
    loaded: boolean;
    error?: any;
    refetch: Refetch;
};

export default useGetOne;
