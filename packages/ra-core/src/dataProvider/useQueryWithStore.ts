import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import useDataProvider from './useDataProvider';
import useVersion from '../controller/useVersion';
import getFetchType from './getFetchType';
import { useSafeSetState } from '../util/hooks';
import { ReduxState, OnSuccess, OnFailure } from '../types';

export interface DataProviderQuery {
    type: string;
    resource: string;
    payload: object;
}

export type Refetch = () => void;

export interface UseQueryWithStoreValue {
    data?: any;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
    refetch: Refetch;
}

export interface QueryOptions {
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    action?: string;
    enabled?: boolean;
    [key: string]: any;
}

type PartialQueryState = {
    error?: any;
    loading: boolean;
    loaded: boolean;
};

const queriesThisTick: { [key: string]: Promise<PartialQueryState> } = {};

/**
 * Default cache selector. Allows to cache responses by default.
 *
 * By default, custom queries are dispatched as a CUSTOM_QUERY Redux action.
 * The useDataProvider hook dispatches a CUSTOM_QUERY_SUCCESS when the response
 * comes, and the customQueries reducer stores the result in the store.
 * This selector reads the customQueries store and acts as a response cache.
 */
const defaultDataSelector = query => (state: ReduxState) => {
    const key = JSON.stringify({ ...query, type: getFetchType(query.type) });
    return state.admin.customQueries[key]
        ? state.admin.customQueries[key].data
        : undefined;
};

const defaultTotalSelector = query => (state: ReduxState) => {
    const key = JSON.stringify({ ...query, type: getFetchType(query.type) });
    return state.admin.customQueries[key]
        ? state.admin.customQueries[key].total
        : null;
};

const defaultIsDataLoaded = (data: any): boolean => data !== undefined;

/**
 * Fetch the data provider through Redux, return the value from the store.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false, refetch }
 * - success: { data: [data from response], total: [total from response], loading: false, loaded: true, refetch }
 * - error: { error: [error from response], loading: false, loaded: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {Object} query
 * @param {string} query.type The verb passed to th data provider, e.g. 'getList', 'getOne'
 * @param {string} query.resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} query.payload The payload object, e.g; { post_id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. () => refresh()
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. (error) => notify(error.message)
 * @param {Function} dataSelector Redux selector to get the result. Required.
 * @param {Function} totalSelector Redux selector to get the total (optional, only for LIST queries)
 * @param {Function} isDataLoaded
 *
 * @returns The current request state. Destructure as { data, total, error, loading, loaded, refetch }.
 *
 * @example
 *
 * import { useQueryWithStore } from 'react-admin';
 *
 * const UserProfile = ({ record }) => {
 *     const { data, loading, error } = useQueryWithStore(
 *         {
 *             type: 'getOne',
 *             resource: 'users',
 *             payload: { id: record.id }
 *         },
 *         {},
 *         state => state.admin.resources.users.data[record.id]
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 */
export const useQueryWithStore = <State extends ReduxState = ReduxState>(
    query: DataProviderQuery,
    options: QueryOptions = { action: 'CUSTOM_QUERY' },
    dataSelector: (state: State) => any = defaultDataSelector(query),
    totalSelector: (state: State) => number = defaultTotalSelector(query),
    isDataLoaded: (data: any) => boolean = defaultIsDataLoaded
): UseQueryWithStoreValue => {
    const { type, resource, payload } = query;
    const version = useVersion(); // used to allow force reload
    // used to force a refetch without relying on version
    // which might trigger other queries as well
    const [innerVersion, setInnerVersion] = useState(0);
    const requestSignature = JSON.stringify({
        query,
        options,
        version,
        innerVersion,
    });
    const requestSignatureRef = useRef(requestSignature);
    const data = useSelector(dataSelector);
    const total = useSelector(totalSelector);

    const refetch = useCallback(() => {
        setInnerVersion(prevInnerVersion => prevInnerVersion + 1);
    }, []);

    const [state, setState]: [
        UseQueryWithStoreValue,
        (StateResult) => void
    ] = useSafeSetState({
        data,
        total,
        error: null,
        loading: options?.enabled === false ? false : true,
        loaded: options?.enabled === false ? false : isDataLoaded(data),
        refetch,
    });

    useEffect(() => {
        if (requestSignatureRef.current !== requestSignature) {
            // request has changed, reset the loading state
            requestSignatureRef.current = requestSignature;
            setState({
                data,
                total,
                error: null,
                loading: options?.enabled === false ? false : true,
                loaded: options?.enabled === false ? false : isDataLoaded(data),
                refetch,
            });
        } else if (!isEqual(state.data, data) || state.total !== total) {
            // the dataProvider response arrived in the Redux store
            if (typeof total !== 'undefined' && isNaN(total)) {
                console.error(
                    'Total from response is not a number. Please check your dataProvider or the API.'
                );
            } else {
                setState(prevState => ({
                    ...prevState,
                    data,
                    total,
                    loaded: true,
                    loading: false,
                }));
            }
        }
    }, [
        data,
        requestSignature,
        setState,
        state.data,
        state.total,
        total,
        isDataLoaded,
        refetch,
        options.enabled,
    ]);

    const dataProvider = useDataProvider();
    useEffect(() => {
        // When several identical queries are issued during the same tick,
        // we only pass one query to the dataProvider.
        // To achieve that, the closure keeps a list of dataProvider promises
        // issued this tick. Before calling the dataProvider, this effect
        // checks if another effect has already issued a similar dataProvider
        // call.
        if (!queriesThisTick.hasOwnProperty(requestSignature)) {
            queriesThisTick[requestSignature] = new Promise<PartialQueryState>(
                resolve => {
                    dataProvider[type](resource, payload, options)
                        .then(() => {
                            // We don't care about the dataProvider response here, because
                            // it was already passed to SUCCESS reducers by the dataProvider
                            // hook, and the result is available from the Redux store
                            // through the data and total selectors.
                            // In addition, if the query is optimistic, the response
                            // will be empty, so it should not be used at all.
                            if (
                                requestSignature !== requestSignatureRef.current
                            ) {
                                resolve(undefined);
                            }

                            resolve({
                                error: null,
                                loading: false,
                                loaded:
                                    options?.enabled === false ? false : true,
                            });
                        })
                        .catch(error => {
                            if (
                                requestSignature !== requestSignatureRef.current
                            ) {
                                resolve(undefined);
                            }
                            resolve({
                                error,
                                loading: false,
                                loaded: false,
                            });
                        });
                }
            );
            // cleanup the list on next tick
            setTimeout(() => {
                delete queriesThisTick[requestSignature];
            }, 0);
        }
        (async () => {
            const newState = await queriesThisTick[requestSignature];
            if (newState) setState(state => ({ ...state, ...newState }));
        })();
        // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055
    }, [requestSignature]); // eslint-disable-line

    return state;
};
