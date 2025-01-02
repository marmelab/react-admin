import * as React from 'react';
import expect from 'expect';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import {
    CoreAdminContext,
    testDataProvider,
    useListContext,
    TestMemoryRouter,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { defaultTheme } from '../theme/defaultTheme';
import { List } from './List';
import { Filter } from './filter';
import { TextInput } from '../input';
import { Notification } from '../layout';
import {
    Basic,
    Title,
    TitleFalse,
    TitleElement,
    PartialPagination,
    Default,
    SelectAllLimit,
} from './List.stories';

const theme = createTheme(defaultTheme);

describe('<List />', () => {
    it('should render a list page', () => {
        const Datagrid = () => <div>datagrid</div>;
        const { container } = render(
            <CoreAdminContext
                dataProvider={testDataProvider({
                    getList: () => Promise.resolve({ data: [], total: 0 }),
                })}
            >
                <ThemeProvider theme={theme}>
                    <List resource="posts">
                        <Datagrid />
                    </List>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(container.querySelectorAll('.list-page')).toHaveLength(1);
    });

    it('should render a toolbar, children and pagination', () => {
        const Filters = () => <div>filters</div>;
        const Pagination = () => <div>pagination</div>;
        const Datagrid = () => <div>datagrid</div>;
        render(
            <CoreAdminContext
                dataProvider={testDataProvider({
                    getList: () => Promise.resolve({ data: [], total: 0 }),
                })}
            >
                <ThemeProvider theme={theme}>
                    <List
                        filters={<Filters />}
                        pagination={<Pagination />}
                        resource="posts"
                    >
                        <Datagrid />
                    </List>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryAllByText('filters')).toHaveLength(2);
        expect(screen.queryAllByLabelText('ra.action.export')).toHaveLength(1);
        expect(screen.queryAllByText('pagination')).toHaveLength(1);
        expect(screen.queryAllByText('datagrid')).toHaveLength(1);
    });

    it('should accept more than one child', () => {
        const Filter = () => <div>filter</div>;
        const Datagrid = () => <div>datagrid</div>;
        render(
            <CoreAdminContext
                dataProvider={testDataProvider({
                    getList: () => Promise.resolve({ data: [], total: 0 }),
                })}
            >
                <ThemeProvider theme={theme}>
                    <List resource="posts">
                        <Filter />
                        <Datagrid />
                    </List>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryAllByText('filter')).toHaveLength(1);
        expect(screen.queryAllByText('datagrid')).toHaveLength(1);
    });

    it('should display aside component', () => {
        const Dummy = () => <div />;
        const Aside = () => <div id="aside">Hello</div>;
        render(
            <CoreAdminContext
                dataProvider={testDataProvider({
                    getList: () => Promise.resolve({ data: [], total: 0 }),
                })}
            >
                <ThemeProvider theme={theme}>
                    <List resource="posts" aside={<Aside />}>
                        <Dummy />
                    </List>
                </ThemeProvider>
            </CoreAdminContext>
        );
        expect(screen.queryAllByText('Hello')).toHaveLength(1);
    });

    describe('empty', () => {
        it('should render an invite when the list is empty', async () => {
            const Dummy = () => {
                const { isPending } = useListContext();
                return <div>{isPending ? 'loading' : 'dummy'}</div>;
            };
            const dataProvider = {
                getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
            } as any;
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <List resource="posts">
                            <Dummy />
                        </List>
                    </ThemeProvider>
                </CoreAdminContext>
            );
            await waitFor(() => {
                screen.getByText('resources.posts.empty');
                expect(screen.queryByText('dummy')).toBeNull();
            });
        });

        it('should not render an invite when the list is empty with an empty prop set to false', async () => {
            const Dummy = () => {
                const { isPending } = useListContext();
                return <div>{isPending ? 'loading' : 'dummy'}</div>;
            };
            const dataProvider = {
                getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
            } as any;
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <List resource="posts" empty={false}>
                            <Dummy />
                        </List>
                    </ThemeProvider>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(screen.queryByText('resources.posts.empty')).toBeNull();
                screen.getByText('dummy');
            });
        });

        it('should not render an empty component when using partial pagination and the list is not empty', async () => {
            render(<PartialPagination />);
            await waitFor(() => {
                expect(screen.queryByText('resources.posts.empty')).toBeNull();
                screen.getByText('John Doe');
            });
        });

        it('should render custom empty component when data is empty', async () => {
            const Dummy = () => null;
            const CustomEmpty = () => <div>Custom Empty</div>;

            const dataProvider = {
                getList: jest.fn(() =>
                    Promise.resolve({
                        data: [],
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                        },
                    })
                ),
            } as any;
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <List resource="posts" empty={<CustomEmpty />}>
                            <Dummy />
                        </List>
                    </ThemeProvider>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(screen.queryByText('resources.posts.empty')).toBeNull();
                screen.getByText('Custom Empty');
            });
        });

        it('should not render an invite when a filter is active', async () => {
            const Dummy = () => {
                const { isPending } = useListContext();
                return <div>{isPending ? 'loading' : 'dummy'}</div>;
            };
            const dataProvider = {
                getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
            } as any;
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <List
                            resource="posts"
                            filterDefaultValues={{ foo: 'bar' }}
                        >
                            <Dummy />
                        </List>
                    </ThemeProvider>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(screen.queryByText('resources.posts.empty')).toBeNull();
                screen.getByText('dummy');
            });
        });
    });

    it('should render a filter button/form combo when passed an element in filters', async () => {
        const DummyFilters = props => (
            <Filter {...props}>
                <TextInput source="foo" alwaysOn />
                <TextInput source="bar" />
            </Filter>
        );
        const Dummy = () => <div>Dummy</div>;
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 0 }], total: 1 })
            ),
        } as any;
        render(
            <TestMemoryRouter initialEntries={[`/posts`]}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <List filters={<DummyFilters />} resource="posts">
                            <Dummy />
                        </List>
                    </ThemeProvider>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
        expect(
            screen.queryAllByLabelText('resources.posts.fields.foo')
        ).toHaveLength(1);
        fireEvent.click(screen.getByText('ra.action.add_filter'));
        fireEvent.click(screen.getByText('resources.posts.fields.bar'));
        await waitFor(() => {
            expect(
                screen.queryAllByLabelText('resources.posts.fields.bar')
            ).toHaveLength(1);
        });
    });

    it('should render a filter button/form combo when passed an array in filters', async () => {
        const dummyFilters = [
            <TextInput source="foo" alwaysOn />,
            <TextInput source="bar" />,
        ];
        const Dummy = () => <div>Dummy</div>;
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 0 }], total: 1 })
            ),
        } as any;
        render(
            <TestMemoryRouter initialEntries={[`/posts`]}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ThemeProvider theme={theme}>
                        <List filters={dummyFilters} resource="posts">
                            <Dummy />
                        </List>
                    </ThemeProvider>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
        expect(
            screen.queryAllByLabelText('resources.posts.fields.foo')
        ).toHaveLength(1);
        fireEvent.click(screen.getByText('ra.action.add_filter'));
        fireEvent.click(screen.getByText('resources.posts.fields.bar'));
        await waitFor(() => {
            expect(
                screen.queryAllByLabelText('resources.posts.fields.bar')
            ).toHaveLength(1);
        });
    });

    it('should render a list page with an error notification when there is an error', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const Datagrid = () => <div>datagrid</div>;
        const dataProvider = {
            getList: jest.fn(() => Promise.reject(new Error('Lorem ipsum'))),
        } as any;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ThemeProvider theme={theme}>
                    <List resource="posts">
                        <Datagrid />
                    </List>
                    <Notification />
                </ThemeProvider>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.getByText('Lorem ipsum'));
        });
    });

    describe('title', () => {
        it('should display by default the title of the resource', async () => {
            render(<Basic />);
            await screen.findByText('War and Peace (1869)');
            screen.getAllByText('Books');
        });

        it('should render custom title string when defined', async () => {
            render(<Title />);
            await screen.findByText('War and Peace (1869)');
            screen.getByText('Custom list title');
        });

        it('should render custom title element when defined', async () => {
            render(<TitleElement />);
            await screen.findByText('War and Peace (1869)');
            screen.getByText('Custom list title');
        });

        it('should not render default title when false', async () => {
            render(<TitleFalse />);
            await screen.findByText('War and Peace (1869)');
            screen.getByText('Books');
        });
    });

    describe('"Select all" button', () => {
        afterEach(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Unselect' }));
        });
        it('should be displayed if an item is selected', async () => {
            render(<Default />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(11);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            expect(
                await screen.findByRole('button', { name: 'Select all' })
            ).toBeDefined();
        });
        it('should not be displayed if all items are manually selected', async () => {
            render(
                <Default
                    dataProvider={testDataProvider({
                        getList: () =>
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
            render(<Default />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(11);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('10 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('13 items selected');
            expect(
                screen.queryByRole('button', { name: 'Select all' })
            ).toBeNull();
        });
        it('should not be displayed if the user reaches the limit by a manual selection', async () => {
            render(
                <SelectAllLimit
                    limit={2}
                    dataProvider={testDataProvider({
                        getList: () =>
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
        it('should not be displayed if the user reaches the selectAllLimit by a click on the "Select all" button', async () => {
            render(<SelectAllLimit />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(11);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('10 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('11 items selected');
            await screen.findByText(
                'There are too many elements to select them all. Only the first 11 elements were selected.'
            );
            expect(
                screen.queryByRole('button', { name: 'Select all' })
            ).toBeNull();
        });
        it('should select all items', async () => {
            render(<Default />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(11);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('10 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('13 items selected');
        });
        it('should select the maximum items possible up to the selectAllLimit', async () => {
            render(<SelectAllLimit />);
            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(11);
            });
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('10 items selected');
            fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
            await screen.findByText('11 items selected');
            await screen.findByText(
                'There are too many elements to select them all. Only the first 11 elements were selected.'
            );
        });
    });
});
