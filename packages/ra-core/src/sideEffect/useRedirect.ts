import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Identifier, Record } from '../types';
import resolveRedirectTo from '../util/resolveRedirectTo';
import { refreshView } from '../actions/uiActions';
import { useHistory } from 'react-router-dom';

type RedirectToFunction = (
    basePath?: string,
    id?: Identifier,
    data?: Record
) => string;

export type RedirectionSideEffect = string | boolean | RedirectToFunction;

/**
 * Hook for Redirection Side Effect
 *
 * @example
 *
 * const redirect = useRedirect();
 * // redirect to list view
 * redirect('list', '/posts');
 * // redirect to edit view
 * redirect('edit', '/posts', 123);
 * // do not redirect (resets the record form)
 * redirect(false);
 * // redirect to the result of a function
 * redirect((redirectTo, basePath, is, data) => ...)
 */

const useRedirect = (baseURL?: string) => {
    const dispatch = useDispatch();
    const history = useHistory(); // Note: history is mutable. This prevents render loops in useCallback.

    const origin = useMemo(
        () =>
            new URL(baseURL ?? process.env.PUBLIC_URL ?? "", window.location.origin),
        []
    );

    return useCallback(
        (
            redirectTo: RedirectionSideEffect,
            basePath: string = '',
            id?: Identifier,
            data?: Partial<Record>
        ) => {
            if (!redirectTo) {
                if (history.location.state || history.location.search) {
                    history.replace({
                        ...history.location,
                        state: {},
                        search: undefined,
                    });
                } else {
                    dispatch(refreshView());
                }
                return;
            }

            const redirectPath =
                resolveRedirectTo(redirectTo, basePath, id, data) ?? '';
            //because we manually add state: { _scrollToTop: true} to scroll to stop -> search params cannot catch
            //need create new URL to get search params
            const url = new URL(redirectPath, origin);

            history.push({
                pathname: url.pathname,
                search: url.search,
                state: { _scrollToTop: true },
            });
        },
        [dispatch, history]
    );
};

export default useRedirect;
