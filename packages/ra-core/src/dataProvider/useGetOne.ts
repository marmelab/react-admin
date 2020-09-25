import get from 'lodash/get';

import { Identifier, Record, ReduxState } from '../types';
import useQueryWithStore from './useQueryWithStore';

/**
 * Call the dataProvider.getOne() method and return the resolved value
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, error, loading, loaded }.
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
    options?: any
): UseGetOneHookValue<RecordType> =>
    useQueryWithStore(
        { type: 'getOne', resource, payload: { id } },
        options,
        (state: ReduxState) => {
            if (
                // resources are registered
                Object.keys(state.admin.resources).length > 0 &&
                // no registered resource mathing the query
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
};

export default useGetOne;
