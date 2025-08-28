import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
    useInfinitePaginationContext,
    useListContext,
    useEvent,
} from 'ra-core';
import { Box, CircularProgress, type SxProps, type Theme } from '@mui/material';
import { Offline } from '../../Offline';

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
    offline = defaultOffline,
    options = defaultOptions,
    sx,
}: InfinitePaginationProps) => {
    const { isPaused, isPending } = useListContext();
    const { fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfinitePaginationContext();

    if (!fetchNextPage) {
        throw new Error(
            'InfinitePagination must be used inside an InfinitePaginationContext, usually created by <InfiniteList>. You cannot use it as child of a <List> component.'
        );
    }

    const [hasRequestedNextPage, setHasRequestedNextPage] =
        React.useState(false);
    const observerElem = useRef(null);
    const handleObserver = useEvent<[IntersectionObserverEntry[]], void>(
        entries => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                setHasRequestedNextPage(true);
                fetchNextPage();
            }
        }
    );

    useEffect(() => {
        // Whenever the query is unpaused, reset the requested next page state
        if (!isPaused) {
            setHasRequestedNextPage(false);
        }
    }, [isPaused]);

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

    const showOffline =
        isPaused &&
        hasNextPage &&
        hasRequestedNextPage &&
        offline !== false &&
        offline !== undefined;

    return (
        <Box
            ref={observerElem}
            sx={[
                {
                    py: 2,
                    textAlign: 'center',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {showOffline ? (
                offline
            ) : isFetchingNextPage && hasNextPage ? (
                <CircularProgress size="1.5em" />
            ) : null}
        </Box>
    );
};

const defaultOptions = { threshold: 0 };
const defaultOffline = <Offline />;

export interface InfinitePaginationProps {
    offline?: React.ReactNode;
    options?: IntersectionObserverInit;
    sx?: SxProps<Theme>;
}
