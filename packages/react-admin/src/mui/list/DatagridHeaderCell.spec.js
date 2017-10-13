import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { DatagridHeaderCell } from './DatagridHeaderCell';

describe('<DatagridHeaderCell />', () => {
    describe('sorting on a column', () => {
        const defaultField = {
            type: 'foo',
            props: {},
            updateSort: () => {},
        };

        it('should be enabled when field has a source', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={{
                        ...defaultField,
                        props: {
                            source: 'title',
                        },
                    }}
                />
            );

            assert.equal(wrapper.find('FlatButton').length, 1);
        });

        it('should be disabled when field has no source', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={{ ...defaultField }}
                />
            );

            assert.equal(wrapper.find('FlatButton').length, 0);
        });

        it('should be disabled when sortable prop is explicitly set to false', () => {
            const wrapper = shallow(
                <DatagridHeaderCell
                    currentSort={{}}
                    field={{
                        ...defaultField,
                        props: {
                            source: 'title',
                            sortable: false,
                        },
                    }}
                />
            );

            assert.equal(wrapper.find('FlatButton').length, 0);
        });
    });
});
