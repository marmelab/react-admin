import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { DatagridCell } from './DatagridCell';

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
});
