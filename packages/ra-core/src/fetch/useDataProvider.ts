import { useMemo } from 'react';
import { Dispatch } from 'redux';
// @ts-ignore
import { useDispatch } from 'react-redux';

import { startUndoable } from '../actions/undoActions';

interface UseDataProviderOptions {
    action?: string;
    meta?: object;
    undoable?: boolean;
    onSuccess?: any;
    onFailure?: any;
}

const getSideEffects = (effects): [(args: any) => void, any] => {
    let functionSideEffect = () => null;
    let objectSideEffect = {};
    if (effects instanceof Function) {
        functionSideEffect = effects;
    } else {
        objectSideEffect = effects;
    }
    return [functionSideEffect, objectSideEffect];
};

/**
 * Hook for getting an instance of the dataProvider as prop
 *
 * Gets a dataProvider function, which behaves just like
 * the real dataProvider (same signature, returns a Promise), but
 * uses Redux under the hood. The benefit is that react-admin tracks
 * the loading state when using this function, and shows the loader animation
 * while the dataProvider is waiting for a response.
 *
 * In addition to the 3 parameters of the dataProvider function (verb, resource, payload),
 * the injected dataProvider prop accepts a fourth parameter, an object literal
 * which may contain side effects, or make the action optimistic (with undoable: true).
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
const useDataProvider = () => {
    const dispatch = useDispatch() as Dispatch;

    return useMemo(
        () => (
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
            const [successFunc, successObj] = getSideEffects(onSuccess);
            const [failureFunc, failureObj] = getSideEffects(onFailure);
            return new Promise((resolve, reject) => {
                const queryAction = {
                    type: action,
                    payload,
                    meta: {
                        ...rest,
                        resource,
                        fetch: type,
                        onSuccess: {
                            ...successObj,
                            callback: ({ payload: response }) => {
                                resolve(response);
                                if (successObj.callback) {
                                    successObj.callback({ payload: response });
                                }
                                successFunc(response);
                                return;
                            },
                        },
                        onFailure: {
                            ...failureObj,
                            callback: ({ error }) => {
                                const exception = new Error(
                                    error.message ? error.message : error
                                );
                                reject(exception);
                                if (failureObj.callback) {
                                    failureObj.callback({ error });
                                }
                                failureFunc(exception);
                                return;
                            },
                        },
                    },
                };

                return undoable
                    ? dispatch(startUndoable(queryAction))
                    : dispatch(queryAction);
            });
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );
};

export default useDataProvider;
