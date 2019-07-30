import { useCallback, useContext } from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import DataProviderContext from './DataProviderContext';
import validateResponseFormat from './validateResponseFormat';
import undoableEventEmitter from './undoableEventEmitter';
import {
    startOptimisticMode,
    stopOptimisticMode,
} from '../actions/undoActions';
import { FETCH_END, FETCH_ERROR, FETCH_START } from '../actions/fetchActions';
import { showNotification } from '../actions/notificationActions';
import { refreshView } from '../actions/uiActions';
import { ReduxState, DataProvider } from '../types';

type DataProviderHookFunction = (
    type: string,
    resource: string,
    params: any,
    options?: UseDataProviderOptions
) => Promise<{ data?: any; total?: any; error?: any }>;

interface UseDataProviderOptions {
    action?: string;
    meta?: object;
    undoable?: boolean;
    onSuccess?: any;
    onFailure?: any;
}

const defaultDataProvider = () => Promise.resolve(); // avoids adding a context in tests

/**
 * Hook for getting an instance of the dataProvider as prop
 *
 * Gets a dataProvider function, which behaves just like the real dataProvider
 * (same signature, returns a Promise), but dispatches Redux actions along the
 * process. The benefit is that react-admin tracks the loading state when using
 * this function, shows the loader animation while the dataProvider is waiting
 * for a response, and executes side effects when the response arrives.
 *
 * In addition to the 3 parameters of the dataProvider function (verb, resource,
 * payload), the returned function accepts a fourth parameter, an object
 * literal which may contain side effects, or make the action optimistic (with
 * undoable: true).
 *
 * @return dataProvider (type, resource, payload, options) => Promise<any>
 *
 * @example
 *
 * import React, { useState } from 'react';
 * import { useDispatch } from 'react-redux';
 * import { useDataProvider, showNotification } from 'react-admin';
 *
 * const PostList = () => {
 *      const [posts, setPosts] = useState([])
 *      const dispatch = useDispatch();
 *      const dataProvider = useDataProvider();
 *
 *      useEffect(() => {
 *          dataProvider('GET_LIST', 'posts', { filter: { status: 'pending' }})
 *            .then(({ data }) => setPosts(data))
 *            .catch(error => dispatch(showNotification(error.message, 'error')));
 *      }, [])
 *
 *      return (
 *          <Fragment>
 *              {posts.map((post, key) => <PostDetail post={post} key={key} />)}
 *          </Fragment>
 *     }
 * }
 */
const useDataProvider = (): DataProviderHookFunction => {
    const dispatch = useDispatch() as Dispatch;
    const dataProvider = useContext(DataProviderContext) || defaultDataProvider;
    const isOptimistic = useSelector(
        (state: ReduxState) => state.admin.ui.optimistic
    );

    return useCallback(
        (
            type: string,
            resource: string,
            payload: any,
            options: UseDataProviderOptions = {}
        ) => {
            const {
                action = 'CUSTOM_FETCH',
                undoable = false,
                onSuccess = {},
                onFailure = {},
                ...rest
            } = options;

            if (isOptimistic) {
                // in optimistic mode, all fetch actions are canceled,
                // so the admin uses the store without synchronization
                return Promise.resolve();
            }

            const params = {
                type,
                payload,
                resource,
                action,
                rest,
                successFunc: getSideEffectFunc(onSuccess),
                failureFunc: getSideEffectFunc(onFailure),
                dataProvider,
                dispatch,
            };
            return undoable
                ? performUndoableQuery(params)
                : performQuery(params);
        },
        [dataProvider, dispatch, isOptimistic]
    );
};

const getSideEffectFunc = (effect): ((args: any) => void) =>
    effect instanceof Function ? effect : () => null;

/**
 * In undoable mode, the hook dispatches an optimistic action and executes
 * the success side effects right away. Then it waits for a few seconds to
 * actually call the dataProvider - unless the user dispatches an Undo action.
 *
 * We call that "optimistic" because the hook returns a resolved Promise
 * immediately (although it has an empty value). That only works if the
 * caller reads the result from the Redux store, not from the Promise.
 */
