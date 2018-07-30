import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { ListView } from './List';

describe('<List />', () => {
    const defaultProps = {
        filterValues: {},
        hasCreate: false,
        ids: [],
        isLoading: false,
        location: { pathname: '' },
        params: {},
        push: () => {},
        query: {},
        refresh: () => {},
        resource: 'post',
        total: 100,
        translate: x => x,
        version: 1,
    };
    it('should render a mui Card', () => {
        const Datagrid = () => <div>datagrid</div>;
        const wrapper = shallow(
            <ListView {...defaultProps}>
                <Datagrid />
            </ListView>
        );
        assert.equal(wrapper.find('WithStyles(Card)').length, 1);
    });

    it('should render filters, children and pagination', () => {
        const Filters = () => <div>filters</div>;
        const Pagination = () => <div>pagination</div>;
        const Datagrid = () => <div>datagrid</div>;
        const wrapper = shallow(
            <ListView
                filters={<Filters />}
                pagination={<Pagination />}
                {...defaultProps}
            >
                <Datagrid />
            </ListView>
        );
        assert.equal(wrapper.find('Filters').length, 1);
        assert.equal(wrapper.find('Pagination').length, 1);
        assert.equal(wrapper.find('Datagrid').length, 1);
    });
});
