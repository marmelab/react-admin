import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import ListContext from './ListContext';
import { ListControllerProps } from './useListController';
import { Record } from '../types';

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
 * @prop {Object}   data an id-based dictionary of the list data, e.g. { 123: { id: 123, title: 'hello world' }, 456: { ... } }
 * @prop {Array}    ids an array listing the ids of the records in the list, e.g. [123, 456, ...]
 * @prop {integer}  total the total number of results for the current filters, excluding pagination. Useful to build the pagination controls. e.g. 23
 * @prop {boolean}  loaded boolean that is false until the data is available
 * @prop {boolean}  loading boolean that is true on mount, and false once the data was fetched
 * @prop {integer}  page the current page. Starts at 1
 * @prop {Function} setPage a callback to change the page, e.g. setPage(3)
 * @prop {integer}  perPage the number of results per page. Defaults to 25
 * @prop {Function} setPerPage a callback to change the number of results per page, e.g. setPerPage(25)
 * @prop {Object}   currentSort a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
 * @prop {Function} setSort a callback to change the sort, e.g. setSort('name', 'ASC')
 * @prop {Object}   filterValues a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
 * @prop {Function} setFilters a callback to update the filters, e.g. setFilters(filters, displayedFilters)
 * @prop {Object}   displayedFilters a dictionary of the displayed filters, e.g. { title: true, nationality: true }
 * @prop {Function} showFilter a callback to show one of the filters, e.g. showFilter('title', defaultValue)
 * @prop {Function} hideFilter a callback to hide one of the filters, e.g. hideFilter('title')
 * @prop {Array}    selectedIds an array listing the ids of the selected rows, e.g. [123, 456]
 * @prop {Function} onSelect callback to change the list of selected rows, e.g. onSelect([456, 789])
 * @prop {Function} onToggleItem callback to toggle the selection of a given record based on its id, e.g. onToggleItem(456)
 * @prop {Function} onUnselectItems callback to clear the selection, e.g. onUnselectItems();
 * @prop {string}   basePath deduced from the location, useful for action buttons
 * @prop {string}   defaultTitle the translated title based on the resource, e.g. 'Posts'
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 *
 * @returns {ListControllerProps} list controller props
 *
 * @see useListController for how it is filled
 *
 * @example // custom list view
 *
 * import { useListContext } from 'react-admin';
 *
 * const MyList = () => {
 *     const { data, ids, loaded } = useListContext();
 *     if (!loaded) {
 *         return <>Loading...</>;
 *     }
 *     const records = ids.map(id => data[id]);
 *     return (
 *         <ul>
 *             {records.map(record => (
 *                 <li key={record.id}>{record.name}</li>
 *             ))}
 *         </ul>
 *     );
 * }
 *
 * @example // custom pagination
 *
 * import { useListContext } from 'react-admin';
 * import { Button, Toolbar } from '@material-ui/core';
 * import ChevronLeft from '@material-ui/icons/ChevronLeft';
 * import ChevronRight from '@material-ui/icons/ChevronRight';
 *
 * const PrevNextPagination = () => {
 *     const { page, perPage, total, setPage } = useListContext();
 *     const nbPages = Math.ceil(total / perPage) || 1;
 *     return (
 *         nbPages > 1 &&
 *             <Toolbar>
 *                 {page > 1 &&
 *                     <Button color="primary" key="prev" onClick={() => setPage(page - 1)}>
 *                         <ChevronLeft />
 *                         Prev
 *                     </Button>
 *                 }
 *                 {page !== nbPages &&
 *                     <Button color="primary" key="next" onClick={() => setPage(page + 1)}>
 *                         Next
 *                         <ChevronRight />
 *                     </Button>
 *                 }
 *             </Toolbar>
 *     );
 * }
 */
const useListContext = <RecordType extends Record = Record>(
    props?: any
): ListControllerProps<RecordType> => {
    const context = useContext(ListContext);
    // Props take precedence over the context
    // @ts-ignore
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractListContextProps(props) : {},
                context
            ),
        [context, props]
    );
};

export default useListContext;

/**
 * Extract only the list controller props
 *
 * @param {Object} props Props passed to the useListContext hook
 *
 * @returns {ListControllerProps} List controller props
 */
const extractListContextProps = ({
    basePath,
    currentSort,
    data,
    defaultTitle,
    displayedFilters,
    filterValues,
    hasCreate,
    hideFilter,
    ids,
    loaded,
    loading,
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
}) => ({
    basePath,
    currentSort,
    data,
    defaultTitle,
    displayedFilters,
    filterValues,
    hasCreate,
    hideFilter,
    ids,
    loaded,
    loading,
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
