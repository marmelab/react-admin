import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { DatagridHeaderCell } from './DatagridHeaderCell';

describe('<DatagridHeaderCell />', () => {
    describe('content rendering', () => {
        const Field = () => <div />;
        const MyHeader = () => <span />;
        Field.defaultProps = {
            type: 'foo',
            updateSort: () => true,
        };

        it('should use default header content renderer if none defined', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={<Field source="title" />}
                    updateSort={() => true}
                />
            );
            assert.equal(wrapper.find('DatagridHeaderCellContent').length, 1);
        });

        it('should allow custom header renderer in field', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={<Field source="title" header={<MyHeader />} />}
                    updateSort={() => true}
                />
            );
            assert.equal(wrapper.find('MyHeader').length, 1);
        });
    });
});
