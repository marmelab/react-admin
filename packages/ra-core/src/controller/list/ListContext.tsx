import { createContext } from 'react';
import { ListControllerResult } from './useListController';

/**
 * Context to store the result of the useListController() hook.
 *
 * Use the useListContext() hook to read the context. That's what many
 * List components do in react-admin (e.g. <Datagrid>, <FilterForm>, <Pagination>).
 *
 * @typedef {Object} ListControllerProps
 * @prop {Array}    data an array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }]
 * @prop {integer}  total the total number of results for the current filters, excluding pagination. Useful to build the pagination controls. e.g. 23
 * @prop {boolean}  isFetching boolean that is true on mount, and false once the data was fetched
 * @prop {boolean}  isLoading boolean that is false until the data is available
 * @prop {integer}  page the current page. Starts at 1
 * @prop {Function} setPage a callback to change the page, e.g. setPage(3)
 * @prop {integer}  perPage the number of results per page. Defaults to 25
 * @prop {Function} setPerPage a callback to change the number of results per page, e.g. setPerPage(25)
 * @prop {Object}   sort a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
 * @prop {Function} setSort a callback to change the sort, e.g. setSort({ field: 'name', order: 'ASC' })
 * @prop {Object}   filterValues a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
 * @prop {Function} setFilters a callback to update the filters, e.g. setFilters(filters, displayedFilters)
 * @prop {Object}   displayedFilters a dictionary of the displayed filters, e.g. { title: true, nationality: true }
 * @prop {Function} showFilter a callback to show one of the filters, e.g. showFilter('title', defaultValue)
 * @prop {Function} hideFilter a callback to hide one of the filters, e.g. hideFilter('title')
 * @prop {Array}    selectedIds an array listing the ids of the selected rows, e.g. [123, 456]
 * @prop {Function} onSelect callback to change the list of selected rows, e.g. onSelect([456, 789])
 * @prop {Function} onToggleItem callback to toggle the selection of a given record based on its id, e.g. onToggleItem(456)
 * @prop {Function} onUnselectItems callback to clear the selection, e.g. onUnselectItems();
 * @prop {string}   defaultTitle the translated title based on the resource, e.g. 'Posts'
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 * @prop {Function} refetch a function for triggering a refetch of the list data
 *
 * @typedef Props
 * @prop {ListControllerResult} value
 *
 * @param {Props}
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
export const ListContext = createContext<ListControllerResult>({
    sort: null,
    data: null,
    defaultTitle: null,
    displayedFilters: null,
    exporter: null,
    filterValues: null,
    hasNextPage: null,
    hasPreviousPage: null,
    hideFilter: null,
    isFetching: null,
    isLoading: null,
    onSelect: null,
    onToggleItem: null,
    onUnselectItems: null,
    page: null,
    perPage: null,
    refetch: null,
    resource: null,
    selectedIds: undefined,
    setFilters: null,
    setPage: null,
    setPerPage: null,
    setSort: null,
    showFilter: null,
    total: null,
});

ListContext.displayName = 'ListContext';
