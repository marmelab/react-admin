import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import {
    Basic,
    defaultDataProvider,
    Limit,
    QueryOptions,
} from './useSelectAll.stories';

describe('useSelectAll', () => {
    it('should select all', async () => {
        render(<Basic options={{}} />);
        await screen.findByText('Selected ids: []');
        fireEvent.click(screen.getByText('Select All'));
        await waitFor(() => {
            expect(
                screen.queryByText('Selected ids: [1,2,3,4,5,6,7]')
            ).not.toBeNull();
        });
    });

    it('should select all with limit', async () => {
        render(<Limit />);
        await screen.findByText('Selected ids: []');
        fireEvent.click(screen.getByText('Select All'));
        await waitFor(() => {
            expect(screen.queryByText('Selected ids: [1,2,3]')).not.toBeNull();
        });
    });

    it('should pass query options', async () => {
        const getList = jest.spyOn(defaultDataProvider, 'getList');
        render(<QueryOptions dataProvider={defaultDataProvider} />);
        await screen.findByText('Selected ids: []');
        fireEvent.click(screen.getByText('Select All'));
        await waitFor(() => {
            expect(getList).toHaveBeenCalledWith('posts', {
                meta: { foo: 'bar' },
                pagination: { page: 1, perPage: 250 },
                sort: { field: 'id', order: 'ASC' },
            });
        });
    });
});
