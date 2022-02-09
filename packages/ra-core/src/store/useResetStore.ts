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
 *    const handleClick = () => {
 *        reset();
 *    };
 *
 *    return <Button onClick={handleClick}>Reset preferences</Button>;
 * }
 */
export const useResetStore = () => {
    const { reset } = useStoreContext();
    return reset;
};
