import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import DatagridHeaderCellContent from './DatagridHeaderCellContent';

describe('<DatagridHeaderCellContent />', () => {
    describe('sorting on a column', () => {
        const Field = () => <div />;
        Field.defaultProps = {
            type: 'foo',
            updateSort: () => true,
        };

        it('should be enabled when field has a source', () => {
            const wrapper = shallow(
                <DatagridHeaderCellContent
                    currentSort={{}}
                    field={<Field source="title" />}
                    updateSort={() => true}
                />
            );
            assert.equal(wrapper.find('withStyles(Button)').length, 1);
        });

        it('should be disabled when field has no source', () => {
            const wrapper = shallow(
                <DatagridHeaderCellContent
                    currentSort={{}}
                    field={<Field />}
                    updateSort={() => true}
                />
            );

            assert.equal(wrapper.find('withStyles(Button)').length, 0);
        });

        it('should be disabled when sortable prop is explicitly set to false', () => {
            const wrapper = shallow(
                <DatagridHeaderCellContent
                    currentSort={{}}
                    field={<Field source="title" sortable={false} />}
                    updateSort={() => true}
                />
            );

            assert.equal(wrapper.find('withStyles(Button)').length, 0);
        });
    });
});
