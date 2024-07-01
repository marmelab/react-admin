import * as React from 'react';
import expect from 'expect';

import {
    CoreAdminContext,
    ResourceContextProvider,
    useRecordContext,
    useShowContext,
    ResourceDefinitionContextProvider,
    TestMemoryRouter,
} from 'ra-core';

import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { AdminContext } from '../AdminContext';
import {
    Default,
    Actions,
    Basic,
    Component,
    Title,
    TitleFalse,
    TitleElement,
} from './Show.stories';
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
        render(
            <TestMemoryRouter initialEntries={['/books/123/show']}>
                <CoreAdminContext dataProvider={dataProvider}>
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
            </TestMemoryRouter>
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

    it('should allow to override the root component', () => {
        render(<Component />);
        expect(screen.getByTestId('custom-component')).toBeDefined();
    });

    describe('title', () => {
        it('should display by default the title of the resource', async () => {
            render(<Basic />);
            await screen.findByText('War and Peace');
            screen.getByText('Book War and Peace');
        });

        it('should render custom title string when defined', async () => {
            render(<Title />);
            await screen.findByText('War and Peace');
            screen.getByText('Hello');
            expect(screen.queryByText('Book War and Peace')).toBeNull();
        });

        it('should render custom title element when defined', async () => {
            render(<TitleElement />);
            await screen.findByText('War and Peace');
            screen.getByText('Hello');
            expect(screen.queryByText('Book War and Peace')).toBeNull();
        });

        it('should not render default title when false', async () => {
            render(<TitleFalse />);
            await screen.findByText('War and Peace');
            expect(screen.queryByText('Book War and Peace')).toBeNull();
        });
    });

    describe('defaultTitle', () => {
        it('should use the record id by default', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: 'lorem' } }),
            } as any;
            const DefaultTitle = () => {
                const { defaultTitle } = useShowContext();
                return <>{defaultTitle}</>;
            };
            const i18nProvider = polyglotI18nProvider(() => englishMessages);
            render(
                <AdminContext
                    dataProvider={dataProvider}
                    i18nProvider={i18nProvider}
                >
                    <Show id="123" resource="foo">
                        <DefaultTitle />
                    </Show>
                </AdminContext>
            );
            await screen.findByText('Foo lorem');
        });

        it('should use the recordRepresentation when defined', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: 'lorem' } }),
            } as any;
            const DefaultTitle = () => {
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
                        definitions={{
                            foo: { name: 'foo', recordRepresentation: 'title' },
                        }}
                    >
                        <Show id="123" resource="foo">
                            <DefaultTitle />
                        </Show>
                    </ResourceDefinitionContextProvider>
                </AdminContext>
            );
            await screen.findByText('Foo lorem');
        });
    });
});
