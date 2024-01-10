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
export const useUnselectAll = (resource: string) => {
    const [, { clearSelection }] = useRecordSelection(resource);
    return useCallback(() => {
        clearSelection();
    }, [clearSelection]);
};
