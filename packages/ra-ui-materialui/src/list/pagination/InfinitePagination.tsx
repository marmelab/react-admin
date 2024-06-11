import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
    useInfinitePaginationContext,
    useListContext,
    useEvent,
} from 'ra-core';
import { Box, CircularProgress, SxProps } from '@mui/material';

/**
 * A pagination component that loads more results when the user scrolls to the bottom of the list.
 *
 * Used as the default pagination component in the <InfiniteList> component.
 *
 * @example
 * import { InfiniteList, InfinitePagination, Datagrid, TextField } from 'react-admin';
 *
 * const PostList = () => (
 *    <InfiniteList pagination={<InfinitePagination sx={{ py: 5 }} />}>
 *       <Datagrid>
 *          <TextField source="id" />
 *         <TextField source="title" />
 *      </Datagrid>
 *   </InfiniteList>
 * );
 */
export const InfinitePagination = ({
    options = defaultOptions,
    sx,
}: InfinitePaginationProps) => {
    const { isPending } = useListContext();
    const { fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfinitePaginationContext();

    if (!fetchNextPage) {
        throw new Error(
            'InfinitePagination must be used inside an InfinitePaginationContext, usually created by <InfiniteList>. You cannot use it as child of a <List> component.'
        );
    }

    const observerElem = useRef(null);

    const handleObserver = useEvent<[IntersectionObserverEntry[]], void>(
        entries => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    );

    useEffect(() => {
        const element = observerElem.current;
        if (!element) return;
        const observer = new IntersectionObserver(handleObserver, options);
        observer.observe(element);
        return () => observer.unobserve(element);
    }, [
        fetchNextPage,
        hasNextPage,
        handleObserver,
        options,
        isPending,
        isFetchingNextPage,
    ]);

    if (isPending) return null;

    return (
        <Box ref={observerElem} py={2} textAlign="center" sx={sx}>
            {isFetchingNextPage && hasNextPage && (
                <CircularProgress size="1.5em" />
            )}
        </Box>
    );
};

const defaultOptions = { threshold: 0 };

export interface InfinitePaginationProps {
    options?: IntersectionObserverInit;
    sx?: SxProps;
}
