import { useCallback } from 'react';

import { useStoreContext } from './useStoreContext';

/**
 * Get a callback to remove all items from the store
 *
 * @example
 * import { useResetStore } from 'react-admin';
 *
 * const ResetPrefs = () {
 *    const reset = useResetStore();
 *
 *    const hancleClick = () => {
 *        reset();
 *    };
 *
 *    return <Button onClick={hancleClick}>Reset preferences</Button>;
 * }
 */
export const useResetStore = () => {
    const { reset } = useStoreContext();
    return useCallback(() => reset(), [reset]);
};
