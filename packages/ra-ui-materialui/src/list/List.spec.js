import React from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';
import { renderWithRedux } from 'ra-core';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { MemoryRouter } from 'react-router-dom';

import defaultTheme from '../defaultTheme.ts';
import List, { ListView } from './List';

const theme = createMuiTheme(defaultTheme);

describe('<List />', () => {
    afterEach(cleanup);

    const defaultProps = {
        filterValues: {},
        hasCreate: false,
        ids: [],
        loading: false,
        location: { pathname: '' },
        params: {},
        perPage: 10,
        push: () => {},
        query: {},
        refresh: () => {},
        resource: 'post',
        selectedIds: [],
        setPage: () => null,
        total: 100,
        version: 1,
    };

    it('should render a list page', () => {
        const Datagrid = () => <div>datagrid</div>;
        const { container } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <ListView {...defaultProps}>
                    <Datagrid />
                </ListView>
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
                    <ListView
                        filters={<Filters />}
                        pagination={<Pagination />}
                        {...defaultProps}
                        hasCreate
                    >
                        <Datagrid />
                    </ListView>
                </MemoryRouter>
            </ThemeProvider>
        );
        expect(queryAllByText('filters')).toHaveLength(2);
        expect(queryAllByLabelText('ra.action.export')).toHaveLength(1);
        expect(queryAllByText('pagination')).toHaveLength(1);
        expect(queryAllByText('datagrid')).toHaveLength(1);
    });

    const defaultListProps = {
        basePath: '/foo',
        ids: [],
        data: {},
        hasCreate: false,
        hasEdit: false,
        hasList: false,
        hasShow: false,
        location: {},
        match: {},
        resource: 'foo',
        total: 0,
    };

    const defaultStateForList = {
        admin: {
            resources: {
                foo: {
                    list: {
                        ids: [],
                        params: {},
                        selectedIds: [],
                        total: 0,
                    },
                },
            },
        },
    };

    it('should display aside component', () => {
        const Dummy = () => <div />;
        const Aside = () => <div id="aside">Hello</div>;
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <List {...defaultListProps} aside={<Aside />}>
                    <Dummy />
                </List>
            </ThemeProvider>,
            defaultStateForList
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });

    it('should render an invite when the list is empty', () => {
        const Dummy = () => <div />;
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <ListView {...defaultProps} total={0} hasCreate loaded>
                    <Dummy />
                </ListView>
            </ThemeProvider>
        );
        expect(queryAllByText('resources.post.empty')).toHaveLength(1);
    });

    it('should not render an invite when a filter is active', () => {
        const Dummy = () => <div />;
        const { queryAllByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <ListView
                    {...defaultProps}
                    filterValues={{ q: 'foo' }}
                    total={0}
                    hasCreate
                    loaded
                >
                    <Dummy />
                </ListView>
            </ThemeProvider>
        );
        expect(queryAllByText('resources.post.empty')).toHaveLength(0);
    });
});
