import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

/**
 * Hook for triggering a page refresh. Returns a callback function.
 *
 * The callback invalidates all queries and refetches the active ones.
 * Any component depending on react-query data will be re-rendered.
 *
 * @example
 *
 * const refresh = useRefresh();
 * const handleClick = () => {
 *     refresh();
 * };
 */
export const useRefresh = () => {
    const queryClient = useQueryClient();
    return useCallback(() => {
        queryClient.invalidateQueries();
    }, [queryClient]);
};
