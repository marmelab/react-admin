import { useCallback } from 'react';

import { useStoreContext } from './useStoreContext';

/**
 * Get a callback to remove all item with a certain key prefix from the store
 *
 * @example
 * import { useRemoveItemsFromStore } from 'react-admin';
 *
 * const ResetDatagridPrefs = () {
 *    const removeItems = useRemoveItemsFromStore();
 *
 *    const handleClick = () => {
 *        removeItems('datagrid.prefs');
 *    };
 *
 *    return <Button onClick={hancleClick}>Reset datagrid preferences</Button>;
 * }
 */
export const useRemoveItemsFromStore = (hookTimeKeyPrefix?: string | null) => {
    const { removeItems } = useStoreContext();
    return useCallback(
        (keyPrefix?: string) => {
            if (
                typeof keyPrefix === 'undefined' &&
                typeof hookTimeKeyPrefix === 'undefined'
            ) {
                throw new Error(
                    'You must provide a key to remove an item from the store'
                );
            }
            // @ts-ignore
            return removeItems(keyPrefix ?? hookTimeKeyPrefix);
        },
        [removeItems, hookTimeKeyPrefix]
    );
};
