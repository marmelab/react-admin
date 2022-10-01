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
export const useRemoveFromStore = (hookTimeKey?: string) => {
    const { removeItem } = useStoreContext();
    return useCallback(
        (key?: string) => {
            if (key === undefined && hookTimeKey === undefined) {
                throw new Error(
                    'You must provide a key to remove an item from the store'
                );
            }
            // @ts-ignore
            return removeItem(key ?? hookTimeKey);
        },
        [removeItem, hookTimeKey]
    );
};
