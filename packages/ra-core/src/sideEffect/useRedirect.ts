import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parsePath } from 'history';

import { Identifier, RaRecord } from '../types';
import resolveRedirectTo from '../util/resolveRedirectTo';

type RedirectToFunction = (
    basePath?: string,
    id?: Identifier,
    data?: RaRecord,
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
 * // do not redirect
 * redirect(false);
 * // redirect to the result of a function
 * redirect((redirectTo, basePath, id, data) => ...)
 */
const useRedirect = () => {
    const navigate = useNavigate();
    // Ensure this doesn't rerender too much
    const location = useLocation();
    const locationRef = useRef(location);

    useEffect(() => {
        locationRef.current = location;
    }, [location]);

    return useCallback(
        (
            redirectTo: RedirectionSideEffect,
            basePath: string = '',
            id?: Identifier,
            data?: Partial<RaRecord>,
            state: object = {}
        ) => {
            if (!redirectTo) {
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
        [navigate]
    );
};

export default useRedirect;
