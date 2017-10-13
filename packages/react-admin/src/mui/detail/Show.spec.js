import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { Show } from './Show';
import SimpleShowLayout from './SimpleShowLayout';
import TextField from '../field/TextField';

describe('<Show />', () => {
    const defaultProps = {
        data: {},
        crudGetOne: () => {},
        hasDelete: false,
        id: 'foo',
        isLoading: false,
        location: { pathname: '' },
        params: {},
        resource: '',
        translate: x => x,
    };

    it('should display correctly when called with a child', () => {
        const Foo = () => <div />;
        const wrapper = shallow(
            <Show {...defaultProps}>
                <Foo />
            </Show>
        );

        const inner = wrapper.find('Foo');
        assert.equal(inner.length, 1);
    });

    it('should display children inputs of SimpleShowLayout', () => {
        const wrapper = shallow(
            <Show {...defaultProps}>
                <SimpleShowLayout>
                    <TextField source="foo" />
                    <TextField source="bar" />
                </SimpleShowLayout>
            </Show>
        );
        const inputs = wrapper.find('pure(TextField)');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['foo', 'bar']);
    });
});
