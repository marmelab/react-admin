import { createContext, useMemo } from 'react';
import pick from 'lodash/pick';
import { ListControllerResult } from './useListController';

/**
 * Context to store the pagination part of the useListController() result.
 *
 * Use the useListPaginationContext() hook to read the pagination information.
 * That's what List components do in react-admin (e.g. <Pagination>).
 *
 * @param {Props} Props
 * @param {Object} ListPaginationContextValue
 * @param {boolean}  isLoading boolean that is false until the data is available
 * @param {integer}  total the total number of results for the current filters, excluding pagination. Useful to build the pagination controls. e.g. 23
 * @param {integer}  page the current page. Starts at 1
 * @param {Function} setPage a callback to change the page, e.g. setPage(3)
 * @param {integer}  perPage the number of results per page. Defaults to 25
 * @param {Function} setPerPage a callback to change the number of results per page, e.g. setPerPage(25)
 * @param {Boolean}  hasPreviousPage true if the current page is not the first one
 * @param {Boolean}  hasNextPage true if the current page is not the last one
 * @param {string}   resource the resource name, deduced from the location. e.g. 'posts'
 * @param {ListPaginationContextValue} value
 *
 * @see useListController
 * @see useListContext
 *
 * @example
 *
 * import { useListController, ListPaginationContext } from 'ra-core';
 *
 * const List = props => {
 *     const controllerProps = useListController(props);
 *     return (
 *         <ListPaginationContext.Provider value={controllerProps}>
 *             ...
 *         </ListPaginationContext.Provider>
 *     );
 * };
 */
export const ListPaginationContext = createContext<ListPaginationContextValue>({
    isLoading: null,
    page: null,
    perPage: null,
    setPage: null,
    setPerPage: null,
    hasPreviousPage: null,
    hasNextPage: null,
    total: undefined,
    resource: null,
});

ListPaginationContext.displayName = 'ListPaginationContext';

export type ListPaginationContextValue = Pick<
    ListControllerResult,
    | 'isLoading'
    | 'hasPreviousPage'
    | 'hasNextPage'
    | 'page'
    | 'perPage'
    | 'setPage'
    | 'setPerPage'
    | 'total'
    | 'resource'
>;

export const usePickPaginationContext = (
    context: ListControllerResult
): ListPaginationContextValue =>
    useMemo(
        () =>
            pick(context, [
                'isLoading',
                'hasPreviousPage',
                'hasNextPage',
                'page',
                'perPage',
                'setPage',
                'setPerPage',
                'total',
                'resource',
            ]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            context.isLoading,
            context.hasPreviousPage,
            context.hasNextPage,
            context.page,
            context.perPage,
            context.setPage,
            context.setPerPage,
            context.total,
        ]
    );
