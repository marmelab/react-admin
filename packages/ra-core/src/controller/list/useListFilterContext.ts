import { useContext } from 'react';

import { ListFilterContext, ListFilterContextValue } from './ListFilterContext';

/**
 * Hook to read the list props from the ListFilterContext.
 *
 * Must be used within a <ListFilterContextProvider>.
 *
 * @returns {ListFilterContextValue} list controller props
 *
 * @see useListController for how it is filled
 */
export const useListFilterContext = (): ListFilterContextValue => {
    const context = useContext(ListFilterContext);
    if (!context) {
        throw new Error(
            'useListFilterContext must be used inside a ListFilterContextProvider'
        );
    }
    return context;
};
