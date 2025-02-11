import * as React from 'react';
import expect from 'expect';
import {
    render,
    screen,
    act,
    waitFor,
    fireEvent,
} from '@testing-library/react';
import {
    ListContextProvider,
    CoreAdminContext,
    RecordContextProvider,
    useRecordContext,
    useListContext,
    TestMemoryRouter,
    testDataProvider,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
    ReferenceArrayField,
    ReferenceArrayFieldView,
} from './ReferenceArrayField';
import { TextField } from './TextField';
import { SingleFieldList } from '../list';
import { AdminContext } from '../AdminContext';
import {
    DifferentIdTypes,
    WithPagination,
} from './ReferenceArrayField.stories';

const theme = createTheme({});

describe('<ReferenceArrayField />', () => {
    it('should render a loading indicator when related records are not yet fetched and a second has passed', async () => {
        render(
            <ThemeProvider theme={theme}>
                <ListContextProvider
                    value={
                        {
                            resource: 'foo',
                            data: null,
                            isPending: true,
                        } as any
                    }
                >
                    <ReferenceArrayFieldView
                        source="barIds"
                        reference="bar"
                        record={{ id: 123, barIds: [1, 2] }}
                    >
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </ThemeProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));
        await screen.findByRole('progressbar');
    });

    it('should render a list of the child component', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const { queryAllByRole, container, getByText } = render(
            <TestMemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={
                            {
                                resource: 'foo',
                                data,
                                isLoading: false,
                            } as any
                        }
                    >
                        <ReferenceArrayFieldView
                            source="barIds"
                            record={{ id: 123, barIds: [1, 2] }}
                            reference="bar"
                        >
                            <SingleFieldList linkType={false}>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </TestMemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild?.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should render nothing when there are no related records', () => {
        const { queryAllByRole, container } = render(
            <ThemeProvider theme={theme}>
                <ListContextProvider
                    value={
                        {
                            resource: 'foo',
                            data: [],
                            isLoading: false,
                        } as any
                    }
                >
                    <ReferenceArrayFieldView
                        source="barIds"
                        record={{ id: 123, barIds: [1, 2] }}
                        reference="bar"
                    >
                        <SingleFieldList linkType={false}>
                            <TextField source="title" />
                        </SingleFieldList>
                    </ReferenceArrayFieldView>
                </ListContextProvider>
            </ThemeProvider>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild?.textContent).toBe('');
    });

    it('should support record with string identifier', () => {
        const data = [
            { id: 'abc-1', title: 'hello' },
            { id: 'abc-2', title: 'world' },
        ];
        const { queryAllByRole, container, getByText } = render(
            <TestMemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={
                            {
                                resource: 'foo',
                                data,
                                isLoading: false,
                            } as any
                        }
                    >
                        <ReferenceArrayFieldView
                            record={{ id: 123, barIds: ['abc-1', 'abc-2'] }}
                            reference="bar"
                            source="barIds"
                        >
                            <SingleFieldList linkType={false}>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </TestMemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild?.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should support record with number identifier', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const { queryAllByRole, container, getByText } = render(
            <TestMemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={
                            {
                                resource: 'foo',
                                data,
                                isLoading: false,
                            } as any
                        }
                    >
                        <ReferenceArrayFieldView
                            record={{ id: 123, barIds: [1, 2] }}
                            resource="foo"
                            reference="bar"
                            source="barIds"
                        >
                            <SingleFieldList linkType={false}>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </TestMemoryRouter>
        );
        expect(queryAllByRole('progressbar')).toHaveLength(0);
        expect(container.firstChild?.textContent).not.toBeUndefined();
        expect(getByText('hello')).not.toBeNull();
        expect(getByText('world')).not.toBeNull();
    });

    it('should use custom className', () => {
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];
        const { container } = render(
            <TestMemoryRouter>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={
                            {
                                resource: 'foo',
                                data,
                                isLoading: false,
                            } as any
                        }
                    >
                        <ReferenceArrayFieldView
                            record={{ id: 123, barIds: [1, 2] }}
                            className="myClass"
                            resource="foo"
                            reference="bar"
                            source="barIds"
                        >
                            <SingleFieldList linkType={false}>
                                <TextField source="title" />
                            </SingleFieldList>
                        </ReferenceArrayFieldView>
                    </ListContextProvider>
                </ThemeProvider>
            </TestMemoryRouter>
        );
        expect(container.getElementsByClassName('myClass')).toHaveLength(1);
    });

    it('should have defined data when loaded', async () => {
        let resolve;
        const promise = new Promise<any>(res => {
            resolve = res;
        });
        const WeakField = () => {
            const record = useRecordContext();
            return <div>{record?.title}</div>;
        };
        const dataProvider = {
            getMany: () =>
                promise.then(() => ({
                    data: [
                        { id: 1, title: 'bar1' },
                        { id: 2, title: 'bar2' },
                    ],
                })),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider as any}>
                <ThemeProvider theme={theme}>
                    <ReferenceArrayField
                        record={{ id: 123, barIds: [1, 2] }}
                        className="myClass"
                        resource="foos"
                        reference="bars"
                        source="barIds"
                    >
                        <SingleFieldList linkType={false}>
                            <WeakField />
                        </SingleFieldList>
                    </ReferenceArrayField>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryByText('bar1')).toBeNull();
        act(() => resolve());
        await waitFor(() => {
            expect(screen.queryByText('bar1')).not.toBeNull();
        });
    });

    it('should accept more than one child', async () => {
        const dataProvider = testDataProvider({
            getMany: () =>
                Promise.resolve<any>({
                    data: [
                        { id: 4, title: 'programming' },
                        { id: 8, title: 'management' },
                        { id: 12, title: 'design' },
                    ],
                }),
        });
        const ListContextWatcher = () => {
            const { data } = useListContext();
            if (!data) return null;
            return (
                <ul>
                    {data.map(record => (
                        <li key={record.id}>tag:{record.title}</li>
                    ))}
                </ul>
            );
        };

        render(
            <AdminContext dataProvider={dataProvider}>
                <RecordContextProvider
                    value={{
                        id: 123,
                        title: 'hello, world',
                        tag_ids: [4, 8, 12],
                    }}
                >
                    <ReferenceArrayField source="tag_ids" reference="tags">
                        <SingleFieldList>
                            <TextField source="title" />
                        </SingleFieldList>
                        <ListContextWatcher />
                    </ReferenceArrayField>
                </RecordContextProvider>
            </AdminContext>
        );
        await screen.findByText('programming');
        await screen.findByText('management');
        await screen.findByText('design');
        await screen.findByText('tag:programming');
        await screen.findByText('tag:management');
        await screen.findByText('tag:design');
    });

    it('should handle IDs of different types', async () => {
        render(<DifferentIdTypes />);

        expect(await screen.findByText('artist_1')).not.toBeNull();
        expect(await screen.findByText('artist_2')).not.toBeNull();
        expect(await screen.findByText('artist_3')).not.toBeNull();
    });

    describe('"Select all" button', () => {
        it('should be displayed if an item is selected', async () => {
            render(<WithPagination />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            expect(
                await screen.findByRole('button', { name: 'Select all' })
            ).toBeDefined();
        });
        it('should not be displayed if all item are manyally selected', async () => {
            render(<WithPagination />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('5 items selected');
            fireEvent.click(
                screen.getByRole('button', { name: 'Go to next page' })
            );
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(4);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('8 items selected');
            expect(
                screen.queryByRole('button', { name: 'Select all' })
            ).toBeNull();
        });
        it('should not be displayed if all item are selected with the "Select all" button', async () => {
            render(<WithPagination />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('5 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('8 items selected');
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
            await screen.findByText('8 items selected');
        });
    });
});
