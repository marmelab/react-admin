import React from 'react';
import assert from 'assert';
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
    };

    it('should display correctly when called with a child', () => {
        const Foo = () => <div />;
        const wrapper = shallow(
            <Edit {...defaultProps}>
                <Foo />
            </Edit>
        );

        const inner = wrapper.find('Foo');
        assert.equal(inner.length, 1);
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
        const inputs = wrapper.find('TextInput');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['foo', 'bar']);
    });
});
