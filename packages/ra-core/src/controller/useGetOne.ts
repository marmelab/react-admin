import { crudGetOne } from '../actions';
import { ReduxState, Record, Identifier } from '../types';
import useOptimisticQuery from './useOptimisticQuery';

export interface GetOneResponse {
    data?: Record;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

/**
 * @typedef GetOneResponse
 * @type {Object}
 * @property {Object} data
 * @property {boolean} loading
 * @property {boolean} loaded
 * @property {Object} error
 */

/**
 * Fetches a record by resource name and id and returns that record.
 *
 * Optimistically loads the record from the store if it was already fetched before.
 *
 * @example const { data } = useGetOne('posts', 123);
 *
 * @param {string} resource The resource name, e.g. "posts"
 * @param {string|int} id the resource identifier, e.g. 123
 * @param {object} meta the action meta (including side effects)
 * @param {number} version An optional integer used to force fetching the record again
 *
 * @returns {GetOneResponse} An object with the shape { data, error, loading, loaded }
 */
const useGetOne = (
    resource: string,
    id: Identifier,
    meta: any = {},
    version: number
): GetOneResponse => {
    return useOptimisticQuery(
        crudGetOne(resource, id, meta),
        (state: ReduxState) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].data[id]
                : null,
        version
    );
};

export default useGetOne;
