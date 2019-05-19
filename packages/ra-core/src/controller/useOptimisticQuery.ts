import { useEffect } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

import { ReduxState } from '../types';

export interface AsyncQueryResponse {
    data?: any;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

export interface FetchAction {
    type: string;
    payload: any;
    meta: {
        fetch: string;
        resource: string;
        onSuccess?: any;
        onFailure?: any;
    };
}

/**
 * @typedef AsyncQueryResponse
 * @type {Object}
 * @property {Object} data
 * @property {boolean} loading
 * @property {boolean} loaded
 * @property {Object} error
 */

/**
 * Uses an action to call the data provider
 * and optimistically loads the result from the store.
 *
 * @example
 *
 * const { data, loading, loaded, error } = useOptimisticQuery(
 *   { type 'RA/GET_ONE', payload: { id: 123 }, meta: { fetch: GET_ONE, resource: 'posts' } }
 *   state => state.admin.resources.posts[123]
 * );
 *
 * @param {object} action The action to dispatch, e.g. { type 'RA/GET_ONE', payload: { id: 123 }, meta: { fetch: GET_ONE, resource: 'posts' } }
 * @param {function} selector The selector function to get the result from the store
 * @param {number} version The version number. Increase to force a new fetch
 *
 * @returns {GetOneResponse} An object with the shape { data, error, loading, loaded }
 */
const useOptimisticQuery = (
    action: FetchAction,
    selector: (state: ReduxState) => string,
    version: number = 1
) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(action);
    }, [JSON.stringify({ action, version })]);
    const data = useSelector(selector);
    const { loading, loaded, error } = useSelector((state: ReduxState) => {
        const key = JSON.stringify({
            type: action.meta.fetch,
            payload: action.payload,
        });
        return state.admin.requests && state.admin.requests[key]
            ? state.admin.requests[key]
            : { loading: false, loaded: false };
    });
    return { data, loading, loaded, error };
};

export default useOptimisticQuery;
