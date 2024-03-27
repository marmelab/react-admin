import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import { ListContext } from './ListContext';
import { ListControllerResult } from './useListController';
import { RaRecord } from '../../types';

/**
 * Hook to read the list controller props from the ListContext.
 *
 * Mostly used within a <ListContext.Provider> (e.g. as a descendent of <List>
 * or <ListBase>).
 *
 * But you can also use it without a <ListContext.Provider>. In this case, it is up to you
 * to pass all the necessary props (see the list below).
 *
 * The given props will take precedence over context values.
 *
 * @typedef {Object} ListControllerProps
 * @prop {Object}   data an array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }]
 * @prop {integer}  total the total number of results for the current filters, excluding pagination. Useful to build the pagination controls. e.g. 23
 * @prop {boolean}  isFetching boolean that is true on mount, and false once the data was fetched
 * @prop {boolean}  isLoading boolean that is false until the data is available
 * @prop {integer}  page the current page. Starts at 1
 * @prop {Function} setPage a callback to change the page, e.g. setPage(3)
 * @prop {integer}  perPage the number of results per page. Defaults to 25
 * @prop {Function} setPerPage a callback to change the number of results per page, e.g. setPerPage(25)
 * @prop {Object}   sort a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
 * @prop {Function} setSort a callback to change the sort, e.g. setSort({ field : 'name', order: 'ASC' })
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
 *
 * @param {ListControllerProps} props Props passed to the useListContext hook
 *
 * @returns {ListControllerResult} list controller props
 *
 * @see useListController for how it is filled
 */
export const useListContextWithProps = <RecordType extends RaRecord = any>(
    props?: any
): Partial<ListControllerResult<RecordType>> => {
    const context = useContext(ListContext);
    // Props take precedence over the context
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractListContextProps<RecordType>(props) : {},
                context
            ),
        [context, props]
    );
};

/**
 * Extract only the list controller props
 *
 * @param {Object} props Props passed to the useListContext hook
 *
 * @returns {ListControllerResult} List controller props
 */
const extractListContextProps = <RecordType extends RaRecord = any>({
    sort,
    data,
    defaultTitle,
    displayedFilters,
    exporter,
    filterValues,
    hasCreate,
    hideFilter,
    isFetching,
    isLoading,
    isPending,
    onSelect,
    onToggleItem,
    onUnselectItems,
    page,
    perPage,
    refetch,
    resource,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSort,
    showFilter,
    total,
}: Partial<ListControllerResult<RecordType>> & Record<string, any>) => ({
    sort,
    data,
    defaultTitle,
    displayedFilters,
    exporter,
    filterValues,
    hasCreate,
    hideFilter,
    isFetching,
    isLoading,
    isPending,
    onSelect,
    onToggleItem,
    onUnselectItems,
    page,
    perPage,
    refetch,
    resource,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSort,
    showFilter,
    total,
});
