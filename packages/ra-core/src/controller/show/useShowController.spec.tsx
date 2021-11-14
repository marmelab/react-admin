import * as React from 'react';
import expect from 'expect';
import { waitFor } from '@testing-library/react';
import { renderWithRedux } from 'ra-test';
import { MemoryRouter, Route } from 'react-router';
import { QueryClientProvider, QueryClient } from 'react-query';

import { ShowController } from './ShowController';
import { DataProviderContext } from '../../dataProvider';
import { DataProvider } from '../../types';

describe('useShowController', () => {
    const defaultProps = {
        id: 12,
        resource: 'posts',
        debounce: 200,
    };

    it('should call the dataProvider.getOne() function on mount', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        const { queryAllByText } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <ShowController {...defaultProps}>
                        {({ record }) => <div>{record && record.title}</div>}
                    </ShowController>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(queryAllByText('hello')).toHaveLength(1);
        });
    });

    it('should decode the id from the route params', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        renderWithRedux(
            <MemoryRouter initialEntries={['/posts/test%3F']}>
                <Route path="/posts/:id">
                    <QueryClientProvider client={new QueryClient()}>
                        <DataProviderContext.Provider value={dataProvider}>
                            <ShowController resource="posts">
                                {({ record }) => (
                                    <div>{record && record.title}</div>
                                )}
                            </ShowController>
                        </DataProviderContext.Provider>
                    </QueryClientProvider>
                </Route>
            </MemoryRouter>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', { id: 'test?' });
        });
    });
});