const performUndoableQuery = ({
    type,
    payload,
    resource,
    action,
    rest,
    successFunc,
    failureFunc,
    dataProvider,
    dispatch,
}: QueryFunctionParams) => {
    dispatch(startOptimisticMode());
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({
        type: `${action}_OPTIMISTIC`,
        payload,
        meta: {
            resource,
            fetch: type,
            optimistic: true,
        },
    });
    successFunc({});
    undoableEventEmitter.once('end', ({ isUndo }) => {
        dispatch(stopOptimisticMode());
        if (isUndo) {
            dispatch(showNotification('ra.notification.canceled'));
            dispatch(refreshView());
            return;
        }
        dispatch({
            type: `${action}_LOADING`,
            payload,
            meta: { resource, ...rest },
        });
        dispatch({ type: FETCH_START });
        dataProvider(type, resource, payload)
            .then(response => {
                if (process.env.NODE_ENV !== 'production') {
                    validateResponseFormat(response, type);
                }
                dispatch({
                    type: `${action}_SUCCESS`,
                    payload: response,
                    requestPayload: payload,
                    meta: {
                        ...rest,
                        resource,
                        fetchResponse: type,
                        fetchStatus: FETCH_END,
                    },
                });
                dispatch({ type: FETCH_END });
            })
            .catch(error => {
                dispatch({
                    type: `${action}_FAILURE`,
                    error: error.message ? error.message : error,
                    payload: error.body ? error.body : null,
                    requestPayload: payload,
                    meta: {
                        ...rest,
                        resource,
                        fetchResponse: type,
                        fetchStatus: FETCH_ERROR,
                    },
                });
                dispatch({ type: FETCH_ERROR, error });
                failureFunc(error);
                throw new Error(error.message ? error.message : error);
            });
    });
    return Promise.resolve({});
};

/**
 * In normal mode, the hook calls the dataProvider. When a successful response
 * arrives, the hook dispatches a SUCCESS action, executes success side effects
 * and returns the response. If the response is an error, the hook dispatches
 * a FAILURE action, executes failure side effects, and throws an error.
 */
const performQuery = ({
    type,
    payload,
    resource,
    action,
    rest,
    successFunc,
    failureFunc,
    dataProvider,
    dispatch,
}: QueryFunctionParams) => {
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({
        type: `${action}_LOADING`,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({ type: FETCH_START });

    return dataProvider(type, resource, payload)
        .then(response => {
            if (process.env.NODE_ENV !== 'production') {
                validateResponseFormat(response, type);
            }
            dispatch({
                type: `${action}_SUCCESS`,
                payload: response,
                requestPayload: payload,
                meta: {
                    ...rest,
                    resource,
                    fetchResponse: type,
                    fetchStatus: FETCH_END,
                },
            });
            dispatch({ type: FETCH_END });
            successFunc(response);
            return response;
        })
        .catch(error => {
            dispatch({
                type: `${action}_FAILURE`,
                error: error.message ? error.message : error,
                payload: error.body ? error.body : null,
                requestPayload: payload,
                meta: {
                    ...rest,
                    resource,
                    fetchResponse: type,
                    fetchStatus: FETCH_ERROR,
                },
            });
            dispatch({ type: FETCH_ERROR, error });
            failureFunc(error);
            throw new Error(error.message ? error.message : error);
        });
};

interface QueryFunctionParams {
    /** The fetch type, e.g. `UPDATE_MANY` */
    type: string;
    payload: any;
    resource: string;
    /** The root action name, e.g. `CRUD_GET_MANY` */
    action: string;
    rest: any;
    successFunc: (args?: any) => void;
    failureFunc: (error: any) => void;
    dataProvider: DataProvider;
    dispatch: Dispatch;
}

export default useDataProvider;
