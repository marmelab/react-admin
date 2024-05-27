import { useContext } from 'react';

import {
    ListPaginationContext,
    ListPaginationContextValue,
} from './ListPaginationContext';

/**
 * Hook to read the list pagination controller props from the ListPaginationContext.
 *
 * Must be used within a <ListPaginationContext> (e.g. as a descendent of <List>
 * or <ListBase>).
 *
 * @returns {ListPaginationContextValue} list controller props
 *
 * @see useListController for how it is filled
 */
export const useListPaginationContext = (): ListPaginationContextValue => {
    const context = useContext(ListPaginationContext);
    if (!context) {
        throw new Error(
            'useListPaginationContext must be used inside a ListPaginationContextProvider'
        );
    }
    return context;
};
