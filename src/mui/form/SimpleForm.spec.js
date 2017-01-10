import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { SimpleForm } from './SimpleForm';
import TextInput from '../input/TextInput';

describe('<SimpleForm />', () => {
    it('should embed a form with given component children', () => {
        const wrapper = shallow(
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="city" />
            </SimpleForm>
        );
        const inputs = wrapper.find('FormField');
        assert.deepEqual(inputs.map(i => i.prop('input').props.source), ['name', 'city']);
    });

    it('should display <SaveButton />', () => {
        const wrapper = shallow(
            <SimpleForm>
                <TextInput source="name" />
            </SimpleForm>
        );

        const button = wrapper.find('SaveButton');
        assert.equal(button.length, 1);
    });
});
