import { useCallback } from 'react';

import { useRecordSelection } from './useRecordSelection';

/**
 * Hook to unselect all row of a datagrid
 *
 * @example
 *
 * const unselectAll = useUnselectAll('posts');
 * unselectAll();
 */
export const useUnselectAll = (resource?: string, storeKey?: string) => {
    const [, { clearSelection }] = useRecordSelection(
        resource
            ? { resource, storeKey }
            : { disableSyncWithStore: true, storeKey }
    );
    return useCallback(
        (fromAllStoreKeys?: boolean) => {
            clearSelection(fromAllStoreKeys);
        },
        [clearSelection]
    );
};
