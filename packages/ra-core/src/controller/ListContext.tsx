import { createContext } from 'react';
import { ListControllerProps } from './useListController';

/**
 * Context to store the result of the useListController() hook.
 *
 * Use the useListContext() hook to read the context.
 *
 * @see useListController
 * @see useListContext
 *
 * @example
 *
 * import { useListController, ListContext } from 'ra-core';
 *
 * const List = props => {
 *     const controllerProps = useListController(props);
 *     return (
 *         <ListContext.Provider value={controllerProps}>
 *             ...
 *         </ListContext.Provider>
 *     );
 * };
 */
const ListContext = createContext<ListControllerProps>({
    basePath: null,
    currentSort: null,
    data: null,
    defaultTitle: null,
    displayedFilters: null,
    filterValues: null,
    hasCreate: null,
    hideFilter: null,
    ids: null,
    loaded: null,
    loading: null,
    onSelect: null,
    onToggleItem: null,
    onUnselectItems: null,
    page: null,
    perPage: null,
    resource: null,
    selectedIds: null,
    setFilters: null,
    setPage: null,
    setPerPage: null,
    setSort: null,
    showFilter: null,
    total: null,
});

ListContext.displayName = 'ListContext';

export default ListContext;
