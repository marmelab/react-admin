import { useContext } from 'react';

import ListContext from './ListContext';

/**
 * Hook to read the list controller props.
 *
 * Must be used within a <ListContext.Provider>
 */
const useListContext = () => useContext(ListContext);

export default useListContext;
