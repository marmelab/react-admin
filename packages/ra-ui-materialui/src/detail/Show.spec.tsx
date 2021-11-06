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

import { Show } from './Show';

describe('<Show />', () => {
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
                    <DataProviderContext.Provider value={dataProvider}>
                        <ResourceContextProvider value="books">
                            <Show>
                                <BookName />
                            </Show>
                        </ResourceContextProvider>
                    </DataProviderContext.Provider>
                </Route>
            </TestContext>
        );
        expect(screen.queryByText('War and Peace')).toBeNull(); // while loading
        await waitFor(() => {
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
    });

    it('should fetch dataProvider.getOne based on id and resource props', async () => {
        // Why is this required? No idea, but without is the tests are flaky
        await new Promise(res => setTimeout(res, 100));
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
            <DataProviderContext.Provider value={dataProvider}>
                <Show id="123" resource="books">
                    <BookName />
                </Show>
            </DataProviderContext.Provider>,
            // FIXME resource must be initialized
            { admin: { resources: { books: { props: {}, data: {} } } } }
        );
        expect(screen.queryByText('War and Peace')).toBeNull(); // while loading
        await waitFor(() => {
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
    });

    it('should accept onFailure prop and call it on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const onFailure = jest.fn();
        const dataProvider = {
            getOne: () => Promise.reject('error'),
        } as any;
        const BookName = () => <span>foo</span>;
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Show id="123" resource="books" onFailure={onFailure}>
                    <BookName />
                </Show>
            </DataProviderContext.Provider>,
            // FIXME resource must be initialized
            { admin: { resources: { books: { props: {}, data: {} } } } }
        );
        await waitFor(() => expect(onFailure).toHaveBeenCalled());
    });
});
