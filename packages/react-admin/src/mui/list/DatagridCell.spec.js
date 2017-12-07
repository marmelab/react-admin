import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import DatagridCell from './DatagridCell';

describe('<DatagridCell />', () => {
    const Field = () => <div />;
    Field.defaultProps = {
        type: 'foo',
    };
    it('should render as a mui <TableRowColumn /> component', () => {
        const wrapper = shallow(<DatagridCell field={<Field />} />);
        const col = wrapper.find('withStyles(TableCell)');
        assert.equal(col.length, 1);
    });
    it('should use cell className if specified', () => {
        const wrapper = shallow(
            <DatagridCell field={<Field />} className="blue" />
        );
        const col = wrapper.find('withStyles(TableCell)');
        assert.deepEqual(col.at(0).prop('className'), 'blue');
    });
    it('should use field className if specified', () => {
        const wrapper = shallow(
            <DatagridCell field={<Field className="red" />} />
        );
        const col = wrapper.find('withStyles(TableCell)');
        assert.deepEqual(col.at(0).prop('className'), 'red');
    });
    it('should use both cell and field className props if specified', () => {
        const wrapper = shallow(
            <DatagridCell field={<Field className="red" />} className="blue" />
        );
        const col = wrapper.find('withStyles(TableCell)');
        assert.deepEqual(col.at(0).prop('className'), 'blue red');
    });
});
