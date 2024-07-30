import { useEffect, useState } from 'react';
import { useQueryClient, QueryObserver } from '@tanstack/react-query';

/**
 * Check if react-query has already fetched data for a query key.
 *
 * This hook is reactive.
 *
 * @example
 * const isCustomerLoaded = useIsDataLoaded(['customers', 'getOne', { id: customerId }]);
 *
 * @returns {boolean} true if the data is loaded, false otherwise
 */
export const useIsDataLoaded = (
    queryKey: any,
    options: { enabled?: boolean } = {}
) => {
    const { enabled = true } = options;
    const queryClient = useQueryClient();
    const [isDataLoaded, setDataLoaded] = useState<boolean>(() => {
        if (!enabled) {
            return false;
        }
        return queryClient.getQueryData(queryKey) !== undefined;
    });

    useEffect(() => {
        if (!enabled) return;
        if (queryClient.getQueryData(queryKey) === undefined) {
            const observer = new QueryObserver(queryClient, { queryKey });
            const unsubscribe = observer.subscribe(result => {
                setDataLoaded(!result.isPending);
                unsubscribe();
            });
            return unsubscribe;
        }
    }, [enabled, queryKey, queryClient]);

    return isDataLoaded;
};
