import { useContext } from 'react';

import { ListSortContext, ListSortContextValue } from './ListSortContext';

/**
 * Hook to read the list sort controller props from the ListSortContext.
 *
 * Must be used within a <ListSortContextProvider> (e.g. as a descendent of <List>
 * or <ListBase>).
 *
 * @returns {ListSortContextValue} list controller props
 *
 * @see useListController for how it is filled
 */
export const useListSortContext = (): ListSortContextValue => {
    const context = useContext(ListSortContext);
    if (!context) {
        throw new Error(
            'useListSortContext must be used inside a ListSortContextProvider'
        );
    }
    return context;
};
