import * as React from 'react';
import expect from 'expect';
import {
    DataProviderContext,
    ResourceContextProvider,
    useRecordContext,
} from 'ra-core';
import { TestContext, renderWithRedux } from 'ra-test';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';

import { Default, Actions, Basic, Component } from './Show.stories';

import { Show } from './Show';

describe('<Show />', () => {
    beforeEach(async () => {
        // Why is this required? No idea, but without is the tests are flaky
        await new Promise(res => setTimeout(res, 100));
    });

    it('should fetch dataProvider.getOne based on history and ResourceContext', async () => {
        const dataProvider = {
            getOne: (resource, params) => {
                return resource === 'books' && params.id === '123'
                    ? Promise.resolve({
                          data: { id: 123, name: 'War and Peace' },
                      })
                    : Promise.reject('error');
            },
        } as any;
        const BookName = () => {
            const record = useRecordContext();
            return record ? <span>{record.name}</span> : null;
        };
        const history = createMemoryHistory({
            initialEntries: ['/books/123/show'],
        });
        render(
            <TestContext
                history={history}
                enableReducers
                initialState={{
                    admin: { resources: { books: { props: {}, data: {} } } },
                }}
            >
                <Route path="/books/:id/show">
                    <QueryClientProvider client={new QueryClient()}>
                        <DataProviderContext.Provider value={dataProvider}>
                            <ResourceContextProvider value="books">
                                <Show>
                                    <BookName />
                                </Show>
                            </ResourceContextProvider>
                        </DataProviderContext.Provider>
                    </QueryClientProvider>
                </Route>
            </TestContext>
        );
        expect(screen.queryByText('War and Peace')).toBeNull(); // while loading
        await waitFor(() => {
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
    });

    it('should fetch dataProvider.getOne based on id and resource props', async () => {
        const dataProvider = {
            getOne: (resource, params) =>
                resource === 'books' && params.id === '123'
                    ? Promise.resolve({
                          data: { id: 123, name: 'War and Peace' },
                      })
                    : Promise.reject('error'),
        } as any;
        const BookName = () => {
            const record = useRecordContext();
            return record ? <span>{record.name}</span> : null;
        };
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <Show id="123" resource="books">
                        <BookName />
                    </Show>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        expect(screen.queryByText('War and Peace')).toBeNull(); // while loading
        await waitFor(() => {
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
    });

    it('should accept onError prop and call it on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const onError = jest.fn();
        const dataProvider = {
            getOne: () => Promise.reject('error'),
        } as any;
        const BookName = () => <span>foo</span>;
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <Show id="123" resource="books" onError={onError}>
                        <BookName />
                    </Show>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await waitFor(() => expect(onError).toHaveBeenCalled());
    });

    it('should display an edit button by default when there is an Edit view', () => {
        render(<Default />);
        expect(screen.getByText('Edit')).toBeDefined();
    });

    it('should allow to display custom actions with the actions prop', () => {
        render(<Actions />);
        expect(screen.getByText('Actions')).toBeDefined();
    });

    it('should display a default title based on resource and id', async () => {
        render(<Basic />);
        await waitFor(() => expect(screen.getByText('Book #1')).toBeDefined());
    });

    it('should allow to override the root component', () => {
        render(<Component />);
        expect(screen.getByTestId('custom-component')).toBeDefined();
    });
});
