import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import DatagridCell from './DatagridCell';

describe('<DatagridCell />', () => {
    it('should render as a mui <TableRowColumn /> component', () => {
        const wrapper = shallow(
            <DatagridCell field={{ type: 'foo', props: {} }} />
        );
        const col = wrapper.find('TableRowColumn');
        assert.equal(col.length, 1);
    });
    it('should use regular col style by default', () => {
        const wrapper = shallow(
            <DatagridCell
                field={{ type: 'foo', props: {} }}
                defaultStyle={{ color: 'blue' }}
            />
        );
        const col = wrapper.find('TableRowColumn');
        assert.deepEqual(col.at(0).prop('style'), { color: 'blue' });
    });
    it('should use field style to override default style', () => {
        const wrapper = shallow(
            <DatagridCell
                field={{ type: 'foo', props: { style: { color: 'red' } } }}
            />
        );
        const col = wrapper.find('TableRowColumn');
        assert.deepEqual(col.at(0).prop('style'), { color: 'red' });
    });
});
