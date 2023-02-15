import * as React from 'react';
import { ListContext } from './ListContext';
import { ListFilterContext, usePickFilterContext } from './ListFilterContext';
import { ListSortContext, usePickSortContext } from './ListSortContext';
import {
    ListPaginationContext,
    usePickPaginationContext,
} from './ListPaginationContext';
import { ListControllerResult } from './useListController';

/**
 * Create a List Context and several thematic List subcontext.
 *
 * Allows children to subscribe to part of the ListContext, and bail out of
 * rendering when some parts of the context that they don't depend on change
 * (because unfortunately React doesn't allow to use context selectors yet).
 *
 * @example
 *
 * const MyList = (props) => {
 *     const controllerProps = useListController(props);
 *     return (
 *         <ListContextProvider value={controllerProps}>
 *             <MyListView>
 *         </ListContextProvider>
 *     );
 * };
 *
 * const MyListView = () => {
 *     const { data, filterValues, setFilters } = useListContext();
 *     // or, to rerender only when filters change but not data
 *     const { filterValues, setFilters } = useListFilterContext();
 * }
 *
 * @see ListContext
 * @see ListFilterContext
 */
export const ListContextProvider = ({
    value,
    children,
}: {
    value: ListControllerResult;
    children: React.ReactNode;
}) => (
    <ListContext.Provider value={value}>
        <ListFilterContext.Provider value={usePickFilterContext(value)}>
            <ListSortContext.Provider value={usePickSortContext(value)}>
                <ListPaginationContext.Provider
                    value={usePickPaginationContext(value)}
                >
                    {children}
                </ListPaginationContext.Provider>
            </ListSortContext.Provider>
        </ListFilterContext.Provider>
    </ListContext.Provider>
);
