import { createContext, useMemo } from 'react';
import pick from 'lodash/pick';
import { ListControllerResult } from './useListController';

/**
 * Context to store the sort part of the useListController() result.
 *
 * Use the useListSortContext() hook to read the context. That's what many
 * List components do in react-admin (e.g. <SortButton>).
 *
 * @typedef {Object} ListSortContextValue
 * @prop {Object}   sort a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
 * @prop {Function} setSort a callback to change the sort, e.g. setSort({ field: 'name', order: 'ASC' })
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
export const ListSortContext = createContext<ListSortContextValue>({
    sort: null,
    setSort: null,
    resource: null,
});

export type ListSortContextValue = Pick<
    ListControllerResult,
    'sort' | 'setSort' | 'resource'
>;

export const usePickSortContext = (
    context: ListControllerResult
): ListSortContextValue =>
    useMemo(
        () => pick(context, ['sort', 'setSort', 'resource']),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [context.sort, context.setSort]
    );

ListSortContext.displayName = 'ListSortContext';
