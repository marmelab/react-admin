import { useCallback } from 'react';
import { useNavigate, To } from 'react-router-dom';
import { Identifier, RaRecord } from '../types';

import { useBasename } from './useBasename';
import { CreatePathType, useCreatePath } from './useCreatePath';

type RedirectToFunction = (
    resource?: string,
    id?: Identifier,
    data?: Partial<RaRecord>,
    state?: object
) => To;

export type RedirectionSideEffect = CreatePathType | false | RedirectToFunction;

/**
 * Hook for Redirection Side Effect
 *
 * @example
 *
 * const redirect = useRedirect();
 * // redirect to list view
 * redirect('list', 'posts');
 * // redirect to edit view
 * redirect('edit', 'posts', 123);
 * // redirect to edit view with state data
 * redirect('edit', 'comments', 123, {}, { record: { post_id: record.id } });
 * // do not redirect
 * redirect(false);
 * // redirect to the result of a function
 * redirect((resource, id, data) => ...)
 */
export const useRedirect = () => {
    const navigate = useNavigate();
    const basename = useBasename();
    const createPath = useCreatePath();

    return useCallback(
        (
            redirectTo: RedirectionSideEffect,
            resource: string = '',
            id?: Identifier,
            data?: Partial<RaRecord>,
            state: object = {}
        ) => {
            if (!redirectTo) {
                return;
            } else if (typeof redirectTo === 'function') {
                const target: To = redirectTo(resource, id, data);
                const absoluteTarget =
                    typeof target === 'string'
                        ? `${basename}${target.startsWith('/') ? '' : '/'}${target}`
                        : {
                              pathname: `${basename}${target.pathname?.startsWith('/') ? '' : '/'}${target.pathname}`,
                              ...target,
                          };
                navigate(absoluteTarget, {
                    state: { _scrollToTop: true, ...state },
                });
                return;
            } else if (
                typeof redirectTo === 'string' &&
                redirectTo.startsWith('http') &&
                window
            ) {
                // redirection to an absolute url
                // history doesn't handle that case, so we handle it by hand
                window.location.href = redirectTo;
                return;
            } else {
                // redirection to an internal link
                navigate(createPath({ resource, id, type: redirectTo }), {
                    state:
                        // We force the scrollToTop except when navigating to a list
                        // where this is already done by <RestoreScrollPosition> in <Resource>
                        redirectTo === 'list'
                            ? state
                            : { _scrollToTop: true, ...state },
                });
                return;
            }
        },
        [navigate, basename, createPath]
    );
};
