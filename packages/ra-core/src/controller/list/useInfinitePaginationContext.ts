import { useContext } from 'react';

import {
    InfinitePaginationContext,
    InfinitePaginationContextValue,
} from './InfinitePaginationContext';

/**
 * Hook to read the infinite pagination callbacks from the InfinitePaginationContext.
 *
 * Meant to be used within an <InfinitePaginationContext.Provider> (e.g. as a descendent of <InfiniteList>
 * or <InfiniteListBase>). Outside of it, returns default values with no next or previous page.
 * To know whether a component is rendered inside an InfinitePaginationContext, read the context
 * with useContext(InfinitePaginationContext) instead: it is undefined outside of it.
 *
 * @typedef {Object} InfinitePaginationContextValue
 * @prop {Function} fetchNextPage a callback to fetch the next page
 * @prop {Function} fetchPreviousPage a callback to fetch the previous page
 *
 * @returns {InfinitePaginationContextValue} infinite pagination callbacks
 *
 * @see useInfiniteListController for how the callbacks are built
 */
export const useInfinitePaginationContext =
    (): InfinitePaginationContextValue =>
        useContext(InfinitePaginationContext) ?? defaultContextValue;

const defaultContextValue: InfinitePaginationContextValue = {
    hasNextPage: false,
    fetchNextPage: () => Promise.reject('not implemented'),
    isFetchingNextPage: false,
    hasPreviousPage: false,
    fetchPreviousPage: () => Promise.reject('not implemented'),
    isFetchingPreviousPage: false,
};
