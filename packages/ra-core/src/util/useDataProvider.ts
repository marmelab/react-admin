import { useMemo } from 'react';
import { Dispatch } from 'redux';
// @ts-ignore
import { useDispatch } from 'react-redux';
import get from 'lodash/get';

import { startUndoable } from '../actions/undoActions';

/**
 * Hook for getting an instance of the dataProvider as prop
 *
 * Injects a dataProvider function prop, which behaves just like
 * the dataProvider function (same signature, returns a Promise), but
 * uses Redux under the hood. The benefit is that react-admin tracks
 * the loading state when using this function, and shows the loader animation
 * while the dataProvider is waiting for a response.
 *
 * In addition to the 3 parameters of the dataProvider function (verb, resource, payload),
 * the injected dataProvider prop accepts a fourth parameter, an object literal
 * which may contain side effects, of make the action optimistic (with undoable: true).
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
const useDataProvider = deps => {
    const dispatch = useDispatch() as Dispatch;

    return useMemo(
        () => (type, resource: string, payload: any, meta: any = {}) =>
            new Promise((resolve, reject) => {
                const action = {
                    type: 'CUSTOM_FETCH',
                    payload,
                    meta: {
                        ...meta,
                        resource,
                        fetch: type,
                        onSuccess: {
                            ...get(meta, 'onSuccess', {}),
                            callback: ({ payload: response }) =>
                                resolve(response),
                        },
                        onFailure: {
                            ...get(meta, 'onFailure', {}),
                            callback: ({ error }) =>
                                reject(
                                    new Error(
                                        error.message ? error.message : error
                                    )
                                ),
                        },
                    },
                };

                return meta.undoable
                    ? dispatch(startUndoable(action))
                    : dispatch(action);
            }),
        deps
    );
};

export default useDataProvider;
