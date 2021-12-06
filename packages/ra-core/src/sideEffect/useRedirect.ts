import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { parsePath } from 'history';

import { Identifier, Record } from '../types';
import resolveRedirectTo from '../util/resolveRedirectTo';
import { refreshView } from '../actions';

type RedirectToFunction = (
    basePath?: string,
    id?: Identifier,
    data?: Record,
    state?: object
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
 * // redirect to edit view with state data
 * redirect('edit', '/comment', 123, {}, { record: { post_id: record.id } });
 * // do not redirect (resets the record form)
 * redirect(false);
 * // redirect to the result of a function
 * redirect((redirectTo, basePath, id, data) => ...)
 */
const useRedirect = () => {
    const dispatch = useDispatch();
    const history = useHistory(); // Note: history is mutable. This prevents render loops in useCallback.
    return useCallback(
        (
            redirectTo: RedirectionSideEffect,
            basePath: string = '',
            id?: Identifier,
            data?: Partial<Record>,
            state: object = {}
        ) => {
            if (!redirectTo) {
                if (history.location.state || history.location.search) {
                    history.replace({
                        ...history.location,
                        state,
                        search: undefined,
                    });
                } else {
                    dispatch(refreshView());
                }
                return;
            }

            if (
                typeof redirectTo === 'string' &&
                redirectTo.startsWith('http') &&
                window
            ) {
                // redirection to an absolute url
                // history doesn't handle that case, so we handle it by hand
                window.location.href = redirectTo;
            } else {
                history.push({
                    ...parsePath(
                        resolveRedirectTo(redirectTo, basePath, id, data)
                    ),
                    state: { _scrollToTop: true, ...state },
                });
            }
        },
        [dispatch, history]
    );
};

export default useRedirect;
