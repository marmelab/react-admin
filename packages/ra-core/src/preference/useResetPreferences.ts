import { useCallback } from 'react';

import { usePreferenceProvider } from './usePreferenceProvider';

/**
 * Get a callback to remove all items from the preferences
 *
 * @example
 * import { useResetPreferences } from 'react-admin';
 *
 * const ResetPrefs = () {
 *    const reset = useResetPreferences();
 *
 *    const hancleClick = () => {
 *        reset();
 *    };
 *
 *    return <Button onClick={hancleClick}>Reset preferences</Button>;
 * }
 */
export const useResetPreferences = () => {
    const { reset } = usePreferenceProvider();
    return useCallback(() => reset(), [reset]);
};
