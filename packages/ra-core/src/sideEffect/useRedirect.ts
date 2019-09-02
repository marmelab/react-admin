import { useCallback } from 'react';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

import { Identifier, Record } from '../types';
import resolveRedirectTo from '../util/resolveRedirectTo';
import { refreshView } from '../actions/uiActions';

type RedirectToFunction = (
    basePath?: string,
    id?: Identifier,
    data?: Record
) => string;

export type RedirectionSideEffect = string | false | RedirectToFunction;

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
const useRedirect = () => {
    const dispatch = useDispatch();
    return useCallback(
        (
            redirectTo: RedirectionSideEffect,
            basePath: string = '',
            id?: Identifier,
            data?: Partial<Record>
        ) => {
            if (!redirectTo) {
                dispatch(refreshView());
                return;
            }

            dispatch(push(resolveRedirectTo(redirectTo, basePath, id, data)));
        },
        [dispatch]
    );
};

export default useRedirect;
