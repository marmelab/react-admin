import * as React from 'react';
import { useEffect, useCallback, useRef } from 'react';
import { useInfinitePaginationContext, useListContext } from 'ra-core';
import { Box, CircularProgress } from '@mui/material';

export const InfiniteScroll = () => {
    const { isLoading } = useListContext();
    const {
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePaginationContext();

    const observerElem = useRef(null);

    const handleObserver = useCallback(
        entries => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage]
    );

    useEffect(() => {
        const element = observerElem.current;
        if (!element) return;
        const option = { threshold: 0 };
        const observer = new IntersectionObserver(handleObserver, option);
        observer.observe(element);
        return () => observer.unobserve(element);
    }, [fetchNextPage, hasNextPage, handleObserver]);

    if (isLoading) return null;
    return (
        <Box ref={observerElem} py={2} textAlign="center">
            {isFetchingNextPage && hasNextPage && (
                <CircularProgress size="1.5em" />
            )}
        </Box>
    );
};
