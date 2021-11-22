import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { parsePath } from 'history';

import { Identifier, Record } from '../types';
import resolveRedirectTo from '../util/resolveRedirectTo';
import { refreshView } from '../actions/uiActions';

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
    const navigate = useNavigate();
    // Ensure this doesn't rerender too much
    const location = useLocation();
    return useCallback(
        (
            redirectTo: RedirectionSideEffect,
            basePath: string = '',
            id?: Identifier,
            data?: Partial<Record>,
            state: object = {}
        ) => {
            if (!redirectTo) {
                if (location.state || location.search) {
                    navigate(
                        {
                            ...location,
                            search: undefined,
                        },
                        {
                            state,
                            replace: true,
                        }
                    );
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
                navigate(
                    parsePath(
                        resolveRedirectTo(redirectTo, basePath, id, data)
                    ),
                    {
                        state: { _scrollToTop: true, ...state },
                    }
                );
            }
        },
        [dispatch, location, navigate]
    );
};

export default useRedirect;
