import { useCallback } from 'react';

import { useRecordSelection } from './useRecordSelection';
import { Identifier } from '../../types';

/**
 * Hook to Unselect the rows of a datagrid
 *
 * @example
 *
 * const unselect = useUnselect('posts');
 * unselect([123, 456]);
 */
export const useUnselect = (resource?: string) => {
    const [, { unselect }] = useRecordSelection(
        resource ? { resource } : { disableSyncWithStore: true }
    );
    return useCallback(
        (ids: Identifier[], fromAllNamespaces: boolean = false) => {
            unselect(ids, fromAllNamespaces);
        },
        [unselect]
    );
};
