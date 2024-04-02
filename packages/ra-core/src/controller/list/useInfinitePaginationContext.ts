import { useContext } from 'react';

import {
    InfinitePaginationContext,
    InfinitePaginationContextValue,
} from './InfinitePaginationContext';

/**
 * Hook to read the infinite pagination callbacks from the InfinitePaginationContext.
 *
 * Must be used within a <InfinitePaginationContext.Provider> (e.g. as a descendent of <InfiniteList>
 * or <InfiniteListBase>).
 *
 * @param {Object} InfinitePaginationContextValue
 * @param {Function} fetchNextPage a callback to fetch the next page
 * @param {Function} fetchPreviousPage a callback to fetch the previous page
 *
 * @returns {InfinitePaginationContextValue} infinite pagination callbacks
 *
 * @see useInfiniteListController for how the callbacks are built
 */
export const useInfinitePaginationContext = (): InfinitePaginationContextValue =>
    useContext(InfinitePaginationContext);
