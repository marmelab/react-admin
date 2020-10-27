import { useEffect, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import useDataProvider from './useDataProvider';
import useVersion from '../controller/useVersion';
import { useSafeSetState } from '../util/hooks';

import {
    PaginationPayload,
    SortPayload,
    ReduxState,
    Identifier,
    Record,
    RecordMap,
} from '../types';

const defaultData = {};
const emptyArray = [];
const queriesThisTick: { [key: string]: Promise<PartialQueryState> } = {};

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from store], ids: [ids from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Object} pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @param {Object} sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @param {Object} filter The request filters, e.g. { title: 'hello, world' }
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded }.
 *
 * @example
 *
 * import { useGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, ids, loading, error } = useGetList(
 *         'posts',
 *         { page: 1, perPage: 10 },
 *         { field: 'published_at', order: 'DESC' }
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{ids.map(id =>
 *         <li key={id}>{data[id].title}</li>
 *     )}</ul>;
 * };
 */
const useGetList = <RecordType extends Record = Record>(
    resource: string,
    pagination: PaginationPayload,
    sort: SortPayload,
    filter: object,
    options?: any
): UseGetListValue<RecordType> => {
    const payload = { pagination, sort, filter };
    const payloadSignature = JSON.stringify(payload);
    const version = useVersion(); // used to allow force reload
    const requestSignature = JSON.stringify({
        query: { type: 'getList', resource, payload },
        options,
        version,
    });
    const requestSignatureRef = useRef(requestSignature);

    const total = useSelector((state: ReduxState): number =>
        get(state.admin.resources, [
            resource,
            'list',
            'cachedRequests',
            payloadSignature,
            'total',
        ])
    );

    // when the response has been received, the total is defind
    const loaded = typeof total !== 'undefined';

    const ids = useSelector((state: ReduxState): Identifier[] => {
        if (!loaded) return emptyArray;
        return get(state.admin.resources, [
            resource,
            'list',
            'cachedRequests',
            payloadSignature,
            'ids',
        ]);
    });

    const data = useSelector((state: ReduxState): RecordMap<RecordType> => {
        if (!loaded) return defaultData;
        const allResourceData = get(
            state.admin.resources,
            [resource, 'data'],
            defaultData
        );
        return ids
            .map(id => allResourceData[id])
            .reduce((acc, record) => {
                if (!record) return acc;
                acc[record.id] = record;
                return acc;
            }, {});
    }, shallowEqual);

    const [state, setState] = useSafeSetState<UseGetListValue<RecordType>>({
        ids,
        data,
        total,
        error: null,
        loading: true,
        loaded,
    });

    useEffect(() => {
        if (requestSignatureRef.current !== requestSignature) {
            // request has changed, reset the loading state
            requestSignatureRef.current = requestSignature;
            setState({
                ids,
                data,
                total,
                error: null,
                loading: true,
                loaded,
            });
        } else if (
            !isEqual(state.data, data) ||
            !isEqual(state.ids, ids) ||
            state.total !== total
        ) {
            // the dataProvider response arrived in the Redux store
            if (loaded && isNaN(total)) {
                console.error(
                    'Total from response is not a number. Please check your dataProvider or the API.'
                );
            } else {
                setState(prevState => ({
                    ...prevState,
                    ids,
                    data,
                    total,
                    loaded: true,
                }));
            }
        }
    }, [
        ids,
        state.ids,
        data,
        state.data,
        total,
        state.total,
        requestSignature,
        loaded,
        setState,
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
                    dataProvider
                        .getList(resource, payload, options)
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
                                resolve();
                            }

                            resolve({
                                error: null,
                                loading: false,
                                loaded: true,
                            });
                        })
                        .catch(error => {
                            if (
                                requestSignature !== requestSignatureRef.current
                            ) {
                                resolve();
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
            setImmediate(() => {
                delete queriesThisTick[requestSignature];
            });
        }
        (async () => {
            const newState = await queriesThisTick[requestSignature];
            if (newState) setState(state => ({ ...state, ...newState }));
        })();
        // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055
    }, [requestSignature]); // eslint-disable-line

    return state;
};

export interface UseGetListValue<RecordType extends Record = Record> {
    ids?: Identifier[];
    data?: RecordMap<RecordType>;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
}

export type PartialQueryState = {
    error?: any;
    loading: boolean;
    loaded: boolean;
};

export default useGetList;
