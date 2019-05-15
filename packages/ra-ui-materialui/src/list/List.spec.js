import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';
import { TestContext } from 'ra-core';

import List, { ListView } from './List';

describe('<List />', () => {
    afterEach(cleanup);

    const defaultProps = {
        filterValues: {},
        hasCreate: false,
        ids: [],
        isLoading: false,
        location: { pathname: '' },
        params: {},
        perPage: 10,
        push: () => {},
        query: {},
        refresh: () => {},
        resource: 'post',
        selectedIds: [],
        total: 100,
        translate: x => x,
        version: 1,
    };

    it('should render a list page', () => {
        const Datagrid = () => <div>datagrid</div>;
        const { container } = render(
            <TestContext>
                <ListView {...defaultProps}>
                    <Datagrid />
                </ListView>
            </TestContext>
        );
        expect(container.querySelectorAll('.list-page')).toHaveLength(1);
    });

    it('should render a toolbar, children and pagination', () => {
        const Filters = () => <div>filters</div>;
        const Pagination = () => <div>pagination</div>;
        const Datagrid = () => <div>datagrid</div>;
        const { queryAllByText, debug } = render(
            <TestContext>
                <ListView
                    filters={<Filters />}
                    pagination={<Pagination />}
                    {...defaultProps}
                >
                    <Datagrid />
                </ListView>
            </TestContext>
        );
        expect(queryAllByText('filters')).toHaveLength(2);
        expect(queryAllByText('Export')).toHaveLength(1);
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
        const { queryAllByText } = render(
            <TestContext initialState={defaultStateForList}>
                <List {...defaultListProps} aside={<Aside />}>
                    <Dummy />
                </List>
            </TestContext>
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
