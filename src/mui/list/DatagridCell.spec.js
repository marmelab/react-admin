import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import DatagridCell from './DatagridCell';

describe('<DatagridCell />', () => {
    it('should render as a mui <TableRowColumn /> component', () => {
        const wrapper = shallow(<DatagridCell field={{ type: 'foo', props: {} }} />);
        const col = wrapper.find('TableRowColumn');
        assert.equal(col.length, 1);
    });
    it('should use regular col style by default', () => {
        const wrapper = shallow(<DatagridCell field={{ type: 'foo', props: {} }} defaultStyle={{ td: { color: 'blue' }, 'td:first-child': { color: 'red' } }} />);
        const col = wrapper.find('TableRowColumn');
        assert.deepEqual(col.at(0).prop('style'), { color: 'blue' });
    });
    it('should use first col style if isFirst is true', () => {
        const wrapper = shallow(<DatagridCell isFirst field={{ type: 'foo', props: {} }} defaultStyle={{ td: { color: 'blue' }, 'td:first-child': { color: 'red' } }} />);
        const col = wrapper.find('TableRowColumn');
        assert.deepEqual(col.at(0).prop('style'), { color: 'red' });
    });
    it('should use field cellStyle to override default style', () => {
        const wrapper = shallow(<DatagridCell field={{ type: 'foo', props: { cellStyle: { td: { color: 'red' } } } }} />);
        const col = wrapper.find('TableRowColumn');
        assert.deepEqual(col.at(0).prop('style'), { color: 'red' });
    });
});
