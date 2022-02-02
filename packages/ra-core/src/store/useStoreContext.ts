import { useContext } from 'react';

import { StoreContext } from './StoreContext';

/**
 * Get the Store stored in the StoreContext
 */
export const useStoreContext = () => useContext(StoreContext);
