import { useCallback } from 'react';

import { useRecordSelection } from './useRecordSelection';

/**
 * Hook for Unselect All Side Effect
 *
 * @example
 *
 * const unselectAll = useUnselectAll('posts');
 * unselectAll();
 */
export const useUnselectAll = (resource?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, { clearSelection }] = useRecordSelection(resource);
    return useCallback(() => {
        clearSelection();
    }, [clearSelection]);
};
