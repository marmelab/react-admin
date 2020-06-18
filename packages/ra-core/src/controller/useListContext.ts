import { useContext } from 'react';

import ListContext from './ListContext';

/**
 * Hook to read the list controller props.
 *
 * Must be used within a <ListContext.Provider>
 */
const useListContext = () => {
    const context = useContext(ListContext);
    if (!context.basePath) {
        throw new Error(
            'This component must be used inside a <ListContext.Provider>'
        );
    }
    return context;
};

export default useListContext;
