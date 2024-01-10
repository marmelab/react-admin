import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { testDataProvider, useListContext } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AdminContext } from '../AdminContext';
import { ReferenceManyField } from './ReferenceManyField';
import { TextField } from './TextField';
import { SingleFieldList } from '../list/SingleFieldList';
import { Pagination } from '../list/pagination/Pagination';
import { Basic } from './ReferenceManyField.stories';

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
        const history = createMemoryHistory();
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () => Promise.resolve({ data, total: 2 }),
                })}
                history={history}
            >
                <ThemeProvider theme={theme}>
                    <ReferenceManyField {...defaultProps}>
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceManyField>
                </ThemeProvider>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
        });
        const links = screen.queryAllByRole('link');
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
                    getManyReference: () => Promise.resolve({ data, total: 2 }),
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
        const history = createMemoryHistory();
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () => Promise.resolve({ data, total: 2 }),
                })}
                history={history}
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
        });
        const links = screen.queryAllByRole('link');
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
        const history = createMemoryHistory();
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    getManyReference: () => Promise.resolve({ data, total: 2 }),
                })}
                history={history}
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
        });
        const links = screen.queryAllByRole('link');
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
            const history = createMemoryHistory();
            render(
                <AdminContext
                    dataProvider={testDataProvider({
                        getManyReference: () =>
                            Promise.resolve({ data, total: 12 }),
                    })}
                    history={history}
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
            const history = createMemoryHistory();
            render(
                <AdminContext
                    dataProvider={testDataProvider({
                        getManyReference: () =>
                            Promise.resolve({
                                data,
                                pageInfo: {
                                    hasPreviousPage: false,
                                    hasNextPage: true,
                                },
                            }),
                    })}
                    history={history}
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
            );
            await screen.findByText('hello');
            await screen.findByText('world');
            await screen.findByText('ra.navigation.partial_page_range_info');
            await screen.findByLabelText('ra.navigation.previous');
            await screen.findByLabelText('ra.navigation.next');
        });
    });
});
