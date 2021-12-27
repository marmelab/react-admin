import { useContext, useMemo } from 'react';

import DataProviderContext from './DataProviderContext';
import defaultDataProvider from './defaultDataProvider';
import validateResponseFormat from './validateResponseFormat';
import { DataProvider } from '../types';
import useLogoutIfAccessDenied from '../auth/useLogoutIfAccessDenied';

/**
 * Hook for getting a dataProvider
 *
 * Gets a dataProvider object, which behaves just like the real dataProvider
 * (same methods returning a Promise). But it's actually a Proxy object, which
 * dispatches Redux actions along the process. The benefit is that react-admin
 * tracks the loading state when using this hook, and stores results in the
 * Redux store for future use.
 *
 * In addition to the 2 usual parameters of the dataProvider methods (resource,
 * payload), the Proxy supports a third parameter for every call. It's an
 * object literal which may contain side effects, or make the action optimistic
 * (with mutationMode: optimistic) or undoable (with mutationMode: undoable).
 *
 * @return dataProvider
 *
 * @example Basic usage
 *
 * import * as React from 'react';
 * import { useState } from 'react';
 * import { useDataProvider } from 'react-admin';
 *
 * const PostList = () => {
 *      const [posts, setPosts] = useState([])
 *      const dataProvider = useDataProvider();
 *      useEffect(() => {
 *          dataProvider.getList('posts', { filter: { status: 'pending' }})
 *            .then(({ data }) => setPosts(data));
 *      }, [])
 *
 *      return (
 *          <Fragment>
 *              {posts.map((post, key) => <PostDetail post={post} key={key} />)}
 *          </Fragment>
 *     );
 * }
 *
 * @example Handling all states (loading, error, success)
 *
 * import { useState, useEffect } from 'react';
 * import { useDataProvider } from 'react-admin';
 *
 * const UserProfile = ({ userId }) => {
 *     const dataProvider = useDataProvider();
 *     const [user, setUser] = useState();
 *     const [loading, setLoading] = useState(true);
 *     const [error, setError] = useState();
 *     useEffect(() => {
 *         dataProvider.getOne('users', { id: userId })
 *             .then(({ data }) => {
 *                 setUser(data);
 *                 setLoading(false);
 *             })
 *             .catch(error => {
 *                 setError(error);
 *                 setLoading(false);
 *             })
 *     }, []);
 *
 *     if (loading) return <Loading />;
 *     if (error) return <Error />
 *     if (!user) return null;
 *
 *     return (
 *         <ul>
 *             <li>Name: {user.name}</li>
 *             <li>Email: {user.email}</li>
 *         </ul>
 *     )
 * }
 *
 * @example Action customization
 *
 * dataProvider.getOne('users', { id: 123 });
 * // will dispatch the following actions:
 * // - CUSTOM_FETCH
 * // - CUSTOM_FETCH_LOADING
 * // - FETCH_START
 * // - CUSTOM_FETCH_SUCCESS
 * // - FETCH_END
 *
 * dataProvider.getOne('users', { id: 123 }, { action: CRUD_GET_ONE });
 * // will dispatch the following actions:
 * // - CRUD_GET_ONE
 * // - CRUD_GET_ONE_LOADING
 * // - FETCH_START
 * // - CRUD_GET_ONE_SUCCESS
 * // - FETCH_END
 */
const useDataProvider = <
    TDataProvider extends DataProvider = DataProvider
>(): TDataProvider => {
    const dataProvider = ((useContext(DataProviderContext) ||
        defaultDataProvider) as unknown) as TDataProvider;

    const logoutIfAccessDenied = useLogoutIfAccessDenied();

    const dataProviderProxy = useMemo(() => {
        return new Proxy(dataProvider, {
            get: (target, name) => {
                if (typeof name === 'symbol' || name === 'then') {
                    return;
                }
                return (...args) => {
                    const type = name.toString();

                    if (typeof dataProvider[type] !== 'function') {
                        throw new Error(
                            `Unknown dataProvider function: ${type}`
                        );
                    }

                    try {
                        return dataProvider[type]
                            .apply(dataProvider, args)
                            .then(response => {
                                if (process.env.NODE_ENV !== 'production') {
                                    validateResponseFormat(response, type);
                                }
                                return response;
                            })
                            .catch(error => {
                                if (process.env.NODE_ENV !== 'production') {
                                    console.error(error);
                                }
                                return logoutIfAccessDenied(error).then(
                                    loggedOut => {
                                        if (loggedOut) return;
                                        throw error;
                                    }
                                );
                            });
                    } catch (e) {
                        if (process.env.NODE_ENV !== 'production') {
                            console.error(e);
                        }
                        throw new Error(
                            'The dataProvider threw an error. It should return a rejected Promise instead.'
                        );
                    }
                };
            },
        });
    }, [dataProvider, logoutIfAccessDenied]);

    return dataProviderProxy;
};

export default useDataProvider;
