import { useCallback } from 'react';
import { Identifier, RaRecord } from '../types';

import { useBasename } from './useBasename';
import { CreatePathType, useCreatePath } from './useCreatePath';
import { useNavigate } from './useNavigate';
import type { RouterTo } from './RouterProvider';

/**
 * Target for redirection - can be a path string or a location object
 */
type RedirectTarget = RouterTo;

type RedirectToFunction = (
    resource?: string,
    id?: Identifier,
    data?: Partial<RaRecord>,
    state?: object
) => RedirectTarget;

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
 * // redirect to an absolute URL
 * redirect('https://marmelab.com/react-admin');
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
                const target: RedirectTarget = redirectTo(resource, id, data);
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
