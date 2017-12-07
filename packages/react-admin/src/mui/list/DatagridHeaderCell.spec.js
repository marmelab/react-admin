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
                />
            );
            assert.equal(wrapper.find('withStyles(Button)').length, 1);
        });

        it('should be disabled when field has no source', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={<Field />}
                    updateSort={() => true}
                />
            );

            assert.equal(wrapper.find('withStyles(Button)').length, 0);
        });

        it('should be disabled when sortable prop is explicitly set to false', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={<Field source="title" sortable={false} />}
                    updateSort={() => true}
                />
            );

            assert.equal(wrapper.find('withStyles(Button)').length, 0);
        });

        it('should use cell className if specified', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    updateSort={() => true}
                    field={<Field />}
                    className="blue"
                />
            );
            const col = wrapper.find('withStyles(TableCell)');
            assert.deepEqual(col.at(0).prop('className'), 'blue');
        });

        it('should use field headerClassName if specified', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    updateSort={() => true}
                    field={<Field headerClassName="red" />}
                />
            );
            const col = wrapper.find('withStyles(TableCell)');
            assert.deepEqual(col.at(0).prop('className'), 'red');
        });

        it('should use both cell className and field headerClassName props if specified', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    updateSort={() => true}
                    field={<Field headerClassName="red" />}
                    className="blue"
                />
            );
            const col = wrapper.find('withStyles(TableCell)');
            assert.deepEqual(col.at(0).prop('className'), 'blue red');
        });
    });
});
