import * as React from 'react';
import expect from 'expect';
import { cleanup, wait } from '@testing-library/react';
import { renderWithRedux, DataProviderContext } from 'ra-core';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { MemoryRouter } from 'react-router-dom';

import defaultTheme from '../defaultTheme';
import List from './List';

const theme = createMuiTheme(defaultTheme);

describe('<List />', () => {
    afterEach(cleanup);

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
            </ThemeProvider>
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
            </ThemeProvider>
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
            </ThemeProvider>
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
        await wait(() => {
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
        await wait(() => {
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
        await wait(() => {
            expect(queryAllByText('resources.posts.empty')).toHaveLength(1);
        });
    });
});
