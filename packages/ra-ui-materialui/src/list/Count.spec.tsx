import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { ResourceContextProvider } from 'ra-core';
import { Count } from './Count';
import { Basic, ErrorState, WithFilter, Wrapper } from './Count.stories';

describe('<Count />', () => {
    it('should return the number of records of a given resource', async () => {
        render(<Basic />);
        await screen.findByText('5');
    });
    it('should render an error icon when the request fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<ErrorState />);
        await screen.findByTitle('error');
    });
    it('should accept a filter prop', async () => {
        render(<WithFilter />);
        await screen.findByText('3');
    });
    it('should accept a sort prop', async () => {
        const dataProvider = {
            getList: jest.fn(),
        } as any;
        render(
            <Wrapper dataProvider={dataProvider}>
                <ResourceContextProvider value="posts">
                    <Count sort={{ field: 'custom_id', order: 'ASC' }} />
                </ResourceContextProvider>
            </Wrapper>
        );
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
            filter: {},
            pagination: { page: 1, perPage: 1 },
            sort: { field: 'custom_id', order: 'ASC' },
            meta: undefined,
        });
    });
});
