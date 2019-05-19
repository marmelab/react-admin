import { useEffect } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { crudGetOne } from '../actions';
import { ReduxState, Record, Identifier } from '../types';

export interface GetOneResponse {
    record?: Record;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

/**
 * @typedef GetOneResponse
 * @type {Object}
 * @property {Object} record
 * @property {boolean} loading
 * @property {boolean} loaded
 * @property {Object} error
 */

/**
 * Fetches a record by resource name and id and returns that record.
 *
 * Optimistically loads the rrcord from the store if it was already fetched before.
 *
 * @example const { record } = useGetOne('posts', 123, '/posts');
 *
 * @param {string} resource The resource name, e.g. "posts"
 * @param {string|int} id the resource identifier, e.g. 123
 * @param {string} basePath the currrent url basePath. Used for redirections.
 * @param {number} version An optional integer used to force fetching the record again
 *
 * @returns {GetOneResponse} An object with the shape { record, error, loading, loaded }
 */
const useGetOne = (
    resource: string,
    id: Identifier,
    basePath?: string,
    version?: number
): GetOneResponse => {
    const dispatch = useDispatch();
    const action = crudGetOne(resource, id, basePath);
    useEffect(() => {
        dispatch(action);
    }, [resource, id, basePath, version]);
    const record = useSelector((state: ReduxState) =>
        state.admin.resources[resource]
            ? state.admin.resources[resource].data[id]
            : null
    );
    const { loading, loaded, error } = useSelector((state: ReduxState) => {
        const key = JSON.stringify({
            type: action.meta.fetch,
            payload: action.payload,
        });
        return state.admin.requests && state.admin.requests[key]
            ? state.admin.requests[key]
            : { loading: false, loaded: false };
    });
    return { record, loading, loaded, error };
};

export default useGetOne;
