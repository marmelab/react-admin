import * as React from 'react';
import expect from 'expect';
import {
    CoreAdminContext,
    ResourceContextProvider,
    useRecordContext,
    useShowContext,
    ResourceDefinitionContextProvider,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { createMemoryHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { AdminContext } from '../AdminContext';
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
            <CoreAdminContext dataProvider={dataProvider} history={history}>
                <Routes>
                    <Route
                        path="/books/:id/show"
                        element={
                            <ResourceContextProvider value="books">
                                <Show>
                                    <BookName />
                                </Show>
                            </ResourceContextProvider>
                        }
                    />
                </Routes>
            </CoreAdminContext>
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
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Show id="123" resource="books">
                    <BookName />
                </Show>
            </CoreAdminContext>
        );
        expect(screen.queryByText('War and Peace')).toBeNull(); // while loading
        await waitFor(() => {
            expect(screen.queryByText('War and Peace')).not.toBeNull();
        });
    });

    it('should accept queryOptions prop', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const onError = jest.fn();
        const dataProvider = {
            getOne: () => Promise.reject('error'),
        } as any;
        const BookName = () => <span>foo</span>;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Show id="123" resource="books" queryOptions={{ onError }}>
                    <BookName />
                </Show>
            </CoreAdminContext>
        );
        await waitFor(() => expect(onError).toHaveBeenCalled());
    });

    it('should display an edit button by default when there is an Edit view', async () => {
        render(<Default />);
        await screen.findByText('Edit');
    });

    it('should allow to display custom actions with the actions prop', async () => {
        render(<Actions />);
        await screen.findByText('Edit');
    });

    it('should display a default title based on resource and id', async () => {
        render(<Basic />);
        await screen.findByText('Book #1');
    });

    it('should allow to override the root component', () => {
        render(<Component />);
        expect(screen.getByTestId('custom-component')).toBeDefined();
    });

    describe('defaultTitle', () => {
        const defaultShowProps = {
            id: '123',
            resource: 'foo',
        };
        it('should use the record id by default', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: 'lorem' } }),
            } as any;
            const Title = () => {
                const { defaultTitle } = useShowContext();
                return <>{defaultTitle}</>;
            };
            const i18nProvider = polyglotI18nProvider(() => englishMessages);
            render(
                <AdminContext
                    dataProvider={dataProvider}
                    i18nProvider={i18nProvider}
                >
                    <Show {...defaultShowProps}>
                        <Title />
                    </Show>
                </AdminContext>
            );
            await screen.findByText('Foo #123');
        });
        it('should use the recordRepresentation when defined', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: 'lorem' } }),
            } as any;
            const Title = () => {
                const { defaultTitle } = useShowContext();
                return <>{defaultTitle}</>;
            };
            const i18nProvider = polyglotI18nProvider(() => englishMessages);
            render(
                <AdminContext
                    dataProvider={dataProvider}
                    i18nProvider={i18nProvider}
                >
                    <ResourceDefinitionContextProvider
                        definitions={{ foo: { recordRepresentation: 'title' } }}
                    >
                        <Show {...defaultShowProps}>
                            <Title />
                        </Show>
                    </ResourceDefinitionContextProvider>
                </AdminContext>
            );
            await screen.findByText('Foo lorem');
        });
    });
});
