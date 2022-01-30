import { useCallback } from 'react';

import { useStoreContext } from './useStoreContext';

/**
 * Get a callback to remove an item from the store
 *
 * @example
 * import { useRemoveFromStore } from 'react-admin';
 *
 * const ResetDatagridPrefs = () {
 *    const removeItem = useRemoveFromStore();
 *
 *    const hancleClick = () => {
 *        removeItem('datagrid.prefs');
 *    };
 *
 *    return <Button onClick={hancleClick}>Reset datagrid preferences</Button>;
 * }
 */
export const useRemoveFromStore = () => {
    const { removeItem } = useStoreContext();
    return useCallback((key: string) => removeItem(key), [removeItem]);
};
