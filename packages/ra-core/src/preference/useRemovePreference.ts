import { useCallback } from 'react';

import { usePreferenceProvider } from './usePreferenceProvider';

/**
 * Get a callback to remove an item from the preferences
 *
 * @example
 * import { useRemovePreference } from 'react-admin';
 *
 * const ResetDatagridPrefs = () {
 *    const removeItem = useRemovePreference();
 *
 *    const hancleClick = () => {
 *        removeItem('datagrid.prefs');
 *    };
 *
 *    return <Button onClick={hancleClick}>Reset datagrid preferences</Button>;
 * }
 */
export const useRemovePreference = () => {
    const { removeItem } = usePreferenceProvider();
    return useCallback((key: string) => removeItem(key), [removeItem]);
};
