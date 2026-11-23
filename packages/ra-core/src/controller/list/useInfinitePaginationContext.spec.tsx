import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { useInfinitePaginationContext } from './useInfinitePaginationContext';

describe('useInfinitePaginationContext', () => {
    it('should return default values when called outside of an InfinitePaginationContext', () => {
        const LoadMore = () => {
            const { hasNextPage } = useInfinitePaginationContext();
            return hasNextPage ? (
                <button>Load more</button>
            ) : (
                <span>No more results</span>
            );
        };
        render(<LoadMore />);
        screen.getByText('No more results');
    });
});
