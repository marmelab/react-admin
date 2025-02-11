import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { testDataProvider, useListContext, TestMemoryRouter } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AdminContext } from '../AdminContext';
import { ReferenceManyField } from './ReferenceManyField';
import { TextField } from './TextField';
import { SingleFieldList } from '../list/SingleFieldList';
import { Pagination } from '../list/pagination/Pagination';
import {
    Basic,
    WithPagination,
    WithPaginationAndSelectAllLimit,
} from './ReferenceManyField.stories';

const theme = createTheme();

describe('<ReferenceManyField />', () => {
    const defaultProps = {
        // resource and reference are the same because useReferenceManyFieldController
        // set the reference as the current resource
        resource: 'posts',
        reference: 'comments',
        page: 1,
        perPage: 10,
        target: 'post_id',
        record: { id: 1 },
    };

    it('should render a list of the child component', async () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        render(
            <TestMemoryRouter>
                <AdminContext
                    dataProvider={testDataProvider({
                        getManyReference: () =>
                            Promise.resolve<any>({ data, total: 2 }),
                    })}
                >
                    <ThemeProvider theme={theme}>
                        <ReferenceManyField {...defaultProps}>
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </ThemeProvider>
                </AdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        });
        const links = await screen.findAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/comments/1');
        expect(links[1].getAttribute('href')).toEqual('/comments/2');
    });

    it('should accept many children', async () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const ListContextWatcher = () => {
            const { data } = useListContext();
            if (!data) return null;
            return (
                <ul>
                    {data.map(record => (
                        <li key={record.id}>comment:{record.title}</li>
                    ))}
                </ul>
            );
        };

        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () =>
                        Promise.resolve<any>({ data, total: 2 }),
                })}
            >
                <ThemeProvider theme={theme}>
                    <ReferenceManyField {...defaultProps}>
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                        <ListContextWatcher />
                    </ReferenceManyField>
                </ThemeProvider>
            </AdminContext>
        );
        await screen.findByText('hello');
        await screen.findByText('world');
        await screen.findByText('comment:hello');
        await screen.findByText('comment:world');
    });

    it('should render nothing when there are no related records', async () => {
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () =>
                        Promise.resolve({ data: [], total: 0 }),
                })}
            >
                <ReferenceManyField {...defaultProps}>
                    <SingleFieldList>
                        <TextField source="title" />
                    </SingleFieldList>
                </ReferenceManyField>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });
    });

    it('should support record with string identifier', async () => {
        const data = [
            { id: 'abc-1', title: 'hello' },
            { id: 'abc-2', title: 'world' },
        ];
        render(
            <TestMemoryRouter>
                <AdminContext
                    dataProvider={testDataProvider({
                        getManyReference: () =>
                            Promise.resolve<any>({ data, total: 2 }),
                    })}
                >
                    <ReferenceManyField {...defaultProps}>
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceManyField>
                </AdminContext>
            </TestMemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        });
        const links = await screen.findAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/comments/abc-1');
        expect(links[1].getAttribute('href')).toEqual('/comments/abc-2');
    });

    it('should support record with number identifier', async () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        render(
            <TestMemoryRouter>
                <AdminContext
                    dataProvider={testDataProvider({
                        getManyReference: () =>
                            Promise.resolve<any>({ data, total: 2 }),
                    })}
                >
                    <ReferenceManyField {...defaultProps}>
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceManyField>
                </AdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        });
        const links = await screen.findAllByRole('link');
        expect(links).toHaveLength(2);
        expect(links[0].textContent).toEqual('hello');
        expect(links[1].textContent).toEqual('world');
        expect(links[0].getAttribute('href')).toEqual('/comments/1');
        expect(links[1].getAttribute('href')).toEqual('/comments/2');
    });

    it('should clear selection on bulk delete', async () => {
        render(<Basic />);
        await screen.findByText('War and Peace');
        const checkbox = (
            await screen.findAllByLabelText('ra.action.select_row')
        )[1];
        fireEvent.click(checkbox);
        await screen.findByText('ra.action.bulk_actions');
        screen.getByText('ra.action.delete').click();
        await waitFor(() => {
            expect(
                screen.queryAllByRole('ra.action.bulk_actions')
            ).toHaveLength(0);
        });
    });

    describe('pagination', () => {
        it('should render pagination based on total from getManyReference', async () => {
            const data = [
                { id: 1, title: 'hello' },
                { id: 2, title: 'world' },
            ];
            render(
                <TestMemoryRouter>
                    <AdminContext
                        dataProvider={testDataProvider({
                            getManyReference: () =>
                                Promise.resolve<any>({ data, total: 12 }),
                        })}
                    >
                        <ReferenceManyField
                            {...defaultProps}
                            pagination={<Pagination />}
                        >
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </AdminContext>
                </TestMemoryRouter>
            );
            await screen.findByText('hello');
            await screen.findByText('world');
            await screen.findByText('ra.navigation.page_range_info');
            await screen.findByText('1');
            await screen.findByText('2');
        });
        it('should render pagination based on pageInfo from getManyReference', async () => {
            const data = [
                { id: 1, title: 'hello' },
                { id: 2, title: 'world' },
            ];
            render(
                <TestMemoryRouter>
                    <AdminContext
                        dataProvider={testDataProvider({
                            getManyReference: () =>
                                Promise.resolve<any>({
                                    data,
                                    pageInfo: {
                                        hasPreviousPage: false,
                                        hasNextPage: true,
                                    },
                                }),
                        })}
                    >
                        <ReferenceManyField
                            {...defaultProps}
                            pagination={<Pagination />}
                        >
                            <SingleFieldList>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </AdminContext>
                </TestMemoryRouter>
            );
            await screen.findByText('hello');
            await screen.findByText('world');
            await screen.findByText('ra.navigation.partial_page_range_info');
            await screen.findByLabelText('ra.navigation.previous');
            await screen.findByLabelText('ra.navigation.next');
        });
    });

    describe('"Select all" button', () => {
        it('should be displayed if all the items of the page are selected', async () => {
            render(<WithPagination />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            expect(
                await screen.findByRole('button', { name: 'Select all' })
            ).toBeDefined();
        });
        it('should not be displayed if all item are manually selected', async () => {
            render(
                <WithPagination
                    dataProvider={testDataProvider({
                        getManyReference: () =>
                            Promise.resolve<any>({
                                data: [
                                    {
                                        id: 0,
                                        title: 'War and Peace',
                                        author: 'Leo Tolstoy',
                                        year: 1869,
                                    },
                                    {
                                        id: 1,
                                        title: 'Pride and Prejudice',
                                        author: 'Jane Austen',
                                        year: 1813,
                                    },
                                ],
                                total: 2,
                            }),
                    })}
                />
            );
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(3);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('2 items selected');
            expect(
                screen.queryByRole('button', { name: 'Select all' })
            ).toBeNull();
        });
        it('should not be displayed if all items are selected with the "Select all" button', async () => {
            render(<WithPagination />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('5 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('7 items selected');
            expect(
                screen.queryByRole('button', { name: 'Select all' })
            ).toBeNull();
        });
        it('should not be displayed if we reached the limit by a manual selection', async () => {
            render(
                <WithPaginationAndSelectAllLimit
                    limit={2}
                    dataProvider={testDataProvider({
                        getManyReference: () =>
                            Promise.resolve<any>({
                                data: [
                                    {
                                        id: 0,
                                        title: 'War and Peace',
                                        author: 'Leo Tolstoy',
                                        year: 1869,
                                    },
                                    {
                                        id: 1,
                                        title: 'Pride and Prejudice',
                                        author: 'Jane Austen',
                                        year: 1813,
                                    },
                                    {
                                        id: 2,
                                        title: 'The Picture of Dorian Gray',
                                        author: 'Oscar Wilde',
                                        year: 1890,
                                    },
                                ],
                                total: 3,
                            }),
                    })}
                />
            );
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(4);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[1]);
            fireEvent.click(screen.getAllByRole('checkbox')[2]);
            await screen.findByText('2 items selected');
            expect(
                screen.queryByRole('button', { name: 'Select all' })
            ).toBeNull();
        });
        it('should not be displayed if we reached the selectAllLimit by a click on the "Select all" button', async () => {
            render(<WithPaginationAndSelectAllLimit />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('5 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('6 items selected');
            await screen.findByText(
                'There are too many elements to select them all. Only the first 6 elements were selected.'
            );
            expect(
                screen.queryByRole('button', { name: 'Select all' })
            ).toBeNull();
        });
        it('should select all items', async () => {
            render(<WithPagination />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('5 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('7 items selected');
        });
        it('should select the maximum items possible until we reach the selectAllLimit', async () => {
            render(<WithPaginationAndSelectAllLimit />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('5 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('6 items selected');
            await screen.findByText(
                'There are too many elements to select them all. Only the first 6 elements were selected.'
            );
        });
    });
});
