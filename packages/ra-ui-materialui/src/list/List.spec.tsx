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
});
