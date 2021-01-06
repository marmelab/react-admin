import { createContext, useMemo } from 'react';
import pick from 'lodash/pick';
import { ListControllerProps } from './useListController';

/**
 * Context to store the sort part of the useListController() result.
 *
 * Use the useListSortContext() hook to read the context. That's what many
 * List components do in react-admin (e.g. <SortButton>).
 *
 * @typedef {Object} ListSortContextValue
 * @prop {Object}   currentSort a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
 * @prop {Function} setSort a callback to change the sort, e.g. setSort('name', 'ASC')
 * @prop {string}   resource the resource name, deduced from the location. e.g. 'posts'
 *
 * @typedef Props
 * @prop {ListSortContextValue} value
 *
 * @param {Props}
 *
 * @see useListController
 * @see useListSortContext
 *
 * @example
 *
 * import { useListController, usePickSortContext, ListSortContext } from 'ra-core';
 *
 * const List = props => {
 *     const controllerProps = useListController(props);
 *     return (
 *         <ListSortContext.Provider value={usePickSortContext(controllerProps)}>
 *             ...
 *         </ListSortContext.Provider>
 *     );
 * };
 */
const ListSortContext = createContext<ListSortContextValue>({
    currentSort: null,
    setSort: null,
    resource: null,
});

export type ListSortContextValue = Pick<
    ListControllerProps,
    'currentSort' | 'setSort' | 'resource'
>;

export const usePickSortContext = (
    context: ListControllerProps
): ListSortContextValue =>
    useMemo(
        () => pick(context, ['currentSort', 'setSort', 'resource']),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [context.currentSort, context.setSort]
    );

ListSortContext.displayName = 'ListSortContext';

export default ListSortContext;
