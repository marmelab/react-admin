import assert from 'assert';
import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import { DatagridCell } from './DatagridCell';

describe('<DatagridCell />', () => {
    const Field = () => <div />;
    Field.propTypes = {
        type: PropTypes.string,
        basePath: PropTypes.string,
    };

    Field.defaultProps = {
        type: 'foo',
    };

    it('should render as a mui <TableRowColumn /> component', () => {
        const wrapper = shallow(<DatagridCell field={<Field />} />);
        const col = wrapper.find('WithStyles(TableCell)');
        assert.equal(col.length, 1);
    });

    it('should pass the Datagrid basePath by default', () => {
        const wrapper = shallow(<DatagridCell basePath="default" field={<Field />} />);
        const col = wrapper.find('Field');
        assert.equal(col.prop('basePath'), 'default');
    });

    it('should allow to overwrite the `basePath` field', () => {
        const wrapper = shallow(<DatagridCell basePath="default" field={<Field basePath="new" />} />);
        const col = wrapper.find('Field');
        assert.equal(col.prop('basePath'), 'new');
    });
});
