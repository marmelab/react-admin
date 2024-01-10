import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { PaginationActions } from './PaginationActions';

describe('<PaginationActions />', () => {
    it('should not render any actions when no pagination is necessary', () => {
        render(
            <PaginationActions
                page={0}
                rowsPerPage={20}
                count={15}
                onPageChange={() => null}
            />
        );
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('should render action buttons when pagination is necessary', () => {
        render(
            <PaginationActions
                page={0}
                rowsPerPage={5}
                count={15}
                onPageChange={() => null}
            />
        );
        // prev 1 2 3 next
        expect(screen.queryAllByRole('button')).toHaveLength(5);
    });

    it('should skip page action buttons when there are too many', () => {
        render(
            <PaginationActions
                page={7}
                rowsPerPage={1}
                count={15}
                onPageChange={() => null}
            />
        );
        // prev 1 ... 7 8 9 ... 15 next
        expect(screen.queryAllByRole('button')).toHaveLength(7);
    });
});
