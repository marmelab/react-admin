import { useQueryClient } from '@tanstack/react-query';
import { useResourceContext } from '../core';
import { HintedString } from '../types';
import useAuthProvider from './useAuthProvider';

/**
 * A hook that returns true if the authProvider is currently checking the authentication status or the user's access rights.
 * @param params
 * @param params.action The action to check access for
 * @param params.resource The resource to check access for (optional). Defaults to the resource of the current ResourceContext.
 * @returns {boolean} true if the authProvider is currently checking the authentication status or the user's access rights, false otherwise.
 */
export const useIsAuthPending = (params: UseIsAuthPendingParams) => {
    const { action, ...props } = params;
    const queryClient = useQueryClient();
    const authProvider = useAuthProvider();
    const resource = useResourceContext(props);

    if (!authProvider) {
        return false;
    }

    const authQueryState = queryClient.getQueryState(['auth', 'checkAuth', {}]);
    const canAccessQueryState = queryClient.getQueryState([
        'auth',
        'canAccess',
        { action, resource },
    ]);

    if (
        authQueryState?.status === 'pending' ||
        (authProvider.canAccess && canAccessQueryState?.status === 'pending')
    ) {
        return true;
    }

    return false;
};

export type UseIsAuthPendingParams = {
    resource?: string;
    action: HintedString<'list' | 'create' | 'edit' | 'show' | 'delete'>;
};
