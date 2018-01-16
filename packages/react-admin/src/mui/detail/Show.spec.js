import React from 'react';
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
        match: {},
        version: 1,
    };

    it('should display correctly when called with a child', () => {
        const Foo = () => <div />;
        const wrapper = shallow(
            <Show {...defaultProps}>
                <Foo />
            </Show>
        );

        const inner = wrapper.find('Foo');
        expect(inner.length).toEqual(1);
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
        expect(inputs.map(i => i.prop('source'))).toEqual(['foo', 'bar']);
    });
});
