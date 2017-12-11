import React from 'react';
import { shallow } from 'enzyme';

import { Edit } from './Edit';
import TextInput from '../input/TextInput';
import SimpleForm from '../form/SimpleForm';

describe('<Edit />', () => {
    const defaultProps = {
        data: {},
        crudGetOne: () => {},
        crudUpdate: () => {},
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
            <Edit {...defaultProps}>
                <Foo />
            </Edit>
        );

        const inner = wrapper.find('Foo');
        expect(inner.length).toEqual(1);
    });

    it('should display children inputs of SimpleForm', () => {
        const wrapper = shallow(
            <Edit {...defaultProps}>
                <SimpleForm>
                    <TextInput source="foo" />
                    <TextInput source="bar" />
                </SimpleForm>
            </Edit>
        );
        const inputs = wrapper.find('WithFormField');
        expect(inputs.map(i => i.prop('source'))).toEqual(['foo', 'bar']);
    });
});
