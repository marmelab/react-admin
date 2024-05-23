import { createContext } from 'react';
import { InfiniteListControllerResult } from './useInfiniteListController';

/**
 * Context to store the pagination callbacks from the useInfiniteListController() result.
 *
 * Use the useInfinitePaginationContext() hook to read the pagination callbacks.
 *
 * @typedef {Object} InfinitePaginationContextValue
 * @prop {Function} fetchNextPage a callback to fetch the next page
 * @prop {Function} fetchPreviousPage a callback to fetch the previous page

 * @example
 *
 * import { useListController, ListPaginationContext } from 'ra-core';
 *
 * const List = props => {
 *     const { fetchNextPage, fetchPreviousPage } = useInfiniteListController(props);
 *     return (
 *         <InfinitePaginationContext.Provider value={{ fetchNextPage, fetchPreviousPage }}>
 *             ...
 *         </InfinitePaginationContext.Provider>
 *     );
 * };
 */
export const InfinitePaginationContext =
    createContext<InfinitePaginationContextValue>({
        hasNextPage: false,
        fetchNextPage: () => Promise.reject('not implemented'),
        isFetchingNextPage: false,
        hasPreviousPage: false,
        fetchPreviousPage: () => Promise.reject('not implemented'),
        isFetchingPreviousPage: false,
    });

InfinitePaginationContext.displayName = 'InfinitePaginationContext';

export type InfinitePaginationContextValue = Pick<
    InfiniteListControllerResult,
    | 'fetchNextPage'
    | 'fetchPreviousPage'
    | 'isFetchingNextPage'
    | 'hasNextPage'
    | 'hasPreviousPage'
    | 'isFetchingPreviousPage'
>;
