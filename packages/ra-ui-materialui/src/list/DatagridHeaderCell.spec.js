import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { DatagridHeaderCell } from './DatagridHeaderCell';

describe('<DatagridHeaderCell />', () => {
    describe('sorting on a column', () => {
        const Field = () => <div />;
        Field.defaultProps = {
            type: 'foo',
            updateSort: () => true,
        };

        it('should be enabled when field has a source', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={<Field source="title" />}
                    updateSort={() => true}
                    translate={() => ''}
                />
            );
            assert.equal(wrapper.find('WithStyles(TableSortLabel)').length, 1);
        });

        it('should be disabled when field has no source', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={<Field />}
                    updateSort={() => true}
                    translate={() => ''}
                />
            );

            assert.equal(wrapper.find('WithStyles(TableSortLabel)').length, 0);
        });

        it('should be disabled when sortable prop is explicitly set to false', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={<Field source="title" sortable={false} />}
                    updateSort={() => true}
                    translate={() => ''}
                />
            );

            assert.equal(wrapper.find('WithStyles(TableSortLabel)').length, 0);
        });

        it('should use cell className if specified', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    updateSort={() => true}
                    translate={() => ''}
                    field={<Field />}
                    className="blue"
                />
            );
            const col = wrapper.find('WithStyles(TableCell)');
            assert.deepEqual(col.at(0).prop('className'), 'blue');
        });
    });
});
