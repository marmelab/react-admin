import { useContext } from 'react';

import { StoreContext } from './StoreContext';

/**
 * Get the StoreProvider stored in the StoreContext
 */
export const useStoreContext = () => useContext(StoreContext);
