import * as React from 'react';
import expect from 'expect';
import { waitFor, fireEvent } from '@testing-library/react';
import { DataProviderContext, ResourceContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { MemoryRouter } from 'react-router-dom';

import defaultTheme from '../defaultTheme';
import List from './List';
import { Filter } from './filter';
import { TextInput } from '../input';

const theme = createTheme(defaultTheme);

describe('<List />', () => {
    const defaultProps = {
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        resource: 'posts',
        basePath: '/posts',
        history: {} as any,
        location: {} as any,
        match: (() => {}) as any,
        syncWithLocation: true,
    };

    const defaultStateForList = {
        admin: {
            resources: {
                posts: {
                    list: {
                        ids: [],
                        params: {},
                        selectedIds: [],
                        total: 0,
                        cachedRequests: {},
                    },
                },
            },
        },
    };

    it('should render a list page', () => {
        const Datagrid = () => <div>datagrid</div>;

        const { container } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <List {...defaultProps}>
                    <Datagrid />
                </List>
            </ThemeProvider>,
            defaultStateForList
        );
        expect(container.querySelectorAll('.list-page')).toHaveLength(1);
    });

    it('should render a toolbar, children and pagination', () => {
        const Filters = () => <div>filters</div>;
        const Pagination = () => <div>pagination</div>;
        const Datagrid = () => <div>datagrid</div>;
        const { queryAllByText, queryAllByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={['/']}>
                    <List
                        filters={<Filters />}
                        pagination={<Pagination />}
                        {...defaultProps}
                    >
                        <Datagrid />
                    </List>
                </MemoryRouter>
            </ThemeProvider>,
            defaultStateForList
        );
        expect(queryAllByText('filters')).toHaveLength(2);
        expect(queryAllByLabelText('ra.action.export')).toHaveLength(1);
        expect(queryAllByText('pagination')).toHaveLength(1);
        expect(queryAllByText('datagrid')).toHaveLength(1);
    });

    it('should display aside component', () => {
        const Dummy = () => <div />;
        const Aside = () => <div id="aside">Hello</div>;
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <List {...defaultProps} aside={<Aside />}>
                    <Dummy />
                </List>
            </ThemeProvider>,
            defaultStateForList
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });

    it('should render an invite when the list is empty', async () => {
        const Dummy = () => <div />;
        const dataProvider = {
            getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
        } as any;
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <DataProviderContext.Provider value={dataProvider}>
                    <List {...defaultProps}>
                        <Dummy />
                    </List>
                </DataProviderContext.Provider>
            </ThemeProvider>,
            defaultStateForList
        );
        await waitFor(() => {
            expect(queryAllByText('resources.posts.empty')).toHaveLength(1);
        });
    });

    it('should not render an invite when the list is empty with an empty prop set to false', async () => {
        const Dummy = () => <div />;
        const dataProvider = {
            getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
        } as any;
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <DataProviderContext.Provider value={dataProvider}>
                    <List {...defaultProps} empty={false}>
                        <Dummy />
                    </List>
                </DataProviderContext.Provider>
            </ThemeProvider>,
            defaultStateForList
        );
        await waitFor(() => {
            expect(queryAllByText('resources.posts.empty')).toHaveLength(0);
        });
    });

    it('should not render an invite when a filter is active', async () => {
        const Dummy = () => <div />;
        const dataProvider = {
            getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
        } as any;
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <DataProviderContext.Provider value={dataProvider}>
                    <List {...defaultProps} filter={{ foo: 'bar' }}>
                        <Dummy />
                    </List>
                </DataProviderContext.Provider>
            </ThemeProvider>,
            defaultStateForList
        );
        await waitFor(() => {
            expect(queryAllByText('resources.posts.empty')).toHaveLength(1);
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
        const { getByText, queryAllByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <DataProviderContext.Provider value={dataProvider}>
                    <List filters={<DummyFilters />} {...defaultProps}>
                        <Dummy />
                    </List>
                </DataProviderContext.Provider>
            </ThemeProvider>,
            defaultStateForList
        );
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
        expect(queryAllByLabelText('resources.posts.fields.foo')).toHaveLength(
            1
        );
        fireEvent.click(getByText('ra.action.add_filter'));
        fireEvent.click(getByText('resources.posts.fields.bar'));
        await waitFor(() => {
            expect(
                queryAllByLabelText('resources.posts.fields.bar')
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
        const { getByText, queryAllByLabelText } = renderWithRedux(
            // As FilterForm doesn't receive rest parameters, it must grab the resource from the context
            <ResourceContextProvider value="posts">
                <ThemeProvider theme={theme}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <List filters={dummyFilters} {...defaultProps}>
                            <Dummy />
                        </List>
                    </DataProviderContext.Provider>
                </ThemeProvider>
            </ResourceContextProvider>,
            defaultStateForList
        );
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
        expect(queryAllByLabelText('resources.posts.fields.foo')).toHaveLength(
            1
        );
        fireEvent.click(getByText('ra.action.add_filter'));
        fireEvent.click(getByText('resources.posts.fields.bar'));
        await waitFor(() => {
            expect(
                queryAllByLabelText('resources.posts.fields.bar')
            ).toHaveLength(1);
        });
    });
});
